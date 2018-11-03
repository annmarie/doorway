// database utils
const _head = require('lodash/head')
const _map = require('lodash/map')

module.exports = {

  queryOne: async (db, model, query, qargs) => {
    const rows = await db.query(query, qargs)
    const data = _head(rows)
    if (!data) throw 'item not found'
    return new model(data)
  },

  queryMany: async (db, model, query, qargs) => {
    const rows = await db.query(query, qargs)
    if (!rows.length) throw 'items not found'
    else return _map(rows, row => new model(row))
  }
}
