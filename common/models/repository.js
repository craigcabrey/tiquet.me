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
      instance.ownerId = currentUser.id;
      instance.ownerName = userName;
      next();
    });
  };

  repository.afterRemote('create', function(ctx, instance, next) {
    var currentUser = ctx.req.currentUser;
    var githubOauth = currentUser.identities()[0].credentials.accessToken;
    var github = new GithubAPI({version: "3.0.0"});
    github.authenticate({
      type: "oauth",
      token: githubOauth
    });

    //Create tags
    github.issues.getLabels({
      user: instance.ownerName,
      repo: instance.name
    }, function(err, res) {
      if (err !== null) {
        next(err);
      }
      res.forEach(function(label) {
        instance.tags.create({
          name: label.name,
          color: label.color
        }, function(err, tag) {
          if (err !== null) {
            next(err);
          }
        });
      });

      // Now add existing issues
      github.issues.repoIssues({
        user: instance.ownerName,
        repo: instance.name
      }, function(err, issues) {
        if (err !== null) {
          next(err);
        }
        issues.forEach(function(issue) {
          instance.tickets.create({
            title: issue.title,
            description: issue.body,
            number: issue.number,
            created: issue.created_at,
            updated: issue.updated_at
          }, function(err, ticket) {
            if (err !== null) {
              next(err);
            }

            //Associate issue with tags
            issue.labels.forEach(function(label) {
              instance.tags({
                where: {
                  name: label.name,
                  color: label.color
                }
              }, function(err, tag) {
                if (err !== null) {
                  next(err);
                }
                ticket.tags.add(tag[0], function(err) {
                  if (err !== null) {
                    next(err);
                  }
                });
              });
            });

            //Associate ticket reporter with user

            app.models.User.findOrCreate({
              where: {
                username: "github-login." + issue.user.id
              }
            }, {
              username: "github-login." + issue.user.id,
              email: issue.user.id + "@loopback.github-login.com",
              password: "ifyuaghf0874g0qa8dbfa"
            }, function(err, user) {
              ticket.updateAttribute("reporterId", user.id, function(err, wut) {});
              app.models.UserIdentity.findOrCreate({
                where: {
                  userId: user.id
                }
              }, {
                provider: "generated-profile",
                authScheme: "none",
                externalId: issue.user.id,
                profile: issue.user,
                credentials: {
                  accessToken: null
                },
                userId: user.id
              }, function(err, wut) {});
            });

            //Associate ticker assignee with user
            if (issue.assignee !== null) {
              app.models.User.findOrCreate({
                where: {
                  username: "github-login." + issue.assignee.id
                }
              }, {
                username: "github-login." + issue.assignee.id,
                email: issue.user.id + "@loopback.github-login.com",
                password: "ifyuaghf0874g0qa8dbfa"
              }, function (err, user) {
                ticket.updateAttribute("assigneeId", user.id, function (err, wut) {
                });
                app.models.UserIdentity.findOrCreate({
                  where: {
                    userId: user.id
                  }
                }, {
                  provider: "generated-profile",
                  authScheme: "none",
                  externalId: issue.assignee.id,
                  profile: issue.assignee,
                  credentials: {
                    accessToken: null
                  },
                  userId: user.id
                }, function(err, wut) {});
              });
            }
          });
        });
        next();
      });
    });
  });
};
