
module.exports = {
  secret: process.env.WEBSECRET || "shh123",
  sessionsecret: process.env.WEBSESSIONSECRET || "shh123",

  authtokenexp: process.env.AUTHTOKENEXP || ((60 * 60) * 24) * 8,
  sessionexp: process.env.SESSIONEXP || ((60 * 60) * 24) * 8,

  s3bucketPrvAWS: 'prv',
  s3bucketPubAWS: 'pub',
  s3bucketDataAWS: 'data',
  s3regionAWS: 'us-east-1',
  apiVersionAWS: '2010-12-01',

  accessKeyIdAWS: process.env.ACCESSKEYIDAWS || '',
  secretAccessKeyAWS: process.env.SECRETACCESSKEYAWS || '',

  dbs: {
    sitedb: {
      host: process.env.SITEDBHOST || '',
      user: process.env.SITEDBUSER || '',
      password: process.env.SITEDBPASSWD || '',
      dbname: process.env.SITEDBNAME || ''
    },

    dardb: {
      host: process.env.DARDBHOST || '',
      user: process.env.DARDBUSER || '',
      password: process.env.DARDBPASSWD || '',
      dbname: process.env.DARDBNAME || ''
    }
  },

  redishost: process.env.REDISHOST || 'localhost',
  redisport: process.env.REDISPORT || '6379'
}
