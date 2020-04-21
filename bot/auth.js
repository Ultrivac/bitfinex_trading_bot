const CryptoJS = require('crypto-js') // Standard JavaScript cryptography library
const request = require('request') // "Request" HTTP req library
const fetch = require('node-fetch') // Fetch library for Node
util = require('./util.js')

//bitfinex api key credentials:
const apiKey = '' // const apiKey = 'paste key here'
const apiSecret = '' // const apiSecret = 'paste secret here'
var my_body = null
var my_error = false
// submits order iven two integers price and amount
// positive amount means buy, negative means sell
// to close a long position sell the same amount vice versa
function submit_market_order(price, amount){
  const apiPath = 'v2/auth/w/order/submit'// Example path
  const nonce = (Date.now() * 1000).toString() // Standard nonce generator. Timestamp * 1000
  const body = {
  		type: 'MARKET',
      symbol: 'tBTCUSD',
      price: price.toString(),
      amount: amount.toString()
  }
  let signature = `/api/${apiPath}${nonce}${JSON.stringify(body)}`
  const sig = CryptoJS.HmacSHA384(signature, apiSecret).toString()

  const options = {
    url: `https://api.bitfinex.com/${apiPath}`,
    headers: {
      'bfx-nonce': nonce,
      'bfx-apikey': apiKey,
      'bfx-signature': sig
    },
    body: body,
    json: true
  }
  request.post(options, (error, response, body) => {
    if (error) {
      my_error = true;
    }
    util.log(`${body}`)
    console.log(body); // Logs the response body
  })
}

function get_positions(){
  const apiPath = 'v2/auth/r/positions'// Example path
  const nonce = (Date.now() * 1000).toString() // Standard nonce generator. Timestamp * 1000
  const body = {}
  let signature = `/api/${apiPath}${nonce}${JSON.stringify(body)}`
  const sig = CryptoJS.HmacSHA384(signature, apiSecret).toString()
  const options = {
    url: `https://api.bitfinex.com/${apiPath}`,
    headers: {
      'bfx-nonce': nonce,
      'bfx-apikey': apiKey,
      'bfx-signature': sig
    },
    body: body,
    json: true
  }

  request.post(options, (error, response, body) => {my_body = body;})
}

function get_PL(){
  try{
    if (my_body == null) {
      return 0;
    }
    return parseFloat(my_body[0][6]);
  }
  catch (err) {
    return 0; // Catches and logs any error
  }
}

function check_error(){
  return my_error;
}

module.exports.check_error = check_error;
module.exports.get_PL = get_PL;
module.exports.submit_market_order = submit_market_order;
module.exports.get_positions = get_positions;
