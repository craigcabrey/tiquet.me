var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mysql = require('mysql');
var GitHubStrategy = require('passport-github').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var repositories = require('./routes/repositories');

var test_users = require('./routes/test-users');
var test_repositories = require('./routes/test-repositories');

var connection = mysql.createConnection({
  host: process.env.MYSQL_DB_HOST || 'localhost',
  user: process.env.MYSQL_DB_USERNAME || 'root',
  password: process.env.MYSQL_DB_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'tiquetme'
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to database.');
    return;
  }

  console.log('Connected to database.');
});

var app = express();

passport.use(new GitHubStrategy({
    clientID: 'GITHUB_CLIENT_ID',
    clientSecret: 'GITHUB_CLIENT_SECRET',
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

app.use(function(req, res, next) {
  req.db = connection;
  next();
});

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/app')));
app.use('/bower_components', express.static(path.join(__dirname, '../client/bower_components')));

if (app.get('env') === 'development') {
  app.use('/', routes);
  app.use('/users', users);
  app.use('/repositories', repositories);

  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
} else if (app.get('env') === 'frontend-dev') {
  app.use('/', routes);
  app.use('/users', test_users);
  app.use('/repositories', test_repositories);

  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
} else {
  app.use('/', routes);
  app.use('/users', users);
  app.use('/repositories', repositories);

  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
