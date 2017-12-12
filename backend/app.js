var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//const formidable = require('express-formidable');
var mongo = require('mongodb').MongoClient;
sDatabasePath = 'mongodb://localhost:27017/events';

mongo.connect(sDatabasePath, (err, database)=>{
    if (err){
        console.log('ERROR 003 -> Cannot connect to database');
        return false;
    }
    console.log('OK 004 -> Connected to database');
    //global.db = db;
    global.mongodb=database.db('events'); 
});

var events = require('./routes/events');
var users = require('./routes/users');
var staff = require('./routes/staff');
var partners = require ('./routes/partners');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(formidable());

app.use('/events', events);
app.use('/users', users);
app.use('/staff', staff);
app.use('/partners', partners);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
