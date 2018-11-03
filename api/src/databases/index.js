// databases -- wrap calls in promises
const dbs = require('../../dbs')
const _get = require('lodash/get')

const dbCallPromiseWrap = (db) => {

  return {
    query: (query, qargs) => new Promise((good, bad) => {
        db.query(query, qargs, (err, res) => {
          if (err) bad(err)
          else good(res)
        })
    }),

    insertOne: (query, qargs) => new Promise((good, bad) => {
        db.query(query, qargs, (err, res) => {
          if (err) bad(err)
          else good(res)
        })
    }).then(rows => _get(rows, "insertId")),

    escape: (i) => db.escape(i),
  }
}

module.exports = {
  sitedb: dbCallPromiseWrap(dbs.sitedb),
  dardb: dbCallPromiseWrap(dbs.dardb),
}
