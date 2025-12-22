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

const versions = {
  0: ({ topics }) => {
    return { request: v0Request({ topics }), response: v0Response }
  },
  1: ({ topics }) => {
    return { request: v1Request({ topics }), response: v1Response }
  },
  2: ({ topics }) => {
    return { request: v2Request({ topics }), response: v2Response }
  },
  3: ({ topics }) => {
    return { request: v3Request({ topics }), response: v3Response }
  },
  4: ({ topics, allowAutoTopicCreation }) => {
    return { request: v4Request({ topics, allowAutoTopicCreation }), response: v4Response }
  },
  5: ({ topics, allowAutoTopicCreation }) => {
    return { request: v5Request({ topics, allowAutoTopicCreation }), response: v5Response }
  },
  6: ({ topics, allowAutoTopicCreation }) => {
    return { request: v6Request({ topics, allowAutoTopicCreation }), response: v6Response }
  },
}

module.exports = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
}
