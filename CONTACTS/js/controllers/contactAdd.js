rasm.controller('AppCtrlAddCustomer', function($scope, $state, $objectstore, $location, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $timeout, $mdToast) {

  $scope.contact = {};
  $scope.contact["baddress"] = {
    city: "",
    country: "",
    state: "",
    street: "",
    zip: ""
  };
  $scope.contact["saddress"] = {
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

    $scope.contact.saddress["s_street"] = $scope.contact.baddress["street"];
    $scope.contact.saddress["s_city"] = $scope.contact.baddress["city"];
    $scope.contact.saddress["s_country"] = $scope.contact.baddress["country"];
    $scope.contact.saddress["s_zip"] = $scope.contact.baddress["zip"];
    $scope.contact.saddress["s_state"] = $scope.contact.baddress["state"];
    if (cb == false) {
      $scope.contact.saddress["s_street"] = "";
      $scope.contact.saddress["s_city"] = "";
      $scope.contact.saddress["s_country"] = "";
      $scope.contact.saddress["s_zip"] = "";
      $scope.contact.saddress["s_state"] = "";

    }
  }

  /*_________________________submit_____________________________________________*/
  $scope.submit = function() {
      var client = $objectstore.getClient("contact12thdoor");
      client.onComplete(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .content('Customer Registed Successfully Saved.')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
      });
      client.onError(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .content('There was an error saving the data.')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
      });
      
      $scope.contact.favoritestar = false;
      $scope.contact.customerid = "-999";
      client.insert($scope.contact, {
        KeyProperty: "customerid"
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

    /*____________________________addressChange_________________________________________*/
  $scope.addressChange = function() {
      $scope.showShipping = !$scope.showShipping;
      $scope.showBilling = !$scope.showBilling;
    }
    /*_____________________________save_________________________________________________*/
  $scope.save = function() {
      $timeout(function() {
        $('#mySignup')
          .click();
      })
    }
    /*_________________________addCustomer_______________________________________________*/
  $scope.addCustomer = function() {
      $('#add').animate({
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        right: "0px",
        bottom: "0px",
        opacity: 0.25
      }, 400, function() {
        location.href = '#/Add_Contact';
      });
    }
    /*_______________________Customerview________________________________________________________*/
  $scope.Customerview = function() {
      location.href = '#/home';

    }
    /*______________________savebtn_______________________________________________________________*/
  $scope.savebtn = function() {
    $('#save').animate({
      width: "100%",
      height: "100%",
      borderRadius: "0px",
      right: "0px",
      bottom: "0px",
      opacity: 0.25
    }, 400, function() {
      $('#mySignup').click();
    });
  }
}) /*_______________________________END OF AppCtrlAddCustomer_____________________________________*/