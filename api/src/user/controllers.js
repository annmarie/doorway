// user controllers
const Users = require('./collections')
const User = require('./models')
const _map = require('lodash/map')
const _pick = require('lodash/pick')
const conf = require('../../config')

module.exports = (tools) => {
  const { renderJson } = tools

  const getUsers = (req, res) => {
    new Users().findAll()
      .then(users => _map(users, (user) => {
        return _pick(user, ['id', 'email', 'name', 'admin', 'permissions'])
      }))
      .then(users => renderJson(res, [200, users]))
      .catch(message => renderJson(res, [500, { message }]))
  }

  const getUserById = (req, res) => {
    const id = req.params.id
    new Users({ id }).findOne()
      .then(user => _pick(user, ['id', 'email', 'name', 'admin', 'permissions']))
      .then(users => renderJson(res, [200, users]))
      .catch(message => renderJson(res, [500, { message }]))
  }

  return {
    getUsers,
    getUserById
  }
}
