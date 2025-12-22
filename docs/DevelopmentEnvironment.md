---
id: development-environment
title: Development Environment
---

## Prerequisites

Before you start developing KafkaJS, make sure you have the following installed:

- **Node.js**: >= 18.0.0 (required since v2.2.4)
- **Yarn**: >= 4.0.0 (Berry)
- **Docker** and **Docker Compose** for running Kafka clusters

### Installing Yarn 4

If you have Yarn Classic (1.x) or need to install Yarn, use Corepack (included with Node.js 16.10+):

```bash
corepack enable
corepack prepare yarn@stable --activate
```

Alternatively, you can install Yarn globally:

```bash
npm install --global yarn
```

### Installing Dependencies

Once you have cloned the repository, install the dependencies:

```bash
yarn install
```

## Running Kafka

For testing KafkaJS we use a multi-broker Kafka cluster as well as Zookeeper for authentication. To start the cluster and generate credentials, run the following from the root of the repository:

```sh
# This will run a Kafka cluster configured with your current IP
./scripts/dockerComposeUp.sh
./scripts/createScramCredentials.sh
```

This boots the Kafka cluster using the default docker-compose.yml file described in [scripts/dockerComposeUp.sh](https://github.com/tulios/kafkajs/blob/master/scripts/dockerComposeUp.sh). If you want to run a different version of Kafka, specify a different compose file using the `COMPOSE_FILE` environment variable:

```sh
COMPOSE_FILE="docker-compose.2_4.yml" ./scripts/dockerComposeUp.sh
```

### Kafka Version Notes

As of version 2.2.4, KafkaJS uses Kafka 3.8 as the default version for development and testing. Some important changes:

- **Bootstrap Server Port**: The default development bootstrap server port is now **29092** (instead of 9092) for better compatibility with Docker networking
- **Docker Compose**: The `version` declaration has been removed from Docker Compose files (deprecated in Docker Compose v2)
- **Kafka Configurations**: Updated listener configurations and authorizer class for Kafka 3.8 compatibility

If you run `docker-compose ps` (or specify whichever compose file you used in the step above), you should see something like:

```sh
$ docker-compose -f docker-compose.2_3.yml ps
WARNING: The HOST_IP variable is not set. Defaulting to a blank string.
      Name                    Command               State                                   Ports
----------------------------------------------------------------------------------------------------------------------------------
kafkajs_kafka1_1   start-kafka.sh                   Up      0.0.0.0:9092->9092/tcp, 0.0.0.0:9093->9093/tcp, 0.0.0.0:9094->9094/tcp
kafkajs_kafka2_1   start-kafka.sh                   Up      0.0.0.0:9095->9095/tcp, 0.0.0.0:9096->9096/tcp, 0.0.0.0:9097->9097/tcp
kafkajs_kafka3_1   start-kafka.sh                   Up      0.0.0.0:9098->9098/tcp, 0.0.0.0:9099->9099/tcp, 0.0.0.0:9100->9100/tcp
kafkajs_zk_1       /bin/sh -c /usr/sbin/sshd  ...   Up      0.0.0.0:2181->2181/tcp, 22/tcp, 2888/tcp, 3888/tcp
```

The user credentials are listed in [scripts/createScramCredentials.sh](https://github.com/tulios/kafkajs/blob/master/scripts/createScramCredentials.sh). You can also pass in the `-h` flag to this script for more details and controls. 

You should now be able to connect to your cluster as such:

```javascript
const fs = require('fs')
const ip = require('ip')

const { Kafka, CompressionTypes, logLevel } = require('./index')

const host = process.env.HOST_IP || ip.address()

const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: [`${host}:9094`, `${host}:9097`, `${host}:9100`],
  clientId: 'example-producer',
  ssl: {
    servername: 'localhost',
    rejectUnauthorized: false,
    ca: [fs.readFileSync('./testHelpers/certs/cert-signed', 'utf-8')],
  },
  sasl: {
    mechanism: 'plain',
    username: 'test',
    password: 'testtest',
  },
})
```

## Visual Studio Code Integration

In order to [better integrate with Visual Studio Code's Javascript Language Service](https://code.visualstudio.com/docs/languages/jsconfig),
you can add a `jsconfig.json` file to the root of the project.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "module": "commonjs",
    "target": "es6",
    "paths": {
      "testHelpers": ["./testHelpers"]
    }
  },
  "include": [
    "src",
    "testHelpers"
  ]
}
```

This can help Visual Studio Code show type-hints even for modules that don't directly import each other:

![Editor screenshot showing type hinting for Cluster methods](./assets/vscode-integration.png)