var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mysql = require('mysql');
var session = require('express-session');
var GitHubStrategy = require('passport-github').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var GitHubApi = require("github");

var routes = require('./routes/index');
var users = require('./routes/users');
var repositories = require('./routes/repositories');

var test_users = require('./routes/test-users');
var test_repositories = require('./routes/test-repositories');

var config = require('./config');
if (process.env.NODE_ENV !== undefined) {
  config = require('./config.' + process.env.NODE_ENV);
}

var connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.username,
  password: config.database.password,
  database: config.database.database
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to database.');
    return;
  }

  console.log('Connected to database.');
});

var github = new GitHubApi({
  version: "3.0.0"
});

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(session({ secret: 'my_precious' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../client/app')));
app.use('/bower_components', express.static(path.join(__dirname, '../client/bower_components')));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  connection.query("SELECT * FROM user WHERE id = ?", [id], function(err, results) {
    if (!err && results.length === 1) {
      var profile = JSON.parse(results[0].profile);
      profile.token = results[0].githubToken;
      return done(null, profile);
    } else {
      return done(err, null);
    }
  });
});

// If development create local user to skip github auth
if (process.env.NODE_ENV !== "production") {
  passport.use(new LocalStrategy(
    function(username, token, done) {
      github.user.getFrom({user: username}, function(err, res) {
        var profile = res;
        delete profile.meta;
        connection.query("SELECT * FROM user WHERE id = ?", [profile.id], function (err, results) {
          if (results.length === 0) {
            // Create test user
            connection.query("INSERT INTO user (id, profile, githubToken) VALUES (?, ?, ?)", [profile.id, JSON.stringify(profile), token], function (err, results) {
              profile.token = token;
              return done(null, profile)
            })
          } else {
            profile.token = token;
            return done(null, profile);
          }
        });
      });
    }
  ));
  app.get('/auth/github', function(req, res, next) {
    req.body.username = config.local_github.username;
    req.body.password = config.local_github.token;
    passport.authenticate('local', function(err, user, info) {
      req.login(user, function(err) {
        res.redirect("/");
      });
    })(req, res, next);
  });
} else {
  passport.use(new GitHubStrategy({
      clientID: config.github_auth.client_id,
      clientSecret: config.github_auth.client_secret,
      callbackURL: "http://" + config.host + ":" + config.port + "/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      connection.query("SELECT * FROM user WHERE id = ?", [profile._json.id], function(err, results) {
        if (err === null) {
          if (results.length === 0) {
            // Create new user
            connection.query("INSERT INTO user (id, profile, githubToken) VALUES (?, ?, ?)", [profile.id, JSON.stringify(profile._json), accessToken], function(err, results) {
              profile.token = accessToken;
              return done(err, profile);
            });
          } else {
            // User exists, return that
            var existingProfile = results[0].profile;
            existingProfile.token = results[0].githubToken;
            return done(null, profile);
          }
        } else {
          return done(err, null);
        }
      });
    }
  ));
  app.get('/auth/github', passport.authenticate('github'));
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });
}


app.use(function(req, res, next) {
  req.db = connection;
  req.github = github;
  next();
});

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

