import {basicClient} from '../utils/httpClient'

export default {
  getStages: (idNode) => {
    return idNode ? basicClient('/node/' + idNode + '/stages', 'GET') : false
  },
  create: (params) => {
    return basicClient('/nodes', 'POST', params)
  },
  get: (id) => {
    return id ? basicClient('/nodes/' + id, 'GET') : false
  },
  update: (id, params) => {
    return id ? basicClient('/nodes/' + id, 'PUT', params) : false
  },
  remove: (id) => {
    return id ? basicClient('/nodes/' + id, 'DELETE') : false
  },
  getChildrens: () => {
    return basicClient(
      '/nodes',
      'GET',
      {bypage: 100, filter: [{'key': 'cicle', 'value': true, 'operator': 'AND'}]}
      )
  },
  createStages: (params) => {
    return basicClient('/stage', 'POST', params)
  },
  updateStage: (id, params) => {
    return id ? basicClient('/stage/' + id, 'PUT', params) : false
  },
  removeStage: (id) => {
    return id ? basicClient('/stage/' + id, 'DELETE') : false
  }
}
