'use strict';

/**
 * @ngdoc function
 * @name tiquetmeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tiquetmeApp
 */
angular.module('tiquetmeApp')
  .controller('HomeCtrl', ['$http', '$scope', '$location', '$modal', '$log', function($http, $scope, $location, $modal, $log) {
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
  $scope.createTicket = function() {
    var ticketPayload =
    {
      id: $scope.repositories[0].tickets.length - 1,
      state: "open",
      title: $scope.newTicketTitle,
      body: $scope.newTicketDescription,
      assignee: {
        email: $scope.newTicketAssignee
      }
    }
    $http.post('/newticket', ticketPayload).
      success(function(data) {
        $scope.repositories[0].tickets.push(data);
      }).
      error(function(data, status, headers, config) {
        console.log(status + headers + config);
      });
  }

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

    // Ticket detail modal
    $scope.items = ['item1', 'item2', 'item4'];
    $scope.open = function (ticket, size) {
      var modalInstance = $modal.open({
        templateUrl: 'ticketDetail.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {  // used to pass locals into the modal scope
          items: function () {
            return $scope.items;
          },
          ticketDetail: function() {
            return ticket;
          }
        }
      });

      // Dismissal
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
}]);

angular.module('tiquetmeApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, ticketDetail) {
  $scope.ticketDetail = ticketDetail;
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  // Save the selection
  $scope.ok = function () {
    $modalInstance.close($scope.selected.item, $scope.ticketDetail);
  };

  // Dismiss the modal
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
