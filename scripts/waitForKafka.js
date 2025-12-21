#!/usr/bin/env node

const execa = require('execa')
const crypto = require('crypto')

const secureRandom = (length = 10) => crypto.randomBytes(length).toString('hex')

const findContainerId = node => {
  const cmd = `
    docker ps \
      --filter "status=running" \
      --filter "label=custom.project=kafkajs" \
      --filter "label=custom.service=${node}" \
      --no-trunc \
      -q
  `
  const containerId = execa.commandSync(cmd, { shell: true }).stdout.toString('utf-8')
  console.log(`${node}: ${containerId}`)
  return containerId
}

const getKafkaVersion = containerId => {
  try {
    const cmd = `docker exec ${containerId} bash -c "kafka-broker-api-versions --version 2>&1 | grep -oP 'Commit ID.*' || echo '0.0.0'"`
    const versionOutput = execa.commandSync(cmd, { shell: true }).stdout.toString('utf-8')
    // Extract version from Confluent Platform or Apache Kafka
    // Example: "7.8.5-ccs" or "3.8.0"
    const versionMatch = versionOutput.match(/(\d+)\.(\d+)\.(\d+)/)
    if (versionMatch) {
      return {
        major: parseInt(versionMatch[1]),
        minor: parseInt(versionMatch[2]),
        patch: parseInt(versionMatch[3]),
      }
    }
  } catch (e) {
    console.log('Could not determine Kafka version, assuming >= 2.5')
  }
  // Default to a version >= 2.5 if we can't determine
  return { major: 2, minor: 5, patch: 0 }
}

const shouldUseBootstrapServer = version => {
  // Kafka 2.5+ deprecated --zookeeper, 3.0+ removed it
  return version.major > 2 || (version.major === 2 && version.minor >= 5)
}

const waitForNode = (containerId, useBootstrapServer) => {
  const connectionParam = useBootstrapServer
    ? '--bootstrap-server kafka1:9092'
    : '--zookeeper zookeeper:2181'

  const cmd = `
    docker exec \
      ${containerId} \
      bash -c "JMX_PORT=9998 kafka-topics ${connectionParam} --list 2> /dev/null"
    sleep 5
  `

  execa.commandSync(cmd, { shell: true })
  console.log(`Kafka container ${containerId} is running`)
}

const createTopic = (containerId, topicName, useBootstrapServer) => {
  const connectionParam = useBootstrapServer
    ? '--bootstrap-server kafka1:9092'
    : '--zookeeper zookeeper:2181'

  const cmd = `
    docker exec \
      ${containerId} \
      bash -c "JMX_PORT=9998 kafka-topics --create --if-not-exists --topic ${topicName} --replication-factor 1 --partitions 2 ${connectionParam} 2> /dev/null"
  `

  return execa.commandSync(cmd, { shell: true }).stdout.toString('utf-8')
}

const consumerGroupDescribe = containerId => {
  const cmd = `
    docker exec \
      ${containerId} \
      bash -c "JMX_PORT=9998 kafka-consumer-groups --bootstrap-server kafka1:9092 --group test-group-${secureRandom()} --describe > /dev/null 2>&1"
    sleep 1
  `
  return execa.commandSync(cmd, { shell: true }).stdout.toString('utf-8')
}

console.log('\nFinding container ids...')
const kafka1ContainerId = findContainerId('kafka1')
const kafka2ContainerId = findContainerId('kafka2')
const kafka3ContainerId = findContainerId('kafka3')

console.log('\nDetecting Kafka version...')
const kafkaVersion = getKafkaVersion(kafka1ContainerId)
const useBootstrapServer = shouldUseBootstrapServer(kafkaVersion)
console.log(`Kafka version: ${kafkaVersion.major}.${kafkaVersion.minor}.${kafkaVersion.patch}`)
console.log(
  `Using ${useBootstrapServer ? '--bootstrap-server' : '--zookeeper'} for topic management`
)

console.log('\nWaiting for nodes...')
waitForNode(kafka1ContainerId, useBootstrapServer)
waitForNode(kafka2ContainerId, useBootstrapServer)
waitForNode(kafka3ContainerId, useBootstrapServer)

console.log('\nAll nodes up:')
console.log(
  execa
    .commandSync(`docker compose -f ${process.env.COMPOSE_FILE} ps`, { shell: true })
    .stdout.toString('utf-8')
)

console.log('\nCreating default topics...')
createTopic(kafka1ContainerId, 'test-topic-already-exists', useBootstrapServer)

console.log('\nWarming up Kafka...')

const totalRandomTopics = 10
console.log(`  -> creating ${totalRandomTopics} random topics...`)
Array(totalRandomTopics)
  .fill()
  .forEach(() => {
    createTopic(kafka1ContainerId, `test-topic-${secureRandom()}`, useBootstrapServer)
  })

console.log('  -> running consumer describe')
consumerGroupDescribe(kafka1ContainerId)
