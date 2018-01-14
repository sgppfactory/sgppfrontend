import {basicClient} from '../utils/httpClient'

export default {
  login: function (username, password) {
    return basicClient('/person', 'GET')
  }
}
