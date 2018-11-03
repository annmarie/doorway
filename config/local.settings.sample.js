const DOMAIN = 'http://10.10.10.10'

module.exports = {
  secret: 'websecret',
  sessionsecret: 'websessionsecret',

  apiurl: `${DOMAIN}/api`,
  authurl: `${DOMAIN}/auth`,

  authtokenexp: ((60 * 60) * 24) * 1,
  sessionexp: ((60 * 60) * 24) * 1,

  accessKeyIdAWS: 'awskey',
  secretAccessKeyAWS: 'awssecret',
  s3bucketPrvAWS: 'prv',
  s3bucketPubAWS: 'pub',

  dbs: {
    sitedb: {
      host: 'localhost',
      user: 'root',
      password: 'root',
      dbname: 'doorway'
    }
  },

  redishost: 'localhost',
  redisport: '6379'
}
