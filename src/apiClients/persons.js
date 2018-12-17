import {basicClient} from '../utils/httpClient'

export default {
  getFilter: function (params) {
    return basicClient('/person', 'GET', params)
  },
  post: function (params) {
    return basicClient('/person', 'POST', params)
  },
  update: function (id, params) {
    if (id && params) {
      return basicClient('/person/' + id, 'PUT', params)
    }
    throw 'Faltan parámetros en la consulta'
  },
  remove: function (id) {
    return basicClient('/person/' + id, 'DELETE')
  },
  getById: function (id) {
    return basicClient('/person/' + id, 'GET')
  }
}
