import _ from 'underscore'

export {formatMoney, changeFormatDate, formatResponse}

function formatMoney (number, symbol) {
  let places = 2
  symbol = symbol !== undefined ? symbol : '$'
  let thousand = ','
  let decimal = '.'
  number = Number(number)
  var negative = number < 0 ? '-' : ''
  var i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + ''
  var j = i.length
  j = j > 3 ? j % 3 : 0
  return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '')
}

function changeFormatDate (latinDate) {
  var dma = latinDate.split('/')
  return dma.length === 3 ? dma[2] + '-' + dma[1] + '-' + dma[0] : false
}

function formatResponse (result, callback) {
  result = result.response
  let message = ''
  if (result.status === 404 || result.status === 500) {
    message = 'Error al procesar la petición, vuelva a intentarlo nuevamente más tarde'
  } else if (result.status === 401) {
    message = 'logout'
  } else {
    message = result.data.message
    if (_.isArray(message)) {
      message = _.reduce(
        message,
        (memo, msg) => {
          return memo + msg.message + '<br>'
        }, '')
    }
  }

  callback(message)
}
