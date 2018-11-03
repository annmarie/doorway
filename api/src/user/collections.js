// user collections
const User = require('./models')
const hashids = require('../hashids')
const dbutils = require('../databases/utils')
const sitedb = require('../databases').sitedb
const _get = require('lodash/get')
const _map = require('lodash/map')
const _replace = require('lodash/replace')

class Users {

  constructor(data) {
    this.id = _get(data, 'id', "")
    this.email = _get(data, 'email', "")
    this.limit = _get(data, 'limit', 1000)
    this.offset = _get(data, 'offset', 0)
  }

  async findOne() {
    const key = (this.id) ? 'id' : (this.email) ? 'email' : null
    if (!key) throw 'request not valid'
    const data = this
    data.id = hashids.decode(data.id)
    const qtmpl = "SELECT * FROM user WHERE {key}=? LIMIT ?"
    const query = _replace(qtmpl, "{key}", key)
    const qargs = [data[key], 1]
    const rset = await dbutils.queryOne(sitedb, User, query, qargs)
    return rset
  }

  async findMany() {
    const key = (this.id) ? 'id' : (this.email) ? 'email' : null
    if (!key) throw 'request not valid'
    const data = this
    data.id = _map(data.id, (id) => hashids.decode(id))
    const qtmpl = "SELECT * FROM user WHERE {key} IN (?) LIMIT ? OFFSET ?"
    const query = _replace(qtmpl, "{key}", key)
    const qargs = [data[key], this.limit, this.offset]
    const rset = await dbutils.queryMany(sitedb, User, query, qargs)
    return rset
  }

  async findAll() {
    const query = "SELECT * FROM user LIMIT ? OFFSET ?"
    const qargs = [this.limit, this.offset]
    const rset = await dbutils.queryMany(sitedb, User, query, qargs)
    return rset
  }
}

module.exports = Users
