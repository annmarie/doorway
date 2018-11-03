// user invite models
const hashids = require('../../hashids')
const sitedb = require('../../databases').sitedb
const dbutils = require('../../databases/utils')
const jwt = require('jsonwebtoken')
const _get = require('lodash/get')
const _isEmpty = require('lodash/isEmpty')
const conf = require('../../config')

class Invite {

  constructor(data) {
    this.id = hashids.encode(_get(data, 'id', ""))
    this.email = _get(data, 'email', "")
    this.jwtoken = _get(data, 'jwtoken', "")
    this.perms = _get(data, 'perms', "")
    this.updated_at = _get(data, 'updated_at', "")
    this.created_at = _get(data, 'created_at', "")
  }

  setInviteJwt() {
    if (!this.email) return
    const email = this.email
    const perms = this.perms
    const payload = { email, perms }
    const expiresIn = ((60 * 60) * 24) * 31
    this.jwtoken = jwt.sign({ payload }, conf.secret)
  }

  save() {
    const select = async () => {
      if (!this.id) return {}
      const query = "SELECT * FROM invite WHERE id=?"
      const qargs = [hashids.decode(this.id)]
      const rset = await dbutils.queryOne(sitedb, Invite, query, qargs)
      return rset
    }

    const insert = async () => {
      if (!this.email) throw "email not found"
      if (!this.jwtoken) throw "jwtoken not set"
      if (!this.perms) this.perms = ""
      const query = "INSERT INTO invite (email, jwtoken, perms) VALUES (?, ?, ?)"
      const qargs = [this.email, this.jwtoken, this.perms]
      const rset = await sitedb.insertOne(query, qargs)
        .then(id => { this.id = hashids.encode(id) })
        .then(() => select())
      return rset
    }

    const update = async (invite) => {
      const email = (this.email) ? this.email : invite.email
      const perms = (this.perms) ? this.perms : invite.perms
      const query = "UPDATE invite SET email=?, jwtoken=?, perms=? WHERE id=?"
      const qargs = [email, this.jwtoken, perms, hashids.decode(this.id)]
      const rset = await sitedb.query(query, qargs).then(() => select())
      return rset
    }

    this.setInviteJwt()

    return select().then(invite => _isEmpty(invite) ? insert() : update(invite))
  }
}

module.exports = Invite
