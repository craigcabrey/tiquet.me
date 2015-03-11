'use strict';

/**
 * @ngdoc function
 * @name tiquetmeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tiquetmeApp
 */
angular.module('tiquetmeApp')
  .controller('MainCtrl', ['$scope', 'User', function($scope, User) {
    window.SCOPE = $scope;
    $scope.isLoggedIn = function() {
      return User.isAuthenticated();
    };
  }]);
