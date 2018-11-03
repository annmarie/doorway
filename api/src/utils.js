// utils
const Users = require('./user/collections')
const jwt = require('jsonwebtoken')
const _pick = require('lodash/pick')
const conf = require('./config')

// setup redis caching
const cachesettings = { host: conf.redishost, port: conf.redisport, expire: 10 }
const rediscache = require('express-redis-cache')(cachesettings)
rediscache.on('error', error => console.log('routes cache error <<---'))

const cacheRoute = (req, res, next) => {
  const setRouteCache = rediscache.route({ expire: {
    '200': 10,
    '4xx': 10,
    '403': 10,
    '5xx': 10,
    'xxx': 1
  }})
  return setRouteCache(req, res, next)
}

const makeAuthToken = (user) => {
  const payload = _pick(user, ['id'])
  return jwt.sign({ payload }, conf.secret, { expiresIn: conf.authtokenexp })
}

function parseAuthToken(req, res, next) {
  const bearerHeader = req.headers["authorization"]
  new Promise((good, bad) => {
    const bearer = bearerHeader.split(" ")
    const authtoken = bearer[1]
    if (!authtoken) return bad('auth failed')
    jwt.verify(authtoken, conf.secret, (err, decoded) => {
      if (err) bad(err)
      else good(decoded.payload)
    })
  })
    .then(tokenuser => {
      return new Users(tokenuser).findOne()
        .then(founduser => {
          return _pick(founduser, ['id', 'email', 'name', 'admin', 'permissions'])
        })
    })
    .then(user => { req.user = user })
    .catch(() => { req.user = {} })
    .then(() => next())
}

function adminOnly(req, res, next) {
  const user = req.hasOwnProperty('user') ? req.user : {}
  const isAdmin = (user.hasOwnProperty('admin') && (user.admin))
  if (isAdmin) return next() // admins have access to all pages
  // the web request does not have permission to access the page
  let status = 500
  let message = 'error'
  if (user.hasOwnProperty('id')) {
    // if a user's id is found return Forbidden message
    status = 403
    message = 'Forbidden'
  } else {
    // otherwise return Unauthorized message
    status = 401
    message = 'Unauthorized'
  }
  return renderJson(res, [status, { message }])
}

function jwtVerify(jwtoken) {
  return jwt.verify(jwtoken, conf.secret, (err, decoded) => {
    if (err) throw err
    return decoded.payload
  })
}

function renderJson(res, [status, rset]) {
  res.status(status).json(rset)
  res.end()
  return
}

module.exports = {
  adminOnly,
  cacheRoute,
  makeAuthToken,
  parseAuthToken,
  jwtVerify,
  renderJson
}
