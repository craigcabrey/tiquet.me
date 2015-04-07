var loopback = require('loopback');

module.exports = function() {
  return function myMiddleware(req, res, next) {
    var app = req.app;
    if (!req.query.access_token) {
	return next();
    }
    app.models.AccessToken.findById(req.query.access_token, function(err, token) {
	if (!err) {
	    var userId = token.userId;
    	    app.models.User.findOne({where: {id: userId}, include: ['identities']}, function(err, user) {
            if (err) {
        	return next(err);
            }
      	    if (!user) {
        	return next(new Error('No user with this access token was found.'));
            }
            res.locals.currentUser = user;
            req.currentUser = user;
            var loopbackContext = loopback.getCurrentContext();
            if (loopbackContext) {
                loopbackContext.set('currentUser', user);
            }
            next();
            });
        }
    });
  }
}
