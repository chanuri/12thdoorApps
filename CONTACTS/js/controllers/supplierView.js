rasm.controller('AppCtrlGetSuppliers', function($scope, $rootScope, $state, $objectstore, $location, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $timeout, $mdToast) {

    $scope.suppliers = [];
    $scope.baddress = {};
    $scope.saddress = {};
    $scope.showShipping = $scope.showShipping;
    $scope.showBilling = !$scope.showBilling;

    $scope.loadAllsupplier = function() {
      var client = $objectstore.getClient("supplier12thdoor");
      client.onGetMany(function(data) {
        if (data) {
          $scope.suppliers = data;
        }
      });
      client.onError(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('This is embarracing')
          .content('There was an error retreving the data.')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
      });
      client.getByFiltering("*");
    };

    $scope.updateSupplier = function(updatedform, sid) {} 
    $scope.deleteSupplier = function(deleteform, ev) {} 
    
    $scope.addressChange = function() {
      $scope.showShipping = !$scope.showShipping;
      $scope.showBilling = !$scope.showBilling;
    }

  }) 