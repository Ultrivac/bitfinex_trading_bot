
var fs = require('fs');
// given the value of position that is in the money,
// sell if random number is below sell_probability threshold
// sell_probability threshold varies with price, higher price more likely to sell
// order cost is open/close orders = 2*amount*price*0.002
function sell(position, price, amount){

  var sell_probability = 0;
  trade_costs = price * amount * 0.002 * 2;
  position = position - trade_costs;

  if (position >= 2 && position < 5){
    sell_probability = 0.01;
  } else if (position >= 5 && position < 10){
    sell_probability = 0.05;
  } else if (position >= 10){
    sell_probability = 0.07;
  } 

  if (Math.random() <= sell_probability) {
  	return true;
  }else{
  	return false;
  }
}

// append to log file
function log(my_string){
    fs.appendFileSync('log.txt', `${my_string}\n` );
}

module.exports.sell = sell;
module.exports.log = log;
