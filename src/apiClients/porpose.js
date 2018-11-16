import {basicClient} from '../utils/httpClient'

export default {
  getFilter: function (params) {
    return basicClient('/porpose', 'GET', params)
  },
  post: function (params) {
    if (params) {
      return basicClient('/porpose', 'POST', params)
    }
    return new Promise((resolve, reject) => {
      reject('Faltan parámetros en la consulta')
    })
  },
  update: function (id, params) {
    if (id && state) {
      return basicClient('/porpose/' + id, 'PUT', params)
    }
    return new Promise((resolve, reject) => {
      reject('Faltan parámetros en la consulta')
    })
  },
  remove: function (id) {
    if (id) {
      return basicClient('/porpose/' + id, 'DELETE')
    }
    return new Promise((resolve, reject) => {
      reject('Faltan parámetros en la consulta')
    })
  },
  getById: function (id) {
    if (id) {
      return basicClient('/porpose/' + id, 'GET')
    }
    return new Promise((resolve, reject) => {
      reject('Faltan parámetros en la consulta')
    })
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
