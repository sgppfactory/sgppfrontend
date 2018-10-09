import {basicClient} from '@/utils/httpClient'

export default {
  search: function (params) {
    return basicClient('/labels', 'GET', params)
  },
  create: function (params) {
    return basicClient('/labels', 'POST', params)
  }
}
