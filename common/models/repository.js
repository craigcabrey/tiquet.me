var loopback = require('loopback');
var GithubAPI = require('github');
var app = require('../../server/server');

module.exports = function(repository) {
  repository.beforeSave = function(next, instance) {
    var ctx = loopback.getCurrentContext();
    var currentUser = ctx.active.http.req.currentUser;
    var githubOauth = currentUser.identities()[0].credentials.accessToken;
    var github = new GithubAPI({version: "3.0.0"});
    github.authenticate({
      type: "oauth",
      token: githubOauth
    });

    //Now that github auth is setup, pull info on the repository
    var repoName = instance.name.split("/")[1];
    var userName = instance.name.split("/")[0];
    github.repos.get({
      user: userName,
      repo: repoName
    }, function(err, res) {
      if (err !== null) {
        next(err);
      }
      instance.name = repoName;
      instance.id = res.id;
      instance.description = res.description;
      instance.created = res.created_at;
      instance.updated = res.updated_at;
      instance.ownerId = res.owner.id;
      next();
    });
  };
};
