var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbConf = require('./config/database')
var routes = require('./routes/index');
var posts = require('./routes/posts');
var api = require('./routes/api');

var app = express();

// MongoDB connection
//MONGODB - BD
fs = require('fs');

var uri;
// uri = 'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase';
if (app.get('env') === 'development') {

  //'mongodb://user:pass@localhost:port/database';
  uri = dbConf.database;
  //uri = 'mongodb://localhost:27017/blogdb';
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/posts', posts);
app.use('/api', api);

// MODELS
require('./models/post');
require('./models/tag');
require('./models/user');


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
    //res.json('error', {
    //  message: err.message,
    //  error: {}
    //});
    res.render('error', {title:'Uppps!',message: err.message, link: 'Volver al Inicio!'});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  //res.json('error', {
  //  message: err.message,
  //  error: {}
  //});
  res.render('error', {title:'Uppps!',message: 'Ha ocurrido un problema.', link: 'Volver al Inicio!'});
});


module.exports = app;
