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

  // TODO(anyone): replace dummy data with proper model.
    function Project(project_name, user_name, tickets) {
      this.project_name = project_name;
      this.user_name = user_name;
      this.tickets = tickets;
    }

    function Ticket(ticket_name, id, date_created, date_updated, status, due_date) {
      this.ticket_name = ticket_name;
      this.id = id;
      this.status = "Status";
      this.date_created = date_created;
      this.date_updated = date_updated;
      this.due_date = due_date;
    }

    var ticket1 = [new Ticket("Fix header", 1), new Ticket("Add test", 2)];
    var ticket2 = [new Ticket("Add style", 1), new Ticket("fix build", 2), new Ticket("Create something", 3), new Ticket("Potato", 4)];
    var ticket3 = [new Ticket("Remove footer", 1)];

    var project1 = new Project("project1", "krutz911", ticket1);
    var project2 = new Project("rubypydjango", "hawker101", ticket2);
    var project3 = new Project("KeelMaster", "realkuehl", ticket3);

    $scope.projects = [project1, project2, project3];
    $scope.tickets = [ticket1, ticket2, ticket3];
    $scope.team_name = "Generic Team Name";
  }]);
