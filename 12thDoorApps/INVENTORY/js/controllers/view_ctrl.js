rasm.controller('viewctrl', function($scope, $location, dialogsvc,$DownloadPdf, InvoiceService, $mdToast, $rootScope, $state, $objectstore, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $timeout) {
 


  $scope.ConvertToPdf = function(obj){
    InventoryObject(obj,function(InArr){
      $DownloadPdf.GetPdf(obj,InArr,'download');
    })
  }
  $scope.printDetails = function(obj){
    InventoryObject(obj,function(InArr){
      $DownloadPdf.GetPdf(obj,InArr,'print');
    })
  }

  function InventoryObject(obj,callback){

    if (obj.AddressName == 'Address') {
      var FullAddress = obj.BillAddress.split(",");
      $scope.AddressOne = FullAddress[0];
      $scope.AddressTwo = FullAddress[1];
      $scope.AddressThree = FullAddress[2];
      $scope.AddressFour = FullAddress[3];
    }else if (obj.AddressName == 'Shipping Address') {
      var FullAddress = obj.ShipAddress.split(",");
      $scope.AddressOne = FullAddress[0];
      $scope.AddressTwo = FullAddress[1];
      $scope.AddressThree = FullAddress[2];
      $scope.AddressFour = FullAddress[3];
    };

    if (obj.inventoryClass == 'Issue') {
        $scope.InventoryObject = {
          NoteType : obj.inventoryClass.toUpperCase(),
          InventoryType: 'GINno',
          InventoryTypeValue : obj.GINno,
          AddressOne : $scope.AddressOne,
          AddressTwo : $scope.AddressTwo,
          AddressThree : $scope.AddressThree,
          AddressFour : $scope.AddressFour
        }
    }else if (obj.inventoryClass == 'Receipt') {
        $scope.InventoryObject = {
          NoteType : obj.inventoryClass.toUpperCase(),
          InventoryType: 'GRNno',
          InventoryTypeValue : obj.GRNno,
          AddressOne : $scope.AddressOne,
          AddressTwo : $scope.AddressTwo,
          AddressThree : $scope.AddressThree,
          AddressFour : $scope.AddressFour
        }
    };  

    callback($scope.InventoryObject);
  }
  
  $scope.OpenViewScreen = function(obj,type){
    $state.go('ViewScreen',{'inventoryID': obj.inventory_code, 'status': type});
  }

  $scope.testdialog = function() {
      $mdDialog.show({
        templateUrl: 'inventory_partials/inventory_dialog_partial.html',
        controller: testcon,
      })
    }
    // delete function in cards start
  $scope.deleteproductview = function(arr, index) {
      InvoiceService.removeArrayView(index, arr)
    }
    //delete function in cards stop 
    //TAB WATCHER START 
  $scope.changeTab = function(ind) {
    switch (ind) {
      case 0:
        $location.url("/home/receipt");
        $rootScope.showaddInventory = true;
        $scope.InventoryTypes = "GRNno";
        break;
      case 1:
        $location.url("/home/issue");
        $rootScope.showaddInventory = false;
        $scope.InventoryTypes = "GINno";
        break;
    }
     $scope.testarr = [{
              name: "Starred",
              id: "favouriteStarNo",
              Intype :  $scope.InventoryTypes,
              src: "img/ic_grade_48px.svg"
              , upstatus : false
              , downstatus : false,
              divider: true,
              close: false
            }, {
              name: "Date",
              id: "date",
              src: "img/ic_add_shopping_cart_48px.svg"
              , upstatus : false
              , downstatus : false,
              divider: false,
              close: true
            }, {
              name: $scope.InventoryTypes,
              id: $scope.InventoryTypes,
              src: "img/ic_add_shopping_cart_48px.svg"
              , upstatus : false
              , downstatus : false,
              divider: false,
              close: false
            }, {
              name: "Customer Names",
              id: "customerNames",
              src: "img/ic_add_shopping_cart_48px.svg"
              , upstatus : false
              , downstatus : false,
              divider: true,
              close: false
            }, {
              name: "Cancelled",
              id: "Status",
              Intype :  $scope.InventoryTypes, 
              src: "img/ic_add_shopping_cart_48px.svg",
              divider: false,
              close: false
            }]
  };
  //TAB WATCHER END 
  // sort function variable start
 
    $scope.self = this;
    $scope.self.searchText = "";
    $scope.prodSearch = '-date';
    $scope.indexno = 1;
    $scope.latest = '-date';

    $scope.DefaultCancel = function(item){
      $scope.testarr[1].close = true;
      $scope.testarr[$scope.indexno].upstatus = false;
      $scope.testarr[$scope.indexno].downstatus = false;
      item.close = false;
      $scope.prodSearch = '-date';
      $scope.indexno = 1;
      $scope.latest = '-date';
    }

    $scope.CheckFullArrayStatus = function(type,id,Intype){  
        $scope.BackUpArray = [];
        //remove all all object that status = paid and put them into backup array
        if(Intype == 'GRNno' ){
          for (var i = $scope.arReceipt.length - 1; i >= 0; i--) {
           if ($scope.arReceipt[i].Status === type) {
              $scope.BackUpArray.push($scope.arReceipt[i]);            
              $scope.arReceipt.splice(i,1);           
            };
          };
          $scope.arReceipt = MergeArr($scope.BackUpArray,$scope.arReceipt);

        }else if(Intype == 'GINno' ){
          for (var i = $scope.arissues.length - 1; i >= 0; i--) {
           if ($scope.arissues[i].Status === type) {
              $scope.BackUpArray.push($scope.arissues[i]);            
              $scope.arissues.splice(i,1);           
            };
          };
          $scope.arissues = MergeArr($scope.BackUpArray,$scope.arissues);
        }  
      }

      function MergeArr(backup,arr){
        //sort back up array by date in accending order       
        backup.sort(function(a,b){
         return new Date(b.date) - new Date(a.date);
        });
        
        arr.sort(function(a,b){
         return new Date(b.date) - new Date(a.date);
        });

        //prepend backup array to fullarray 
        for (var i = backup.length - 1; i >= 0; i--) {
         arr.unshift(backup[i]);        
        }; 
        return arr;
      }

      function SortStarFunc(Intype){
        $scope.BackUpArrayStar = [];
        if (Intype == 'GRNno') {
          for (var i = $scope.arReceipt.length - 1; i >= 0; i--) {
           if ($scope.arReceipt[i].favouriteStarNo === 0) {
              $scope.BackUpArrayStar.push($scope.arReceipt[i]);            
              $scope.arReceipt.splice(i,1);           
            };
          };
          $scope.arReceipt = MergeArr($scope.BackUpArrayStar,$scope.arReceipt);
          console.log($scope.arReceipt)

        }else if (Intype == 'GINno') {
          for (var i = $scope.arissues.length - 1; i >= 0; i--) {
           if ($scope.arissues[i].favouriteStarNo === 0) {
              $scope.BackUpArrayStar.push($scope.arissues[i]);            
              $scope.arissues.splice(i,1);           
            };
          };
          $scope.arissues = MergeArr($scope.BackUpArrayStar,$scope.arissues);
        };
      }

      $scope.starfunc = function(item,index) {

           if (item.id === "favouriteStarNo") {
              $scope.prodSearch = null;
              item.upstatus == false;
              item.downstatus = false;
              $scope.testarr[$scope.indexno].upstatus = false;
              $scope.testarr[$scope.indexno].downstatus = false;              
              $scope.testarr[$scope.indexno].close = false;               
              item.close = true;
              $scope.indexno  = index; 
              $scope.latest = '-date' 
              SortStarFunc(item.Intype);

           }else if(item.id === "Status"){
              $scope.latest = null;
              $scope.prodSearch = null; 
              item.upstatus == false;
              item.downstatus = false;
              $scope.testarr[$scope.indexno].downstatus = false;
              $scope.testarr[$scope.indexno].upstatus = false;
              $scope.testarr[$scope.indexno].close = false;               
              item.close = true;
              $scope.indexno  = index; 
              $scope.CheckFullArrayStatus(item.name,item.id,item.Intype);        
              
           }
           else{
            // scope.star = "";

                  if (item.upstatus == false && item.downstatus == false) {
                      item.upstatus = !item.upstatus;
                      item.close = true;
                      $scope.testarr[$scope.indexno].upstatus = false;
                      $scope.testarr[$scope.indexno].downstatus = false;
                      $scope.testarr[$scope.indexno].close = false;
                      $scope.indexno  = index;
                  }
                  else{
                   item.upstatus = !item.upstatus;
                   item.downstatus = !item.downstatus; 
                   item.close = true;            
                   }                
                                 
                  $scope.self.searchText = "";
                   
                  if (item.upstatus) {
                       $scope.prodSearch = item.id;
                       $scope.latest = '-date';
                  }
                  if (item.downstatus) {
                       $scope.prodSearch ='-'+item.id;
                       $scope.latest = '-date';
                  }
            }
          }
  //sort function variable end 
    // Favourite star function strat
  $scope.favouriteFunction = function(obj) {

      if (obj.inventoryClass == "Receipt") {
        obj.GRNno = obj.GRNno.toString();
      }else if (obj.inventoryClass == "Issue") {
        obj.GINno = obj.GINno.toString();
      };

      var client = $objectstore.getClient("inventory12thdoor");
      client.onComplete(function(data) {
        if (obj.inventoryFavourite) {
          var toast = $mdToast.simple().content('Add To Favourite').action('OK').highlightAction(false).position("bottom right");
          $mdToast.show(toast).then(function() {});
          //obj.favouriteStarNo = 0;
        } else if (!(obj.inventoryFavourite)) {
          var toast = $mdToast.simple().content('Remove from Favourite').action('OK').highlightAction(false).position("bottom right");
          $mdToast.show(toast).then(function() {});
          //obj.favouriteStarNo = 1;
        };
      });
      client.onError(function(data) {
        var toast = $mdToast.simple().content('Error Occure while Adding to Favourite').action('OK').highlightAction(false).position("bottom right");
        $mdToast.show(toast).then(function() {
          //whatever
        });
      });
      if (obj.favouriteStarNo == 1 ) {
          obj.favouriteStarNo = 0;
      }
      else if (obj.favouriteStarNo == 0){
          obj.favouriteStarNo = 1;
      };
      obj.inventoryFavourite = !obj.inventoryFavourite;
      client.insert(obj, {
        KeyProperty: "inventory_code"
      });
    }
    // Favourite star function end
  $scope.addressfuncissueold = function(val) {
    if (val.AddressName == "Shipping Address") {
      val.AddressName = "Address";
    } else if (val.AddressName == "Address") {
      val.AddressName = "Shipping Address";
    };
  }
  $scope.addressfuncreceiptold = function(val) {
    if (val.AddressName == "Shipping Address") {
      val.AddressName = "Address";
    } else if (val.AddressName == "Address") {
      val.AddressName = "Shipping Address";
    };
  }
  $scope.checkAbility = true;
  $scope.checkAbilityview = true;
  $scope.onChangeinventory = function(cbState) {
    if (cbState == true) {
      $scope.checkAbility = false;
      $scope.checkAbilityview = true;
    } else {
      $scope.checkAbility = true;
      $scope.checkAbilityview = false;
    }
  };
  //edit button ng-change function start
  $scope.onChangereceipt = function(cbState) {
    if (cbState == true) {
      $scope.checkAbilityview = false;
      $scope.checkAbility = true;
    } else {
      $scope.checkAbilityview = true;
      $scope.checkAbility = false;
    }
  };
  //edit button ng-button function end
  //start of fab button functions
  $scope.demo = {
    topDirections: ['left', 'up'],
    bottomDirections: ['down', 'right'],
    isOpen: false,
    availableModes: ['md-fling', 'md-scale'],
    selectedMode: 'md-fling',
    availableDirections: ['up', 'down', 'left', 'right'],
    selectedDirection: 'up'
  };
  $scope.addInventory = function() {
    $rootScope.inventoryType = "insert";
    $('#addinventory').animate({
      width: "100%",
      height: "100%",
      borderRadius: "0px",
      right: "0px",
      bottom: "0px",
      opacity: 0.25
    }, 400, function() {
      location.href = '#/Add_Inventory';
    });
  }
  $scope.addInventoryIssue = function() {
      $rootScope.inventoryType = "insert";
      $('#addinventory').animate({
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        right: "0px",
        bottom: "0px",
        opacity: 0.25
      }, 400, function() {
        location.href = '#/Add_Inventory_Issue';
      });
    }
    //end of fab button functions
  $scope.Inventories = [];
  $scope.loadArray = {
    val: []
  };
  //load all Inventory function start
  $scope.loadAllInventory = function() {
    // responsiveVoice.speak('wellcome to inventory');
    $scope.Inventories = [];
    $scope.arissues = [];
    $scope.arReceipt = [];

    var issueClient = $objectstore.getClient("GIN12thdoor");
    issueClient.onGetMany(function(issueData){
      $scope.arissues = issueData
      for(k=0; k <= $scope.arissues.length-1; k++){
          $scope.arissues[k].GINno = parseInt($scope.arissues[k].GINno);
      }

      var reeiptClient = $objectstore.getClient("GRN12thdoor");
      reeiptClient.onGetMany(function(receiptData){
        $scope.arReceipt = receiptData;
        for(k=0; k <= $scope.arReceipt.length-1; k++){
          $scope.arReceipt[k].GRNno = parseInt($scope.arReceipt[k].GRNno);
        }
      });
      reeiptClient.onError(function(data){
          $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('This is embarracing').content('There was an error retreving the data.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
      });
      reeiptClient.getByFiltering("*");

    });
    issueClient.onError(function(data){
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('This is embarracing').content('There was an error retreving the data.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
    });
    issueClient.getByFiltering("*");

    if ($state.current.name == 'home.receipt') {
      $rootScope.showaddInventory = true;
      $scope.selectedIndex = 0;
      $scope.InventoryTypes = "GRNno";
    } else if ($state.current.name == 'home.issue') {
      $rootScope.showaddInventory = false;
      $scope.selectedIndex = 1;
      $scope.InventoryTypes = "GINno";
    };

    $scope.testarr = [{
              name: "Starred",
              id: "favouriteStarNo",
              Intype :  $scope.InventoryTypes,
              src: "img/ic_grade_48px.svg"
              , upstatus : false
              , downstatus : false,
              divider: true,
              close: false
            }, {
              name: "Date",
              id: "date",
              src: "img/ic_add_shopping_cart_48px.svg"
              , upstatus : false
              , downstatus : false,
              divider: false,
              close: true
            }, {
              name: $scope.InventoryTypes,
              id: $scope.InventoryTypes,
              src: "img/ic_add_shopping_cart_48px.svg"
              , upstatus : false
              , downstatus : false,
              divider: false,
              close: false
            }, {
              name: "Customer Names",
              id: "customerNames",
              src: "img/ic_add_shopping_cart_48px.svg"
              , upstatus : false
              , downstatus : false,
              divider: true,
              close: false
            }, {
              name: "Cancelled",
              id: "Status",
              Intype :  $scope.InventoryTypes,
              src: "img/ic_add_shopping_cart_48px.svg",
              divider: false,
              close: false
            }]

  };
  //load all Inventory function end
  $scope.addproductview = function(arr) {
      $rootScope.tableContent = [];
      $rootScope.tableContent = arr;
      dialogsvc.addmethod();
    }
    // table ng click start
  $rootScope.tableContent = [];
  $scope.tableclick = function(arr, obj) {
      $rootScope.tableContent = [];
      $rootScope.tableContent = arr;
      dialogsvc.method(obj)
    }
    //table ng click end
});