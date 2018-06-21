import {basicClient} from '../utils/httpClient'

export default {
  getStages: (idNode) => {
    return idNode ? basicClient('/node/' + idNode + '/stages', 'GET') : false
  },
  create: (params) => {
    return basicClient('/node', 'POST', params)
  }
}
