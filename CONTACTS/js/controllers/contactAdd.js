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

 $scope.Settings = {};

 var client = $objectstore.getClient("Settings12thdoor");
    client.onGetMany(function(data) {
        if (data) {
            $scope.Settings = data;
            for (var i = $scope.Settings.length - 1; i >= 0; i--) {
                if ($scope.Settings[i].profile) {
                   $scope.contact.adminmail = $scope.Settings[i].profile.adminEmail;
                    $scope.contact.BaseCurrency = $scope.Settings[i].profile.baseCurrency;
                }
              }
            }
        });
    client.onError(function(data) {});
    client.getByFiltering("*");

  $scope.emailExsist = false;

  $scope.validateEmail = function(obj){
    $scope.emailExsist = false;
    var emailClient = $objectstore.getClient("contact12thdoor");
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

  $scope.showShipping = $scope.showShipping;
  $scope.showBilling = !$scope.showBilling;
  $scope.cb = false;

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

  $scope.submit = function() {
      if (!$scope.emailExsist) {
          var client = $objectstore.getClient("contact12thdoor");
          client.onComplete(function(data) {
           $mdToast.show(
            $mdToast.simple()
              .textContent('Customer Successfully Registerd')
              .position('bottom right')
              .theme('success-toast')
              .hideDelay(2000)
          );
            location.href = '#/home'
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

          var result = document.getElementById("noteTxt").scrollHeight;
          var height = angular.element(result);

          $scope.contact.notes = [];
          var name  ="name" + ( $scope.contact.notes.length + 1 ).toString();
          $scope.contact.notes.push({
            note : $scope.cnotes,
            height : height[0] + 'px;',
            editable : false,
            idName : name
          });

          $scope.contact.favoritestar = false;
          $scope.contact.status = "Active";
          $scope.contact.customerid = "-999";
          $scope.contact.favouriteStarNo = 1;
          $scope.contact.deleteStatus = false;
          $scope.contact.todayDate = new Date();
          $scope.contact.favourite = false;
          
          client.insert($scope.contact, {
            KeyProperty: "customerid"
          })
      }
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

  // $scope.save = function() {
  //     $timeout(function() {
  //       $('#mySignup')
  //         .click();
  //     })
  // }
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

  $scope.Customerview = function() {
    location.href = '#/home'  
  }

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
})