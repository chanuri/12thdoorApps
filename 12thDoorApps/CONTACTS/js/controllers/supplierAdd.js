rasm.controller('AppCtrlAddSuppliers', function($scope, $state, $objectstore, $location, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $timeout, $mdToast, $rootScope) {
    $scope.supplier = {};

    $scope.supplier["baddress"] = {
      city: "",
      country: "",
      state: "",
      street: "",
      zip: ""
    };
    $scope.supplier["saddress"] = {
      s_city: "",
      s_country: "",
      s_state: "",
      s_street: "",
      s_zip: ""
    };
    $scope.showShipping = $scope.showShipping;
    $scope.showBilling = !$scope.showBilling;
    $scope.cb = false;
    /*__________________________onChange_______________________________________*/
    $scope.onChange = function(cb) {

        $scope.supplier.saddress["s_street"] = $scope.supplier.baddress["street"];
        $scope.supplier.saddress["s_city"] = $scope.supplier.baddress["city"];
        $scope.supplier.saddress["s_country"] = $scope.supplier.baddress["country"];
        $scope.supplier.saddress["s_zip"] = $scope.supplier.baddress["zip"];
        $scope.supplier.saddress["s_state"] = $scope.supplier.baddress["state"];
        if (cb == false) {
          $scope.supplier.saddress["s_street"] = "";
          $scope.supplier.saddress["s_city"] = "";
          $scope.supplier.saddress["s_country"] = "";
          $scope.supplier.saddress["s_zip"] = "";
          $scope.supplier.saddress["s_state"] = "";
        }
    }
      /*__________________________________submit__________________________________________________*/
    $scope.submit = function() {
        var client = $objectstore.getClient("supplier12thdoor");
        client.onComplete(function(data) {
          $mdDialog.show($mdDialog.alert()
            .parent(angular
              .element(document.body))
            .content(
              'Timesheet Added Successfully.')
            .ariaLabel(
              'Alert Dialog Demo')
            .ok('OK')
            .targetEvent(
              data));
        });
        client.onError(function(data) {
          $mdDialog.show($mdDialog.alert()
            .parent(angular
              .element(document.body))
            .content(
              'There was an error saving the data.'
            )
            .ariaLabel('Alert Dialog Demo')
            .ok(
              'OK')
            .targetEvent(data));
        });
        $scope.supplier.favoritestar = false;
        $scope.supplier.supplierid = "-999";
        client.insert($scope.supplier, {
          KeyProperty: "supplierid"
        })
      }

      // check whether object is empty or not 
      function isEmpty(obj) {
        for(var prop in obj) {
              if(obj.hasOwnProperty(prop))
                  return false;
          }
          return true;
      } 
    $scope.addressChange = function() {
      $scope.showShipping = !$scope.showShipping;
      $scope.showBilling = !$scope.showBilling;
    } 
    $scope.save = function() {
      $timeout(function(){
        $('#mySignup').click();
      })
    }
    $scope.supplierView = function(){
      $state.go('settings.supplier')
    }
  }) /*______________________________END OF AppCtrlAddSuppliers______________________________________*/