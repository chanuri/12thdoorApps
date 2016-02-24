angular
  .module('mainApp', ['ngMaterial', 'directivelibrary', 'uiMicrokernel', 'ui.router', 'ui.sortable'])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');
})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/AllcreditNotes');
  $stateProvider

    .state('creditNote', {
    url: '/creditNoteApp',
    templateUrl: 'creditNotePartial/NewCreditNote.html',
    controller: 'AppCtrl'
  })

  .state('app', {
    url: '/AllcreditNotes',
    templateUrl: 'creditNotePartial/AllCreditNotes.html',
    controller: 'viewCtrl'
  })

  .state('view', {
    url: '/viewcreditNotes/CnNo=:Cnno',
    templateUrl: 'creditNotePartial/viewCNote.html',
    controller: 'viewCtrl'
  })

  .state('edit', {
    url: '/editcreditNotes/CnNo=:Cnno',
    templateUrl: 'creditNotePartial/editCNote.html',
    controller: 'editCtrl'
  })

})

.controller('AppCtrl', function($scope, $objectstore,$state, $uploader, $mdDialog, $window, $objectstore, $auth, $timeout, $q, $http, $mdToast, $rootScope, creditNoteService, $filter, $location, UploaderService) {
 $scope.Settings = {};
    $scope.list = [];
    $scope.TDCreditNote = {};
    $scope.total = 0;
    $scope.product = {};
    $scope.TDCreditNote.creditNoteNo = 'N/A'
    $scope.Showdate = false;
    $scope.TDCreditNote.date = new Date();
    $scope.showEditCustomer = false;
    $scope.dueDtaesShow = false;
    $scope.Billingaddress = true;
    $scope.Shippingaddress = false;
    
     $scope.totalSection = false;
      $scope.ShippingSwitch = false;
      $scope.TDCreditNote.fdiscount = 0;
      $scope.TDCreditNote.salesTaxAmount = 0;
      $scope.TDCreditNote.anotherTax = 0;
      $scope.TDCreditNote.shipping = 0;
       $scope.AllTaxes = [];
       $scope.individualTax = [];
       $scope.UnitOfMeasure = [];
       $scope.CusFields = [];
       $scope.roles = [];
       $scope.permission = [];

     $scope.InvoiceDetails = [];   
       var client = $objectstore.getClient("domainClassAttributes");
      client.onGetMany(function(data) {
         if (data) {
          $scope.InvoiceDetails = data;

        for (var i = $scope.InvoiceDetails.length - 1; i >= 0; i--) {
          $scope.ID = $scope.InvoiceDetails[i].maxCount;
    };
    $scope.maxID = parseInt($scope.ID)+1;
    $scope.TDCreditNote.creditNoteRefNo = $scope.maxID.toString();
         }
      });
      client.getByFiltering("select maxCount from domainClassAttributes where class='CNote12thdoor'");

      var client = $objectstore.getClient("Settings12thdoor");
      client.onGetMany(function(data) {
         if (data) {
           $scope.Settings = data;
            for (var i =  $scope.Settings.length - 1; i >= 0; i--) {
                
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
                
            };
         }

      
        
        $scope.AllTaxes = $scope.individualTax;
        $scope.UOM = $scope.UnitOfMeasure;
        $scope.CusFields = $scope.cusF;
        $scope.Displaydiscount = $scope.ShowDiscount;
      });
      client.onError(function(data) {
      });
      client.getByFiltering("*");



    //checks whether the use has selected a name or not. if the name is selecter the it enebles the user to edit the customer details
    $scope.selectedItemChange = function(c) {
      $scope.showEditCustomer = true;
    };

    $scope.sortableOptions = {
      containment: '#sortable-container'
    };

    $scope.changeAddress = function() {
      $scope.Billingaddress = !$scope.Billingaddress;
      $scope.Shippingaddress = !$scope.Shippingaddress;
    }

    //Autocomplete to get client details
       $rootScope.self = this;
      $rootScope.self.tenants = loadAll();
      $rootScope.selectedItem1 = null;      
      $rootScope.self.querySearch = querySearch; 
      $rootScope.searchText = null;

      $scope.enter = function(keyEvent) {
               if (keyEvent.which == 40) {
                  if ($rootScope.selectedItem1 === null) {
                     $rootScope.selectedItem1 = query;
                  } else {}
               }
            }
      function querySearch(query) {
         $scope.enter = function(keyEvent) {
               if (keyEvent.which == 40) {
               }
            }
            //Custom Filter
         $rootScope.results = [];
         for (i = 0, len = $rootScope.customerNames.length; i < len; ++i) {
            if ($rootScope.customerNames[i].display.indexOf(query.toLowerCase()) != -1) {
               $rootScope.results.push($rootScope.customerNames[i]);
            }
         }
         return $rootScope.results;
      }
      $rootScope.customerNames = [];
      function loadAll() {
         var client = $objectstore.getClient("contact");
         client.onGetMany(function(data) {
            if (data) {
                
               for (i = 0, len = data.length; i < len; ++i) {
                  $rootScope.customerNames.push({
                     display: data[i].Name.toLowerCase(),
                     value: data[i],
                     BillingAddress: data[i].baddress.street + ', ' + data[i].baddress.city + ', ' + data[i].baddress.zip + ', ' + data[i].baddress.state + ', ' + data[i].baddress.country,
                     ShippingAddress: data[i].saddress.s_street + ', ' + data[i].saddress.s_city + ', ' + data[i].saddress.s_zip + ', ' + data[i].saddress.s_state + ', ' +
                        data[i].saddress.s_country
                  });
               }
            }
         });
         client.onError(function(data) {});
         client.getByFiltering("*");
      }

    //dialog box pop up to add product
    $scope.addproduct = function(ev) {
       $rootScope.AllUnitOfMeasures = [];
       $rootScope.taxType = angular.copy($scope.AllTaxes);
          $rootScope.AllUnitOfMeasures = angular.copy($scope.UOM)
          $rootScope.Showdiscount = angular.copy($scope.Displaydiscount);
          $rootScope.discounts = angular.copy($scope.dis);
          $rootScope.DisplayTaxes =  angular.copy($scope.ShowTaxes);
          //console.log($rootScope.AllUnitOfMeasures.unitsOfMeasurement);
            if($rootScope.Showdiscount == true){
              if($rootScope.discounts == "Individual Items"){
                $rootScope.displayDiscountLine = true;
              }
            }
      $mdDialog.show({

        templateUrl: 'creditNotePartial/addproduct.html',
        targetEvent: ev,
        controller: function addProductController($scope, $mdDialog) {
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
                     creditNoteService.setFullArr({
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
                     if ($rootScope.proName[i].dis.indexOf(query.toLowerCase()) != -1) {
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

    //Delete added products
    $scope.deleteproduct = function(name) {
      creditNoteService.removeArray(name);
    }

    //dialog box pop up to add customer through invoice
    $scope.addCustomer = function() {
        $mdDialog.show({
          templateUrl: 'creditNotePartial/addCustomer.html',
             controller: function DialogController($scope, $mdDialog) {
                  $scope.addTask = "";
                  $scope.email = "";
                  $scope.contact={};
                  $scope.baddress = {};
                  $scope.saddress = {};
                  $scope.showShipping = $scope.showShipping;
                  $scope.showBilling = !$scope.showBilling;

                  $scope.closeDialog = function() {
                     $mdDialog.hide();
                  }
                  $scope.addressChange = function() {
                     $scope.showShipping = !$scope.showShipping;
                     $scope.showBilling = !$scope.showBilling;
                  }
                 $scope.AddCus = function() {
              var client = $objectstore.getClient("contact");
                       client.onComplete(function(data) {
                        $mdDialog.show(
                          $mdDialog.alert()
                          .parent(angular.element(document.body))
                          .content('Customer Registed Successfully Saved.')
                          .ariaLabel('Alert Dialog Demo')
                          .ok('OK')
                          .targetEvent(data)
                         );
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
                           $scope.contact.favoritestar = false;
                           $scope.contact.customerid = "-999";
                           client.insert($scope.contact, {
                            KeyProperty: "customerid"
                     });
                           $rootScope.customerNames.push({
                              display: $scope.contact.Name.toLowerCase(),
                              value: $scope.contact,
                              BillingAddress: $scope.contact.baddress.street + ', ' + $scope.contact.baddress.city + ', ' + $scope.contact.baddress.zip + ', ' + $scope.contact.baddress.state + ', ' + $scope.contact.baddress.country,
                              ShippingAddress: $scope.contact.saddress.s_street + ', ' + $scope.contact.saddress.s_city + ', ' + $scope.contact.saddress.s_zip + ', ' + $scope.contact.saddress.s_state + ', ' +
                              $scope.contact.saddress.s_country
                           });
                              var self = this;
                             for (var i = $rootScope.customerNames.length - 1; i >= 0; i--) {
                               if ($rootScope.customerNames[i].display == $scope.contact.Name ) {
                                 $rootScope.selectedItem1 = $rootScope.customerNames[i];
                               }; 
                             };
                     $mdDialog.hide();
                  }
               }
            })
         }
    $scope.editContact = function() {
      $mdDialog.show({
        templateUrl: 'creditNotePartial/editCustomer.html',
        controller: function DialogController($scope, $mdDialog) {

          $scope.addTask = "";
          $scope.email = "";
          $scope.baddress = {};
          $scope.saddress = {};
          $scope.showShipping = $scope.showShipping;
          $scope.showBilling = !$scope.showBilling;

          $scope.addressChange = function() {
            $scope.showShipping = !$scope.showShipping;
            $scope.showBilling = !$scope.showBilling;
          }
          $scope.closeDialog = function() {
            $mdDialog.hide();
          }

          $scope.editCus = function(cusform) {
            var client = $objectstore.getClient("contact");

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
            client.insert(cusform, {KeyProperty: "customerid"});
            $rootScope.customerNames.splice( $rootScope.customerNames.indexOf($rootScope.selectedItem1), 1 );
                     $rootScope.customerNames.push({
                    display: cusform.Name.toLowerCase(),
                    value: cusform,
                     BillingAddress: cusform.baddress.street + ', ' + cusform.baddress.city + ', ' + cusform.baddress.zip + ', ' + cusform.baddress.state + ', ' + cusform.baddress.country,
                    ShippingAddress: cusform.saddress.s_street + ', ' + cusform.saddress.s_city + ', ' + cusform.saddress.s_zip + ', ' + cusform.saddress.s_state + ', ' +
                   cusform.saddress.s_country
                 });
                    var self = this;
                   for (var i = $rootScope.customerNames.length - 1; i >= 0; i--) {
                     if ($rootScope.customerNames[i].display == cusform.Name ) {
                       $rootScope.selectedItem1 = $rootScope.customerNames[i];
                        $rootScope.selectedItem1.Billingaddress = $rootScope.customerNames[i].Billingaddress;
                        $rootScope.selectedItem1.ShippingAddress = $rootScope.customerNames[i].ShippingAddress;
                     }; 
              };
          }
        }
      })
    }

    //save invoice details
    $scope.submit = function() {
      $scope.imagearray = UploaderService.loadArray();
      console.log($scope.imagearray);
      if ($scope.imagearray.length > 0) {

        for (indexx = 0; indexx < $scope.imagearray.length; indexx++) {
          console.log($scope.imagearray[indexx].name);


          $uploader.upload("45.55.83.253", "creditNoteUploades", $scope.imagearray[indexx]);
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
            $mdToast.show(toast).then(function() {});
          });

        }
      };
      var client = $objectstore.getClient("CNote12thdoor");
      $scope.TDCreditNote.productTB = $rootScope.testArray.val;
      $scope.TDCreditNote.total = $scope.total;
      $scope.TDCreditNote.finalamount = $scope.famount;
      $scope.TDCreditNote.status = "unapplied";
      $scope.TDCreditNote.Name = $rootScope.selectedItem1.display;
      $scope.TDCreditNote.billingAddress = $rootScope.selectedItem1.BillingAddress;
      $scope.TDCreditNote.shippingAddress = $rootScope.selectedItem1.ShippingAddress;
     //$scope.TDCreditNote.InvoiceRefNo = $rootScope.selectedNo.display;
      $scope.TDCreditNote.UploadImages = {val: []};
      $scope.TDCreditNote.UploadImages.val = UploaderService.loadBasicArray();
       $scope.TDCreditNote.commentsAndHistory=[];
         $scope.TDCreditNote.commentsAndHistory.push({
              done: false,
              text: "Credit Note was created by Mr.dddd",
              date:new Date()
         });
          if($rootScope.testArray.val.length >0){
      client.onComplete(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('')
          .content('credit Note Successfully Saved')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
        $rootScope.CNoteArray.splice(0,1);
        creditNoteService.setCNArr($scope.TDCreditNote);
        $state.go('view', {'Cnno': $scope.TDCreditNote.creditNoteRefNo});
      });
       $scope.TDCreditNote.creditNoteNo = "-999";
      client.insert([$scope.TDCreditNote], {KeyProperty: "creditNoteNo"});
       }else {
        $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('')
               .content('add line Item')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK') 
            );
      }
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
      
    }

    $scope.cancelCNote = function(ev){
      var confirm = $mdDialog.confirm()
          .title('Would you like save this to draft?')
          .content('')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('save')
          .cancel('clear');
            $mdDialog.show(confirm).then(function() {

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

        var client = $objectstore.getClient("CNote12thdoorDrafts");

      $scope.TDCreditNote.productTB = $rootScope.testArray.val;
      $scope.TDCreditNote.total = $scope.total;
      $scope.TDCreditNote.finalamount = $scope.famount;
      $scope.TDCreditNote.status = "Draft";
      $scope.TDCreditNote.Name = $rootScope.selectedItem1.display;
      $scope.TDCreditNote.billingAddress = $rootScope.selectedItem1.BillingAddress;
      $scope.TDCreditNote.shippingAddress = $rootScope.selectedItem1.ShippingAddress;
     
     //$scope.TDCreditNote.InvoiceRefNo = $rootScope.selectedNo.display;
      $scope.TDCreditNote.UploadImages = {val: []};
      $scope.TDCreditNote.UploadImages.val = UploaderService.loadBasicArray();
       $scope.TDCreditNote.commentsAndHistory=[];
         $scope.TDCreditNote.commentsAndHistory.push({
              done: false,
              text: "Credit Note was created by Mr.dddd",
              date:new Date()
         });
         client.onComplete(function(data) {
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('')
               .content('invoice Saved to drafts')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
            location.href = '#/app';
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
          $scope.TDCreditNote.creditNoteNo = "-999";
      client.insert([$scope.TDCreditNote], {KeyProperty: "creditNoteNo"});

            }, function() {
               $rootScope.testArray.val = "";
                $rootScope.dateArray.val = "";
                 $scope.total = "";
                 $scope.famount="";
                 $rootScope.selectedItem1.display="";
                 $rootScope.selectedItem1.BillingAddress="";
                 $rootScope.selectedItem1.ShippingAddress="";
                 $scope.dateArray.value="";
                 $rootScope.searchText = null;
                 $scope.TDCreditNote.poNum = "";
                 $scope.TDCreditNote.comments = "";
                 $scope.TDCreditNote.fdiscount = "";
                 $scope.TDCreditNote.salesTax = "";
                 $scope.TDCreditNote.anotherTax = "";
                 $scope.TDCreditNote.shipping = "";
                 $scope.TDCreditNote.notes = "";
                 $scope.TDCreditNote.paymentMethod = "";
                 $scope.TDCreditNote.roFruitNames = "";

                 location.href = '#/invoice_app';
         
            });
    }

    //pops a dialog box to edit or view product
    $scope.viewProduct = function(obj) {
      $mdDialog.show({
        templateUrl: 'creditNotePartial/editproduct.html',
        controller: 'testCtrl',
        locals: {
          item: obj
        }
      });
    }

    //pops a dialog box which enble the user to upload the files
    $scope.upload = function(ev) {
      $mdDialog.show({
        templateUrl: 'creditNotePartial/showUploader.html',
        targetEvent: ev,
        controller: 'UploadCtrl',
        locals: {
          dating: ev
        }
      })
    }

    //pops a dialog box which enble the user to change currency
    $scope.acceptAccount = function(ev, user) {
      $mdDialog.show({
        templateUrl: 'creditNotePartial/changeCurrency.html',
        targetEvent: ev,
        controller: 'AppCtrl'
      })
    }

    $scope.cancel = function() {
      $mdDialog.cancel();
    }

    $rootScope.calculatetotal = function() {     
         $scope.total = 0;
         angular.forEach($rootScope.testArray.val, function(tdIinvoice) {
            $scope.total += parseInt(tdIinvoice.price * tdIinvoice.quantity);
         })
         return $scope.total;
      };
  
      $scope.finaldiscount = function() {
         $scope.finalDisc = 0;
         $scope.Discount = 0;
         if($scope.dis == "SubTotal Items" ){
            $scope.finalDisc = parseInt($scope.total*$scope.TDCreditNote.fdiscount/100)
         }else if ($scope.dis == "Individual Items" ){
            angular.forEach($rootScope.testArray.val, function(tdIinvoice) {
            $scope.Discount +=   parseInt(tdIinvoice.discount);
            $scope.finalDisc = parseInt($scope.total*$scope.Discount/100);
         })
       }
       return $scope.finalDisc;
      }

      $scope.CalculateTax = function() {
         $scope.salesTax=0;
         for (var i = $rootScope.taxArr.length - 1; i >= 0; i--) {
          console.log($rootScope.taxArr[i])
            $scope.salesTax += parseInt($rootScope.taxArr[i].salesTax);
          }
           return $scope.salesTax;
      }
     
      $scope.finalamount = function() {
         $rootScope.famount = 0;
         $rootScope.famount = parseInt($scope.total - $scope.finalDisc)+parseInt($scope.salesTax)+
         parseInt($scope.TDCreditNote.shipping);

         return $rootScope.famount;
      };
    $scope.view = function() {
        location.href = '#/AllcreditNotes';
    }

     $scope.DemoCtrl = function($timeout, $q) {
      var self = this;
      self.readonly = false;
      self.fruitNames = [];
      self.TDCreditNote.roFruitNames = angular.copy(self.fruitNames);
      self.tags = [];

      self.newVeg = function(chip) {
        return {
          name: chip,
          type: 'unknown'
        };
      };
    }
  })
  
  //-------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------
  