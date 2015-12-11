angular.module('mainApp')
 .controller('testCtrl', function($scope, $mdDialog, $rootScope, InvoiceService, item) {
      $scope.test = item;
      console.log(item);
      $scope.cancel = function() {
         $mdDialog.cancel();
      };
      $scope.edit = function(tst) {
      	console.log($rootScope.testArray);
          $rootScope.testArray.val.splice(tst, 1);
         InvoiceService.setArray({
                        Productname: item.Productname,
                        price: item.price,
                        quantity: item.quantity,
                        ProductUnit:item.ProductUnit,
                        discount: item.discount,
                        tax: item.tax,
                        olp: item.olp,
                        amount: $scope.Amount,
                        status:item.status
                     })
         $mdDialog.cancel();
      };
      $scope.calAMount = function() {
         $scope.Amount = 0;
         $scope.Amount = (item.price * item.quantity) ;
         return $scope.Amount;
      }
   })
//----------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
 .controller('paymentCtrl', function($scope, $mdDialog, $rootScope, pim) {
    $scope.pay = pim;
    console.log($scope.pay);
    $scope.cancel = function() {
         $mdDialog.cancel();
      }

 })
//-------------------------------------------------------------------------------------------------------  
//------------------------------------------------------------------------------------------------------
   .controller('UploadCtrl', function($scope, $mdDialog, $rootScope, $state, UploaderService) {
      $scope.uploadimages = {
         val: []
      };
      $scope.uploadimages.val = UploaderService.loadBasicArray();
      //directive table content start
      $scope.$on('viewRecord', function(event, args) {
         $scope.uploadimages.val.splice(args, 1);
      });
      $scope.toggleSearch = false;
      $scope.headers = [{
         name: 'Name',
         field: 'name'
      }, {
         name: 'Size',
         field: 'size'
      }];
      $scope.custom = {
         name: 'bold',
         size: 'grey'
      };
      $scope.sortable = ['name', 'size'];
      $scope.thumbs = 'thumb';
      $scope.count = 3;
      
      $scope.AddImage = function() {
         $scope.uploadimages.val = UploaderService.loadBasicArray();
      }
      $scope.cancel = function() {
         $mdDialog.cancel();
      };
   })
   //---------------------------------------------------------------------------------------
   //---------------------------------------------------------------------------------------
   .factory('InvoiceService', function($rootScope) {
      $rootScope.testArray = {val: []};
      $rootScope.editProdArray = {val: []};
      $rootScope.showprodArray = {val: []};
      return {
         setArray: function(newVal) {
            $rootScope.testArray.val.push(newVal);
            return $rootScope.testArray;
         },
          removeArray: function(newVals) {
            $rootScope.testArray.val.splice(newVals, 1);
            return $rootScope.testArray;
         },
         setArray1: function(newVal) {
            $rootScope.showprodArray.val.push(newVal);
            return $rootScope.showprodArray;
         },
         removeArray1: function(newVals) {
            $rootScope.showprodArray.val.splice(newVals, 1);
            return $rootScope.showprodArray;
         },
          setArray2: function(newVal) {
            $rootScope.editProdArray.val.push(newVal);
            return $rootScope.showprodArray;
         },
         removeArray2: function(newVals) {
            $rootScope.editProdArray.val.splice(newVals, 1);
            return $rootScope.showprodArray;
         },
         setArrayview: function(val, arr) {
            arr.push(val);
            return arr;
        },
        seteditArrayView: function(vall, arry) {
            arry.push(vall);
            return arry;
        }

      }
   })
   //-----------------------------------------------------------------------------------------------
   //------------------------------------------------------------------------------------------------
    .factory('invoiceDetails', function($rootScope) {
      $rootScope.invoiceArray = [];
      $rootScope.invoiceArray2 = [];
      return {
         setArray: function(newVal) {
            $rootScope.invoiceArray.push(newVal);
            return $rootScope.invoiceArray;
         },
         removeArray: function(newVals) {
            $rootScope.invoiceArray.splice(newVals, 1);
            return $rootScope.invoiceArray;
         },
         setArray1: function(newVal) {
            $rootScope.invoiceArray2.push(newVal);
            return $rootScope.invoiceArray;
         },
         removeArray1: function(newVals) {
            $rootScope.invoiceArray2.splice(newVals, 1);
            return $rootScope.invoiceArray;
         }
      }
   })
   //------------------------------------------------------------------------------------------------
   //------------------------------------------------------------------------------------------------
   .factory('MultipleDudtesService', function($rootScope) {
      $rootScope.dateArray = {
         value: []
      };
      return {
         setDateArray: function(newVal) {
            $rootScope.dateArray.value.push(newVal);
            return $rootScope.dateArray;
         },
         removeDateArray: function(newVals) {
            $rootScope.dateArray.value.splice(newVals, 1);
            return $rootScope.dateArray;
         }
      }
   })
   //-----------------------------------------------------------------------------------------------------------------
   //-----------------------------------------------------------------------------------------------------------------

   .controller('showproductCtrl', function($scope, $mdDialog, $rootScope, InvoiceService, item) {
      $scope.test = item;
      console.log(item);
      $scope.cancel = function() {
         $mdDialog.cancel();
      };
      $scope.edit = function(tst) {
        $rootScope.showprodArray.val.splice(tst, 1);
         InvoiceService.setArray1({
                        Productname: item.Productname,
                        price: item.price,
                        quantity: item.quantity,
                        ProductUnit:item.ProductUnit,
                        discount: item.discount,
                        tax: item.tax,
                        olp: item.olp,
                        amount: $scope.Amount,
                        status:item.status
                     })
         $mdDialog.cancel();
      };
      $scope.calAMount = function() {
         $scope.Amount = 0;
         $scope.Amount = (item.price * item.quantity) ;
         return $scope.Amount;
      }
   })