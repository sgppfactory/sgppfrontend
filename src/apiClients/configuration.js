import {basicClient} from '../utils/httpClient'

export default {
  buildTree: () => {
    return basicClient('/implementation/structure', 'GET')
  },
  create: (params) => {
    return basicClient('/implementation', 'POST', params)
  }
}
