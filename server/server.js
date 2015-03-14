var bodyParser = require('body-parser');
var boot = require('loopback-boot');
var logger = require('winston');
var loopback = require('loopback');
var loopbackPassport = require('loopback-component-passport');

// Loopback Application Singleton
var app = module.exports = loopback();

app.use(bodyParser.json());
app.use(loopback.compress());

boot(app, __dirname);

// Being Authentication Configuration
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

var config = {};
try {
  config = require('./providers.json');
} catch (err) {
  logger.error('No authentication providers found, aborting server boot up.');
  process.exit(1);
}

passportConfigurator.init();
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
// End Authentication Configuration

app.start = function() {
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Start the server if invoked directly.
if (require.main === module) {
  app.start();
}
