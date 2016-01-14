rasm.controller('AppCtrl', function($scope, $location, dialogsvc,$uploader, InvoiceService,UploaderService, $mdToast, $rootScope, $state, $objectstore, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $timeout) {
  //upload controllers start

  $scope.CurrentDate = moment().format("LL");
  console.log($scope.CurrentDate)

  $scope.imageuploader = function() {
    $mdDialog.show({
      templateUrl: 'inventory_partials/image_dialog_partial.html',
      controller: EyeController
    })
  }
  function EyeController($scope, $mdDialog, $rootScope, $state) {
    $scope.AddCus = function() {
      $mdDialog.hide();
    }
    $scope.closeDialog = function() {
      $mdDialog.hide();
    }
  }
  //upload controllers end 
  $scope.sortableOptions = {
    containment: '#sortable-container'
  };
  //delete product start
  $scope.deleteproduct = function(arr, index) {
      arr.splice(index, 1);
    }
    //delete product end 
    //chips start 
  $scope.DemoCtrl = function($timeout, $q) {
      var self = this;
      self.readonly = false;
      // Lists of tags names and Vegetable objects
      self.fruitNames = [];
      self.inventory.roFruitNames = angular.copy(self.fruitNames);
      self.tags = [];
      self.newVeg = function(chip) {
        return {
          name: chip,
          type: 'unknown'
        };
      };
    }
    //chips end
    // address input icon functions start
  $scope.addresshow = true;
  $scope.shipaddresshow = false;
  $rootScope.inventoryType = "insert";
  $scope.Address = "Address";
  $scope.AddressCount = false;
  
  $scope.addressfuncold = function() {
      if ($scope.Address == "Address") {
        $scope.Address = "Shipping Address";
        $scope.AddressCount = true;
        $scope.addresshow = false;
        $scope.shipaddresshow = true;
      } else if ($scope.Address == "Shipping Address") {
        $scope.Address = "Address";
        $scope.AddressCount = false;
        $scope.addresshow = true;
        $scope.shipaddresshow = false;
      };
    }
    //save functon start
  $scope.inventory = {};
  $scope.submit = function() {
      console.log(self.selectedItem)
      if ($rootScope.testArray.val.length == 0) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title("please enter atleast one product item")
          .ok("OK")
          .ariaLabel("Alert Demo live")
          .targetEvent()
          )
      }else{

        $scope.imagearray = [];
        $scope.imagearray = UploaderService.loadArray();
        if ($scope.imagearray.length > 0) {
          for (indexx = 0; indexx < $scope.imagearray.length; indexx++) {
            $uploader.upload("45.55.83.253", "expenseimagesNew", $scope.imagearray[indexx]);
            $uploader.onSuccess(function (e, data) {});
            $uploader.onError(function (e, data) {
              var toast = $mdToast.simple()
                .content('There was an error, please upload!')
                .action('OK')
                .highlightAction(false)
                .position("bottom right");
              $mdToast.show(toast).then(function () {
                //whatever
              });
            });
          }
        };

        var client = $objectstore.getClient("inventory12thdoor");
        client.onComplete(function(data) {
          $mdDialog.show($mdDialog.alert().parent(angular.element(document.body))
            .content('Inventory Successfully Saved.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
          
          MoveToViewscreen();
        });
        client.onError(function(data) {
          $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('There was an error saving the data.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
        });
        if ($state.current.name == 'Add_Inventory') {
          $scope.inventory.inventoryClass = "Receipt";
        } else if ($state.current.name == 'Add_Inventory_Issue') {
          $scope.inventory.inventoryClass = "Issue";
        }      

        $scope.inventory.date = $scope.CurrentDate;
        $scope.inventory.inventoryFavourite = false;
        $scope.inventory.favouriteStarNo = 1;
        $scope.inventory.customerNames = self.selectedItem.display;
        $scope.inventory.AddressName = $scope.Address;
        $scope.inventory.BillAddress = self.selectedItem.BillAddress;
        $scope.inventory.ShipAddress = self.selectedItem.ShipAddress;
        $scope.inventory.inventory_code = "-999";
        $scope.inventory.inventory_upload = {val:[]};
        $scope.inventory.inventory_upload.val = UploaderService.loadBasicArray();
        $scope.inventory.itemdetails = $rootScope.testArray.val;
        client.insert($scope.inventory, {
          KeyProperty: "inventory_code"
        });
      }       
    }

    function MoveToViewscreen(){
      var client = $objectstore.getClient("inventory12thdoor");
      client.onGetMany(function(data){
        // console.log(data[0].maxCount)
        var maxNo = (data[0].maxCount);
        $state.go('ViewScreen',{'inventoryID':maxNo});

      });
      client.onError(function(data){
        console.log("error loading max count")
      });
      client.getByFiltering("select maxCount from domainClassAttributes where class='inventory12thdoor'")
    }
    //save function end   
    //fab button functions
  $scope.demo = {
    topDirections: ['left', 'up'],
    bottomDirections: ['down', 'right'],
    isOpen: false,
    availableModes: ['md-fling', 'md-scale'],
    selectedMode: 'md-fling',
    availableDirections: ['up', 'down', 'left', 'right'],
    selectedDirection: 'up'
  };
  $scope.types = "Receipt";
  $scope.save = function() {
    $('#mySignup').click();
  }
  $scope.viewInventory = function() {
    $rootScope.inventoryType = "cards";
    $rootScope.selectedIndex = 0;
    $rootScope.showaddInventory = true;
    location.href = '#/home/receipt';
    // $('#viewinventory').animate({
    //     width: "100%",
    //     height: "100%",
    //     borderRadius: "0px",
    //     right: "0px",
    //     bottom: "0px",
    //     opacity: 0.25
    // }, 400, function() {
    //     location.href = '#/home/receipt';
    // });
  }
  $scope.viewIssue = function() {
      $rootScope.inventoryType = "cards";
      $rootScope.selectedIndex = 1;
      $rootScope.showaddInventory = false;
      location.href = '#/home/issue';
      // $('#viewissues').animate({
      //     width: "100%",
      //     height: "100%",
      //     borderRadius: "0px",
      //     right: "0px",
      //     bottom: "0px",
      //     opacity: 0.25
      // }, 400, function() {
      //     location.href = '#/home/issue';
      // });
    }
    //end of fab button functions
    // table add button function start
  $scope.addproduct = function() {
    $rootScope.plusdialog = false;
    dialogsvc.addmethod();
  }
  $scope.addproductreceipt = function() {
      $rootScope.plusdialog = true;
      dialogsvc.addmethod();
    }
    // table add button function end
    // table ng click start
  $rootScope.tableContent = [];
  $scope.tableclick = function(arr, obj) {
    console.log(arr)
    $rootScope.tableContent = [];
    $rootScope.tableContent = arr;
    dialogsvc.method(obj);
  }
  $scope.tableclickadd = function(obj) {
      dialogsvc.method(obj);
    }
    //table ng click end
  var self = this;
  self.tenants = loadAll();
  self.selectedItem = null;
  self.searchText = null;
  self.querySearch = querySearch;
  self.querySearchView = querySearchView;

  function querySearch(query) {
    $scope.enter = function(keyEvent) {
        if (keyEvent.which === 13) {
          if (self.selectedItem === null) {
            self.selectedItem = query;
            console.log(results);
          } else {
            console.log(self.selectedItem);
          }
        }
      }
      //Custom Filter
    var results = [];
    for (i = 0, len = $scope.customerNames.length; i < len; ++i) {
      if ($scope.customerNames[i].display.indexOf(query) != -1) {
        results.push($scope.customerNames[i]);
      }
    }
    return results;
  }

  function querySearchView(query) {
    $scope.enter = function(keyEvent) {
      if (keyEvent.which === 13) {
        if (self.selectedItem === null) {
          self.selectedItem = query;
          console.log(results);
        } else {
          console.log(self.selectedItem);
        }
      }
    }
  }
  $scope.customerNames = [];

  function loadAll() {
    var client = $objectstore.getClient("contact");
    client.onGetMany(function(data) {
      if (data) {
        for (i = 0, len = data.length; i < len; ++i) {
          $scope.customerNames.push({
            display: data[i].CustomerFname + ' ' + data[i].CustomerLname,
            BillAddress: data[i].baddress.street + ', ' + data[i].baddress.city + ', ' + data[i].baddress.zip + ', ' + data[i].baddress.country,
            ShipAddress: data[i].saddress.s_city + ', ' + data[i].saddress.s_country + ', ' + data[i].saddress.s_zip + ', ' + data[i].saddress.s_country
          });
        }
        console.log($scope.customerNames)
      }
    });
    client.onError(function(data) {
      $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('Sorry').content('There is no products available').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
    });
    client.getByFiltering("*");
  }
})