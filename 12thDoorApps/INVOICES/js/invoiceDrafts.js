angular.module('mainApp')
 .controller('testCtrl', function($scope, $mdDialog, $rootScope,$objectstore, $uploader,$state, InvoiceService, item) {
  $scope.settings = {};
  $scope.UnitOfMeasure = [];
  $scope.taxType = []
  $scope.AllTaxes = [];
  $scope.individualTax = [];
   var client = $objectstore.getClient("Settings12thdoor");
      client.onGetMany(function(data) {
         if (data) {
           $scope.settings = data;
             for (var i =  $scope.settings.length - 1; i >= 0; i--) {
               for (var z = $scope.settings[i].preference.productpref.units.length - 1; z >= 0; z--) {
                if($scope.settings[i].preference.productpref.units[z].activate == true){
                  $scope.UnitOfMeasure.push($scope.settings[i].preference.productpref.units[z])
                }
                  
                  $scope.ShowDiscount = $scope.settings[i].preference.invoicepref.enableDisscounts;
                  $scope.dis = $scope.settings[i].preference.invoicepref.disscountItemsOption;
                };

                if($scope.settings[i].taxes){
                  for (var x = $scope.settings[i].taxes.individualtaxes.length - 1; x >= 0; x--) {
                     $scope.individualTax.push($scope.settings[i].taxes.individualtaxes[x]);
                   };
                   for (var y = $scope.settings[i].taxes.multipletaxgroup.length - 1; y >= 0; y--) {
                    $scope.individualTax.push($scope.settings[i].taxes.multipletaxgroup[y]); 
                   };
               }

             }
            }
             $scope.AllTaxes = $scope.individualTax;
              $scope.Displaydiscount = $scope.ShowDiscount;
        });
      client.onError(function(data) {
      });
      client.getByFiltering("*");

      $scope.test = item;
      
      $scope.cancel = function() {
         $mdDialog.cancel();
      };

      $scope.setTax = function(pDis){
      for (var i = $scope.AllTaxes.length - 1; i >= 0; i--) {
       if($scope.AllTaxes[i].taxname == pDis.tax.taxname){
            $scope.Ptax = ({
               taxname:$scope.AllTaxes[i].taxname,
               activate: $scope.AllTaxes[i].activate, 
               compound:$scope.AllTaxes[i].compound,
               rate:$scope.AllTaxes[i].rate, 
               type: $scope.AllTaxes[i].type, 
               individualtaxes:$scope.AllTaxes[i].individualtaxes});
        }
      };
     item.tax = $scope.Ptax;
   }   

            
      $scope.edit = function(tst, index) {
           $rootScope.testArray.val.splice($rootScope.testArray.val.indexOf(tst), 1);

         InvoiceService.setFullArr({
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
         $scope.total = 0;
         $scope.disc = 0;

         $scope.total = (item.price * item.quantity);

         if($scope.dis=="Individual Items"){
          $scope.disc = parseInt($scope.total* item.discount/100);
          $scope.Amount =  $scope.total - $scope.disc;
         }else{
          $scope.Amount = $scope.total;
         }
         
         return $scope.Amount;
      }
   })
//----------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
 .controller('paymentCtrl', function($scope, $mdDialog, $rootScope, pim) {
    $scope.pay = pim;
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
            this.setArray(obj);
            $rootScope.correctArr = [];
            $rootScope.multiTax = [];
               $rootScope.total = 0;
                $rootScope.compoundcal=[];

            if(obj.tax != null){
            if(obj.tax.type == "individualtaxes"){
              if(obj.tax.rate == 0){
              }else{
               $rootScope.taxArr.push({
                 taxName: obj.tax.taxname,
                 rate: obj.tax.rate,
                 salesTax: parseInt(obj.amount*obj.tax.rate/100),
                 compoundCheck: obj.tax.compound
               })
             }
               }else if(obj.tax.type == "multipletaxgroup"){
                  for (var i = obj.tax.individualtaxes.length - 1; i >= 0; i--) {
                     $rootScope.multiTax.push(obj.tax.individualtaxes[i].rate);

                    
                      $rootScope.total = parseInt(obj.amount*obj.tax.individualtaxes[i].rate/100)

                      // if(obj.tax.individualtaxes[i].compound == true){
                      //   $rootScope.ID = obj.tax.individualtaxes[i].positionId
                      //    $rootScope.total = parseInt(obj.amount * obj.tax.individualtaxes[i].rate/100)
                      // }

                     if(obj.tax.individualtaxes[i].rate == 0){

                     }else{
                     $rootScope.taxArr.push({
                      taxName:obj.tax.individualtaxes[i].taxname,
                      rate:obj.tax.individualtaxes[i].rate,
                      salesTax: $rootScope.total,
                      compoundCheck: obj.tax.individualtaxes[i].compound
                     })
                     }       
                  }; 
                   
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
            $rootScope.correctArr1 = [];
            $rootScope.multiTax = [];
               $rootScope.total = 0;
                $rootScope.calCompound=[];
            if(obj.tax.type == "individualtaxes"){
               if(obj.tax.rate == 0){

              }else{
               $rootScope.taxArr.push({
                 taxName: obj.tax.taxname,
                 rate: obj.tax.rate,
                 salesTax: parseInt(obj.amount*obj.tax.rate/100),
                 compoundCheck: obj.tax.compound
               })
             }
               }else if(obj.tax.type == "multipletaxgroup"){
                  for (var i = obj.tax.individualtaxes.length - 1; i >= 0; i--) {
                     $rootScope.multiTax.push(obj.tax.individualtaxes[i].rate);
                     if(obj.tax.individualtaxes[i].rate == 0){

                     }else{
                     $rootScope.taxArr.push({
                      taxName:obj.tax.individualtaxes[i].taxname,
                      rate:obj.tax.individualtaxes[i].rate,
                      salesTax: parseInt(obj.amount*obj.tax.individualtaxes[i].rate/100),
                      compoundCheck: obj.tax.individualtaxes[i].compound
                     })
                     }       
                  }; 
                   
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
          };
          if($rootScope.calPercentatge == 100){
            this.setDateArray(val);
            console.log($rootScope.dateArray.val);
          }else{
            $rootScope.showmsg = true;
          }
         },

         editDateArray:function(val){
           $rootScope.showmsg = false;
          $rootScope.calPercentatge = 0;
          $rootScope.oldPercentage = 0;

          for (var i = $rootScope.dateArray.val.length - 1; i >= 0; i--) {
            $rootScope.oldPercentage += parseInt($rootScope.dateArray.val[i].Percentage);
          }
        

          for (var i = $rootScope.checkArr.length - 1; i >= 0; i--) {
            $rootScope.calPercentatge += parseInt($rootScope.checkArr[i].percentage);
          };
          this.setDateArray(val);
          if($rootScope.calPercentatge+$rootScope.oldPercentage == 100){
            
          }else{
            $rootScope.showmsg = true;
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