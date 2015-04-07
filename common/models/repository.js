var loopback = require('loopback');
var app = require('../../server/server');

module.exports = function(repository) {
  repository.beforeValidate = function(next, instance) {
    var ctx = loopback.getCurrentContext();
    var currentUser = ctx.active.http.req.currentUser;
    var githubOauth = currentUser.identities()[0].credentials.accessToken;

    next();
  };
};
