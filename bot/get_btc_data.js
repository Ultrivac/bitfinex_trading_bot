const fetch = require('node-fetch') // Fetch library for Node
const url = 'https://api-pub.bitfinex.com/v2/'// Domain

const pathParams = 'tickers' // Change these based on relevant path params listed in the docs
const queryParams = 'symbols=tBTCUSD' // Change these based on relevant query params listed in the docs

var BID = NaN
var ASK = NaN
var LAST_PRICE = NaN
var DIFF = NaN
var TREND = []
var SMA = 0
var SMA_21 = 0
// determine linear trend and gather 2-second price data
setInterval(async () => {
    try {
        const req = await fetch(`${url}/${pathParams}?${queryParams}`)
        const response = await req.json()
        res = response[0]
        BID = parseInt(res[1])
        ASK = parseInt(res[3])
        LAST_PRICE = parseInt(res[7])
        DIFF = parseInt(res[9]) - parseInt(res[10]) // DIFF = HIGH - LOW
        TREND.push(LAST_PRICE) // add element to end of list
    }
    catch (err) {
        console.log(err) // Catches and logs any error
    }
}, 2000);

// determine sma trend data every20 seconds
setInterval(async () => {
  try {
    const req = await fetch("https://api-pub.bitfinex.com/v2/candles/trade:5m:tBTCUSD/hist")
    const response = await req.json()
    var sma_21 = 0
    var sma_100 = 0
    for (var i = 0; i < response.length; i++) {
      if (i < 21){
        sma_21 += response[i][2]
      }
      if (i < 100){
        sma_100 += response[i][2]
      }
    }
    sma_21 = sma_21/21
    sma_100 = sma_100/100
    SMA = sma_21 - sma_100
    SMA_21 = sma_21
    console.log("sma_100: " + sma_100)
    console.log("sma_21: " + sma_21)
    if (sma_21 < sma_100) {
      console.log("SHORT")
    }
    else {
      console.log("LONG")
    }
  }catch (err) {
    console.log(err)
    SMA = NaN
  }
}, 20000);

function get_BID() {
  return BID;
}

function get_ASK() {
  return ASK;
}

function get_LAST_PRICE() {
  return LAST_PRICE;
}

function get_DIFF() {
  return DIFF;
}

function get_TREND() {
  // remove the first minute of the trend if over 5 minutes
  if (TREND.length >= 150){
    TREND = TREND.slice(1);// remove first first entries minute of price data
  }
  if (TREND.length >= 2) {
    start = TREND[0];
    end = TREND[TREND.length-1];
    return (end - start);
  }
    return 0;
}

function get_TREND_size() {
  return TREND.length;
}

function reset_TREND() {
  TREND = [];
}

function get_SMA(){
  return SMA;
}

function is_sma_21_within_price_range(){
    try{
        if (Math.abs(LAST_PRICE - SMA_21) <= 5){
            return true;
        }
    }catch(err){
        return false;    
    }
    return false;
}

module.exports.is_sma_21_within_price_range = is_sma_21_within_price_range;
module.exports.get_SMA = get_SMA;
module.exports.reset_TREND = reset_TREND;
module.exports.get_TREND_size = get_TREND_size;
module.exports.get_BID = get_BID;
module.exports.get_ASK = get_ASK;
module.exports.get_LAST_PRICE = get_LAST_PRICE;
module.exports.get_DIFF = get_DIFF;
module.exports.get_TREND = get_TREND;
