// passport
const fetch = require('node-fetch')
const LocalStrategy = require('passport-local').Strategy
const conf = require('../config')

module.exports = (passport) => {

  // serialize the user for the session
  passport.serializeUser((session, next) => {
    next(null, session.authtoken)
  })

  // deserialize the user's session
  passport.deserializeUser((authtoken, next) => {
    const apiReqArgs = Object.create(null)
      apiReqArgs.method = 'get'
      apiReqArgs.headers = {
        "Authorization": "Bearer " + authtoken,
        "Cache-Control": "no-cache"
      }
    fetch(conf.apiurl + '/auth/me', apiReqArgs)
      .then(r => r.json())
      .then(rset => {
        const auth = rset.hasOwnProperty('auth') ? rset.auth : false
        if (!auth) return next(null, null)
        const me = rset.hasOwnProperty('me') ? rset.me : {}
        const authtoken = rset.hasOwnProperty('authtoken') ? rset.authtoken : ''
        if (!authtoken) return next(null, null)
        me.authtoken = authtoken
        return next(null, me)
      })
      .catch(() => next(null, null))
  })

  passport.use('site-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, (req, email, password, next) => {
    process.nextTick(() => {
      fetch(conf.apiurl + '/auth/login', {
        method: 'post',
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: 'email='+ email +'&password=' + password
      })
        .then(r => r.json())
        .then(data => {
          if (data.auth == false)
            return next(null, false, req.flash('loginMessage', 'Login Failed.'))
          const authtoken = data.authtoken
          next(null, { authtoken }, req.flash('loginMessage', 'Login Successful.'))
        })
        .catch(err => {
          next(null, false, req.flash('loginMessage', "Login Error." + err))
        })
    })
  }))
}
