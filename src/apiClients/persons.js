import {basicClient} from '../utils/httpClient'

export default {
  getFilter: function (params) {
    return basicClient('/person', 'GET', params)
  },
  post: function (params) {
    return basicClient('/person', 'POST', params)
  },
  update: function (params) {
    return basicClient('/person', 'PUT', params)
  },
  remove: function (id) {
    return basicClient('/person/' + id, 'DELETE')
  }
}
