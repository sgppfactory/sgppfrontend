'use strict'
const path = require('path')

module.exports = {
  NODE_ENV: '"production"',
  DEBUG_MODE: false,
  API_URL: '"https://api.forkb.com.ar:3000"',
  keyGMaps: '"' + path.resolve(__dirname, '../credentials/gmaps.txt') + '"',
  // dev: {
  // 	host: '"0.0.0.0"'
  // }
}
