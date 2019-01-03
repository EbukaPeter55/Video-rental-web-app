//auth here stands for authorization
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
//we import bcryptjs library for hashing or encrypting password, inorder to secure it.
const bcryptjs = require('bcryptjs');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/*--This route handler or endpoint is available to only authenticated users.
We also use "ID" to get users, for security purpose The password is excluded--*/ 
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcryptjs.genSalt(10);
  user.password = await bcryptjs.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router; 
