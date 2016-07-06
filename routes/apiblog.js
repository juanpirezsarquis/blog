var express = require('express');
var User = require('../models/user');
//var jwt = require('jwt-simple');
var jwt = require('jsonwebtoken');
var config = require('../config/database');
var passport  = require('passport');
var apiblog = express.Router();
 
// create a new user account (POST http://localhost:8080/apiblog/signup)
apiblog.post('/signup', function(req, res) {
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

// route to authenticate a user (POST http://localhost:8080/apiblog/authenticate)
apiblog.post('/authenticate', function(req, res) {
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
          var token = jwt.sign(user, config.secret, {
            expiresInMinutes: 480 // expires in 8 hours
          });
          //var token = jwt.encode(user, config.secret);
          // res.json({success: true, message: '', token: 'JWT ' + token});
          // return the information including token as JSON
          res.json({success: true, token: token});
        } else {
          res.send({success: false, message: 'Usuario o clave incorrectos.'});
        }
      });
    }
  });
});

//apiblog.use(passport.authenticate('jwt', { session: false}), function(req, res, next) {
apiblog.use(function(req, res, next) {
  console.log('Autenticando');
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
    /*var decoded = jwt.decode(token, config.secret);
    User.findOne({
      username: decoded.username
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed.'});
        } else {
          //res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;    
          next();
        }
    });*/
  } else {
    return res.status(403).send({success: false, msg: 'Authentication failed.'});
  }
});

apiblog.get('/memberinfo', function(req, res) {
  console.log(req.decoded);
  res.json({success: true, msg: 'Welcome in the member area ' + req.decoded.username + '!'});
});

/*apiblog.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      username: decoded.username
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.username + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Authentication failed.'});
  }
});*/

// route middleware to verify a token
/*apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
}); */

 
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