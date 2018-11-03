// user forgotpassword controllers
const Users = require('../collections')
const ForgotPasswords = require('./collections')
const ForgotPassword = require('./models')
const conf = require('../../config')

module.exports = (tools) => {
  const { renderJson, jwtVerify } = tools

  const getForgotPasswords = (req, res) => {
    new ForgotPasswords().findAll()
      .then(forgotpasswords => renderJson(res, [200, forgotpasswords]))
      .catch(message => renderJson(res, [500, { message }]))
  }

  const createForgotPassword = (req, res) => {
    const bodyObj = req.hasOwnProperty('body') ? req.body : {}
    const user_id = bodyObj.user_id
    new Promise((good, bad) => {
      if (!user_id) return good([400, { message: 'request invalid' }])
      new ForgotPasswords({ user_id }).findOne()
        .then(editforgotpassword => {
          editforgotpassword.admin = admin
          return editforgotpassword.save().then(() => editforgotpassword.id)
        })
        .catch(() => {
          const newforgotpassword = new ForgotPassword()
          newforgotpassword.user_id = user_id
          return newforgotpassword.save().then(() => newforgotpassword.id)
        })
        .then(id => new ForgotPasswords({ id }).findOne())
        .then(forgotpassword => good([200, forgotpassword]))
        .catch(err => bad(err))
    })
      .then(render => renderJson(res, render))
      .catch(message => renderJson(res, [500, { message }]))
  }

  const getForgotPasswordById = (req, res) => {
    const id = req.params.id
    new ForgotPasswords({ id }).findOne()
      .then(forgotpassword => renderJson([200, forgotpassword]))
      .catch(message => renderJson(res, [500, { message }]))
  }

  const updateUserPassword = (req, res) => {
    const id = req.params.id
    const bodyObj = req.hasOwnProperty('body') ? req.body : {}
    const user_id = bodyObj.user_id
    const password = bodyObj.password
    new Promise((good, bad) => {
      if (!password) return good([400, { message: "request invalid" }])
      new ForgotPasswords({ id }).findOne()
        .then(forgotpassword => jwtVerify(forgotpassword.jwtoken))
        .then(payload => {
          const hasValidPayload = ((payload) && payload.hasOwnProperty('email') &&
            (payload.user_id === user_id))
          if (!hasValidPayload) return good([400, { message: "request invalid" }])
          return new Users({ id: payload.user_id }).findOne()
            .then(edituser => {
              edituser.password = password
              return edituser.save()
            })
            .then(updateduser => good([200, updateduser]))
        })
        .catch(err => bad(err))
    })
      .then(render => renderJson(res, render))
      .catch(message => renderJson(res, [500, { message }]))
  }

  return {
    getForgotPasswords,
    createForgotPassword,
    getForgotPasswordById,
    updateUserPassword
  }
}
