angular.module('mainApp')
.controller('editCtrl', function($scope, $mdDialog,$state,$stateParams, $objectstore, $window, $rootScope, creditNoteService, $filter, $state, $location, UploaderService) {

// for (var i = $rootScope.invoiceArray.length - 1; i >= 0; i--) {
//   if($rootScope.invoiceArray[i].status == "Draft"){
//     $scope.showSave = true;
//   }
// };

//  if($state.current.name == 'copy') {
//         $scope.saveInvoiceB = true;
//      }else if($state.current.name == 'estimateInvoice'){
//       $scope.saveInvoiceB = true;
//      }else{
//         $scope.editInvoiceB = true;
//      }
$scope.edit = function(updatedForm) {
      var client = $objectstore.getClient("CNote12thdoor");

      $scope.TDCreditNote.total = $scope.total;
      $scope.TDCreditNote.finalamount = $scope.famount;

      client.onComplete(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('')
          .content('Credit Note Successfully Saved')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
        $rootScope.CNoteArray.splice(0,1);
        creditNoteService.setCNArr(updatedForm);
        $state.go('view', {'Cnno': updatedForm.creditNoteRefNo});
      });
      client.onError(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('Sorry')
          .content('Error Saving Credit Note')
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