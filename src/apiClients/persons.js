import {basicClient} from '../utils/httpClient'

export default {
  getFilter: function (params) {
    return basicClient('/person', 'GET', params)
  }
}
