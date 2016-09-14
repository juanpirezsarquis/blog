var express = require('express');
var User = require('../models/user');
//var jwt = require('jwt-simple');
var jwt = require('jsonwebtoken');
var config = require('../config/database');
var apiposts = require('./apiposts');
var api = express.Router();
 
// route to authenticate a user (POST http://localhost:8080/api/authenticate)
api.post('/authenticate', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, message: 'Usuario o clave incorrectos.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          // do not pass password because its on base64
          var userJson = { user: { username: user.username, email: user.email }};
          var token = jwt.sign(userJson, config.secret, {
            expiresIn: 3600 // expires in 1 hour
          });
          // return the information including token as JSON
          res.json({success: true, username: user.username, token: token});
        } else {
          res.send({success: false, message: 'Usuario o clave incorrectos.'});
        }
      });
    }
  });
});

// validate user is authenticated and all methods before this require the token
api.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || getToken(req.headers);
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Authentication failed.'});
  }
});

// create a new user account (POST http://localhost:8080/api/signup)
api.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.json({success: false, message: 'Debe ingresar nombre, password y email.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, message: 'Ya existe un usuario con ese nombre.'});
      }
      res.json({success: true, message: 'Usuario creado.'});
    });
  }
});

// create a new user account (POST http://localhost:8080/api/signup)
api.post('/changepass', function(req, res) {
  if (!req.body.oldpassword || !req.body.newpassword) {
    res.json({success: false, message: 'Debe ingresar password viejo y password nuevo.'});
  } else {
    User.findOne({
      username: req.decoded.user.username
    }, function(err, user) {
        if (err) throw err;
        
        // check if password matches
        user.comparePassword(req.body.oldpassword, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            user.password = req.body.newpassword;
            user.save(function(err) {
                if (err) {
                  return res.json({success: false, message: 'Ya existe un usuario con ese nombre.'});
                }
                // return the information including token as JSON
                res.json({success: true, message: 'Password cambiada correctamente'});
              });
          } else {
            res.send({success: false, message: 'Usuario o clave incorrectos.'});
          }
        });   
    });
  }
});

api.use('/posts', apiposts);
 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return parted[0];
    }
  } else {
    return null;
  }
};

module.exports = api;