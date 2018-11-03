// user forgotpassword models
const hashids = require('../../hashids')
const sitedb = require('../../databases').sitedb
const dbutils = require('../../databases/utils')
const jwt = require('jsonwebtoken')
const _get = require('lodash/get')
const _isEmpty = require('lodash/isEmpty')
const conf = require('../../config')

class ForgotPassword {

  constructor(data) {
    this.id = hashids.encode(_get(data, 'id', ""))
    this.user_id = _get(data, 'user_id', "")
    this.jwtoken = _get(data, 'jwtoken', "")
    this.updated_at = _get(data, 'updated_at', "")
    this.created_at = _get(data, 'created_at', "")
  }

  setForgotPasswordJwt() {
    if (!this.user_id) return
    const user_id = hashids.encode(this.user_id)
    const payload = { user_id }
    const expiresIn = ((60 * 60) * 24) * 31
    this.jwtoken = jwt.sign({ payload }, conf.secret)
  }

  save() {
    const select = async () => {
      if (!this.id) return {}
      const query = "SELECT * FROM forgotpassword WHERE id=?"
      const qargs = [hashids.decode(this.id)]
      const rset = await dbutils.queryOne(sitedb, ForgotPassword, query, qargs)
      return rset
    }

    const insert = async () => {
      if (!this.user_id) throw "user_id not found"
      if (!this.jwtoken) throw "jwtoken not set"
      const query = "INSERT INTO forgotpassword (user_id, jwtoken) VALUES (?, ?)"
      const qargs = [hashids.decode(this.user_id), this.jwtoken]
      const rset = await sitedb.insertOne(query, qargs)
        .then(id => { this.id = hashids.encode(id) })
        .then(() => select())
      return rset
    }

    const update = async (fogotpassword) => {
      const user_id = (this.user_id) ? this.user_id : forgotpassword.user_id
      const query = "UPDATE forgotpassword SET user_id=?, jwtoken=? WHERE id=?"
      const qargs = [hashids.decode(user_id), this.jwtoken, hashids.decode(this.id)]
      const rset = await sitedb.query(query, qargs).then(() => select())
      return rset
    }

    this.setForgotPasswordJwt()

    return select().then(fp => _isEmpty(fp) ? insert() : update(fp))
  }
}

module.exports = ForgotPassword
