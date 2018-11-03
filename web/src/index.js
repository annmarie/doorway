// web server
const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const path = require('path')
const conf = require('./config')

// setup express server and disable X-Powered-By
const _app = express().disable('x-powered-by')
const _port = conf.port

// add access output
_app.use(morgan('tiny'))

// views
_app.set('view engine', 'ejs')
  .set('views', path.join(__dirname, '/views'))

// static routes
_app.use(favicon(path.join(__dirname, '../static/public', 'favicon.ico')))
  .use('/gen', express.static(path.join(__dirname, '../static/gen')))

// start server listening
require('./server')(_app, _port)
