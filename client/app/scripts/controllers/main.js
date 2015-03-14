'use strict';

/**
 * @ngdoc function
 * @name tiquetmeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tiquetmeApp
 */
angular.module('tiquetmeApp')
  .controller('MainCtrl', ['$scope', '$location', 'User', function($scope, $location, User) {
    window.SCOPE = $scope;
    if(User.isAuthenticated()) {
      $location.path("/home");
    }
    $scope.isLoggedIn = function() {
      return User.isAuthenticated();
    };
  }]);
