// api config
const _defaultsDeep = require('lodash/defaultsDeep')
const { getSettings } = require('../config/utils')
const settings = getSettings('../config/settings')
const local_settings = getSettings('../config/local.settings')
const test_settings = getSettings('../config/test.settings')

require('dotenv').config()
const node_env = process.env.NODE_ENV
const port = process.env.PORT

settings.port = port || 3002

module.exports = (node_env === 'test') ?
  _defaultsDeep(test_settings, settings) :
  _defaultsDeep(local_settings, settings)
