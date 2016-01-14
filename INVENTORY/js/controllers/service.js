rasm.service('dialogsvc', function($mdDialog) {
  var dialogsvc = {};
  dialogsvc.method = function(obj) {
    $mdDialog.show({
      templateUrl: 'inventory_partials/inventory_dialog_partial.html',
      controller: EyeController,
      locals: {
        item: obj
      }
    })
  }
  dialogsvc.addmethod = function() {
    $mdDialog.show({
      templateUrl: 'inventory_partials/inventory_dialog_partial.html',
      controller: DialogController
    })
  }

  function DialogController($scope, $objectstore, $mdDialog, InvoiceService, $rootScope, $state) {
    $scope.tenants = loadAll();
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.querySearch = querySearch;

    function querySearch(query) {
      $scope.enter = function(keyEvent) {
          if (keyEvent.which === 13) {
            if ($scope.selectedItem === null) {
              $scope.selectedItem = query;
              console.log(results);
            } else {
              console.log($scope.selectedItem);
            }
          }
        }
        //Custom Filter
      $scope.results = [];
      for (i = 0, len = $scope.productNames.length; i < len; ++i) {
        if ($scope.productNames[i].display.indexOf(query.toLowerCase()) != -1) {
          $scope.results.push($scope.productNames[i]);
        }
      }
      return $scope.results;
    }
    $scope.productNames = [];

    function loadAll() {
      var client = $objectstore.getClient("product12thdoor");
      client.onGetMany(function(data) {
        if (data) {
          for (i = 0, len = data.length; i < len; ++i) {
            $scope.productNames.push({
              display: data[i].Productname,
              value: data[i].Productname.toLowerCase(),
              uom: data[i].ProductUnit
            });
          }
        }
      });
      client.onError(function(data) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('Sorry').content('There is no products available').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
      });
      client.getByFiltering("*");
    }
    $scope.inventory = {};
    $scope.dialogaddbutton = true;
    $scope.dialogUpdatebutton = false;
    if ($state.current.name == 'Add_Inventory' || $state.current.name == 'home.receipt') {
      $scope.plusdialog = true;
    } else if ($state.current.name == 'Add_Inventory_Issue' || $state.current.name == 'home.issue') {
      $scope.plusdialog = false;
    }
    $scope.closeDialog = function(product) {
      $mdDialog.hide();
    }
    $scope.AddCus = function(product, qty, unit) {
      $scope.inventory.productname = product;
      $scope.inventory.Unit = unit;
      
      if ($rootScope.inventoryType == "cards") {
        if (product == null || qty == null || unit == null) {
          console.log("fill all details")
        } else {
          InvoiceService.setArrayview($scope.inventory, $rootScope.tableContent);
          $mdDialog.hide();
        }
      } else if ($rootScope.inventoryType == "insert") {
        if (product == null || qty == null || unit == null) {
          console.log("fill all details")
        } else {
          InvoiceService.setArray($scope.inventory);
          $mdDialog.hide();
        }
      }
    }
  }

  function EyeController($scope, $mdDialog, InvoiceService, item, $rootScope, $state, $objectstore) {
    $scope.inventory = item;
    $scope.dialogaddbutton = false;
    $scope.dialogUpdatebutton = true;
    $scope.tenants = loadAll();
    $scope.selectedItem = {
      display : item.productname,
      uom : item.Unit
    };
    // $scope.selectedItem.display = item.productname;
    // $scope.selectedItem.uom = item.Unit;
    $scope.searchText = null;
    $scope.querySearch = querySearch;

    function querySearch(query) {
      $scope.enter = function(keyEvent) {
          if (keyEvent.which === 13) {
            if ($scope.selectedItem === null) {
              $scope.selectedItem = query;
              console.log(results);
            } else {
              console.log($scope.selectedItem);
            }
          }
        }
        //Custom Filter
      $scope.results = [];
      for (i = 0, len = $scope.productNames.length; i < len; ++i) {
        if ($scope.productNames[i].display.indexOf(query.toLowerCase()) != -1) {
          $scope.results.push($scope.productNames[i]);
        }
      }
      return $scope.results;
    }
    $scope.productNames = [];

    function loadAll() {
      var client = $objectstore.getClient("product12thdoor");
      client.onGetMany(function(data) {
        if (data) {
          for (i = 0, len = data.length; i < len; ++i) {
            $scope.productNames.push({
              display: data[i].Productname,
              value: data[i].Productname.toLowerCase(),
              uom: data[i].ProductUnit
            });
          }
        }
      });
      client.onError(function(data) {
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('Sorry').content('There is no products available').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
      });
      client.getByFiltering("*");
    }
    if ($state.current.name == 'Add_Inventory' || $state.current.name == 'home.receipt') {
      $scope.plusdialog = true;
    } else if ($state.current.name == 'Add_Inventory_Issue' || $state.current.name == 'home.issue') {
      $scope.plusdialog = false;
    }
    $scope.closeDialog = function(product,unit) {
      item.productname = product;
      item.Unit = unit;
      $mdDialog.hide();
    }
    $scope.deletecus = function() {
      if ($rootScope.inventoryType == "cards") {
        InvoiceService.removeArrayView(item, $rootScope.tableContent);
        $mdDialog.hide();
      } else if ($rootScope.inventoryType == "insert") {
        InvoiceService.removeArray(item);
        $mdDialog.hide();
      }
    }
  }
  return dialogsvc;
});

rasm.factory('InvoiceService', function($rootScope) {
  $rootScope.testArray = {
    val: []
  };
  return {
    setArray: function(newVal) {
      $rootScope.testArray.val.push(newVal);
      return $rootScope.testArray;
    },
    setArrayview: function(val, arr) {
      arr.push(val);
      return arr;
    },
    removeArray: function(newVals) {
      $rootScope.testArray.val.splice(newVals, 1);
      return $rootScope.testArray;
    },
    removeArrayView: function(val, arr) {
      arr.splice(val, 1);
      return arr;
    }
  }
});
rasm.service('$DownloadPdf',function(){
	this.GetPdf = function(obj,Inv,type){ 

    // var specialElementHandlers = {
    //   '#convert_to_pdf': function(element, renderer){
    //     return true;
    //   }
    // };
    // var doc = new jsPDF();
    // doc.fromHTML($('#convert_to_pdf').get(0), 15, 15, {
    //    'width': 170, 
    //    'elementHandlers': specialElementHandlers
    // }, function() {
    //   doc.save('sample-file.pdf');
    // });    
  //obj = hasNull(obj); 
  if(!obj.hasOwnProperty(Comment)){
     obj.Comment = "";
  }

  var doc = new jsPDF();
    doc.setFontSize(17);
    doc.text(30, 20,Inv.NoteType + ' NOTE');
    doc.setFontSize(14);
    doc.text(40, 30, Inv.InventoryType);
    doc.setFontSize(14);
    doc.text(70, 30, Inv.InventoryTypeValue.toString());
    doc.setFontSize(14);
    doc.text(150, 30, 'To');
    doc.setFontSize(14);
    doc.setFontType("bold");
    doc.text(150, 35,  Inv.AddressOne);    
    doc.setFontType("normal");
    doc.setFontSize(14);
    doc.text(150, 40,  Inv.AddressTwo);
    doc.setFontSize(14);
    doc.text(150, 45,  Inv.AddressThree);
    doc.setFontSize(14);
    doc.text(150, 50,  Inv.AddressFour);
    doc.setFontSize(14);
    doc.text(40, 40, 'Date');
    doc.text(70, 40, obj.date);
    doc.setFontSize(14);
    doc.text(40, 50, 'Comment');
    doc.setFontSize(14);
    doc.text(70, 50,obj.Comment);
    doc.setFontSize(14);
    doc.setFontType("bold");
    doc.text(155, 88, 'Qty');
    doc.setFontSize(14);
    doc.setFontType("bold");
    doc.text(170, 88, 'Unit');
    doc.setFontSize(14);
    doc.setFontType("bold");
    doc.text(40, 88, 'Description');
    doc.setFontSize(14);
    doc.setFontType("bold");
    doc.text(40, 90, '___________________________________________________');
    doc.setFontSize(14);

    if (obj.itemdetails.length > 0) {
      var QtyHeight = 80;
      var UnitHeight = 80;
      var TitleHeight = 80;
      var DescHeight = 80;
      var LineHeight = 85;

      for(i=0; i<= obj.itemdetails.length-1 ; i++){
         if(!obj.itemdetails[i].hasOwnProperty(Comment)){
             obj.itemdetails[i].Comment = "";
         }
         QtyHeight = QtyHeight + 15;
         UnitHeight = UnitHeight + 15;
         TitleHeight = TitleHeight + 15;
         DescHeight = DescHeight + 20;
         LineHeight = LineHeight + 20;
          doc.setFontSize(14);
          doc.setFontType("normal");
          doc.text(157, QtyHeight, obj.itemdetails[i].Quantity.toString());
          doc.setFontSize(14);
          doc.setFontType("normal");
          doc.text(170, UnitHeight, obj.itemdetails[i].Unit.toString());
          doc.setFontSize(14);
          doc.setFontType("normal");
          doc.text(40, TitleHeight, obj.itemdetails[i].productname.toString());
          doc.setFontSize(14);
          doc.setFontType("normal");
          doc.text(40, DescHeight, obj.itemdetails[i].Comment.toString());
          doc.setFontSize(14);
          doc.setFontType("normal");
          doc.text(40, LineHeight, '___________________________________________________');
          doc.setFontSize(14);
      }
    };

    if (type == 'print') {
      doc.output('dataurlnewwindow'); 
    }else if (type == 'download') {
      doc.save('sample-file.pdf');
    };    
    
  }
});

function hasNull(target) {
    for (var member in target) {
      if (target[member] != null)
           target[member] = target[member].toString();
        if (target[member] == null)
           target[member] = "";
    }
  return target;
}
