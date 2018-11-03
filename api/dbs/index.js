const mysql = require('mysql')
const conf = require('../config')

const dbs = conf.dbs

const connections = {
  // create mysql connection to the sitedb
  sitedb: mysql.createPool({
    host: dbs.sitedb.host,
    user: dbs.sitedb.user,
    password: dbs.sitedb.password,
    database: dbs.sitedb.dbname,
    multipleStatements: true
  })
}

// connect to sitedb
connections.sitedb.getConnection((err) => {
  if (err) {
    console.log("mysql sitedb error <<---")
    console.log(err.code);
    console.log(err.fatal);
  }
})

module.exports = connections
