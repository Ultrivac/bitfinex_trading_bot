auth = require('./auth.js')
util = require('./util.js')

var price = null
var trend = null
var position = null
var TRADE = false
var direction = null
const amount = 0.05

let price_timer = setInterval(() => {
  require('./auth.js').get_positions()
  position = require('./auth.js').get_PL()
  price = require('./get_btc_data.js').get_LAST_PRICE()
  trend = require('./get_btc_data.js').get_TREND()
  sma = require('./get_btc_data.js').get_SMA()
  var within_range = require('./get_btc_data.js').is_sma_21_within_price_range()
  if (sma <= -25 && TRADE == false && within_range){
    auth.submit_market_order(0, -amount);
    // check if order succeded
    if (require('./auth.js').check_error() == false){
      TRADE = true;
      direction = 'SHORT';
    } else { console.log('order failed - handled')}
  } else if(sma >= 25 && TRADE == false && within_range){
      auth.submit_market_order(0, amount);
      // check if order succeded
      if (require('./auth.js').check_error() == false){
        TRADE = true;
        direction = 'LONG';
      } else { console.log('order failed - handled')}
  }

  if (TRADE == true){
    if (direction == "SHORT" && sma >= 0){
      auth.submit_market_order(0, amount);
      // check if order succeded
      if (require('./auth.js').check_error() == false){
        TRADE = false;
        direction = null;
      } else { console.log('order failed - handled')}
    } else if (direction == "LONG" && sma <= 0){
      auth.submit_market_order(0, -amount);
      if (require('./auth.js').check_error() == false){
        TRADE = false;
        direction = null;
      } else { console.log('order failed - handled')}
    }
  }
  // sell prematurely if profit or a loss exceeds 8 USD, therefore max loss is 8 USD
  if (TRADE == true && (util.sell(position, price, amount) == true || position < -8)){
    if (direction == 'LONG'){
      auth.submit_market_order(0, -amount);
      if (require('./auth.js').check_error() == false){
        TRADE = false;
        direction = null;
        util.log('sell triggered')
        console.log('sell triggered')
      } else { console.log('order failed - handled')}
    }else if (direction == 'SHORT') {
      auth.submit_market_order(0, amount);
      if (require('./auth.js').check_error() == false){
        TRADE = false;
        direction = null;
        util.log('sell triggered')
        console.log('sell triggered')
      } else { console.log('order failed - handled')}
    }
  }


  util.log(`${price} ${position} ${sma}`) // append to log file
  console.log(price, position, sma)
}
, 2000);


//auth.submit_market_order(0, 0.01)
