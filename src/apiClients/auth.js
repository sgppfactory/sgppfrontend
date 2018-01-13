import {basicClient} from '../utils/httpClient'

export default {
  login: function (username, password) {
    return basicClient('/auth', 'POST', {username: username, password: password})
  }
}
