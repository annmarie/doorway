// hashids
const Hashids = require('hashids')
const _isNumber = require('lodash/isNumber')
const _head = require('lodash/head')
const conf = require('./config')

const hashing = new Hashids(conf.secret, 6)

module.exports = {

  encode: (id) => (_isNumber(id)) ? hashing.encode(id) : id,
  decode: (id) => (_isNumber(id)) ? id : _head(hashing.decode(id)),
}
