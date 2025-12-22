#!/usr/bin/env node

const execa = require('execa')
const crypto = require('crypto')

const secureRandom = (length = 10) => crypto.randomBytes(length).toString('hex')

const findContainerId = (node) => {
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

const waitForNode = (containerId) => {
  const cmd = `
    docker exec \
      ${containerId} \
      bash -c "JMX_PORT=9998 kafka-topics --bootstrap-server kafka1:29092 --list 2> /dev/null"
    sleep 5
  `

  execa.commandSync(cmd, { shell: true })
  console.log(`Kafka container ${containerId} is running`)
}

const createTopic = (containerId, topicName) => {
  const cmd = `docker exec ${containerId} bash -c "JMX_PORT=9998 kafka-topics --create --if-not-exists --topic ${topicName} --replication-factor 1 --partitions 2 --bootstrap-server kafka1:29092"`

  try {
    return execa.commandSync(cmd, { shell: true }).stdout.toString('utf-8')
  } catch (_error) {
    // Ignore errors, topic might already exist
    return ''
  }
}

const consumerGroupDescribe = (containerId) => {
  const cmd = `docker exec ${containerId} bash -c "JMX_PORT=9998 kafka-consumer-groups --bootstrap-server kafka1:29092 --group test-group-${secureRandom()} --describe" && sleep 1`
  try {
    return execa.commandSync(cmd, { shell: true }).stdout.toString('utf-8')
  } catch (_error) {
    // Ignore errors
    return ''
  }
}

console.log('\nFinding container ids...')
const kafka1ContainerId = findContainerId('kafka1')
const kafka2ContainerId = findContainerId('kafka2')
const kafka3ContainerId = findContainerId('kafka3')

console.log('\nWaiting for nodes...')
waitForNode(kafka1ContainerId)
waitForNode(kafka2ContainerId)
waitForNode(kafka3ContainerId)

console.log('\nAll nodes up:')
console.log(
  execa
    .commandSync(`docker compose -f ${process.env.COMPOSE_FILE} ps`, { shell: true })
    .stdout.toString('utf-8')
)

console.log('\nCreating default topics...')
createTopic(kafka1ContainerId, 'test-topic-already-exists')

console.log('\nWarming up Kafka...')

const totalRandomTopics = 10
console.log(`  -> creating ${totalRandomTopics} random topics...`)
Array(totalRandomTopics)
  .fill()
  .forEach(() => {
    createTopic(kafka1ContainerId, `test-topic-${secureRandom()}`)
  })

console.log('  -> running consumer describe')
consumerGroupDescribe(kafka1ContainerId)
