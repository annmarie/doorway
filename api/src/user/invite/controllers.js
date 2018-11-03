// user invite controllers
const Users = require('../collections')
const User = require('../models')
const Invites = require('./collections')
const Invite = require('./models')
const conf = require('../../config')

module.exports = (tools) => {
  const { renderJson, jwtVerify, makeAuthToken } = tools

  const showInvites = (req, res) => {
    new Promise((good, bad) =>
      new Invites().findAll()
        .then(invites => good([200, invites]))
        .catch(() => good([200, []]))
    )
      .then(render => renderJson(res, render))
      .catch(message => renderJson(res, [500, { message }]))
  }

  const createInvite = (req, res) => {
    const bodyObj = req.hasOwnProperty('body') ? req.body : {}
    const email = (bodyObj.email || "").toLowerCase()
    const perms = JSON.stringify(bodyObj.perms || [])
    new Promise((good, bad) => {
      if (!email) return good([400,{ message: 'request invalid' }])
      new Users({ email }).findOne()
        .then(user => good([400, { message: 'invite accepted' }]))
        .catch(() => new Invites({ email }).findOne())
        .then(editinvite => {
          editinvite.perms = perms
          return editinvite.save().then(() => editinvite.id)
        })
        .catch(() => {
          const newinvite = new Invite()
          newinvite.email = email
          newinvite.perms = perms
          return newinvite.save().then(() => newinvite.id)
        })
        .then(id => new Invites({ id }).findOne())
        .then(invite => good([200, invite]))
        .catch(err => bad(err))
    })
      .then(render => renderJson(res, render))
      .catch(message => renderJson(res, [500, { message }]))
  }

  const showInvite = (req, res) => {
    const id = req.params.id
    new Promise((good, bad) =>
      new Invites({ id }).findOne()
        .then(invite => good([200, invite]))
        .catch(() => bad('invite expired'))
    )
      .then(render => renderJson(res, render))
      .catch(message => renderJson(res, [500, { message }]))
  }

  const createUserFromInvite = (req, res) => {
    const id = req.params.id
    const bodyObj = req.hasOwnProperty('body') ? req.body : {}
    const email = (bodyObj.email || "").toLowerCase()
    const password = bodyObj.password
    new Promise((good, bad) => {
      if (!password) return good([400, { message: "request invalid" }])
      new Invites({ id }).findOne()
        .then(invite => jwtVerify(invite.jwtoken))
        .then(payload => {
          const hasValidPayload = ((payload) && payload.hasOwnProperty('email') &&
            (payload.email === email))
          if (!hasValidPayload) return good([400, { message: "request invalid" }])
          const perms = payload.hasOwnProperty('perms') ? payload.perms : ""
          return new Users({ email }).findOne()
            .then(user => good([400, { message: "Email already in use" }]))
            .catch(() => {
              const newuser = new User()
              newuser.email = email
              newuser.password = password
              newuser.perms = perms
              return newuser.save()
            })
            .then(addeduser => {
              const id = addeduser.id
              const email = addeduser.email
              const authtoken = makeAuthToken(addeduser)
              good([200, { id, email, authtoken }])
            })
        })
        .catch(err => bad(err))
    })
      .then(render => renderJson(res, render))
      .catch(message => renderJson(res, [500, { message }]))
  }

  return {
    showInvites,
    createInvite,
    showInvite,
    createUserFromInvite,
  }
}
