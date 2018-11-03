// config utils
const getSettings = (file) => {
  try { return require(file) }
  catch(e) { return Object.create(null) }
}

module.exports = { getSettings }
