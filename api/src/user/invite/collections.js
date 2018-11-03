// user invite collections
const Invite = require('./models')
const hashids = require('../../hashids')
const dbutils = require('../../databases/utils')
const sitedb = require('../../databases').sitedb
const _get = require('lodash/get')
const _replace = require('lodash/replace')
const _map = require('lodash/map')

class Invites {

  constructor(data) {
    this.id = _get(data, 'id', "")
    this.email = _get(data, 'email', "")
    this.limit = _get(data, 'limit', 1000)
    this.offset = _get(data, 'offset', 0)
  }

  async findOne() {
    const key = (this.id) ? 'id' : (this.email) ? 'email' : null
    if (!key) throw "request not valid"
    const data = this
    data.id = hashids.decode(data.id)
    const qtmpl = "SELECT invite.* FROM invite LEFT JOIN user on invite.email = user.email " +
      "WHERE invite.{key}=? AND user.email is NULL LIMIT ?"
    const query = _replace(qtmpl, "{key}", key)
    const qargs = [data[key], 1]
    const rset = await dbutils.queryOne(sitedb, Invite, query, qargs)
                  .then(invite => {
                    invite.perms = JSON.parse(invite.perms)
                    return invite
                  })
    return rset
  }

  async findMany() {
    const key = (this.id) ? 'id' : (this.email) ? 'email' : null
    if (!key) throw "request not valid"
    const data = this
    data.id = _map(data.id, (id) => hashids.decode(id))
    const qtmpl = "SELECT invite.* FROM invite LEFT JOIN user on invite.email = user.email " +
      "WHERE invite.{key} IN (?) AND user.email is NULL LIMIT ? OFFSET ?"
    const query = _replace(qtmpl, "{key}", key)
    const qargs = [data[key], this.limit, this.offset]
    const rset = await dbutils.queryMany(sitedb, Invite, query, qargs)
                  .then(invites => _map(invites, (invite) => {
                    invite.perms = JSON.parse(invite.perms)
                    return invite
                  }))
    return rset
  }

  async findAll() {
    const query = "SELECT invite.* FROM invite LEFT JOIN user ON invite.email = user.email " +
      "WHERE user.email IS NULL LIMIT ? OFFSET ?"
    const qargs = [this.limit, this.offset]
    const rset = await dbutils.queryMany(sitedb, Invite, query, qargs)
                  .then(invites => _map(invites, (invite) => {
                    invite.perms = JSON.parse(invite.perms)
                    return invite
                  }))
    return rset
  }
}

module.exports = Invites
