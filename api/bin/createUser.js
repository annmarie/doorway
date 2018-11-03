const User = require('../src/user/models')
const prompt = require('prompt')

const properties = [
  { name: 'email', type: 'string', },
  { name: 'password', type: 'string', hidden: true, replace: "*", },
  { name: 'admin', type: 'boolean', message: 'true or false', default: false, },
]

prompt.start();

prompt.get(properties, (err, result) => {
  if (err) {
    console.log(err)
    process.exit()
    return 1
  }

  const newuser = new User()
  newuser.email = result.email
  newuser.password = result.password
  newuser.admin = result.admin

  return newuser.save()
  .then(usr => console.log(usr))
  .catch(err => console.log(err))
  .then(() => process.exit())
})
