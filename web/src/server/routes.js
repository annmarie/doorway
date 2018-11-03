// routes
const routeUtils = require('./utils')
const conf = require('../config')

module.exports = (app, passport) => {
  const router = require('express').Router()

  // all / routes
  router.get('/', (req, res) => res.render('index.ejs'))

  // all /auth routes
  app.use('/auth', require('./authentication')(router, routeUtils, passport))

  // all /f routes
  app.use('/f', require('./s3files')(router, routeUtils)) // aws s3 file proxy


  // robots.txt request
  app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
  })

  // index page
  app.get(/^(\/|\/auth)\/?$/, routeUtils.hasAuth, (req, res) => {
    res.render('index.ejs')
  })

  app.get("*", (req, res) => {
    res.writeHead(404, {'Content-type': 'text/html'})
    res.write('huh?')
    res.end()
  })
}
