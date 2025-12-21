#!/bin/bash -e

find_container_id() {
  echo $(docker ps \
    --filter "status=running" \
    --filter "label=custom.project=kafkajs" \
    --filter "label=custom.service=kafka1" \
    --no-trunc \
    -q)
}

get_kafka_version() {
  local container_id=$(find_container_id)
  local version_output=$(docker exec $container_id bash -c "kafka-broker-api-versions --version 2>&1 | grep -oP '(\d+)\.(\d+)\.(\d+)' | head -1" || echo "2.5.0")
  echo $version_output
}

should_use_bootstrap_server() {
  local version=$1
  local major=$(echo $version | cut -d. -f1)
  local minor=$(echo $version | cut -d. -f2)
  
  # Kafka 2.5+ should use --bootstrap-server
  if [ $major -gt 2 ] || ([ $major -eq 2 ] && [ $minor -ge 5 ]); then
    echo "true"
  else
    echo "false"
  fi
}

CLIENT_ID=${CLIENT_ID:='example-producer'}
PRODUCER_BYTES=${PRODUCER_BYTES:=1024}
CONSUMER_BYTES=${CONSUMER_BYTES:=1024}

echo 'Setting client quota for:'
echo "CLIENT_ID: '${CLIENT_ID}'"
echo "PRODUCER_BYTES: ${PRODUCER_BYTES}"
echo "CONSUMER_BYTES: ${CONSUMER_BYTES}"

KAFKA_VERSION=$(get_kafka_version)
USE_BOOTSTRAP=$(should_use_bootstrap_server $KAFKA_VERSION)

if [ "$USE_BOOTSTRAP" = "true" ]; then
  CONNECTION_PARAM="--bootstrap-server kafka1:9092"
else
  CONNECTION_PARAM="--zookeeper zookeeper:2181"
fi

docker exec \
 $(find_container_id) \
 bash -c "kafka-configs ${CONNECTION_PARAM} --alter --add-config 'producer_byte_rate=${PRODUCER_BYTES},consumer_byte_rate=${CONSUMER_BYTES}' --entity-type clients --entity-name ${CLIENT_ID}"
