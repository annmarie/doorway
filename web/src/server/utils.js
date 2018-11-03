// utils
const fetch = require('node-fetch')
const conf = require('../../config')

const hasAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.redirect('/auth/weblogin?ret='+req.originalUrl)
}

const checkFilePerms = (req, res, next) => {
  const checkHasFilePerms = () => {
    const filepath = req.hasOwnProperty('originalUrl') ? req.originalUrl : ''
    const record_id = filepath.split('/').slice(-2, -1)[0]
    const user = req.hasOwnProperty('user') ? req.user : {}
    const authtoken = user.hasOwnProperty('authtoken') ? user.authtoken : ''
    const apiReqArgs = Object.create(null)
      apiReqArgs.method = 'get'
      apiReqArgs.headers = {
        "Authorization": "Bearer " + authtoken,
        "Cache-Control": "no-cache"
      }
    fetch(conf.apiurl + '/report/' + record_id, apiReqArgs)
      .then(r => r.json())
      .then(rset => {
        const user = req.hasOwnProperty('user') ? req.user : {}
        const userIsAdmin = (user.hasOwnProperty('admin') && (user.admin))
        if (userIsAdmin) return next()
        if (rset.id === record_id) {
          const permissions = (user.hasOwnProperty('permissions')) ? user.permissions : {}
          const category = rset.hasOwnProperty('category') ? rset.category.toLowerCase() : ""
          const hasPerms = permissions.reports.includes(category) ? true : false
          if (hasPerms) return next()
          res.status(403).send('forbidden')
          res.end()
        } else {
          res.status(404).send('not found')
          res.end()
        }
      })
      .catch(() => {
        res.status(500).send('error')
        res.end()
      })
  }
  return hasAuth(req, res, checkHasFilePerms)
}

const isAdmin = (req, res, next) => {
  const checkIsAdmin = () => {
    const userIsAdmin = (req.hasOwnProperty('user') && (req.user.admin))
    if (userIsAdmin) return next()
    res.status(500).send('error')
  }
  return hasAuth(req, res, checkIsAdmin)
}

const checkCredentials = (req, res, next) => {
  const hasValidReq = (req.hasOwnProperty('body') &&
    (req.body.email) && (req.body.password))
  if (!hasValidReq) req.flash(this.messageKey, 'Credentials not valid.')
  next()
}

module.exports = {
  hasAuth,
  isAdmin,
  checkFilePerms,
  checkCredentials
}
