const ISOLATION_LEVEL = require('../../isolationLevel')

// For normal consumers, use -1
const REPLICA_ID = -1
const NETWORK_DELAY = 100

// Load all request/response modules at the top
const v0Request = require('./v0/request')
const v0Response = require('./v0/response')
const v1Request = require('./v1/request')
const v1Response = require('./v1/response')
const v2Request = require('./v2/request')
const v2Response = require('./v2/response')
const v3Request = require('./v3/request')
const v3Response = require('./v3/response')
const v4Request = require('./v4/request')
const v4Response = require('./v4/response')
const v5Request = require('./v5/request')
const v5Response = require('./v5/response')
const v6Request = require('./v6/request')
const v6Response = require('./v6/response')
const v7Request = require('./v7/request')
const v7Response = require('./v7/response')
const v8Request = require('./v8/request')
const v8Response = require('./v8/response')
const v9Request = require('./v9/request')
const v9Response = require('./v9/response')
const v10Request = require('./v10/request')
const v10Response = require('./v10/response')
const v11Request = require('./v11/request')
const v11Response = require('./v11/response')

/**
 * The FETCH request can block up to maxWaitTime, which can be bigger than the configured
 * request timeout. It's safer to always use the maxWaitTime
 **/
const requestTimeout = (timeout) =>
  Number.isSafeInteger(timeout + NETWORK_DELAY) ? timeout + NETWORK_DELAY : timeout

const versions = {
  0: ({ replicaId = REPLICA_ID, maxWaitTime, minBytes, topics }) => {
    return {
      request: v0Request({ replicaId, maxWaitTime, minBytes, topics }),
      response: v0Response,
      requestTimeout: requestTimeout(maxWaitTime),
    }
  },
  1: ({ replicaId = REPLICA_ID, maxWaitTime, minBytes, topics }) => {
    return {
      request: v1Request({ replicaId, maxWaitTime, minBytes, topics }),
      response: v1Response,
      requestTimeout: requestTimeout(maxWaitTime),
    }
  },
  2: ({ replicaId = REPLICA_ID, maxWaitTime, minBytes, topics }) => {
    return {
      request: v2Request({ replicaId, maxWaitTime, minBytes, topics }),
      response: v2Response,
      requestTimeout: requestTimeout(maxWaitTime),
    }
  },
  3: ({ replicaId = REPLICA_ID, maxWaitTime, minBytes, maxBytes, topics }) => {
    return {
      request: v3Request({ replicaId, maxWaitTime, minBytes, maxBytes, topics }),
      response: v3Response,
      requestTimeout: requestTimeout(maxWaitTime),
    }
  },
  4: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }) => {
    return {
      request: v4Request({ replicaId, isolationLevel, maxWaitTime, minBytes, maxBytes, topics }),
      response: v4Response,
      requestTimeout: requestTimeout(maxWaitTime),
    }
  },
  5: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }) => {
    return {
      request: v5Request({ replicaId, isolationLevel, maxWaitTime, minBytes, maxBytes, topics }),
      response: v5Response,
      requestTimeout: requestTimeout(maxWaitTime),
    }
  },
  6: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }) => {
    return {
      request: v6Request({ replicaId, isolationLevel, maxWaitTime, minBytes, maxBytes, topics }),
      response: v6Response,
      requestTimeout: requestTimeout(maxWaitTime),
    }
  },
  7: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    sessionId = 0,
    sessionEpoch = -1,
    forgottenTopics = [],
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }) => {
    return {
      request: v7Request({
        replicaId,
        isolationLevel,
        sessionId,
        sessionEpoch,
        forgottenTopics,
        maxWaitTime,
        minBytes,
        maxBytes,
        topics,
      }),
      response: v7Response,
      requestTimeout: requestTimeout(maxWaitTime),
    }
  },
  8: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    sessionId = 0,
    sessionEpoch = -1,
    forgottenTopics = [],
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }) => {
    return {
      request: v8Request({
        replicaId,
        isolationLevel,
        sessionId,
        sessionEpoch,
        forgottenTopics,
        maxWaitTime,
        minBytes,
        maxBytes,
        topics,
      }),
      response: v8Response,
      requestTimeout: requestTimeout(maxWaitTime),
    }
  },
  9: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    sessionId = 0,
    sessionEpoch = -1,
    forgottenTopics = [],
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }) => {
    return {
      request: v9Request({
        replicaId,
        isolationLevel,
        sessionId,
        sessionEpoch,
        forgottenTopics,
        maxWaitTime,
        minBytes,
        maxBytes,
        topics,
      }),
      response: v9Response,
      requestTimeout: requestTimeout(maxWaitTime),
    }
  },
  10: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    sessionId = 0,
    sessionEpoch = -1,
    forgottenTopics = [],
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
  }) => {
    return {
      request: v10Request({
        replicaId,
        isolationLevel,
        sessionId,
        sessionEpoch,
        forgottenTopics,
        maxWaitTime,
        minBytes,
        maxBytes,
        topics,
      }),
      response: v10Response,
      requestTimeout: requestTimeout(maxWaitTime),
    }
  },
  11: ({
    replicaId = REPLICA_ID,
    isolationLevel = ISOLATION_LEVEL.READ_COMMITTED,
    sessionId = 0,
    sessionEpoch = -1,
    forgottenTopics = [],
    maxWaitTime,
    minBytes,
    maxBytes,
    topics,
    rackId,
  }) => {
    return {
      request: v11Request({
        replicaId,
        isolationLevel,
        sessionId,
        sessionEpoch,
        forgottenTopics,
        maxWaitTime,
        minBytes,
        maxBytes,
        topics,
        rackId,
      }),
      response: v11Response,
      requestTimeout: requestTimeout(maxWaitTime),
    }
  },
}

module.exports = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
}
