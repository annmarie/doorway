// s3Proxy
const s3Proxy = require('s3-proxy')
const conf = require('../config')

module.exports = (router, utils) => {
  const { checkFilePerms } = utils

  // s3 files behind auth
  router.use('/prv', checkFilePerms, (req, res) => {
    return s3Proxy({
      bucket: conf.s3bucketPrvAWS,
      accessKeyId: conf.accessKeyIdAWS,
      secretAccessKey: conf.secretAccessKeyAWS,
      overrideCacheControl: 'max-age=100000'
    })(req, res, () => res.end())
  })

  // s3 files not behind auth
  router.use('/pub', (req, res) => {
    return s3Proxy({
      bucket: conf.s3bucketPubAWS,
      accessKeyId: conf.accessKeyIdAWS,
      secretAccessKey: conf.secretAccessKeyAWS,
      overrideCacheControl: 'max-age=100000'
    })(req, res, () => res.end())
  })

  return router
}
