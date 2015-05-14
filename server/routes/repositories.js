var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!req.user) {
    return next({status: 401});
  }
  req.db.query({sql: "SELECT * FROM repositories LEFT JOIN tickets ON repositories.id = tickets.repositoryId AND repositories.ownerId = ?", nestTables: true}, [req.user.id], function (err, results) {
    if (err !== null) {
      return next(err);
    }
    if (results.length === 0) {
      res.json({});
    } else {
      var reposList = {};
      results.forEach(function(result) {
        if (reposList[result.repositories.id] === undefined) {
          reposList[result.repositories.id] = result.repositories;
        }
        if (reposList[result.repositories.id].tickets === undefined) {
          console.log("new tickets array");
          reposList[result.repositories.id].tickets = [];
        }
        reposList[result.repositories.id].tickets.push(result.tickets);
      });
      var newList = [];
      for (var key in reposList) {
        newList.push(reposList[key]);
      };
      res.json(newList);
    }
  })
});

router.post('/', function(req, res, next) {
  if(!req.user) {
    return next({status: 401});
  }
  var github = req.github;
  github.authenticate({
    type: "oauth",
    token: req.user.token
  });
  var repoName = req.body.name.split("/")[1];
  var userName = req.body.name.split("/")[0];
  github.repos.get({
    user: userName,
    repo: repoName
  }, function(err, repoRes) {
    if (err !== null) {
      return next(err);
    }
    // TODO: Check if repo exists already
    req.db.query("INSERT INTO repositories (id, name, description, created, updated, ownerName, ownerId) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [repoRes.id, repoRes.name, repoRes.description, repoRes.created_at, repoRes.updated_at, repoRes.owner.login, req.user.id], function (err, results) {
        if (err !== null) {
          return next(err);
        }
        // Add tags
        github.issues.getLabels({
          user: userName,
          repo: repoName
        }, function(err, labelRes) {
          if (err !== null) {
            return next(err);
          }
          delete labelRes.meta;
          var query = "INSERT INTO tags (name, color, repositoryId) VALUES ";
          var values = [];
          labelRes.forEach(function(label) {
            query = query + "(?, ?, ?),";
            values = values.concat([label.name, label.color, repoRes.id]);
          });
          query = query.slice(0, query.length - 1);
          req.db.query(query, values, function(err, results) {
            // Add tickets
            github.issues.repoIssues({
              user: userName,
              repo: repoName
            }, function(err, issueRes) {
              if (err !== null) {
                return next(err);
              }
              delete issueRes.meta;
              var issueQuery = "INSERT INTO tickets (title, description, number, created, updated, reporterId, repositoryId) VALUES ";
              var issueValues = [];
              issueRes.forEach(function(issue) {
                issueQuery = issueQuery + "(?, ?, ?, ?, ?, ?, ?),";
                issueValues = issueValues.concat([issue.title, issue.description, issue.number, issue.created_at, issue.updated_at, issue.user.id, repoRes.id]);
              })
              issueQuery = issueQuery.slice(0, issueQuery.length - 1);
              req.db.query(issueQuery, issueValues, function(err, results) {
                if (err !== null) {
                  return next(err);
                }
                res.json({success: true});
              })
            });
          })
        });
    })
  })
});

module.exports = router;
