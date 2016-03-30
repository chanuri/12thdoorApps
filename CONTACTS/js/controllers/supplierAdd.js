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
         $mdToast.show(
            $mdToast.simple()
              .textContent('Supplier Successfully Registerd')
              .position('bottom right')
              .theme('success-toast')
              .hideDelay(2000)
          );
         $state.go('settings.supplier')
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
        var result = document.getElementById("noteTxt").scrollHeight;
        var height = angular.element(result);
        $scope.supplier.notes = [];
        var name  ="name" + ( $scope.supplier.notes.length + 1 ).toString();
        $scope.supplier.notes.push({
          note : $scope.cnotes,
          height : height[0] + 'px;',
          editable : false,
          idName : name
        });
        $scope.supplier.favoritestar = false;
        $scope.supplier.supplierid = "-999";
        $scope.supplier.status = "Active";
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

     $scope.emailExsist = false;

    $scope.validateSupplierEmail = function(obj){
    $scope.emailExsist = false;
    var emailClient = $objectstore.getClient("supplier12thdoor");
    emailClient.onGetMany(function(data){
      if (data.length > 0) {
        console.log("exsist")
        $scope.emailExsist = true;
      }
    });
    emailClient.onError(function(data){

    });
    emailClient.getByFiltering("select Email from contact12thdoor where Email = '"+obj.Email+"'")
  }
  }) /*______________________________END OF AppCtrlAddSuppliers______________________________________*/