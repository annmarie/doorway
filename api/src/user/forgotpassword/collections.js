// user forgotpassword collections
const ForgotPassword = require('./models')
const hashids = require('../../hashids')
const dbutils = require('../../databases/utils')
const sitedb = require('../../databases').sitedb
const _get = require('lodash/get')
const _replace = require('lodash/replace')
const _map = require('lodash/map')

class ForgotPasswords {

  constructor(data) {
    this.id = _get(data, 'id', "")
    this.user_id = _get(data, 'user_id', "")
    this.limit = _get(data, 'limit', 1000)
    this.offset = _get(data, 'offset', 0)
  }

  async findOne() {
    const key = (this.id) ? 'id' : (this.user_id) ? 'user_id' : null
    if (!key) throw "request not valid"
    const data = this
    data.id = hashids.decode(data.id)
    data.user_id = hashids.decode(data.user_id)
    const qtmpl = "SELECT * FROM forgotpassword WHERE {key}=? LIMIT ?"
    const query = _replace(qtmpl, "{key}", key)
    const qargs = [data[key], 1]
    const rset = await dbutils.queryOne(sitedb, ForgotPassword, query, qargs)
    return rset
  }

  async findMany() {
    const key = (this.id) ? 'id' : (this.user_id) ? 'user_id' : null
    if (!key) throw "request not valid"
    const data = this
    data.id = map(data.id, (id) => hashids.decode(id))
    data.user_id = _map(data.user_id, (user_id) => hashids.decode(user_id))
    const qtmpl = "SELECT * FROM forgotpassword WHERE {key} IN (?) LIMIT ? OFFSET ?"
    const query = _replace(qtmpl, "{key}", key)
    const qargs = [data[key], this.limit, this.offset]
    const rset = await dbutils.queryMany(sitedb, ForgotPassword, query, qargs)
    return rset
  }

  async findAll() {
    const query = "SELECT * FROM forgotpassword LIMIT ? OFFSET ?"
    const qargs = [this.limit, this.offset]
    const rset = await dbutils.queryMany(sitedb, ForgotPassword, query, qargs)
    return rset
  }
}

module.exports = ForgotPasswords
