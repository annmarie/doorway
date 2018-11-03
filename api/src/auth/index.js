// auth routes
const authController = require('./controllers')

module.exports = (router, utils) => {
  const views = authController(utils)

  router.get('/auth/me', views.authMe)
  router.post('/auth/login', views.authLogin)

  return router
}
