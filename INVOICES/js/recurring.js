// angular.module('mainApp')
app.controller('newRecurringCtrl', function($scope, $state, $objectstore, $uploader, $mdDialog, $window, $objectstore, $auth, $timeout, $q, $http, $mdToast, $rootScope, recurringInvoiceService, $filter, $location, UploaderService, MultipleDudtesService) {
      $scope.list = [];
      $scope.TDinvoice = {};
      $scope.invoicDEtails = {};
      $scope.total = 0;
      $scope.product = {};
      $scope.TDinvoice.profileRefName = 'N/A'
      $scope.Showdate = false;
      $scope.TDinvoice.Startdate = new Date();
      $scope.showEditCustomer = false;
      $scope.dueDtaesShow = false;
      $scope.TDinvoice.billingFrequency = "Monthly";
      $scope.TDinvoice.occurences = 0;
      $scope.TDinvoice.fdiscount = 0;
      $scope.TDinvoice.salesTax = 0;
      // $scope.TDinvoice.anotherTax = 0;
      $scope.TDinvoice.shipping = 0;
      $scope.InvoiceDetailss = [];
      $scope.invoicDEtails.shipping = 0;
      $scope.invoicDEtails.fdiscount = 0;
      $scope.invoicDEtails.salesTax = 0;


       var client = $objectstore.getClient("domainClassAttributes");
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
        
        $scope.AllTaxes = [];
       $scope.individualTax = [];
       $scope.UnitOfMeasure = [];
       $scope.CusFields = [];
       $scope.roles = [];
       $scope.permission = [];

var client = $objectstore.getClient("Settings12thdoor");
      client.onGetMany(function(data) {
         if (data) {
           $scope.Settings = data;
            for (var i =  $scope.Settings.length - 1; i >= 0; i--) {
              // $scope.com = $scope.Settings[i].preference.invoicepref.defaultComm;
              $scope.note = $scope.Settings[i].preference.invoicepref.defaultNote;
              $scope.paymentTerm = $scope.Settings[i].preference.invoicepref.defaultPaymentTerms;  
              $scope.dis = $scope.Settings[i].preference.invoicepref.disscountItemsOption;
              $scope.ShippingCharges= $scope.Settings[i].preference.invoicepref.enableshipping;
              //$scope.partialPayment =  $scope.Settings[i].preference.invoicepref.allowPartialPayments;
              $scope.ShowDiscount = $scope.Settings[i].preference.invoicepref.enableDisscounts;
              //$scope.ShowShipAddress = $scope.Settings[i].preference.invoicepref.displayshipaddress;
              $scope.ShowTaxes = $scope.Settings[i].preference.invoicepref.enableTaxes;
              $scope.offlinePayments = $scope.Settings[i].preference.invoicepref.offlinePayments;
              $scope.EmailPermission = $scope.Settings[i].preference.invoicepref.copyadminallinvoices;
              $scope.mail = $scope.Settings[i].profile.adminEmail;


             
              for (var z = $scope.Settings[i].users.roles.length - 1; z >= 0; z--) {
                 $scope.roles.push($scope.Settings[i].users.roles[z].rolename);
                 $scope.permission.push($scope.Settings[i].users.roles[z]) ;  
              };
             console.log($scope.permission);

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
        // $scope.TDinvoice.comments = $scope.com;
        $scope.TDinvoice.notes = $scope.note;
        $scope.TDinvoice.termtype =  $scope.paymentTerm;
        
        //$scope.TDinvoice.DiplayShipiingAddress = $scope.ShowShipAddress;
        //$scope.TDinvoice.allowPartialPayments = $scope.partialPayment;
        $scope.AllTaxes = $scope.individualTax;
        $scope.UOM = $scope.UnitOfMeasure;
        $scope.CusFields = $scope.cusF;
        $scope.Displaydiscount = $scope.ShowDiscount;
          //console.log($scope.TDinvoice.adminEmail)
      });
      client.onError(function(data) {
      });
      client.getByFiltering("*");

     
      if($scope.dis == "SubTotal Items" ){
        checkDiscout = false;
      }

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
        $rootScope.taxType = angular.copy($scope.AllTaxes);
          $rootScope.AllUnitOfMeasures = angular.copy($scope.UOM)
          $rootScope.Showdiscount = angular.copy($scope.Displaydiscount);
          $rootScope.discounts = angular.copy($scope.dis);
          $rootScope.DisplayTaxes =  angular.copy($scope.ShowTaxes);
          // console.log($rootScope.taxType);
            if($rootScope.Showdiscount == true){
              if($rootScope.discounts == "Individual Items"){
                $rootScope.displayDiscountLine = true;
              }
            }
         $mdDialog.show({
            templateUrl: 'Invoicepartials/addproduct.html',
            targetEvent: ev,
            controller: function addProductController($scope, $mdDialog) {
               $scope.prducatsAdd = {};
               $scope.prod = {};
               $scope.promoItems = [];
               //add product to the invoice
              $scope.addproductToarray = function(item,ev) {
                 // console.log(item)
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
                  // console.log($scope.promoItems)
                  // console.log($scope.discount)
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
                     recurringInvoiceService.setFullArr({
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
                      // console.log($scope.promoItems[i].discount)
                      // $rootScope.calculatetotal(); 
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
                        //console.log($rootScope.testArray.val)
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
                    // if(pDis.status == "notavailable"){
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
                     // console.log($scope.Stax);

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


      $scope.contacts = [];
      //dialog box pop up to add customer through invoice
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
                     var client = $objectstore.getClient("contact12thdoor");
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
         // end of Add Contact function
     
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
                      var client = $objectstore.getClient("contact12thdoor");
            client.onComplete(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content('Customer details updated Successfully')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent(data)
                );
            });
            client.onError(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('This is embarracing')
                    .content('There was an error updating the customer details.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent(data)
                );
            });

            client.insert(cusform, {
                KeyProperty: "customerid"})

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
                                  $rootScope.selectedItem1.Billingaddress = $rootScope.customerNames[i].Billingaddress;
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
      function loadAll() {
         var client = $objectstore.getClient("contact12thdoor");
         client.onGetMany(function(data) {
            if (data) {
                $rootScope.customerNames = [];
               for (i = 0, len = data.length; i < len; ++i) {
                  $rootScope.customerNames.push({
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

      $scope.viewRec = function() {
               $state.go('settings.AllRecurring_Invoices');
         }

          $scope.InvoiceDetails1 = [];   
       var client = $objectstore.getClient("domainClassAttributes");
              client.onGetMany(function(data) {
                 if (data) {
                  $scope.InvoiceDetails1 = data;

                for (var i = $scope.InvoiceDetails1.length - 1; i >= 0; i--) {
                  $scope.ID = $scope.InvoiceDetails1[i].maxCount;
            };
            $scope.maxID = parseInt($scope.ID)+1;
            $scope.invoicDEtails.invoiceRefNo = $scope.maxID.toString();
                 }
              });
              client.getByFiltering("select maxCount from domainClassAttributes where class='invoice12thdoor'");

      $scope.ss=[];
      $scope.getPayement = function(pay){
         for (var i = $scope.paymentMethod.length - 1; i >= 0; i--) {
        if(pay ==  $scope.paymentMethod[i].paymentmethod){
          $scope.ss.push({
            sc:$scope.paymentMethod[i].paymentmethod,
            dd:$scope.paymentMethod[i].paymentType
          })
          
          if($scope.paymentMethod[i].paymentType == "Offline"){
          $scope.invoicDEtails.OfflinePaymentDetails = $scope.offlinePayments;
          }
        }
      };
      }

         //save invoice details
      $scope.submit = function() {
        $rootScope.invoiceArray.splice($scope.TDinvoice, 1);
        recurringInvoiceService.setArray1($scope.TDinvoice);

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
          $scope.TDinvoice.finalamount = $rootScope.famount;
         $scope.TDinvoice.discountAmount = $scope.finalDisc;
         $scope.TDinvoice.salesTaxAmount = $scope.salesTax;
          $scope.TDinvoice.otherTaxAmount = $scope.otherTax;
          $scope.TDinvoice.status = "Active";
          $scope.TDinvoice.commentsAndHistory=[];
         $scope.TDinvoice.commentsAndHistory.push({
              done: false,
              text: "Invoice was created by Mr.dddd",
              date:new Date()
         });
         $scope.TDinvoice.favourite = false;
         $scope.TDinvoice.favouriteStarNo = 1;
         $scope.TDinvoice.Name = $rootScope.selectedItem1.display;
         $scope.TDinvoice.Email = $rootScope.selectedItem1.value.Email;
         $scope.TDinvoice.billingAddress = $rootScope.selectedItem1.BillingValue;
         $scope.TDinvoice.shippingAddress = $rootScope.selectedItem1.shippingValue;
         // $scope.TDinvoice.MultiDueDAtesArr = $scope.dateArray.value;
         $scope.TDinvoice.UploadImages = {
            val: []
         };
         
         
         $scope.invoicDEtails.favourite = false;
         $scope.invoicDEtails.favouriteStarNo = 1;
         $scope.invoicDEtails.Name = $rootScope.selectedItem1.display;
         $scope.invoicDEtails.Email = $rootScope.selectedItem1.value.Email;
         $scope.invoicDEtails.billingAddress = $rootScope.selectedItem1.BillingValue;
         $scope.invoicDEtails.shippingAddress = $rootScope.selectedItem1.shippingValue;
         // $scope.invoicDEtails.MultiDueDAtesArr = $scope.dateArray.value;
         $scope.invoicDEtails.UploadImages = {
            val: []
         };
          $scope.invoicDEtails.invoiceProducts = $rootScope.prodArray.val;
         $scope.invoicDEtails.total = $scope.total;
          $scope.invoicDEtails.finalamount = $rootScope.famount;
         $scope.invoicDEtails.discountAmount = $scope.finalDisc;
         $scope.invoicDEtails.salesTaxAmount = $scope.salesTax;
          $scope.invoicDEtails.otherTaxAmount = $scope.otherTax;
          $scope.invoicDEtails.RecurringProfileNo = $scope.TDinvoice.profileRefName;
          $scope.invoicDEtails.paymentMethod = $scope.TDinvoice.paymentMethod;
           $scope.invoicDEtails.comments = $scope.TDinvoice.comments;
           $scope.invoicDEtails.Startdate =  $scope.TDinvoice.Startdate;
           $scope.invoicDEtails.commentsAndHistory=[];
           $scope.invoicDEtails.termtype = "Custom";
           $scope.invoicDEtails.roFruitNames = angular.copy($scope.TDinvoice.roFruitNames);
             $scope.changeDate = angular.copy($scope.TDinvoice.Startdate);

              
         $scope.invoicDEtails.commentsAndHistory.push({
              done: false,
              text: "Invoice was created by Mr.dddd",
              date:new Date()
         });

          if($scope.TDinvoice.saveOption == "saveAsPending"){
          $scope.status = "Pending";
         }else{
          $scope.status = "Unpaid";
         }
         
         $scope.invoicDEtails.MultiDueDAtesArr= [{
                           DueDate: $scope.invoicDEtails.duedate,
                           Percentage: "0",
                           dueDateprice: $rootScope.famount,
                           paymentStatus:$scope.status,
                           balance :$rootScope.famount
                        }];

         

         if($rootScope.prodArray.val.length >0){
         $scope.TDinvoice.UploadImages.val = UploaderService.loadBasicArray();
         client.onComplete(function(data) {
            $state.go('viewProfile', {'profileName': $scope.TDinvoice.profileRefName});
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('')
               .content('profile Successfully Saved')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
         });
         $scope.TDinvoice.profileName = "-999";
         client.insert([$scope.TDinvoice], {
            KeyProperty: "profileName"
         });

         $scope.invoicCount = parseInt($scope.TDinvoice.occurences);
          $scope.invoDetails = [];
          $scope.invoicDEtails.invoiceNo = "-999";
          $scope.tryLogic = angular.copy($scope.invoicDEtails);

          for (var i = $scope.invoicCount- 1; i >= 0; i--) {
            $scope.invoicDEtails = {};
            $scope.invoicDEtails = angular.copy($scope.tryLogic);

            switch($scope.TDinvoice.billingFrequency) {
                    case "weekly":
                        $scope.sevenDays = $scope.changeDate;
                        $scope.sevenDays.setDate($scope.sevenDays.getDate() + 7);
                        $scope.invoicDEtails.duedate = $scope.sevenDays;
                        break;
                    case "2weeks":
                        $scope.twoWeeks= $scope.changeDate;
                        $scope.twoWeeks.setDate($scope.twoWeeks.getDate() + 14);
                        $scope.invoicDEtails.duedate = $scope.twoWeeks;
                        break;
                    case "4weeks":
                        $scope.fourWeeks= $scope.changeDate;
                        $scope.fourWeeks.setDate($scope.fourWeeks.getDate() + 28);
                        $scope.invoicDEtails.duedate = $scope.fourWeeks;
                        break;
                    case "Monthly":
                        var now = $scope.changeDate;
                          current = new Date(now.getFullYear(), now.getMonth()+1, now.getDate());
                        $scope.invoicDEtails.duedate = current;
                        break;
                    case "2Months":
                         var now = $scope.changeDate;
                          current = new Date(now.getFullYear(), now.getMonth()+2, now.getDate());
                        $scope.invoicDEtails.duedate = current;
                        break;
                    case "3Months":
                         var now = $scope.changeDate;
                          current = new Date(now.getFullYear(), now.getMonth()+3, now.getDate());
                        $scope.invoicDEtails.duedate = current;
                        break;
                    case "6Months":
                        var now = $scope.changeDate;
                        current = new Date(now.getFullYear(), now.getMonth()+6, now.getDate());
                        $scope.invoicDEtails.duedate = current;
                        break;
                    case "Yearly":
                        var now =$scope.changeDate;
                          current = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
                        $scope.invoicDEtails.duedate = current;
                        break;
                    case "2Years":
                         var now = $scope.changeDate;
                          current = new Date(now.getFullYear()+2, now.getMonth(), now.getDate());
                        $scope.invoicDEtails.duedate = current;
                        break;
                    case "3Years":
                         var now = $scope.changeDate;
                          current = new Date(now.getFullYear()+3, now.getMonth(), now.getDate());
                        $scope.invoicDEtails.duedate = current;
                        
                        break;
                    default:
                }
                $scope.invoDetails.push($scope.invoicDEtails)
                $scope.changeDate = $scope.invoicDEtails.duedate;
          };

        var invo = $objectstore.getClient("invoice12thdoor");
        invo.onComplete(function(data){
            console.log("Successfully  invoice saved")
        });
        invo.onError(function(data){
            console.log("error saving invoice")
        });
        invo.insertMultiple($scope.invoDetails,"invoiceNo");
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
                  });
               });
            }
         };

         var client = $objectstore.getClient("twethdoorProfileDraft");
         $scope.TDinvoice.recurringProducts = $rootScope.prodArray.val;
         $scope.TDinvoice.total = $scope.total;
         $scope.TDinvoice.finalamount = $scope.famount;
         $scope.TDinvoice.discountAmount = $scope.finalDisc;
         $scope.TDinvoice.salesTaxAmount = $scope.salesTax;
         $scope.TDinvoice.otherTaxAmount = $scope.otherTax;
         $scope.TDinvoice.status = "Draft";
         $scope.TDinvoice.Name = $rootScope.selectedItem1.display;
         $scope.TDinvoice.billingAddress = $rootScope.selectedItem1.BillingValue;
         $scope.TDinvoice.shippingAddress = $rootScope.selectedItem1.shippingValue;
        
         $scope.TDinvoice.UploadImages = {val: []};
         $scope.TDinvoice.UploadImages.val = UploaderService.loadBasicArray();
         
         client.onComplete(function(data) {
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('')
               .content('recurring profile Saved to drafts')
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
          $scope.TDinvoice.profileName = "-999";
         client.insert([$scope.TDinvoice], {
            KeyProperty: "profileName"
         });

            }, function() {
               $rootScope.prodArray.val = "";
                $rootScope.dateArray.value = "";
                 $scope.total = "";
                 $scope.famount="";
                 $scope.dateArray.value="";
                 $scope.TDinvoice.poNum = "";
                 $scope.TDinvoice.comments = "";
                 $scope.TDinvoice.fdiscount = "";
                 $scope.TDinvoice.salesTax = "";
                 $scope.TDinvoice.shipping = "";
                 $scope.TDinvoice.notes = "";
                 $scope.TDinvoice.paymentMethod = "";
                 $scope.TDinvoice.roFruitNames = "";
                 $scope.TDinvoice.saveOption = "";
                 $scope.TDinvoice.billingFrequency = "";
                 $scope.TDinvoice.Startdate = "";
                 $scope.TDinvoice.occurences = "";
                 $scope.TDinvoice.inNote = "";
                  $scope.TDinvoice.inNote = "";
                  $rootScope.selectedItem1.display ="";
                 $rootScope.selectedItem1.BillingValue="";
                 $rootScope.selectedItem1.shippingValue="";
                 $rootScope.searchText = null;
                 
                 //location.href = '#/AllRecurring_Invoices';
                  $state.go('settings.AllRecurring_Invoices');
         
            });
      }
   
      $rootScope.calculatetotal = function() {     
         $scope.total = 0;
         angular.forEach($rootScope.prodArray.val, function(tdIinvoice) {
            $scope.total += parseInt(tdIinvoice.price * tdIinvoice.quantity);
         })
         return $scope.total;
      };
  
      $scope.finaldiscount = function() {
         $scope.finalDisc = 0;
         $scope.Discount = 0;
         if($scope.dis == "SubTotal Items" ){
            $scope.finalDisc = parseInt($scope.total*$scope.TDinvoice.fdiscount/100)
         }else if ($scope.dis == "Individual Items" ){
            angular.forEach($rootScope.prodArray.val, function(tdIinvoice) {
            $scope.Discount +=   parseInt(tdIinvoice.discount);
            $scope.finalDisc = parseInt($scope.total*$scope.Discount/100);
         })
       }
       return $scope.finalDisc;
      }

      $scope.CalculateTax = function() {
         $scope.salesTax=0;
         for (var i = $rootScope.taxArr.length - 1; i >= 0; i--) {
            $scope.salesTax += parseInt($rootScope.taxArr[i].salesTax);
          }
           return $scope.salesTax;
       
      }
     
      $scope.finalamount = function() {
         $rootScope.famount = 0;
         $rootScope.famount = parseInt($scope.total - $scope.finalDisc)+parseInt($scope.salesTax)+
         parseInt($scope.TDinvoice.shipping);

         return $rootScope.famount;
         console.log($rootScope.famount)
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
   });
//-------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------
 
 app.controller('productCtrl', function($scope, $mdDialog, $rootScope, recurringInvoiceService, item) {
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