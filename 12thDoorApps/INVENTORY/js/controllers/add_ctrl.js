rasm.controller('AppCtrl', function($scope, $location, dialogsvc,$uploader, InvoiceService,UploaderService, $mdToast, $rootScope, $state, $objectstore, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $timeout) {
  //upload controllers 


  $scope.inventory = {};


  function getMaxNumber(className,callback){
      var clientMax = $objectstore.getClient("domainClassAttributes");
      clientMax.onGetMany(function(data){          
         callback(data[0].maxCount)
      });
      clientMax.onError(function(data){
        console.log("error loading max count")
      });
      clientMax.getByFiltering("select maxCount from domainClassAttributes where class = '"+className+"'")
    }


  if ($state.current.name == 'Add_Inventory') { 
      getMaxNumber("GRN12thdoor",function(maxCount){
        $scope.inventory.GRNno = parseInt(maxCount) +1
      });
  }else if ($state.current.name == 'Add_Inventory_Issue') {   
      getMaxNumber("GIN12thdoor",function(maxCount){
        $scope.inventory.GINno = parseInt(maxCount) +1
      })
  } 

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
  var proBalClient = $objectstore.getClient("productBalance");
  proBalClient.onGetMany(function(data){
    $scope.balanceArr = [];
    for(p=0; p<= data.length-1; p++){
        data[p].balance_code = parseInt(data[p].balance_code)
        $scope.balanceArr.push(data[p]);
    }
  });
  proBalClient.onError(function(data){
    console.log("error loading balance details ")
  });
  proBalClient.getByFiltering("*")
    //save functon start
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
            $uploader.upload("45.55.83.253", "inventoryimagesNew", $scope.imagearray[indexx]);
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
        var client;
        if ($state.current.name == 'Add_Inventory') {
            $scope.inventoryType = "GRN";
            $scope.inventory.inventoryClass = "Receipt";
            client = $objectstore.getClient("GRN12thdoor");
        } else if ($state.current.name == 'Add_Inventory_Issue') {
            $scope.inventoryType = "GIN";
            $scope.inventory.inventoryClass = "Issue";
            client = $objectstore.getClient("GIN12thdoor");
        } 

        client.onComplete(function(data) {
          $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Inventory Successfully Saved.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
          
          $scope.inventoryID = data.Data[0].ID;
          var samplebalance = [];
          var sampleFullArr = [];
          var fullArr = [];
          var checkStatus  = false;

          function addtoservice(obj){
            $scope.latestObj = {};
            $scope.latestObj  = angular.copy(obj);

            $scope.latestObj.startValue = obj.closeValue;
            $scope.latestObj.balance_code = "-999";

            if ($state.current.name == 'Add_Inventory' || $state.current.name == 'home.receipt') {
              $scope.latestObj.GRNvalue = $scope.testArray.val[g].Quantity;
              $scope.latestObj.closeValue = (parseInt($scope.latestObj.closeValue) + parseInt($scope.testArray.val[g].Quantity)).toString();
              $scope.latestObj.GINvalue = "0";  
              
            } else if ($state.current.name == 'Add_Inventory_Issue' || $state.current.name == 'home.issue') {
              $scope.latestObj.GINvalue = $scope.testArray.val[g].Quantity
              $scope.latestObj.closeValue = (parseInt($scope.latestObj.closeValue) - parseInt($scope.testArray.val[g].Quantity)).toString();
              $scope.latestObj.GRNvalue = "0";
            } 
              
            fullArr.push($scope.latestObj); 
            console.log(fullArr)
          }   

          for(g=0; g <= $scope.testArray.val.length-1; g++){

            if (fullArr.length > 0) {
              checkStatus = false;
              samplebalance = [];

              for(l=0; l <= fullArr.length-1; l++){
                if (fullArr[l].productId == $scope.testArray.val[g].proId) {
                  checkStatus = true;
                  samplebalance.push(fullArr[l])
                }         
              } 
              if (checkStatus) {
                var sortArr = [];
                sortArr = samplebalance.sort(function(a,b){
                  return b.balance_code - a.balance_code;
                })
                addtoservice(sortArr[0]);
              }           
            }

            if (!checkStatus || fullArr.length == 0) {
              sampleFullArr = [];
              for(f=0; f<= $scope.balanceArr.length-1; f++){
                if ($scope.testArray.val[g].proId == $scope.balanceArr[f].productId) {
                  sampleFullArr.push($scope.balanceArr[f])
                };
              }
              if (sampleFullArr.length > 0) {
                var sortArr = sampleFullArr.sort(function(a,b){
                  return b.balance_code - a.balance_code;
                })                            
              }
              addtoservice(sortArr[0]);  
            }            
          }          
          // var balanceArr = [];
          console.log(fullArr)

          var addToBalanceClass = $objectstore.getClient("productBalance");
          addToBalanceClass.onComplete(function(data){
            console.log("Successfully added to product balance class");
            AddToHistory($scope.inventoryID,function(){
              MoveToViewscreen();
            })    
          });
          addToBalanceClass.onError(function(data){
            console.log("error adding to product balance class");
          });
          addToBalanceClass.insertMultiple(fullArr,"balance_code");

        });
        client.onError(function(data) {
          $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('There was an error saving the data.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
        });
            

        $scope.inventory.date = $scope.CurrentDate;
        $scope.inventory.inventoryFavourite = false;
        $scope.inventory.favouriteStarNo = 1;
        $scope.inventory.deleteStatus = false;
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

    function AddToHistory(invenId,callback){
      $scope.historyArr = [];

      for(u=0; u<=$rootScope.testArray.val.length-1; u++){

        $scope.historyArr.push({
          history_code : "-999",
          type : $scope.inventoryType,
          inventoryNo : invenId,
          proId : $rootScope.testArray.val[u].proId,
          amount : $rootScope.testArray.val[u].Quantity,
          stockLevel : "Level 1",
          status : "Active"
        })
      }

      var historyClinet = $objectstore.getClient("inventoryHistory");
      historyClinet.onComplete(function(data){
        console.log("Successfully added to history class");
        callback();
      });
      historyClinet.onError(function(data){
        console.log("error adding to history class")
      });
      historyClinet.insertMultiple($scope.historyArr,"history_code");

    }

    function MoveToViewscreen(){
      var client = $objectstore.getClient("domainClassAttributes");
      client.onGetMany(function(data){
        var maxNo = (data[0].maxCount);
        $state.go('ViewScreen',{'inventoryID':maxNo, 'status' : $scope.classStatus});
      });
      client.onError(function(data){
        console.log("error loading max count")
      });
      if ($state.current.name == 'Add_Inventory') {        
          client.getByFiltering("select maxCount from domainClassAttributes where class='GRN12thdoor'");
          $scope.classStatus = "GRN";
      }else if ($state.current.name == 'Add_Inventory_Issue') {   
          client.getByFiltering("select maxCount from domainClassAttributes where class='GIN12thdoor'");
          $scope.classStatus = "GIN";
      } 
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
  }
  $scope.viewIssue = function() {
      $rootScope.inventoryType = "cards";
      $rootScope.selectedIndex = 1;
      $rootScope.showaddInventory = false;
      location.href = '#/home/issue';
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