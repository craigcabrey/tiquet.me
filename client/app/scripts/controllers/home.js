'use strict';

/**
 * @ngdoc function
 * @name tiquetmeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tiquetmeApp
 */
angular.module('tiquetmeApp')
  .controller('HomeCtrl', ['$http', '$scope', '$location', function($http, $scope, $location) {

    // TODO: waiting for auth
    // if (User.isAuthenticated()) {
    //   $scope.user = User.getCurrent(
    //     function (success) {
    //       // Get user data
    //       User.identities({id: success.id}, function(identities) {
    //         $scope.user.displayName = identities[0].profile.displayName;
    //       });
    //     }
    //   );
    // } else {
    //   $scope.user = null;
    //   $location.path("/");
    // }
    // $scope.isLoggedIn = function() {
    //   return User.isAuthenticated();
    // };

    // // Logout Handler
    // $scope.logout = function() {
    //   User.logout({access_token: localStorage.getItem('$LoopBack$accessTokenId')},
    //     function(success) {
    //       document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    //       $scope.user = null;
    //       $location.path("/");
    //     }
    //   );
    // };

  // Getting repositories
  $http.get("/repositories")
  .success(function(response) {
    $scope.repositories = response;
  }).then(function(){
    var count = 0;

    // Get number of repositories
    for (var key in $scope.repositories[0]) {
      if (key === "id") {
        count++;
      }
    }
    $scope.repositoryCount = count;
  });
}]);
