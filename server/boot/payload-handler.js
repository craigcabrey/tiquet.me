module.exports = function(app) {
  app.post('/api/payload', function(req, res) {
    console.log(JSON.stringify(req.body));
    res.json({ success: true });
  });
}
