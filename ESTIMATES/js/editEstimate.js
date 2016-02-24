angular.module('mainApp')
.controller('editCtrl', function($scope, $mdDialog, $objectstore, $window, $rootScope,$stateParams, InvoiceService, EstimateDetails, $filter, $state, $location) {

if($state.current.name == 'copy') {
        $scope.saveEstimateB = true;
     }else if($state.current.name == 'estimateInvoice'){
      $scope.saveEstimateB = true;
     }else{
        $scope.editEstimate = true;
     }

      $scope.TDinvoice =[];
     var client = $objectstore.getClient("Estimate12thdoor");
      client.onGetMany(function(data) {
         if (data) {
            for (var i = data.length - 1; i >= 0; i--) {
               data[i].estimateNo = parseInt(data[i].estimateNo);
               $scope.TDinvoice.push(data[i]);
               
               if($stateParams.estimateNo == data[i].estimateNo){
                EstimateDetails.removeArray(data[i], 1);
                  EstimateDetails.setArray(data[i]);
               }
            };
         }
      });
      client.onError(function(data) {
         $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .content('There was an error retreving the data.')
            .ariaLabel('Alert Dialog Demo')
            .ok('OK')
            .targetEvent(data)
         );
      });
      client.getByFiltering("*");

	$scope.edit = function(updatedForm) {
      var client = $objectstore.getClient("Estimate12thdoor");
      updatedForm.estimateNo = updatedForm.estimateNo.toString();

      client.onComplete(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('')
          .content('invoice Successfully Saved')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
      });
      client.onError(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('Sorry')
          .content('Error Saving invoice')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
      });
      
      client.insert(updatedForm, {
            KeyProperty: "estimateNo"
         });
    }

    $scope.addProductArray = function(ev,arr){
          $rootScope.tableContent = [];
            $rootScope.tableContent = arr;

         $mdDialog.show({
            templateUrl: 'estimatePartial/addproduct.html',
            targetEvent: ev,
            controller: function editProductController($scope, $mdDialog) {
               $scope.prducatsAdd = {};
               $scope.prod = {};
               $scope.promoItems = [];
               //add product to the invoice
               $scope.addproductToarray = function(item,ev) {

                  $scope.promoItems[0] = {
                      productName: $scope.SproductName,
                      price : $scope.Sprice,
                      tax : $scope.Stax,
                      ProductUnit : $scope.SProductUnit,
                      qty : $scope.Sqty,
                      discount: $scope.discount,
                      olp: $scope.olp,
                      status:$scope.Sstatus
                  }

                  for (var i = $scope.promoItems.length - 1; i >= 0; i--) {

                    if($scope.promoItems[i].qty == null){
                       $scope.showActionToast = function() {
                        var toast = $mdToast.simple()
                              .content('Action Toast!')
                              .action('OK')
                              .highlightAction(false)
                              .position($scope.getToastPosition());
                        $mdToast.show(toast).then(function(response) {
                          if ( response == 'ok' ) {
                            alert('You clicked \'OK\'.');
                          }
                        });
                      };
                    }else if($scope.promoItems[i].ProductUnit == null){

                    }else if($scope.promoItems[i].price == null){

                    }else{
                     InvoiceService.setArray2({
                        Productname: $scope.promoItems[i].productName,
                        price: $scope.promoItems[i].price,
                        quantity: $scope.promoItems[i].qty,
                        ProductUnit: $scope.promoItems[i].ProductUnit,
                        discount: $scope.promoItems[i].discount,
                        tax: $scope.promoItems[i].tax,
                        olp: $scope.promoItems[i].olp,
                        amount: $scope.Amount,
                        status:$scope.promoItems[i].status,
                     });
                     //console.log($rootScope.editProdArray.val)
                      if($scope.promoItems[i].status == 'notavailable'){
                          var confirm = $mdDialog.confirm()
                            .title('Would you like to save this product for future use?')
                            .content('')
                            .ariaLabel('Lucky day')
                            .targetEvent(ev)
                            .ok('save')
                            .cancel('cancel');
                      $mdDialog.show(confirm).then(function(item) {
                        for (var i = $scope.promoItems.length - 1; i >= 0; i--) {
                        $scope.prod.Productname = $scope.promoItems[i].productName;
                         $scope.prod.costprice = $scope.promoItems[i].price;
                         $scope.prod.ProductUnit=$scope.promoItems[i].ProductUnit;
                         $scope.prod.producttax = $scope.promoItems[i].tax;                       
                         
                         console.log($scope.promoItems[i].tax);
                         $scope.FirstLetters = $scope.promoItems[i].productName.substring(0, 3).toUpperCase();
                          if ($scope.product.length>0) {
                            //if array is not empty
                             $scope.PatternExsist = false; // use to check pattern match the object of a array 
                             $scope.MaxID = 0;
                              for(y=0; y<=$scope.product.length-1; y++){
                                if ($scope.product[y].ProductCode.substring(0, 3) === $scope.FirstLetters) {
                                  $scope.CurrendID = $scope.product[y].ProductCodeID;
                                  if ($scope.CurrendID > $scope.MaxID) {
                                    $scope.MaxID = $scope.CurrendID;
                                  };
                                   $scope.PatternExsist = true;
                                };
                              }
                              if (!$scope.PatternExsist) {
                                $scope.prod.ProductCode = $scope.FirstLetters + '-0001';
                                $scope.prod.ProductCodeID = 1;
                              }else if($scope.PatternExsist){
                                $scope.GetMaxNumber($scope.prod,$scope.FirstLetters,$scope.MaxID)
                              }       
                          }else{
                            $scope.prod.ProductCode = $scope.FirstLetters + '-0001';
                            $scope.prod.ProductCodeID = 1;
                          }

                       }

                       $scope.GetMaxNumber = function(obj,name,MaxID){
                        $scope.FinalNumber = MaxID +1;
                        $scope.FinalNumberLength = $scope.FinalNumber.toString().length;
                        $scope.Zerros="";
                        for(i=0; i<4-$scope.FinalNumberLength; i++ ){
                          var str = "0";
                          $scope.Zerros = $scope.Zerros + str;
                        }
                        $scope.Zerros  = $scope.Zerros + $scope.FinalNumber.toString(); 
                        obj.ProductCodeID = $scope.FinalNumber;
                        obj.ProductCode = name +'-'+ $scope.Zerros;
                       }

                       $scope.prod.ProductCategory = "Product";
                       $scope.prod.progressshow = "false"
                       $scope.prod.favouriteStar = false;
                       $scope.prod.favouriteStarNo = 1;
                       $scope.prod.tags = [];
                       $scope.prod.todaydate = new Date();
                       $scope.prod.UploadImages = {val: []};
                       $scope.prod.UploadBrochure = {val: []};
                         var client = $objectstore.getClient("product12thdoor");
                         client.onComplete(function(data) {
                            $mdDialog.show(
                               $mdDialog.alert()
                               .parent(angular.element(document.body))
                               .title('')
                               .content('product Successfully Saved')
                               .ariaLabel('Alert Dialog Demo')
                               .ok('OK')
                               .targetEvent(data)
                            );
                         });
                         client.onError(function(data) {
                            $mdDialog.show(
                               $mdDialog.alert()
                               .parent(angular.element(document.body))
                               .title('Sorry')
                               .content('Error saving product')
                               .ariaLabel('Alert Dialog Demo')
                               .ok('OK')
                               .targetEvent(data)
                            );
                         });
                         $scope.prod.product_code = "-999";
                         client.insert([$scope.prod], {
                            KeyProperty: "product_code"
                         });
                      }, function() {
                      });
                        }
                         for (var i = $rootScope.editProdArray.val.length - 1; i >= 0; i--) {
                             $rootScope.EstimateArray[0].EstimateProducts.push($rootScope.editProdArray.val[i]);
                           };
                       $mdDialog.hide();
                     }
                    }
                  }
                  //close dialog box
               $scope.cancel = function() {
                     $mdDialog.cancel();
                  }
                   
                   $scope.promoItems.push({
                     productName:'',
                     price : '',
                     tax : '',
                     ProductUnit :'',
                     qty:'',
                     discount:'',
                     olp:'',
                     status:''
                   });
                  $scope.TaxDisabled = false;
                  $scope.setSelectedClient = function (package){
                         $scope.promoItems.tax = 0;
                        $scope.discount = 0;

                       for (var i = 0; i < $scope.product.length; i++) {
                        
                           if($scope.product[i].Productname.toLowerCase() === package.toLowerCase()){
                              $scope.SproductName = package;
                              $scope.Sprice = $scope.product[i].costprice;
                              $scope.SProductUnit = $scope.product[i].ProductUnit;
                              $scope.Sqty = $scope.qty;
                              $scope.Solp = $scope.olp;
                              $scope.Stax = $scope.product[i].producttax;
                              $scope.Sstatus = "available"
                              $scope.promoItems.splice(0,1)
                               $scope.promoItems.push({
                                     productName: package,
                                     price : $scope.product[i].costprice,
                                     tax : $scope.product[i].producttax,
                                     ProductUnit : $scope.product[i].ProductUnit,
                                     qty : $scope.qty,
                                     discount: $scope.discount,
                                     olp: $scope.olp,
                                     status:"available"
                             });
                              $scope.TaxDisabled = false;
                              break;
                           }
                           else if($scope.product[i].Productname.toLowerCase() != package.toLowerCase()){
                              $scope.SproductName = package;
                              $scope.Sprice = $scope.productPrice;
                              $scope.SProductUnit = $scope.promoItems.ProductUnit;
                              $scope.Sqty = $scope.qty;
                              $scope.Solp = $scope.olp;
                              $scope.Stax = $scope.promoItems.tax;
                              $scope.Sstatus = "notavailable"
                              $scope.promoItems.splice(0,1)
                              $scope.promoItems.push({
                                  productName:'',
                                  price : '',
                                  tax :'',
                                  qty : '',
                                  discount: '',
                                  ProductUnit :"each",
                                  olp: '',
                                 status:"notavailable"
                             });
                              $scope.TaxDisabled = false;
                           }
                       }
                   };

                   $scope.setprice = function(pd){
                      $scope.Sprice = pd.price;
                   }
                   $scope.setTax = function(pDis){
                     $scope.Stax = pDis.tax;
                   }
                   $scope.setUOM = function(pUOM){
                      $scope.SProductUnit = pUOM.ProductUnit;
                   }

                  var client = $objectstore.getClient("product12thdoor");
                     client.onGetMany(function(data) {
                        if (data) {
                           $scope.product = data;
                        }
                     });
                     client.getByFiltering("*");

               //Uses auto complete to get the product details 
               $rootScope.proload = loadpro();
               $rootScope.selectedItemm = null;
               $rootScope.searchTextt = null;
               $rootScope.querySearchh = querySearchh;

               function querySearchh(query) {
                  $scope.enter = function(keyEvent) {
                     if (keyEvent.which === 13) {
                        if ($rootScope.selectedItemm === null) {
                           $rootScope.selectedItemm = query;
                        } else {}
                     }
                  }
                  $rootScope.results = [];
                  for (i = 0, len = $rootScope.proName.length; i < len; ++i) {
                     if ($rootScope.proName[i].dis.indexOf(query) != -1) {
                        $rootScope.results.push($rootScope.proName[i]);
                     }
                  }
                  return $rootScope.results;
               }
               $rootScope.proName = [];

               function loadpro() {
                     var client = $objectstore.getClient("product12thdoor");
                     client.onGetMany(function(data) {
                        if (data) {
                           for (i = 0, len = data.length; i < len; ++i) {
                              $rootScope.proName.push({
                                 dis: data[i].Productname.toLowerCase(),
                                 valuep: data[i]
                              });
                           }
                        }
                     });
                     client.onError(function(data) {
                     });
                     client.getByFiltering("*");
                  }
                  //calculate the invoice amount for each product
               $scope.calAMount = function() {
                  $scope.Amount = 0;
                  // angular.forEach($scope.promoItems, function(tdIinvoice) {
                     $scope.Amount = $scope.Sprice * $scope.Sqty;
                  // })
                  return $scope.Amount;
               }
            }
         })
      }

$scope.saveEstimate = function(esData){
  var client = $objectstore.getClient("Estimate12thdoor");

      esData.total = $scope.total;
      esData.finalamount = $scope.famount;
      esData.discountAmount = $scope.finalDisc;
      esData.salesTaxAmount = $scope.salesTax;
      esData.otherTaxAmount = $scope.otherTax;
      esData.status = "Valid";
      
      $scope.TDEstimate.commentsAndHistory=[];
         $scope.TDEstimate.commentsAndHistory.push({
              done: false,
              text: "Estimate was created by Mr.dddd",
              date:new Date()
         });

      // esData.UploadImages = {
      //   val: []
      // };
      // $scope.TDEstimate.UploadImages.val = UploaderService.loadBasicArray();

         EstimateDetails.removeArray(0, 1);
        EstimateDetails.setArray(esData);

      client.onComplete(function(data) {
        $state.go('viewEst', {'estimateNo': esData.estimateRefNo});
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('')
          .content('Estimate Successfully Saved')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
      });

      client.onError(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('Sorry')
          .content('Error saving credit Note ')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
      });
     
      esData.estimateNo = "-999";
      client.insert([esData], {
        KeyProperty: "estimateNo"
      });
}

for (var i = $rootScope.EstimateArray.length - 1; i >= 0; i--) {
  if($rootScope.EstimateArray[i].status == "Draft"){
    $scope.showSave = true;
  }
};

$scope.EstimateDetails = [];
       var client = $objectstore.getClient("domainClassAttributes");
        client.onGetMany(function(data) {
           if (data) {
            $scope.EstimateDetails = data;

          for (var i = $scope.EstimateDetails.length - 1; i >= 0; i--) {
            $scope.ID = $scope.EstimateDetails[i].maxCount;
      };
      $scope.maxID = parseInt($scope.ID)+1;
      $scope.refNo = $scope.maxID.toString();
       // console.log($scope.TDEstimate.estimateRefNo)
           }
        });
        client.getByFiltering("select maxCount from domainClassAttributes where class='Estimate12thdoor'");

$scope.savetoEstimate = function(obj) {
         var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('')
            .content('Are You Sure You Want To save it?')
            .ok('Save')
            .cancel('Cancel')
            .targetEvent(obj);
         $mdDialog.show(confirm).then(function() {
            var draftdelete = $objectstore.getClient("Estimate12thdoorDraft");
            
            draftdelete.onComplete(function(data) {
              obj.estimateRefNo = $scope.refNo;
            obj.status = "Valid";
               var newInsert = $objectstore.getClient("Estimate12thdoor");
               newInsert.onComplete(function(data) {
                  $mdDialog.show(
                     $mdDialog.alert()
                     .parent(angular.element(document.body))
                     .title('')
                     .content('invoice Successfully Saved')
                     .ariaLabel('Alert Dialog Demo')
                     .ok('OK')
                     .targetEvent(data)
                  );
                  $state.go('viewEst', {'estimateNo': $scope.refNo}, {
                     reload: true
                  });
               });
               newInsert.onError(function(data) {
                  $mdDialog.show(
                     $mdDialog.alert()
                     .parent(angular.element(document.body))
                     .title('Sorry')
                     .content('Error saving invoice')
                     .ariaLabel('Alert Dialog Demo')
                     .ok('OK')
                     .targetEvent(data)
                  );
               });
               obj.estimateNo = "-999";
               newInsert.insert(obj, {
                  KeyProperty: "estimateNo"
               });
            });
            draftdelete.onError(function(data) {
               $mdDialog.show(
                  $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .content('Error Deleting from Draft')
                  .ariaLabel('')
                  .ok('OK')
                  .targetEvent(data)
               );
            });
            draftdelete.deleteSingle(obj.estimateNo.toString(), "estimateNo");
         }, function() {
            $mdDialog.hide();
         });
      }

    
$scope.calculatetotal = function(data) {
         $scope.total = 0;
         angular.forEach(data.EstimateProducts, function(tdIinvoice) {
            $scope.total += (tdIinvoice.price * tdIinvoice.quantity) ;
         })
         return $scope.total;
      };
    $scope.finaldiscount = function(data) {
         $scope.finalDisc = 0;
         $scope.Discount = 0;
          angular.forEach(data.EstimateProducts, function(tdIinvoice) {
            $scope.Discount +=   parseInt(tdIinvoice.discount);
            $scope.finalDisc = parseInt($scope.total*$scope.Discount/100);
         })
         return $scope.finalDisc;
      }
      $scope.CalculateTax = function(data) {
         $scope.salesTax = 0;

         angular.forEach(data.EstimateProducts, function(tdIinvoice) {
            $scope.salesTax += parseInt($scope.total*tdIinvoice.tax/100);
         })
         return $scope.salesTax;
         
      }
     
      $scope.finalamount = function(data) {
        $rootScope.famount = 0;
         $rootScope.famount = parseInt($scope.total - $scope.finalDisc)+parseInt($scope.salesTax)+parseInt(data.shipping);
         return $rootScope.famount;
         // console.log()
      };
    
})