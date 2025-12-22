const v0Request = require('./v0/request')
const v0Response = require('./v0/response')
const v1Request = require('./v1/request')
const v1Response = require('./v1/response')
const v2Request = require('./v2/request')
const v2Response = require('./v2/response')
const v3Request = require('./v3/request')
const v3Response = require('./v3/response')

const versions = {
  0: ({ groupId, memberId }) => {
    return {
      request: v0Request({ groupId, memberId }),
      response: v0Response,
    }
  },
  1: ({ groupId, memberId }) => {
    return {
      request: v1Request({ groupId, memberId }),
      response: v1Response,
    }
  },
  2: ({ groupId, memberId }) => {
    return {
      request: v2Request({ groupId, memberId }),
      response: v2Response,
    }
  },
  3: ({ groupId, memberId, groupInstanceId }) => {
    return {
      request: v3Request({ groupId, members: [{ memberId, groupInstanceId }] }),
      response: v3Response,
    }
  },
}

module.exports = {
  versions: Object.keys(versions),
  protocol: ({ version }) => versions[version],
}
