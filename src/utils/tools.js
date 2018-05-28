export {formatMoney, changeFormatDate}

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
