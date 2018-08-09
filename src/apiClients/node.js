import {basicClient} from '../utils/httpClient'

export default {
  getStages: (idNode) => {
    return idNode ? basicClient('/node/' + idNode + '/stages', 'GET') : false
  },
  create: (params) => {
    return basicClient('/node', 'POST', params)
  },
  get: (id) => {
    return basicClient('/node/' + id, 'GET')
  },
  update: (id, params) => {
    return basicClient('/node/' + id, 'PUT', params)
  },
  remove: (id) => {
    return basicClient('/node/' + id, 'DELETE')
  },
  createStages: (params) => {
    return basicClient('/stage', 'POST', params)
  },
  updateStage: (id, params) => {
    return basicClient('/stage/' + id, 'PUT', params)
  },
  removeStage: (id) => {
    return basicClient('/stage/' + id, 'DELETE')
  }
}
