var express = require('express');
var User = require('../models/user');
var jwt = require('jwt-simple');
var config = require('../config/database');
var passport  = require('passport');
var apiblog = express.Router();
 
// create a new user account (POST http://localhost:8080/apiblog/signup)
apiblog.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.json({success: false, msg: 'Debe ingresar nombre, password y email.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Ya existe un usuario con ese nombre.'});
      }
      res.json({success: true, msg: 'Usuario creado.'});
    });
  }
});

// route to authenticate a user (POST http://localhost:8080/apiblog/authenticate)
apiblog.post('/authenticate', function(req, res) {
  console.log('u: '+req.body.username+' p: '+req.body.password);
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Usuario o clave incorrectos.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Usuario o clave incorrectos.'});
        }
      });
    }
  });
});

apiblog.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});
 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = apiblog;