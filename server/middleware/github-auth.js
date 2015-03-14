module.exports = function() {
  return function githubAuth(req, res, next) {
    var app = req.app;
    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback', 
      passport.authenticate('github', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      }
   );
  }
}
