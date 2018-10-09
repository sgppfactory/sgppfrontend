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
  },
  changeState: function (id, state) {
    if (id && state) {
      return basicClient('/porpose/' + id + '/state', 'PUT', {state: state})
    }
    return new Promise((resolve, reject) => {
      reject('Faltan parámetros en la consulta')
    })
  }
}
