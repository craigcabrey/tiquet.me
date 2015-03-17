var GithubAPI = require('github');

module.exports = function(User) {
  "use strict";

  function useGithub(self, cb) {
    self.identities(function(err, identities) {
      if (err === null) {
        var github = new GithubAPI({version: "3.0.0"});
        github.authenticate({
          type: "oauth",
          token: identities[0].credentials.accessToken
        });
        cb(github);
      }
    });
  }

  User.prototype.repositories = function(cb) {
    useGithub(this, function(github) {
      github.repos.getAll({}, function(err, repos) {
        if (err === null) {
          var response = [];
          repos.forEach(function(repo) {
            response.push({
              id: repo.id,
              name: repo.full_name
            });
          });
          // Check orgs
          github.user.getOrgs({}, function(err, orgs) {
            if(err === null) {
              if (orgs.length > 0) {
                orgs.forEach(function(org) {
                  github.repos.getFromOrg({org: org.login, type: "member"}, function(err, orgRepos) {
                    if (err === null) {
                      console.log(orgRepos);
                      orgRepos.forEach(function(orgRepo) {
                        response.push({
                          id: orgRepo.id,
                          name: orgRepo.full_name
                        });
                      });
                      cb(null, response);
                    } else {
                      cb(err);
                    }
                  })
                })
              } else {
                // No orgs found
                cb(null, response);
              }
            } else {
              cb(err);
            }
          });
        } else {
          cb(err);
        }
      });
    });
  }

  User.remoteMethod(
    'repositories',
    {
      returns: [{arg: "repositories", type: "array"}],
      isStatic: false,
      http: {verb: "get"},
      description: "Get all respositories for the user"
    }
  )
};
