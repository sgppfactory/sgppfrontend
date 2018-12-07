import {basicClient} from '../utils/httpClient'

export default {
  getFilter: function (params) {
    return basicClient('/tasks', 'GET', params)
  },
  findById: function (id) {
    return basicClient('/tasks/' + id, 'GET')
  },
  post: function (params) {
    return basicClient('/tasks', 'POST', params)
  }
}
