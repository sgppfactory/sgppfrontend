import {basicClient} from '../utils/httpClient'

export default {
  getFilter: function (params) {
    return basicClient('/porpose', 'GET', params)
  },
  post: function (params) {
    return basicClient('/porpose', 'POST', params)
  },
  update: function (params) {
    return basicClient('/porpose', 'PUT', params)
  },
  remove: function (id) {
    return basicClient('/porpose/' + id, 'DELETE')
  },
  getById: function (id) {
    return basicClient('/porpose/' + id, 'GET')
  }
}
