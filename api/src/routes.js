// routes
const routeUtils = require('./utils')
const conf = require('./config')

module.exports = (app) => {
  const router = require('express').Router()
  const { cacheRoute, parseAuthToken } = routeUtils

  // parse auth token
  app.use((req, res, next) => parseAuthToken(req, res, next))

  // all /api routes
  app.use('/api', require('./auth')(router, routeUtils))
  app.use('/api', require('./user')(router, routeUtils))

  // render robots.txt
  router.get('/robots.txt', cacheRoute, (req, res) => {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
  })

  // index page
  app.get(/(\/|\/api)\/?$/, cacheRoute, (req, res) => {
    res.writeHead(200, {'Content-type': 'text/html'})
    res.write('DOORWAY API')
    res.end()
  })
}
