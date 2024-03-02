const APIReqeust = require('../model/apiRequest')
const CommonHeaders = require('../model/header')
const currencyCodes = require('../resources/currency_codes')

const parseRequest = function (req) {
  const cHeaders = new CommonHeaders(req.headers['x-channel-id'], req.headers['x-sub-channel-id'], req.headers['x-req-id'])
  const body = req.body
  const queryParams = req.query
  const pathParams = req.query
  return new APIReqeust(cHeaders, body, queryParams, pathParams)
}

/**
 * Removes comma from amount
 * make the decimal point value to length 2
 *
 * Removes point and commas
 *
 * Takes last 13 digits of amount if length is more than 13
 *
 * @param {string} amount
 * @param {number} paddingLength how many zeroes to pad at left
 * @param {number} sliceLength How many digits to pick from last
 * @returns {string} formatted amount left padded with zeroes
 *
 */
const formatAmount = function (amount = '', paddingLength, sliceLength = 13) {
  amount = amount ? String(amount) : ''

  const decimalParts = amount.replace(/,/g, '').split('.')

  if (decimalParts.length > 1) {
    // take out floating point and make it to length 2
    const floatingPointAmount = decimalParts.pop().substring(0, 2)
    // put it back
    decimalParts.push(floatingPointAmount)
  }
  // join parts which will make amount without floating point, take last sliceLength digits, pad left zeroes till specified length
  return decimalParts.join('').slice(-sliceLength).padStart(paddingLength, 0)
}

const setDateLocal = function () {
  let dateObjlocal = new Date()
  dateObjlocal = dateObjlocal.toLocaleString()
  dateObjlocal = dateObjlocal.split(' ')
  var datestr = dateObjlocal[0].split('-')
  var year = datestr[0]
  var month = parseInt(datestr[1]) < 10 ? '0' + datestr[1] : datestr[1]
  var day = parseInt(datestr[2]) < 10 ? '0' + datestr[2] : datestr[2]
  return year + '' + month + '' + day
}

const setTimeLocal = function () {
  const dateObjlocal = new Date()
  var timestr = dateObjlocal[1].split(':')
  var hour = parseInt(timestr[0]) < 10 ? '0' + parseInt(timestr[0]) : parseInt(timestr[0]) + ''
  var minute = parseInt(timestr[1]) < 10 ? '0' + parseInt(timestr[1]) : parseInt(timestr[1]) + ''
  var second = parseInt(timestr[2]) < 10 ? '0' + parseInt(timestr[2]) : parseInt(timestr[2]) + ''
  return hour + minute + second
}

/**
 * Returns xml with accepted special characters
 * @param {string} val
 */
const ConvertXMLcharac = function (val) {
  if (val === '' || val === undefined || val === null || val === 'null') {
    return ''
  }
  val = val.indexOf('&') !== -1 ? val.replace(/&/g, '&amp;') : val
  val = val.indexOf('<') !== -1 ? val.replace(/</g, '&lt;') : val
  val = val.indexOf('>') !== -1 ? val.replace(/>/g, '&gt;') : val
  val = val.indexOf("'") !== -1 ? val.replace(/'/g, '&apos;') : val
  val = val.indexOf('"') !== -1 ? val.replace(/"/g, '&quot;') : val
  return val
}

/**
 * Returns ISO currency code of provided Alpha currency code
 * @param {string} alphaCode
 */
const alphaToIsoCurrencyCode = function (alphaCode) {
  if (!alphaCode) {
    return ''
  }
  const result = currencyCodes.find(row => row.alphaCode === alphaCode)
  return result ? result.currencyCode : ''
}



module.exports = {
  parseRequest: parseRequest,
  formatAmount: formatAmount,
  setDateLocal: setDateLocal,
  setTimeLocal: setTimeLocal,
  ConvertXMLcharac: ConvertXMLcharac,
  alphaToIsoCurrencyCode: alphaToIsoCurrencyCode,
  getFileName
  
}
