import {basicClient} from '../utils/httpClient'

export default {
  getFilter: function (params) {
    return basicClient('/person', 'GET', params)
  },
  // getFilterAsync: async function (params) {
  //   return await basicClient('/person', 'GET', params)
  // },
  post: function (params) {
    return basicClient('/person', 'POST', params)
  },
  update: function (id, params) {
    if (id && params) {
      return basicClient('/person/' + id, 'PUT', params)
    }
    return new Promise((resolve, reject) => {
      reject('Faltan parámetros en la consulta')
    })
  },
  remove: function (id) {
    return basicClient('/person/' + id, 'DELETE')
  },
  getById: function (id) {
    return basicClient('/person/' + id, 'GET')
  }
}
