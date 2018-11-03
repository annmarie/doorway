const DOMAIN = 'http://localhost'

module.exports = {

  apiurl: `${DOMAIN}/api`,
  authurl: `${DOMAIN}/auth`,

  authtokenexp: ((60 * 60) * 24) * 1,
  sessionexp: ((60 * 60) * 24) * 1,

  s3reportRoot: 'TEST',

  dbs: {
    sitedb: {
       host: 'localhost',
       user: 'root',
       password: 'root',
       dbname: 'doorway_test'
    }
  }
}
