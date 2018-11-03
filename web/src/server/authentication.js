// authentication
const conf = require('../config')
const redis = require('redis')
const redis_client = redis.createClient({ host: conf.redishost, port: conf.redisport })

// authentication
module.exports = (router, utils, passport) => {
  const { checkCredentials } = utils
  const messageKey = "loginMessage"
  const checkLoginCreds = checkCredentials.bind({ messageKey })

  // routes
  router.get('/login', passportLoginResp)
  router.post('/login', checkLoginCreds, passportLogin)
  router.get('/logout', authLogout)
  router.get('/me', showAuthMe)

  router.get('/weblogout', webLogout)
  router.get('/weblogin', (req, res) => res.render('login.ejs'))

  function webLogout(req, res) {
      redis_client.del(`sess:${req.session.id}`)
      res.cookie("connect.sid", "", { expires: new Date() })
      req.logOut()
      res.redirect('/')
  }

  function authLogout(req, res) {
    let auth = (req.hasOwnProperty('user')) ? true : false
    let status = 500
    try {
      redis_client.del(`sess:${req.session.id}`)
      res.cookie("connect.sid", "", { expires: new Date() })
      req.logOut()
      status = 200
      auth = false
      rset = { auth }
    } catch(message) {
      rset = { auth, message }
    }
    res.status(status).json(rset)
    res.end()
  }

  function passportLoginResp(req, res) {
    const me = (req.hasOwnProperty('user')) ? req.user : ''
    let auth = false
    let status = 500
    let message = "You are not logged in."
    const flashMsg = req.flash('loginMessage').join(' ')
    if (flashMsg) message = flashMsg
    if (me) {
      auth = true
      status = 200
      rset = { auth, me }
    } else {
      rset = { auth, message }
    }
    res.status(status).json(rset)
    res.end()
  }

  function passportLogin(req, res) {
    passport.authenticate('site-login', {
      successRedirect : '/auth/login',
      failureRedirect : '/auth/login',
      failureFlash : true
    })(req, res)
  }

  function showAuthMe(req, res) {
    const me = req.hasOwnProperty('user') ? req.user : {}
    const isValidUser = (me.hasOwnProperty('authtoken') && (me.authtoken) &&
      me.hasOwnProperty('email') && (me.email))
    new Promise((good, bad) => {
      const authme = (isValidUser) ? { auth: true, me } : { auth: false }
      return (!me) ? good(authme) : req.login(me, () => good(authme))
    })
      .then(rset => res.status(200).json(rset))
      .catch(rset => res.status(200).json(rset))
      .then(() => res.end())
  }

  return router
}
