import {basicClient} from '../utils/httpClient'

export default {
  buildTree: function () {
    return basicClient('/implementation/structure', 'GET')
  }
}
