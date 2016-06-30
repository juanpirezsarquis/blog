var express = require('express');
var User = require('../models/user');
var apiblog = express.Router();
 
// create a new user account (POST http://localhost:8080/api/signup)
apiblog.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.json({success: false, msg: 'Please pass name, password and email.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

module.exports = apiblog;