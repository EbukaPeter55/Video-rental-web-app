const winston = require('winston');

/**Error middleware or functions with 4 arguments, winston is use to log out the errors, 
 it works only for a requesting process pipeline */
module.exports = function(err, req, res, next){
  winston.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug 
  // silly

  res.status(500).send('Something failed.');
}