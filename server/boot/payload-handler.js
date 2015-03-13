module.exports = function(app) {
  app.post('/payload', function(req, res) {
    console.log('received github payload');
    console.log(JSON.stringify(req.body));
    res.json({ success: true });
  });
}
