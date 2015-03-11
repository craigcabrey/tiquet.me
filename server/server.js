var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
var morgan = require('morgan');

app.middleware('initial', morgan('short'));

// Authentication Configuration
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

var config = {};
try {
  config = require('./providers.json');
} catch (err) {
  console.trace(err);
  process.exit(1);
}

boot(app, __dirname);

app.use(loopback.compress());

passportConfigurator.init();

// We need flash messages to see passport errors
var flash = require('express-flash');
app.use(flash());

passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential
});

for (var s in config) {
  var c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
