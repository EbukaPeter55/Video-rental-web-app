const Joi = require('joi');
//we import bcryptjs library for hashing or encrypting password, inorder to secure it.
const bcryptjs = require('bcryptjs');
//the lodash library makes use of the _.pick to present user to the client
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  //Validating the user with his email, if not found, send Invalid email or password
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  //Validating the password using the bcryptjs.comp method, comparing the plain text and hashed password
  const validPassword = await bcryptjs.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  //Generating a token. "JwtPrivateKey" is not a secrete but our app settings

  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 
