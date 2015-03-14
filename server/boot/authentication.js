module.exports = function enableAuthentication(server) {
  // enable authentication
  if(process.env.NODE_ENV !=='development') {
    server.enableAuth();
  }
};
