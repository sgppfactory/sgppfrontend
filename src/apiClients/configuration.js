import {basicClient} from '../utils/httpClient'

export default {
  buildTree: () => {
    return basicClient('/implementation/structure', 'GET')
  },
  getNodesByParent: (params) => {
    return basicClient('/node', 'GET', params)
  },
  createNode: (params) => {
    return basicClient('/node', 'POST', params)
  },
  createStages: (params) => {
    return basicClient('/stage', 'POST', params)
  },
  create: (params) => {
    return basicClient('/implementation', 'POST', params)
  }
}
