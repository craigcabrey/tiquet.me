'use strict';

/**
 * @ngdoc function
 * @name tiquetmeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tiquetmeApp 
 */
angular.module('tiquetmeApp')
  .controller('HomeCtrl', ['$scope', '$location', 'User', function($scope, $location, User) {
    if (User.isAuthenticated()) {
      $scope.user = User.getCurrent(



        function (success) {
          // Get user data
          User.identities({id: success.id}, function(identities) {
            $scope.user.displayName = identities[0].profile.displayName;
          });
        }
      );
    } else {
      $scope.user = null;
      $location.path("/");
    }
    $scope.isLoggedIn = function() {
      return User.isAuthenticated();
    };

    // Logout Handler
    $scope.logout = function() {
      User.logout({access_token: localStorage.getItem('$LoopBack$accessTokenId')},
        function(success) {
          document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          $scope.user = null;
          $location.path("/");
        }
      );
    };

  $scope.repos = [{},{}]
  $scope.testUser =  {
    name: 'owner/repo',
    description: 'blah blah blah',
    created: 'datetime text',
    updated: 'datetime text',
    tickets: [
      {
        title: 'Bug 1',
        description: 'this shit breaks tings',
        sha: 'q3495wqeruq0934823049823434',
        state: 'closed',
        tickets: []
      },
      {
        title: 'Feature 1',
        description: 'this',
        sha: 'q3495wqeruq0934823049823434',
        state: 'closed',
        tickets: []
      }
    ],
      tags: [
      {
        name: 'feature',
        color: '#666'
      },
      {
        name: 'bug',
        color: '#444444'
      },
    ]
  }
  }]);
