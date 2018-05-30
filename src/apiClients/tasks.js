import {basicClient} from '../utils/httpClient'

export default {
  getFilter: function (params) {
    return basicClient('/tasks', 'GET', params)
  },
  remove: function () {
    return basicClient('/tasks', 'DELETE')
  },
  findById: function (id) {
    return basicClient('/tasks/' + id, 'GET')
  }
}
