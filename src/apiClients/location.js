import {basicClient} from '../utils/httpClient'

export default {
  search: function () {
    return basicClient('/urlgmaps', 'GET')
  }
}
