angular.module('mainApp')
.controller('newRecurringCtrl', function($scope, $state, $objectstore, $uploader, $mdDialog, mfbDefaultValues, $window, $objectstore, $auth, $timeout, $q, $http, $mdToast, $rootScope, recurringInvoiceService, $filter, $location, UploaderService, MultipleDudtesService) {
      $scope.list = [];
      $scope.TDinvoice = {};
      $scope.total = 0;
      $scope.product = {};
      $scope.TDinvoice.profileRefName = 'N/A'
      $scope.Showdate = false;
      $scope.TDinvoice.Startdate = new Date();
      $scope.showEditCustomer = false;
      $scope.dueDtaesShow = false;
      $scope.TDinvoice.billingFrequency = "Monthly"
      $scope.TDinvoice.fdiscount = 0;
      $scope.TDinvoice.salesTax = 0;
      $scope.TDinvoice.anotherTax = 0;
      $scope.TDinvoice.shipping = 0;

         $scope.$watch("ShippingSwitch", function() {
      if($scope.ShippingSwitch == true){
         $scope.shipping = false;
      }
      else{
          $scope.shipping = true;
      }
   });

      $scope.InvoiceDetailss = [];

       var client = $objectstore.getClient("RecurringProfile");
              client.onGetMany(function(data) {
                 if (data) {
                  $scope.InvoiceDetailss = data;
                   //console.log(data);
                for (var i = $scope.InvoiceDetailss.length - 1; i >= 0; i--) {
                  $scope.ID = $scope.InvoiceDetailss[i].maxCount;
            };
            $scope.maxID = parseInt($scope.ID)+1;
           
            $scope.TDinvoice.profileRefName = $scope.maxID.toString();
             
                 }
              });
              client.getByFiltering("select maxCount from domainClassAttributes where class='RecurringProfile'");


     // $scope.invoiceProducts =  $scope.prodArray.val;
      //checks whether the use has selected a name or not. if the name is selecter the it enebles the user to edit the customer details
      $scope.selectedItemChange = function(c) {
         $scope.showEditCustomer = true;
      };
      //check whether the the user select the dudate. if the use enters a due date the payment type will be change to custom
      $scope.$watch("TDinvoice.duedate", function() {
         if ($scope.TDinvoice.duedate != null) {
            $scope.TDinvoice.termtype = "Custom";
         }
      });
      $scope.sortableOptions = {
         containment: '#sortable-container'
      };
      //pops a dialog box to edit or view product
      $scope.viewProduct = function(obj) {
            $mdDialog.show({
               templateUrl: 'Invoicepartials/showproduct.html',
               controller: 'productCtrl',
               locals: {
                  item: obj
               }
            });
         }
         //pops a dialog box which enble the user to upload the files
      $scope.upload = function(ev) {
            $mdDialog.show({
               templateUrl: 'Invoicepartials/showUploader.html',
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
               templateUrl: 'Invoicepartials/changeCurrency.html',
               targetEvent: ev,
               controller: 'AppCtrl'
            })
         }
      
         //Delete added products
      $scope.deleteproduct = function(name) {
            recurringInvoiceService.removeArray(name);
         }
         //dialog box pop up to add product
      $scope.addproduct = function(ev) {
         $mdDialog.show({
            templateUrl: 'Invoicepartials/addproduct.html',
            targetEvent: ev,
            controller: function addProductController($scope, $mdDialog) {
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
                     recurringInvoiceService.setArray({
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
                       }
                       $scope.prod.ProductCategory = "Product";
                       $scope.prod.progressshow = "false"
                       $scope.prod.favouriteStar = false;
                       $scope.prod.favouriteStarNo = 1;
                       $scope.prod.todaydate = new Date();
                       $scope.prod.UploadImages = {val: []};
                       $scope.prod.UploadBrochure = {val: []};
                         var client = $objectstore.getClient("12thproduct");
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
                         $scope.prod.ProductCode = "-999";
                         client.insert([$scope.prod], {
                            KeyProperty: "ProductCode"
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

                  var client = $objectstore.getClient("12thproduct");
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
                     var client = $objectstore.getClient("12thproduct");
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


      $scope.contacts = [];
      //dialog box pop up to add customer through invoice
      $scope.addCustomer = function() {
            $mdDialog.show({
               templateUrl: 'Invoicepartials/addCustomer.html',
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
                           .title('')
                           .content('Customer Successfully Saved')
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
                           .content('Error saving Customer')
                           .ariaLabel('Alert Dialog Demo')
                           .ok('OK')
                           .targetEvent(data)
                        );
                     });
                     $scope.contact.customerid = "-999";
                     client.insert([$scope.contact], {
                        KeyProperty: "customerid"
                     });
                     $rootScope.customerNames.push({
                              display: $scope.contact.Name.toLowerCase(),
                              value: $scope.contact,
                              BillingValue: $scope.contact.baddress.street + ', ' + $scope.contact.baddress.city + ', ' + $scope.contact.baddress.zip + ', ' + $scope.contact.baddress.state + ', ' + $scope.contact.baddress.country,
                              shippingValue: $scope.contact.saddress.s_street + ', ' + $scope.contact.saddress.s_city + ', ' + $scope.contact.saddress.s_zip + ', ' + $scope.contact.saddress.s_state + ', ' +
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
               templateUrl: 'Invoicepartials/editCustomer.html',
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
                     client.onError(function(data) {});
                     client.insert(cusform, {KeyProperty: "customerid"});
                     $rootScope.customerNames.splice( $rootScope.customerNames.indexOf($rootScope.selectedItem1), 1 );
                     $rootScope.customerNames.push({
                              display: cusform.Name.toLowerCase(),
                              value: cusform,
                              BillingValue: cusform.baddress.street + ', ' + cusform.baddress.city + ', ' + cusform.baddress.zip + ', ' + cusform.baddress.state + ', ' + cusform.baddress.country,
                              shippingValue: cusform.saddress.s_street + ', ' + cusform.saddress.s_city + ', ' + cusform.saddress.s_zip + ', ' + cusform.saddress.s_state + ', ' +
                             cusform.saddress.s_country
                           });
                           
                              var self = this;
                             for (var i = $rootScope.customerNames.length - 1; i >= 0; i--) {
                               if ($rootScope.customerNames[i].display == cusform.Name ) {
                                 $rootScope.selectedItem1 = $rootScope.customerNames[i];
                                  $rootScope.selectedItem1.Billingaddress = $rootScope.customerNames.Billingaddress;
                               }; 
                        };
                  }
               }
            })
         }

      //Autocomplete to get client details
      $rootScope.self = this;
      $rootScope.self.tenants = loadAll();
      $rootScope.selectedItem1 = null;
      $rootScope.self.searchText = null;
      $rootScope.self.querySearch = querySearch;

      function querySearch(query) {
         $scope.enter = function(keyEvent) {
               if (keyEvent.which === 13) {
                  if ($rootScope.selectedItem1 === null) {
                     $rootScope.selectedItem1 = query;
                  } else {}
               }
            }
            //Custom Filter
         $rootScope.results = [];
         for (i = 0, len = $scope.customerNames.length; i < len; ++i) {
            if ($scope.customerNames[i].display.indexOf(query) != -1) {
               $rootScope.results.push($scope.customerNames[i]);
            }
         }
         return $rootScope.results;
      }
      $scope.customerNames = [];

      function loadAll() {
         var client = $objectstore.getClient("contact");
         client.onGetMany(function(data) {
            if (data) {
               // $scope.contact =data;
               for (i = 0, len = data.length; i < len; ++i) {
                  $scope.customerNames.push({
                     display: data[i].Name.toLowerCase(),
                     value: data[i],
                     BillingValue: data[i].baddress.street + ', ' + data[i].baddress.city + ', ' + data[i].baddress.zip + ', ' + data[i].baddress.state + ', ' + data[i].baddress.country,
                     shippingValue: data[i].saddress.s_street + ', ' + data[i].saddress.s_city + ', ' + data[i].saddress.s_zip + ', ' + data[i].saddress.s_state + ', ' +
                        data[i].saddress.s_country
                  });
               }
            }
         });
         client.onError(function(data) {});
         client.getByFiltering("*");
      }

      $scope.Billingaddress = true;
      $scope.Shippingaddress = false;

      $scope.changeAddress = function() {
         $scope.Billingaddress = !$scope.Billingaddress;
         $scope.Shippingaddress = !$scope.Shippingaddress;
      }
      $scope.cancel = function() {
         $mdDialog.cancel();
      }
      $scope.saveProduct = function() {
         var client = $objectstore.getClient("12thproduct");
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
         $scope.tdIinvoice.product_code = "-999";
         client.insert([$scope.tdIinvoice], {
            KeyProperty: "product_code"
         });
      }
     
      $scope.productCode = [];
      //Retrieve product details
      var client = $objectstore.getClient("12thproduct");
      client.onGetMany(function(data) {
         if (data) {
            $scope.product = data;
            return $scope.product;
         }
      });
      client.onError(function(data) {
         $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .title('Sorry')
            .content('There is no products available')
            .ariaLabel('Alert Dialog Demo')
            .ok('OK')
            .targetEvent(data)
         );
      });
      client.getByFiltering("*");

      $scope.viewRec = function() {
               location.href = '#/settings/AllRecurring_Invoices';
         }
         //save invoice details
      $scope.submit = function() {
          $rootScope.invoiceArray.splice($scope.TDinvoice, 1);
        recurringInvoiceService.setArray1($scope.TDinvoice);
        console.log($rootScope.invoiceArray);

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
         var client = $objectstore.getClient("RecurringProfile");
         $scope.TDinvoice.recurringProducts = $rootScope.prodArray.val;
         $scope.TDinvoice.total = $scope.total;
          $scope.TDinvoice.finalamount = $scope.famount;
         $scope.TDinvoice.discountAmount = $scope.finalDisc;
         $scope.TDinvoice.salesTaxAmount = $scope.salesTax;
          $scope.TDinvoice.otherTaxAmount = $scope.otherTax;
          $scope.TDinvoice.status = "Active";
         $scope.TDinvoice.favourite = false;
         $scope.TDinvoice.favouriteStarNo = 1;
         $scope.TDinvoice.Name = $rootScope.selectedItem1.display;
         $scope.TDinvoice.Email = $rootScope.selectedItem1.value.Email;
         $scope.TDinvoice.billingAddress = $rootScope.selectedItem1.BillingValue;
         $scope.TDinvoice.shippingAddress = $rootScope.selectedItem1.shippingValue;
         $scope.TDinvoice.MultiDueDAtesArr = $scope.dateArray.value;
         $scope.TDinvoice.UploadImages = {
            val: []
         };

         if($rootScope.prodArray.val.length >0){
         $scope.TDinvoice.UploadImages.val = UploaderService.loadBasicArray();
         client.onComplete(function(data) {
            $state.go('viewProfile', {'profileName': $scope.TDinvoice.profileRefName});
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('')
               .content('invoioce Successfully Saved')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
         });
         $scope.TDinvoice.profileName = "-999";
         client.insert([$scope.TDinvoice], {
            KeyProperty: "profileName"
         });

      }else{
         
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
               .content('Error saving invoioce')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
         });
      
         
      }

      $scope.cancelrec = function(ev){
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
                     //whatever
                  });
               });
            }
         };

         var client = $objectstore.getClient("twethdoorProfileDraft");
         $scope.TDinvoice.invoiceProducts = $rootScope.prodArray.val;
         $scope.TDinvoice.total = $scope.total;
         $scope.TDinvoice.finalamount = $scope.famount;
         $scope.TDinvoice.status = "Draft";
         $scope.TDinvoice.Name = $rootScope.selectedItem1.display;
         $scope.TDinvoice.billingAddress = $rootScope.selectedItem1.BillingValue;
         $scope.TDinvoice.shippingAddress = $rootScope.selectedItem1.shippingValue;
        
         $scope.TDinvoice.UploadImages = {
            val: []
         };
         $scope.TDinvoice.UploadImages.val = UploaderService.loadBasicArray();
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
          $scope.TDinvoice.invoiceNo = "-999";
         client.insert([$scope.TDinvoice], {
            KeyProperty: "invoiceNo"
         });

            }, function() {
               $rootScope.testArray.val = "";
                $rootScope.dateArray.value = "";
                 $scope.total = "";
                 $scope.famount="";
                 $rootScope.selectedItem1.display="";
                 $rootScope.selectedItem1.BillingValue="";
                 $rootScope.selectedItem1.shippingValue="";
                 $scope.dateArray.value="";
                 $rootScope.searchText = null;
                 $scope.TDinvoice.poNum = "";
                 $scope.TDinvoice.comments = "";
                 $scope.TDinvoice.fdiscount = "";
                 $scope.TDinvoice.salesTax = "";
                 $scope.TDinvoice.anotherTax = "";
                 $scope.TDinvoice.shipping = "";
                 $scope.TDinvoice.notes = "";
                 $scope.TDinvoice.paymentMethod = "";
                 $scope.TDinvoice.roFruitNames = "";

                 location.href = '#/AllRecurring_Invoices';
         
            });
      }
   
      $scope.calculatetotal = function() {
         $scope.total = 0;
         angular.forEach($rootScope.prodArray.val, function(tdIinvoice) {
            $scope.total += (tdIinvoice.price * tdIinvoice.quantity) ;
         })
         return $scope.total;
      };
      $scope.finaldiscount = function() {
         $scope.finalDisc = 0;
         $scope.Discount = 0;
          angular.forEach($rootScope.prodArray.val, function(tdIinvoice) {
            $scope.Discount +=   parseInt(tdIinvoice.discount);
            $scope.finalDisc = parseInt($scope.total*$scope.Discount/100);
         })
         return $scope.finalDisc;
      }
      $scope.CalculateTax = function() {
         $scope.salesTax = 0;
         angular.forEach($rootScope.prodArray.val, function(tdIinvoice) {
            $scope.salesTax += parseInt($scope.total*tdIinvoice.tax/100);
         })
         return $scope.salesTax;
      }
      $scope.CalculateOtherTax = function() {
         $scope.otherTax = 0;
         $scope.otherTax = ($scope.total * $scope.TDinvoice.anotherTax / 100);
         return $scope.otherTax;
      }
      $scope.TDinvoice.shipping = 0;
      $scope.finalamount = function() {
         $rootScope.famount = 0;
         $rootScope.famount = parseInt($scope.total - $scope.finalDisc)+
          parseInt($scope.salesTax)+parseInt($scope.otherTax)+parseInt($scope.TDinvoice.shipping);
         return $rootScope.famount;
      };
      var client = $objectstore.getClient("contact");
      client.onGetMany(function(data) {
         if (data) {
            $scope.contact = data;
            return $scope.contact;
         }
      });
      client.onError(function(data) {
         $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .title('Sorry')
            .content('There is no products available')
            .ariaLabel('Alert Dialog Demo')
            .ok('OK')
            .targetEvent(data)
         );
      });
      client.getByFiltering("*");
      $scope.DemoCtrl = function($timeout, $q) {
         var self = this;
         self.readonly = false;
         self.fruitNames = [];
         self.TDinvoice.roFruitNames = angular.copy(self.fruitNames);
         self.tags = [];
         self.newVeg = function(chip) {
            return {
               name: chip,
               type: 'unknown'
            };
         };
      }
   })
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
 
 .controller('productCtrl', function($scope, $mdDialog, $rootScope, recurringInvoiceService, item) {
      $scope.test = item;
      $scope.cancel = function() {
         $mdDialog.cancel();
      };
      $scope.edit = function() {
         $mdDialog.cancel();
      };
      $scope.calAMount = function() {
         $scope.Amount = 0;
         $scope.Amount = (((item.price * item.quantity) - ((item.price * item.quantity) * item.discount / 100)) + ((item.price * item.quantity)) * item.tax / 100);
         return $scope.Amount;
      }
   })