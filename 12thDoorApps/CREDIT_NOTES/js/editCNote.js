angular.module('mainApp')
.controller('editCtrl', function($scope, $mdDialog,$state,$stateParams, $objectstore, $window, $rootScope, creditNoteService, $filter, $state, $location, UploaderService) {

$scope.edit = function(updatedForm) {
      var client = $objectstore.getClient("CNote12thdoor");

      $scope.TDCreditNote.table = $rootScope.testArray.val;
      $scope.TDCreditNote.total = $scope.total;
      $scope.TDCreditNote.finalamount = $scope.famount;

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
        KeyProperty: "creditNoteNo"
      });
    }

	})