"use strict";

var GithubAPI = require('node-github');

/**
 * Adds a user to the app for testing
 * It grabs the user data from githubDevData.json
 * NOTE: This needs to be a real github user and OAuth token
 * Format:
 * {
 *    "username": "test",
 *    "token": "98d67f87s6df87t8sw7tf8wte87sdgv87s"
 * }
 */

module.exports = function (app) {
  if (process.env.NODE_ENV === 'development') {
    try {
      var devData = require('./githubDevData.json');
    }
    catch (e) {
      console.log("githubDevData.json not found, skipping user add");
      return;
    }

    // Load github development credentials
    console.log('Adding user from githubDevData.json');
    var github = new GithubAPI({version: "3.0.0"});
    github.authenticate({
      type: "oauth",
      token: devData.token
    });

    // Create test user
    github.user.get({}, function(err, res) {
      app.models.Useridentity.login("github-login", "oAuth 2.0", res, {accessToken: devData.token}, {autoLogin: true}, function(err, user, identity, token) {
        if (err === null) {
          console.log("Access Token: " + token.id);
        }
      });
    });
  }
};
