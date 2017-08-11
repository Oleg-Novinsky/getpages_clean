const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

const mongoose = require('mongoose');

// Аутентификация
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 1000000
        });
        res.json({
          success: true,
          token: 'JWT '+token,
          username: user.username
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});




module.exports = router;
