var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;

var routes = require('./routes/index');
//var users = require('./routes/users');
var apiblog = require('./routes/apiblog');

var app = express();

// MongoDB connection
//MONGODB - BD
fs = require('fs');

var uri;
// uri = 'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase';
if (app.get('env') === 'development') {

  //'mongodb://user:pass@localhost:port/database';
  uri = 'mongodb://localhost:27017/blogdb';
  // uri = 'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase';
}

mongoose.connect(uri);

var db = mongoose.connection;
db.on('error', function (err) {
  throw new Error(err+' unable to connect to database at ' + mongoUri);
});

db.on('disconnected', function(ref){
  console.log("MONGO:disconnected");
});
db.on('close', function(ref){
  console.log("MONGO:close");
})

// pass passport for configuration
require('./config/passport')(passport);

//PASSPORT - PARA EL LOGUEO
app.use(passport.initialize());
//app.use(passport.session());

//passport.serializeUser(function(user, done) {
//  done(null, user);
//});

//passport.deserializeUser(function(user, done) {
//  done(null, user);
//});

//passport.use(new LocalStrategy(function(username, password, done) {
//  process.nextTick(function() {
//    UserDetails.findOne({
//      'username': username, 
//    }, function(err, user) {
//      if (err) {
//        return done(err);
//      }

//      if (!user) {
//        return done(null, false);
//      }

//      if (user.password != password) {
//        return done(null, false);
//      }

//      return done(null, user);
//    });
//  });
//}));

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/apiblog', apiblog);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
