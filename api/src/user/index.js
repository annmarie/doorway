// user routes
const UserController = require('./controllers')
const UserForgotPasswordController = require('./forgotpassword/controllers')
const UserInviteController = require('./invite/controllers')

module.exports = (router, utils) => {
  const { cacheRoute, adminOnly } = utils
  const views = UserController(utils)
  const viewsFgtPwd = UserForgotPasswordController(utils)
  const viewsInvite = UserInviteController(utils)

  router.get('/user/forgotpassword/:id', viewsFgtPwd.getForgotPasswordById)
  router.post('/user/forgotpassword/:id', viewsFgtPwd.updateUserPassword)

  router.get('/user/forgotpassword', adminOnly, viewsFgtPwd.getForgotPasswords)
  router.post('/user/forgotpassword', adminOnly, viewsFgtPwd.createForgotPassword)

  router.get('/user/invite/:id', viewsInvite.showInvite)
  router.post('/user/invite/:id', viewsInvite.createUserFromInvite)

  router.get('/user/invite/', adminOnly, viewsInvite.showInvites)
  router.post('/user/invite/', adminOnly, viewsInvite.createInvite)

  router.get('/user/:id', adminOnly, cacheRoute, views.getUserById)
  router.get('/user', adminOnly, cacheRoute, views.getUsers)

  return router
}
