rasm.controller('AppCtrlGet', function($scope, $rootScope,$contactNotes, $state, $objectstore, $location, $mdDialog, $objectstore, $timeout, $mdToast) {
    $scope.contacts = [];
    $scope.baddress = {};
    $scope.saddress = {};
    $scope.showShipping = $scope.showShipping;
    $scope.showBilling = !$scope.showBilling;
    $scope.checkAbilityBtn = true;
    $scope.checkAbilityEditing = true;
    $scope.contactNameupArrow = false;
    $scope.contactNamedownArrow = false;
    $scope.sortEmailAsc = "Email";
    $scope.sortEmailDes = "-Email";
    $scope.contactEmailupArrow = false;
    $scope.contactEmaildownArrow = false; 


    $scope.customerNotes = function(obj){
        $contactNotes.viewNotes(obj,"contact12thdoor","customerid")
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

    $scope.changeStatus = function(obj){
      
      function changeStatus(obj){
        if (obj.status == "Active") obj.status = "Inactive";
        else if (obj.status == "Inactive") obj.status = "Active";
      }

      changeStatus(obj);

      var statusClient = $objectstore.getClient("contact12thdoor");
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
      statusClient.insert(obj,{ KeyProperty: "customerid" })
    }

    
    $scope.loadAllcontact = function() {
        var client = $objectstore.getClient("contact12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                $scope.contacts = data;
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
   
    $scope.addressChange = function() {
        $scope.showShipping = !$scope.showShipping;
        $scope.showBilling = !$scope.showBilling;
    }    

}); /*___________________________________End of ApCtrlGet____________________________________________*/