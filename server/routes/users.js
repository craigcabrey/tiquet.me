var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  req.db.query(
    'SELECT * FROM users WHERE id = ' + req.user.id,
    function(err, result) {
      res.json(result);
    }
  );
});

module.exports = router;
