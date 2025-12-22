---
id: contribution-guide
title: Contributing
---

KafkaJS is an open-source project where development takes place in the open on GitHub. Although the project is maintained by a small group of dedicated volunteers, we are grateful to the community for bug fixes, feature development and other contributions.

Issues are tracked in [Github](https://github.com/tulios/kafkajs/issues). For first time contributors, we maintain a list of [Good First Issues](https://github.com/tulios/kafkajs/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22). If you are planning to implement a new feature or work on fixing a bug, make sure to [check the issue tracker](https://github.com/tulios/kafkajs/issues) to see if someone is already working on it, or [open an issue](https://github.com/tulios/kafkajs/issues/new) before you start your work. [The Slack channel](https://join.slack.com/t/kafkajs/shared_invite/zt-1ezd5395v-SOpTqYoYfRCyPKOkUggK0A) is also a good place if you want to discuss your plans before starting your implementation.

## System Requirements

To contribute to KafkaJS, you need:

- **Node.js** >= 18.0.0
- **Yarn** >= 4.0.0 (Berry)
- **Docker** and **Docker Compose** for running tests

### Installing Yarn 4

If you don't have Yarn 4 installed, use Corepack (included with Node.js 16.10+):

```sh
corepack enable
corepack prepare yarn@stable --activate
```

## Initial Setup

1. Fork and clone the repository
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Start the Kafka cluster:
   ```sh
   ./scripts/dockerComposeUp.sh
   ```
4. Create SCRAM credentials:
   ```sh
   ./scripts/createScramCredentials.sh
   ```
5. Run the tests:
   ```sh
   yarn test:local
   ```

## TL;DR

The following chapters will get you set up with a working development environment and teach you how to run the tests. If you are already familiar with the project setup, here's the gist:

With `docker`, `docker-compose`, Node.js 18+ and Yarn 4 available:

```sh
yarn test
# or
./scripts/dockerComposeUp.sh
./scripts/createScramCredentials.sh
yarn test:local:watch
```
