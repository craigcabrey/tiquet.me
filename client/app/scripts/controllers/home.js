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
    if(User.isAuthenticated()) {
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
      User.logout({},
        function(success) {
          document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          $scope.user = null;
          $location.path("/");
        }
      );
    };

    // Dashboard js
    $('#side-menu').metisMenu();
    $(window).bind("load resize", function() {
        var topOffset = 50;
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
  }]);
