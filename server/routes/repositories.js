var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  if(!req.user) {
    return next({status: 401});
  }
  req.db.query("SELECT * FROM repositories WHERE ownerId = ?", [req.user.id], function (err, results) {
    if (err !== null) {
      return next(err);
    }
    if (results.length === 0) {
      res.json({});
    } else {
      res.json(results);
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
      next(err);
    }
    // TODO: Check if repo exists already
    req.db.query("INSERT INTO repositories (id, name, description, created, updated, ownerName, ownerId) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [repoRes.id, repoRes.name, repoRes.description, repoRes.created_at, repoRes.updated_at, repoRes.owner.login, req.user.id], function (err, results) {
        if (err !== null) {
          return next(err);
        }
        res.json({success: true})
    })
  })
});

module.exports = router;
