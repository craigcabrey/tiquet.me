var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var repositories = require('./routes/repositories');
var tickets = require('./routes/tickets');
var comments = require('./routes/comments');

var connection = mysql.createConnection({
  host: process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
  user: process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root',
  password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD || '',
  database: process.env.OPENSHIFT_MYSQL_DATABASE || 'togglio'
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to database.');
    return;
  }

  console.log('Connected to database.');
});

var app = express();

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/app')));
app.use('/bower_components', express.static(path.join(__dirname, '../client/bower_components')));

app.use('/', routes);
app.use('/users', users);
app.use('/repositories', repositories);
app.use('/tickets', tickets);
app.use('/comments', comments);

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
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
