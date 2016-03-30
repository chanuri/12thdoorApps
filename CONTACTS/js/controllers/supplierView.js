rasm.controller('AppCtrlGetSuppliers', function($scope, $rootScope, $state, $objectstore, $location, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $timeout, $mdToast) {

    $scope.suppliers = [];
    $scope.baddress = {};
    $scope.saddress = {};
   $scope.showShipping = $scope.showShipping;
  $scope.showBilling = true;
  $scope.cb = false;

    // $scope.customerNotes = function(obj){
    //     $contactNotes.viewNotes(obj,"supplier12thdoor","supplierid")
    // }


    $scope.changeStatus = function(obj){
      
      function changeStatus(obj){
        if (obj.status == "Active") obj.status = "Inactive";
        else if (obj.status == "Inactive") obj.status = "Active";
      }

      changeStatus(obj);

      var statusClient = $objectstore.getClient("supplier12thdoor");
      statusClient.onComplete(function(data){
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .title('Success')
            .content('status changed successfully')
            .ariaLabel('Alert Dialog Demo')
            .ok('OK')
            .targetEvent(data)
        );
      });
      statusClient.onError(function(data){
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .title('Unsuccessful')
            .content('There was an error changing the status')
            .ariaLabel('Alert Dialog Demo')
            .ok('OK')
            .targetEvent(data)
          );
          changeStatus(obj);
      });
      statusClient.insert(obj,{ KeyProperty: "supplierid" })
    }

    $scope.changeTab = function(ind) {
        switch (ind) {
            
        case 0:
            $state.go('settings.contact')
            $rootScope.showsort = true;
            break;
        case 1:
            $state.go('settings.supplier');
            $rootScope.showsort = false;
            $rootScope.showaddProject = false;
            break;
        }
    }

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
          .title('Error')
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