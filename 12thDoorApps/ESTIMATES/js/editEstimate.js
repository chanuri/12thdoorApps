angular.module('mainApp')
.controller('editCtrl', function($scope, $mdDialog, $objectstore, $window, $rootScope,$stateParams, $filter, $state, $location) {

	$scope.edit = function(updatedForm) {
      var client = $objectstore.getClient("twethdoorEstimate");

      $scope.TDEstimate.EstimateProducts = $rootScope.testArray.val;
      $scope.TDEstimate.total = $scope.total;
      $scope.TDEstimate.finalamount = $scope.famount;
      $scope.TDEstimate.status = "N";

      client.onComplete(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('')
          .content('invoice Successfully Saved')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
      });
      client.onError(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('Sorry')
          .content('Error Saving invoice')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
      });
      client.insert(updatedForm, {
        KeyProperty: "estimateNo"
      });
    }
    
})