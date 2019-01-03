const config = require('config');

module.exports = function() {
  //If configuration key is not set or same, throw an error and exit the process..
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
}