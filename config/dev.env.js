'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const path = require('path')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"http://localhost:3000"',
  keyGMaps: '"' + path.resolve(__dirname, '../credentials/gmaps.txt') + '"',
  // DEBUG_MODE: true,s
})
