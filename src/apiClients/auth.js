import {basicClient} from '../utils/httpClient'

export default {
  login: function (username, password) {
    return basicClient('/auth', 'POST', {username: username, password: password})
  },
  getUser: function () {
    return basicClient('/user', 'GET')
  },
  update: function (params) {
    return basicClient('/user', 'PUT', params)
  },
  getLogUser: function (params) {
    return basicClient('/user/log', 'GET', params)
  }
}
