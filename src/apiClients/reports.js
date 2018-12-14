import {basicClient} from '../utils/httpClient'

export default {
  getFilter: function (params) {
    return basicClient('/reports', 'GET', params)
  },
  remove: function () {
    return basicClient('/reports', 'DELETE')
  },
  findById: function (id) {
    return basicClient('/reports/' + id, 'GET')
  },
  findCicles: function () {
    return basicClient('/cicles', 'GET')
  },
  generate: function (params) {
    return basicClient('/reports/try', 'GET', params)
  }
}
