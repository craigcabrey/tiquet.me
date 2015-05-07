var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.user) {
    res.json(req.user);
  } else {
    next({status: 401})
  }
});

router.get('/logout', function(req, res, next) {
  req.logout();
  req.redirect('/');
});

module.exports = router;
