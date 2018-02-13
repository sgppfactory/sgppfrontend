import {basicClient} from '../utils/httpClient'

export default {
  get: function () {
    return basicClient('/rol', 'GET')
  }
}
