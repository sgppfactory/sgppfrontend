import httpClient from 'axios'
import _ from 'underscore'
import config from '../../config'
// const BASE_URL = 'http://localhost:3000';

// export {getPublicStartupBattles, getPrivateStartupBattles};
export {basicClient}

function basicClient (url, method, params) {
  var data
  var header = {}

  if (_.contains(['POST', 'PUT', 'PATCH'], method)) {
    const formData = new FormData()
    for (let name in params) {
      let param = params[name]
      if (typeof param === 'object') {
        param = JSON.stringify(params[name])
      }
      formData.append(name, param)
    }
    data = {data: formData}
  } else {
    data = {params: params}
  }

  if (localStorage.jwt) {
    header = {headers: {'Authorization': 'Bearer ' + localStorage.jwt}}
  }

  return httpClient.request(_.extend({
    url: url,
    method: method,
    baseURL: config.API_URL
    // headers: header
  }, data, header))
}

// function getPrivateStartupBattles() {
//   const url = `${BASE_URL}/api/battles/private`;
//   return axios.get(url).then(response => response.data);
// }
