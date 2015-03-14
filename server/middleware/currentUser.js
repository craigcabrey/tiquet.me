module.exports = function() {
  return function myMiddleware(req, res, next) {
    var app = req.app;
    if (!req.accessToken) {
      return next();
    }
    app.models.User.findById(req.accessToken.userId, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error('No user with this access token was found.'));
      }
      res.locals.currentUser = user;
      req.currentUser = user;
      next();
    });
  }
}
