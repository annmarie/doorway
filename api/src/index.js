// api server
const express = require('express')
const morgan = require('morgan')
const conf = require('./config')

// setup express server
const _app = express().disable('x-powered-by')
const _port = conf.port

// add access output
_app.use(morgan('tiny'))

// start server listening
require('./server')(_app, _port)
