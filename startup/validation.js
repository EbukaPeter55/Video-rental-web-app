const Joi = require('joi');

module.exports = function() {
  //objectId is a method of the "joi-objectid"
  Joi.objectId = require('joi-objectid')(Joi);
}