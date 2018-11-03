// server
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

module.exports = (app, port) => {
  // set universal headers
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
    res.setHeader("Pragma", "no-cache")
    res.setHeader("Expires", "0")
    res.setHeader("Vary", "*")
    res.setHeader("Surrogate-Control", "no-store")
    res.setHeader("X-Powered-By", "Doorway Portal")
    return next()
  })

  // set request parsers
  app.use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use(fileUpload())

  // set routes
  require('./routes')(app)

  // start server listening
  const server = app.listen(port, error => {
    if (error) console.log(`There was a problem. ${error}`)
    else console.log(`api server listening at ${server.address().port}`)
  })
}
