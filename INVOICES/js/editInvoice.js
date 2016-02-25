//Angular Material Design - v0.11.0
angular.module('mainApp')
.controller('editCtrl', function($scope, $mdDialog, $objectstore, $window, $rootScope,invoiceDetails,$stateParams, InvoiceService, $filter, $state, $location, UploaderService,MultipleDudtesService) {
// console.log($rootScope.invoiceArray);
$scope.editInvoiceB = false;
$scope.saveInvoiceB = false;
 $scope.systemMessage = [];


$scope.Settings = {};
 $scope.AllTaxes = [];
 $scope.individualTax = [];
 $scope.UnitOfMeasure = [];
 $scope.CusFields = [];
 $scope.roles = [];
 $scope.permission = [];

 $scope.termtype = $rootScope.invoiceArray[0].termtype;
 $scope.duedate = new Date($rootScope.invoiceArray[0].duedate);
 $scope.Startdate = new Date($rootScope.invoiceArray[0].Startdate);

 var client = $objectstore.getClient("Settings12thdoor");
      client.onGetMany(function(data) {
         if (data) {
           $scope.Settings = data;
            for (var i =  $scope.Settings.length - 1; i >= 0; i--) {
              $scope.com = $scope.Settings[i].preference.invoicepref.defaultComm;
              $scope.note = $scope.Settings[i].preference.invoicepref.defaultNote;
              $scope.paymentTerm = $scope.Settings[i].preference.invoicepref.defaultPaymentTerms;  
              $scope.dis = $scope.Settings[i].preference.invoicepref.disscountItemsOption;
              $scope.ShippingCharges= $scope.Settings[i].preference.invoicepref.enableshipping;
              $scope.partialPayment =  $scope.Settings[i].preference.invoicepref.allowPartialPayments;
              $scope.ShowDiscount = $scope.Settings[i].preference.invoicepref.enableDisscounts;
              $scope.ShowShipAddress = $scope.Settings[i].preference.invoicepref.displayshipaddress;
              $scope.ShowTaxes = $scope.Settings[i].preference.invoicepref.enableTaxes;
              $scope.offlinePayments = $scope.Settings[i].preference.invoicepref.offlinePayments;
              $scope.EmailPermission = $scope.Settings[i].preference.invoicepref.copyadminallinvoices;
              $scope.mail = $scope.Settings[i].profile.adminEmail;
              $scope.BaseCurrency = $scope.Settings[i].profile.baseCurrency;
             
              for (var z = $scope.Settings[i].users.roles.length - 1; z >= 0; z--) {
                 $scope.roles.push($scope.Settings[i].users.roles[z].rolename);
                 $scope.permission.push($scope.Settings[i].users.roles[z]) ;  
              };

               $scope.cusF = $scope.Settings[i].preference.invoicepref.CusFiel

               for (var x = $scope.Settings[i].taxes.individualtaxes.length - 1; x >= 0; x--) {
                 $scope.individualTax.push($scope.Settings[i].taxes.individualtaxes[x]);
               };
               for (var y = $scope.Settings[i].taxes.multipletaxgroup.length - 1; y >= 0; y--) {
                $scope.individualTax.push($scope.Settings[i].taxes.multipletaxgroup[y]); 
               };
               
                for (var z = $scope.Settings[i].preference.productpref.units.length - 1; z >= 0; z--) {
                  $scope.UnitOfMeasure.push($scope.Settings[i].preference.productpref.units[z])
                };

                $scope.paymentMethod = [];

                for (var x = $scope.Settings[i].preference.paymentpref.PaymentMethod.length - 1; x >= 0; x--) {
                   $scope.paymentMethod.push({
                     paymentmethod:$scope.Settings[i].preference.paymentpref.PaymentMethod[x].paymentmethod,
                     paymentType: $scope.Settings[i].preference.paymentpref.PaymentMethod[x].paymentType,
                     activate:$scope.Settings[i].preference.paymentpref.PaymentMethod[x].activate
                   }) 
                };
                for (var y = $scope.Settings[i].payments.length - 1; y >= 0; y--) {
                   $scope.paymentMethod.push({
                     paymentmethod:$scope.Settings[i].payments[y].name,
                     paymentType: $scope.Settings[i].payments[y].paymentType,
                     activate:$scope.Settings[i].payments[y].activate
                     // url:$scope.Settings[i].payments[y].url
                   }) 
                };
            };
         }

         if($scope.EmailPermission == true){
          $scope.TDinvoice.adminEmail = $scope.mail;
         }
        $scope.TDinvoice.comments = $scope.com;
        $scope.TDinvoice.notes = $scope.note;
        $scope.TDinvoice.termtype =  $scope.paymentTerm;
        $scope.TDinvoice.baseCurrency = $scope.BaseCurrency;
        $scope.TDinvoice.DiplayShipiingAddress = $scope.ShowShipAddress;
        $scope.TDinvoice.allowPartialPayments = $scope.partialPayment;
        $scope.AllTaxes = $scope.individualTax;
        $scope.UOM = $scope.UnitOfMeasure;
        $scope.CusFields = $scope.cusF;
        $scope.Displaydiscount = $scope.ShowDiscount;
      });
      client.onError(function(data) {
      });
      client.getByFiltering("*");


for (var i = $rootScope.invoiceArray.length - 1; i >= 0; i--) {
  for (var x = $rootScope.invoiceArray[i].MultiDueDAtesArr.length - 1; x >= 0; x--) {
     if($rootScope.invoiceArray[i].MultiDueDAtesArr[x].paymentStatus == "Draft"){
    $scope.showSave = true;
  }
  }
 
};

 if($state.current.name == 'copy') {
        $scope.saveInvoiceB = true;
     }else if($state.current.name == 'estimateInvoice'){
      $scope.saveInvoiceB = true;
     }else{
        $scope.editInvoiceB = true;
     }

     // for (var i = $rootScope.invoiceArray.length - 1; i >= 0; i--) {
       console.log($rootScope.invoiceArray[0].termtype)
     // };

     

$scope.edit = function(updatedForm) {
         updatedForm.invoiceNo = updatedForm.invoiceNo.toString();
         for (var x = updatedForm.MultiDueDAtesArr.length - 1; x >= 0; x--) {
       
         if(updatedForm.MultiDueDAtesArr[x].paymentStatus == "Draft"){
        
          var client = $objectstore.getClient("invoice12thdoorDraft");
         updatedForm.total = $scope.total;
         updatedForm.finalamount = $scope.famount;
         updatedForm.Startdate = $scope.Startdate;
         updatedForm.termtype = $scope.termtype;
         updatedForm.duedate = $scope.duedate;
         updatedForm.OfflinePaymentDetails = $scope.OfflinePaymentDetails;
          $scope.systemMessage.push({text:"The Invoice was Edited by mr.Perera", done:false,  date:new Date()});
          for (var i = $scope.systemMessage.length - 1; i >= 0; i--) {
           updatedForm.commentsAndHistory.push($scope.systemMessage[i]);
          };
         //console.log(updatedForm);
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
         client.onError(function(data) {});
         client.insert(updatedForm, {
            KeyProperty: "invoiceNo"
         });
        }else{
       
         var client = $objectstore.getClient("invoice12thdoor");
         //updatedForm.invoiceProducts = $rootScope.showprodArray.val;
         updatedForm.total = $scope.total;
         updatedForm.finalamount = $scope.famount;
          //updatedForm.termtype = $scope.termtype;
          updatedForm.Startdate = $scope.Startdate;
         updatedForm.duedate = $scope.duedate;
         $scope.systemMessage.push({text:"The Invoice was Edited by mr.Perera", done:false,  date:new Date()});
          for (var i = $scope.systemMessage.length - 1; i >= 0; i--) {
           updatedForm.commentsAndHistory.push($scope.systemMessage[i]);
          };
         //console.log(updatedForm.invoiceProducts);
         client.onComplete(function(data) {
           $state.go('view', {'invoiceno': updatedForm.invoiceRefNo});
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
         client.onError(function(data) {});
         client.insert(updatedForm, {
            KeyProperty: "invoiceNo"
         });
       }
      }
    }
          $scope.calAMount = function(data) {
         $scope.Amount = 0;
         $scope.Amount = (((data.price * data.quantity) - ((data.price * data.quantity) * data.discount / 100)) + ((data.price * data.quantity)) * data.tax / 100);
         return $scope.Amount;
      }

      $scope.ss=[];
      $scope.getPayement = function(pay){
         for (var i = $scope.paymentMethod.length - 1; i >= 0; i--) {
        if(pay ==  $scope.paymentMethod[i].paymentmethod){
          $scope.ss.push({
            sc:$scope.paymentMethod[i].paymentmethod,
            dd:$scope.paymentMethod[i].paymentType
          })
          if($scope.paymentMethod[i].paymentType == "Offline"){
          $scope.OfflinePaymentDetails = $scope.offlinePayments;
          }
        }
      };
      }
      $scope.calculatetotal = function(data) {
         $scope.total = 0;
         angular.forEach(data.invoiceProducts, function(tdIinvoice) {
            $scope.total += (tdIinvoice.price * tdIinvoice.quantity) ;
         })
         return $scope.total;
      };
      $scope.finaldiscount = function(data) {
         $scope.finalDisc = 0;
         $scope.Discount = 0;
          angular.forEach(data.invoiceProducts, function(tdIinvoice) {
            $scope.Discount +=   parseInt(tdIinvoice.discount);
            $scope.finalDisc = parseInt($scope.total*$scope.Discount/100);
         })
         return $scope.finalDisc;
      }
      $scope.CalculateTax = function() {
         $scope.salesTax = 0;

         for (var i = $rootScope.getTax.length - 1; i >= 0; i--) {
            $scope.salesTax += parseInt($rootScope.getTax[i].salesTax);
          }
         return $scope.salesTax;
         
      }
      $scope.finalamount = function(data) {
        $rootScope.famount = 0;
         $rootScope.famount = parseInt($scope.total - $scope.finalDisc)+parseInt($scope.salesTax)+parseInt(data.shipping);
         return $rootScope.famount;
      };

      $scope.InvoiceDetails = [];   
       var client = $objectstore.getClient("domainClassAttributes");
              client.onGetMany(function(data) {
                 if (data) {
                  $scope.InvoiceDetails = data;

                for (var i = $scope.InvoiceDetails.length - 1; i >= 0; i--) {
                  $scope.ID = $scope.InvoiceDetails[i].maxCount;
            };
            $scope.maxID = parseInt($scope.ID)+1;
            $scope.refNo = $scope.maxID.toString();
                 }
              });
              client.getByFiltering("select maxCount from domainClassAttributes where class='invoice12thdoor'");

          $scope.savetoInvoices = function(obj) {
         var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('')
            .content('Are You Sure You Want To save it?')
            .ok('Save')
            .cancel('Cancel')
            .targetEvent(obj);
         $mdDialog.show(confirm).then(function() {
            var draftdelete = $objectstore.getClient("invoice12thdoorDraft");
            obj.OfflinePaymentDetails = $scope.OfflinePaymentDetails;
            obj.termtype = $scope.termtype;
            obj.duedate = $scope.duedate;
            draftdelete.onComplete(function(data) {
              if(obj.termtype != "multipleDueDates"){
         obj.MultiDueDAtesArr= [{
                           DueDate: $scope.TDinvoice.duedate,
                           Percentage: "0",
                           dueDateprice: $scope.famount,
                           paymentStatus:'Unpaid',
                           balance :$scope.famount
                        }];
        }else{
          obj.MultiDueDAtesArr = $rootScope.dateArray.value;
        }
              obj.invoiceRefNo = $scope.refNo;
           for (var x = obj.MultiDueDAtesArr.length - 1; x >= 0; x--) {
       
         if(obj.MultiDueDAtesArr[x].paymentStatus == "Draft"){}}
            obj.OfflinePaymentDetails = $scope.OfflinePaymentDetails;
               var newInsert = $objectstore.getClient("invoice12thdoor");
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
                  $state.go('view', {'invoiceNo': $scope.refNo}, {
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
               obj.invoiceNo = "-999";
               newInsert.insert(obj, {
                  KeyProperty: "invoiceNo"
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
            draftdelete.deleteSingle(obj.invoiceNo.toString(), "invoiceNo");
         }, function() {
            $mdDialog.hide();
         });
      }

       
       $scope.viewSavedProducts = function(obj) {
         $mdDialog.show({
            templateUrl: 'Invoicepartials/showproduct.html',
            controller: 'showproductCtrl',
            locals: {
               item: obj
            }
         });
      }

      $scope.deleteEditproduct = function(name,index ){
         $rootScope.invoiceArray[0].invoiceProducts.splice($rootScope.invoiceArray[0].invoiceProducts.indexOf(name),1);
         
           console.log($rootScope.getTax)
         $scope.CalculateTax();
      }

      $scope.addProductArray = function(ev,arr){
          $rootScope.taxType = angular.copy($scope.AllTaxes);
          $rootScope.AllUnitOfMeasures = angular.copy($scope.UOM)
          $rootScope.Showdiscount = angular.copy($scope.Displaydiscount);
          $rootScope.discounts = angular.copy($scope.dis);
          $rootScope.DisplayTaxes =  angular.copy($scope.ShowTaxes);
            if($rootScope.Showdiscount == true){
              if($rootScope.discounts == "Individual Items"){
                $rootScope.displayDiscountLine = true;
              }
            }

         $mdDialog.show({
            templateUrl: 'Invoicepartials/addproduct.html',
            targetEvent: ev,
            controller: function editProductController($scope, $mdDialog) {
               $scope.prducatsAdd = {};
               $scope.prod = {};
               $scope.promoItems = [];
               $scope.taxType = [];
               $scope.AllUnitOfMeasures = [];

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
                     InvoiceService.setTempArr({
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
                         
                         $scope.FirstLetters = $scope.promoItems[i].productName.substring(0, 3).toUpperCase();
                          if ($scope.product.length>0) {
                            //if array is not empty
                             $scope.PatternExsist = false; 
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
                         for (var i =  $rootScope.editProdArray.val.length - 1; i >= 0; i--) {
                       $rootScope.invoiceArray[0].invoiceProducts.push($rootScope.editProdArray.val[i]);
                       for (var i = $rootScope.calTax.length - 1; i >= 0; i--) {
                       $rootScope.getTax.push($rootScope.calTax[i])
                     };
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
                              $scope.Stax = $scope.Ptax;
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
                      for (var i = $rootScope.taxType.length - 1; i >= 0; i--) {
                       if($rootScope.taxType[i].taxname == pDis.tax.taxname){
                            $scope.Ptax = ({
                               taxname:$rootScope.taxType[i].taxname,
                               activate: $rootScope.taxType[i].activate, 
                               compound:$rootScope.taxType[i].compound,
                               rate:$rootScope.taxType[i].rate, 
                               type: $rootScope.taxType[i].type, 
                               individualtaxes:$rootScope.taxType[i].individualtaxes});
                        }
                      };
                     $scope.Stax = $scope.Ptax;
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
                     $scope.Amount = $scope.Sprice * $scope.Sqty;
                  return $scope.Amount;
               }
            }
         })
      }
      $scope.getTotal = 0;
      $rootScope.getTax = [];
      $scope.groupTax = [];
      $scope.calTotal = 0;

        $scope.TDinvoice =[];
     var client = $objectstore.getClient("invoice12thdoor");
      client.onGetMany(function(data) {
         if (data) {
            for (var i = data.length - 1; i >= 0; i--) {
               data[i].invoiceNo = parseInt(data[i].invoiceNo);
               $scope.TDinvoice.push(data[i]);
               
               if($stateParams.invoiceno == data[i].invoiceNo){
                invoiceDetails.removeArray(data[i], 1);
                  invoiceDetails.setArray(data[i]);
                  
             
               for (var x = data[i].invoiceProducts.length - 1; x >= 0; x--) {
                  $scope.getTotal = angular.copy(data[i].invoiceProducts[x].amount);
                    if(data[i].invoiceProducts[x].tax.type == "individualtaxes"){
                      $rootScope.getTax.push({
                      taxName: data[i].invoiceProducts[x].tax.taxname,
                       rate: data[i].invoiceProducts[x].tax.rate,
                       salesTax: parseInt($scope.getTotal*data[i].invoiceProducts[x].tax.rate/100),
                       compoundCheck: data[i].invoiceProducts[x].tax.compound
                          })
                    }
                    else if(data[i].invoiceProducts[x].tax.type == "multipletaxgroup"){
                      for (var y = data[i].invoiceProducts[x].tax.individualtaxes.length - 1; y >= 0; y--) {
                         $scope.groupTax.push(data[i].invoiceProducts[x].tax.individualtaxes[y].rate)
                      };
                      angular.forEach($scope.groupTax, function(tdIinvoice) {
                       $scope.calTotal += parseInt($scope.getTotal*tdIinvoice/100)
                       return $scope.calTotal
                      })

                      $rootScope.getTax.push({
                       taxName:data[i].invoiceProducts[x].tax.taxname,
                       rate:$scope.groupTax,
                       salesTax: $scope.total,
                       compoundCheck: $scope.compoundcal
                     })

                    }
                    $rootScope.getTax = $rootScope.getTax.sort(function(a,b){
                  return a.taxName.toLowerCase() > b.taxName.toLowerCase() ? 1 : a.taxName.toLowerCase() < b.taxName.toLowerCase() ? -1 : 0;
                 });
                  
                  if($rootScope.getTax.length > 1){
               for(l=0; l<=$rootScope.getTax.length-1; l++){
                  if ($rootScope.getTax[l+1]) {

                     if ($rootScope.getTax[l].taxName == $rootScope.getTax[l+1].taxName) {
                        var sumSalesTax = 0;
                        var txtName = $rootScope.getTax[l].taxName;
                        var rate = $rootScope.getTax[l].rate;
                        var compound = $rootScope.getTax[l].compoundCheck
                        
                        sumSalesTax = $rootScope.getTax[l].salesTax + $rootScope.getTax[l+1].salesTax;

                        $rootScope.getTax.splice(l,2);
                        $rootScope.getTax.push({
                           taxName : txtName,
                           rate : rate,
                           salesTax : sumSalesTax,
                           compoundCheck: compound
                        })
                        
                        $rootScope.getTax.sort(function(a,b){
                            return a.taxName.toLowerCase() > b.taxName.toLowerCase() ? 1 : a.taxName.toLowerCase() < b.taxName.toLowerCase() ? -1 : 0;
                        });
                      
                     };
                  };                  
               }
            }  
                 };
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

       $scope.saveInvoice = function(updatedForm) {
        $rootScope.invoiceArray.splice(updatedForm, 1);
        invoiceDetails.setArray(updatedForm);
        updatedForm.OfflinePaymentDetails = $scope.OfflinePaymentDetails;
         updatedForm.ProgressBar = {PaymentScheme:"",PaymentSchemeActive:"",PaymentSchemeData:[]};
         updatedForm.ProgressBar.PaymentScheme = updatedForm.termtype;
          updatedForm.ProgressBar.PaymentSchemeActive= "false";
          updatedForm.termtype = $scope.termtype;
         updatedForm.duedate = $scope.duedate;
         updatedForm.ProgressBar.PaymentSchemeData.push($rootScope.dateArray.value);
         updatedForm.commentsAndHistory=[];
         updatedForm.commentsAndHistory.push({
              done: false,
              text: "Invoice was created by Mr.dddd",
              date:new Date()
         });

         $scope.imagearray = UploaderService.loadArray();
         if ($scope.imagearray.length > 0) {
            for (indexx = 0; indexx < $scope.imagearray.length; indexx++) {
               $uploader.upload("45.55.83.253", "invoiceUploades", $scope.imagearray[indexx]);
               $uploader.onSuccess(function(e, data) {
                  var toast = $mdToast.simple()
                     .content('Successfully uploaded!')
                     .action('OK')
                     .highlightAction(false)
                     .position("bottom right");
                  $mdToast.show(toast).then(function() {
                  });
               });
               $uploader.onError(function(e, data) {
                  var toast = $mdToast.simple()
                     .content('There was an error, please upload!')
                     .action('OK')
                     .highlightAction(false)
                     .position("bottom right");
                  $mdToast.show(toast).then(function() {
                  });
               });
            }
         };
         var client = $objectstore.getClient("invoice12thdoor");
         updatedForm.ProgressBarDetails = $scope.ProgressBar;
         updatedForm.commentsAndHistory = {};
         updatedForm.invoiceRefNo = $scope.refNo;
         updatedForm.total = $scope.total;
         updatedForm.finalamount = $scope.famount;
         updatedForm.discountAmount = $scope.finalDisc;
         updatedForm.salesTaxAmount = $scope.salesTax;
         updatedForm.otherTaxAmount = $scope.otherTax;
         updatedForm.status = "Unpaid";
         updatedForm.favourite = false;
         updatedForm.favouriteStarNo = 1;
         updatedForm.UploadImages = {
            val: []
         };

      if(updatedForm.termtype != "multipleDueDates"){
        MultipleDudtesService.setDateArray({
                           DueDate: updatedForm.duedate,
                           Percentage: "0",
                           dueDateprice: $scope.famount,
                           paymentStatus:'Unpaid',
                           balance :$scope.famount
                        });
        }

        updatedForm.UploadImages.val = UploaderService.loadBasicArray();
         client.onComplete(function(data) {
          $state.go('view', {'invoiceno': $scope.refNo});
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

         updatedForm.invoiceNo = "-999";
         client.insert(updatedForm, {
            KeyProperty: "invoiceNo"
         });

       client.onError(function(data) {
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
      }

      $scope.cancelinvoice = function(obj, ev){
         if($state.current.name == 'copy') {
        var confirm = $mdDialog.confirm()
          .title('Would you like save this to draft?')
          .content('')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('save')
          .cancel('clear');
            $mdDialog.show(confirm).then(function() {

         var client = $objectstore.getClient("invoice12thdoorDraft");
         obj.invoiceProducts = $rootScope.testArray.val;
         obj.total = $scope.total;
         obj.finalamount = $scope.famount;
         obj.status = "Draft";
         // $scope.TDinvoice.Name = $rootScope.selectedItem1.display;
         // $scope.TDinvoice.billingAddress = $rootScope.selectedItem1.BillingValue;
         // $scope.TDinvoice.shippingAddress = $rootScope.selectedItem1.shippingValue;
         // $scope.TDinvoice.MultiDueDAtesArr = $scope.dateArray.value;
       
         client.onComplete(function(data) {
          $state.go('settings.invoice_app');
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('')
               .content('invoice Saved to drafts')
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
               .content('Error saving drafts')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
         });
         //console.log(obj);
          obj.invoiceNo = "-999";
         client.insert([obj], {
            KeyProperty: "invoiceNo"
         });
            }, function() {
              $rootScope.invoiceArray.splice(obj, 1);
              $state.go('settings.invoice_app');
            });
     }else{
        $state.go('view', {'invoiceno': obj.invoiceRefNo});
     }  
      }
})
.controller('estimateCtrl', function($scope, $mdDialog, $objectstore, $window, $stateParams,$rootScope,invoiceDetails, InvoiceService, $filter, $state, $location, UploaderService,MultipleDudtesService) {
     
     $scope.editInvoiceB = false;
     $scope.saveInvoiceB = true;

      var client = $objectstore.getClient("invoice12thdoor");
      client.onGetMany(function(data) {
         if (data) {
            for (var i = data.length - 1; i >= 0; i--) {
               data[i].invoiceNo = parseInt(data[i].invoiceNo);
               $scope.TDinvoice.push(data[i]);

               if($stateParams.cusName == data[i].Name){
                invoiceDetails.removeArray(data[i], 1);
                  invoiceDetails.setArray(data[i]);
               }
            };
         }
      });
      client.onError(function(data) {});
      client.getByFiltering("*");
  })