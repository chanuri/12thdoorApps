angular.module('mainApp')
 .controller('testCtrl', function($scope, $mdDialog, $rootScope,$objectstore, $uploader,$state, InvoiceService, item) {
  $scope.settings = {};
  $scope.UnitOfMeasure = [];
  $scope.taxType = []
   var client = $objectstore.getClient("Settings12thdoor");
      client.onGetMany(function(data) {
         if (data) {
           $scope.settings = data;
             for (var i =  $scope.settings.length - 1; i >= 0; i--) {
               for (var z = $scope.settings[i].preference.productpref.units.length - 1; z >= 0; z--) {
                  $scope.UnitOfMeasure.push($scope.settings[i].preference.productpref.units[z])
                };

             }
            }
             $scope.UOM = $scope.UnitOfMeasure;
        });
      client.onError(function(data) {
      });
      client.getByFiltering("*");

       $scope.taxType = $scope.UOM;
      console.log( $scope.taxType)

      $scope.test = item;
      
     

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
      $scope.uploadimages = {val: []};
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
      $rootScope.fullArr = {val:[]};
      $rootScope.taxArr = [];
      $rootScope.correctArr = [];
      $rootScope.compoundcal=[];

      $rootScope.setTempArr= {val:[]};
      $rootScope.calTax = [];
      $rootScope.correctArr1 = [];
      $rootScope.calCompound = [];

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
        },
        setFullArr : function(obj){
          console.log(obj)
            this.setArray(obj);
            $rootScope.correctArr = [];
            $rootScope.multiTax = [];
               $rootScope.total = 0;
                $rootScope.compoundcal=[];
           // for(i=0; i<= $rootScope.fullArr.val.length-1; i++){
            if(obj.tax != null){
            if(obj.tax.type == "individualtaxes"){
               $rootScope.taxArr.push({
                 taxName: obj.tax.taxname,
                 rate: obj.tax.rate,
                 salesTax: parseInt(obj.amount*obj.tax.rate/100),
                 compoundCheck: obj.tax.compound
               })
               }else if(obj.tax.type == "multipletaxgroup"){
                  for (var i = obj.tax.individualtaxes.length - 1; i >= 0; i--) {
                     $rootScope.multiTax.push(obj.tax.individualtaxes[i].rate);
                     //$rootScope.compoundcal = obj.tax.individualtaxes[i].compound;
                     $rootScope.compoundcal.push({
                      taxname:obj.tax.individualtaxes[i].taxname,
                      rate:obj.tax.individualtaxes[i].rate,
                      compound: obj.tax.individualtaxes[i].compound
                     })
                    // if()          
                  }; 
                   angular.forEach($rootScope.multiTax, function(tdIinvoice) {
                     $rootScope.total += parseInt(obj.amount*tdIinvoice/100)
                     return $rootScope.total
                   })
                   $rootScope.taxArr.push({
                       taxName: obj.tax.taxname,
                       rate:$rootScope.multiTax ,
                       salesTax: $rootScope.total,
                       compoundCheck: $rootScope.compoundcal
                     })
               }
            $rootScope.taxArr = $rootScope.taxArr.sort(function(a,b){
              return a.taxName.toLowerCase() > b.taxName.toLowerCase() ? 1 : a.taxName.toLowerCase() < b.taxName.toLowerCase() ? -1 : 0;
                 });

            if($rootScope.taxArr.length > 1){
               for(l=0; l<=$rootScope.taxArr.length-1; l++){
                  if ($rootScope.taxArr[l+1]) {

                     if ($rootScope.taxArr[l].taxName == $rootScope.taxArr[l+1].taxName) {
                        var sumSalesTax = 0;
                        var txtName = $rootScope.taxArr[l].taxName;
                        var rate = $rootScope.taxArr[l].rate;
                        var compound = $rootScope.taxArr[l].compoundCheck
                        
                        sumSalesTax = $rootScope.taxArr[l].salesTax + $rootScope.taxArr[l+1].salesTax;

                        $rootScope.taxArr.splice(l,2);
                        $rootScope.taxArr.push({
                           taxName : txtName,
                           rate : rate,
                           salesTax : sumSalesTax,
                           compoundCheck: compound
                        })
                        
                        $rootScope.taxArr.sort(function(a,b){
                            return a.taxName.toLowerCase() > b.taxName.toLowerCase() ? 1 : a.taxName.toLowerCase() < b.taxName.toLowerCase() ? -1 : 0;
                        });
                      
                     };
                  };                  
               }
            }
          }
        },
        setTempArr : function(obj){
            this.setArray2(obj);
            console.log(obj);
            $rootScope.correctArr1 = [];
            $rootScope.multiTax = [];
               $rootScope.total = 0;
                $rootScope.calCompound=[];
           // for(i=0; i<= $rootScope.fullArr.val.length-1; i++){
            if(obj.tax.type == "individualtaxes"){
               $rootScope.calTax.push({
                 taxName: obj.tax.taxname,
                 rate: obj.tax.rate,
                 salesTax: parseInt(obj.amount*obj.tax.rate/100),
                 compoundCheck: obj.tax.compound
               })
               }else if(obj.tax.type == "multipletaxgroup"){
                  for (var i = obj.tax.individualtaxes.length - 1; i >= 0; i--) {
                     $rootScope.multiTax.push(obj.tax.individualtaxes[i].rate);
                     //$rootScope.calCompound = obj.tax.individualtaxes[i].compound;
                     $rootScope.calCompound.push({
                      taxname:obj.tax.individualtaxes[i].taxname,
                      rate:obj.tax.individualtaxes[i].rate,
                      compound: obj.tax.individualtaxes[i].compound
                     })
                    // if()          
                  }; 
                   angular.forEach($rootScope.multiTax, function(tdIinvoice) {
                     $rootScope.total += parseInt(obj.amount*tdIinvoice/100)
                     return $rootScope.total
                   })
                   $rootScope.calTax.push({
                       taxName: obj.tax.taxname,
                       rate:$rootScope.multiTax ,
                       salesTax: $rootScope.total,
                       compoundCheck: $rootScope.calCompound
                     })
               }
            $rootScope.calTax = $rootScope.calTax.sort(function(a,b){
              return a.taxName.toLowerCase() > b.taxName.toLowerCase() ? 1 : a.taxName.toLowerCase() < b.taxName.toLowerCase() ? -1 : 0;
                 });

            if($rootScope.calTax.length > 1){
               for(l=0; l<=$rootScope.calTax.length-1; l++){
                  if ($rootScope.calTax[l+1]) {

                     if ($rootScope.calTax[l].taxName == $rootScope.calTax[l+1].taxName) {
                        var sumSalesTax = 0;
                        var txtName = $rootScope.calTax[l].taxName;
                        var rate = $rootScope.calTax[l].rate;
                        var compound = $rootScope.calTax[l].compoundCheck;

                        sumSalesTax = $rootScope.calTax[l].salesTax + $rootScope.calTax[l+1].salesTax;

                        $rootScope.calTax.splice(l,2);
                        $rootScope.calTax.push({
                           taxName : txtName,
                           rate : rate,
                           salesTax : sumSalesTax,
                           compoundCheck: $rootScope.calCompound
                        })
                        
                        $rootScope.calTax.sort(function(a,b){
                            return a.taxName.toLowerCase() > b.taxName.toLowerCase() ? 1 : a.taxName.toLowerCase() < b.taxName.toLowerCase() ? -1 : 0;
                        });
                      
                     };
                  };                  
               }
            }
        } 
      }
   })
//------------------------------------------------------------------------------------------------
   //------------------------------------------------------------------------------------------------
   .factory('MultipleDudtesService', function($rootScope) {
      $rootScope.dateArray = {val:[]};
      $rootScope.getDateArr = {val:[]};
      $rootScope.showmsg = false;
      return {
         setDateArray: function(newVal) {
            $rootScope.dateArray.val.push(newVal);
            return $rootScope.dateArray;
         },
         removeDateArray: function(newVals) {
            $rootScope.dateArray.val.splice(newVals, 1);
            return $rootScope.dateArray;
         },

         calDateArray:function(val){
          $rootScope.showmsg = false;
          $rootScope.calPercentatge = 0;
          for (var i = $rootScope.checkArr.length - 1; i >= 0; i--) {
            $rootScope.calPercentatge += parseInt($rootScope.checkArr[i].percentage);
           console.log($rootScope.calPercentatge);
          };
          if($rootScope.calPercentatge == 100){
            this.setDateArray(val);
          }else{
            $rootScope.showmsg = true;
            // alert("please check the percentage")
          }
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