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
    if (id && params) {
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
  changeState: function (id, state, advanceProject) {
    if (id && state) {
      var params = {state: state}
      if (advanceProject) {
        params.advance = advanceProject
      }
      return basicClient('/porpose/' + id + '/state', 'PUT', params)
    }
    return new Promise((resolve, reject) => {
      reject('Faltan parámetros en la consulta')
    })
  }
}
