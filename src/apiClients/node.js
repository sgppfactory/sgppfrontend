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
  remove: (id) => {
    return basicClient('/node/' + id, 'DELETE')
  },
  createStages: (params) => {
    return basicClient('/stage', 'POST', params)
  }
}
