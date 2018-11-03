// server
const passport = require('passport')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const conf = require('../config')

module.exports = (app, port) => {
  // set universal headers
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
    res.setHeader("Pragma", "no-cache")
    res.setHeader("Expires", "-1")
    res.setHeader("Vary", "*")
    res.setHeader("Surrogate-Control", "no-store")
    res.setHeader("X-Content-Type-Options", "nosniff")
    res.setHeader("X-Powered-By", "Doorway Portal")
    return next()
  })

  // set request parsing
  app.use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use(cookieParser())
    .use(fileUpload())

  // authentication setup
  require('./passport')(passport)
  app.use(session({
      secret: conf.sessionsecret,
      cookie: { maxage: conf.sessionexp * 1000 },
      rolling: true,
      resave: true,
      saveUninitialized: true,
      store: new RedisStore({ host: conf.redishost, port: conf.redisport }),
      unset: 'destroy'
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use(flash())
    .set('trust proxy', 1)

  // set routes
  require('./routes')(app, passport)

  // start server listening
  const server = app.listen(port, error => {
    if (error) console.log(`there was a problem. ${error}`)
    else console.log(`web server listening at ${server.address().port}`)
  })
}
