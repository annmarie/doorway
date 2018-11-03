// auth controllers
const _pick = require('lodash/pick')
const User = require('../user/models')
const Users = require('../user/collections')
const conf = require('../config')

module.exports = (tools) => {
  const { renderJson, makeAuthToken } = tools

  const authMe = (req, res) => {
    new Promise((good, bad) => {
      const user = (req.hasOwnProperty('user')) ? req.user : {}
      if (user.hasOwnProperty('email')) {
        const authtoken = makeAuthToken(user)
        const me = _pick(user, ['id', 'email', 'name', 'admin', 'permissions'])
        good([200, authtoken, me])
      } else {
        bad([401, 'Unauthorized'])
      }
    })
      .then(([status, authtoken, me]) => [status, { auth: true, authtoken, me }])
      .catch(([status, message]) => [status, { auth: false, message }])
      .then(render => renderJson(res, render))
  }

  const authLogin = (req, res) => {
    const bodyObj = req.hasOwnProperty('body') ? req.body : {}
    const email = (bodyObj.email || "").toLowerCase()
    const password = bodyObj.password

    return new Promise((good, bad) => {
      if (!email) return bad([400, 'email not found'])
      if (!password) return bad([400, 'password not found'])

      new Users({ email }).findOne()
        .then(user => {
          if (!user.hasValidPassword(bodyObj.password))
            return bad([400, 'password failed'])
          const authtoken = makeAuthToken(user)
          return good([200, authtoken])
        })
        .catch(() => bad([401, 'unauthorized']))
    })
      .then(([status, authtoken]) => [status, { auth: true, authtoken }])
      .catch(([status, message]) => [status, { auth: false, message }])
      .then(render => renderJson(res, render))
  }

  return { authMe, authLogin }
}
