// user models
const bcrypt = require('bcrypt-nodejs')
const hashids = require('../hashids')
const sitedb = require('../databases').sitedb
const dbutils = require('../databases/utils')
const _get = require('lodash/get')
const _isEmpty = require('lodash/isEmpty')

class User {

  constructor(data) {
    this.id = hashids.encode(_get(data, 'id', ""))
    this.email = _get(data, 'email', "")
    this.name = _get(data, 'name', "")
    this.nickname = _get(data, 'nickname', "")
    this.password = _get(data, 'password', "")
    this.password_digest = _get(data, 'password_digest', "")
    this.admin = (_get(data, 'admin', 0)) ? 1 : 0
    this.perms = _get(data, 'perms', "")
    this.updated_at = _get(data, 'updated_at', "")
    this.created_at = _get(data, 'created_at', "")
    this.processPassword()
    this.processPermissions()
  }

  processPassword() {
    if (this.password) {
      this.password_digest = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null)
      this.password = null
    }
  }

  processPermissions() {
    const perms = (this.perms) ? JSON.parse(this.perms) : []
    if (!Array.isArray(perms)) return
    const permissions = { products: [], reports: [] }
    for (let i=0;i<perms.length;i++) {
      const row = perms[i].split(':')
      if (permissions.hasOwnProperty(row[0]))
        permissions[row[0]].push(row[1])
      else
        permissions[row[0]] = [row[1]]
    }
    // set this.permissions value
    this.permissions = permissions
  }

  hasValidPassword(password) {
    return bcrypt.compareSync(password, this.password_digest)
  }

  async savePerms(rawtext) {
    return ''
  }

  save() {
    const select = async () => {
      if (!this.id) return {}
      const query = "SELECT * FROM user WHERE id=?"
      const qargs = [hashids.decode(this.id)]
      const rset = await dbutils.queryOne(sitedb, User, query, qargs)
      return rset
    }

    const insert = async () => {
      if (!this.email) throw "email not found"
      if (!this.password_digest) throw "password not found"
      const query = "INSERT INTO user (email, name, nickname, password_digest, admin, perms) VALUES (?, ?, ?, ?, ?, ?)"
      const qargs = [this.email, this.name, this.nickname, this.password_digest, this.admin, this.perms]
      const rset = await sitedb.insertOne(query, qargs)
        .then(id => { this.id = hashids.encode(id) })
        .then(() => select())
      return rset
    }

    const update = async (user) => {
      const email = (this.email) ? this.email : user.email
      const name = (this.name) ? this.name : user.name
      const nickname = (this.nickname) ? this.nickname : user.nickname
      const admin = (this.admin) ? this.admin : user.admin
      const perms = (this.perms) ? this.perms : user.perms
      const pswd = (this.password_digest) ?
        this.password_digest : user.password_digest
      const nothingToUpdate = ((email === user.email) && (admin === user.admin) &&
        (perms === user.perms) && (pswd === user.password_digest))
      if (nothingToUpdate) return user
      const query = "UPDATE user SET email=?, name=?, nickname=?, admin=?, perms=?, password_digest=? WHERE id=?"
      const qargs = [email, name, nickname, admin, perms, pswd, hashids.decode(this.id)]
      const rset = await sitedb.query(query, qargs).then(() => select())
      return rset
    }

    this.processPassword()

    return select().then(user => _isEmpty(user) ? insert() : update(user))
  }
}

module.exports = User
