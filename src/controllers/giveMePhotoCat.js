const fetch = require('node-fetch')

module.exports.giveMePhotoCat = async function giveMePhotoCat() {
  const response = await fetch('https://api.thecatapi.com/v1/images/search')
  const data = await response.json()
  return data[0].url
}