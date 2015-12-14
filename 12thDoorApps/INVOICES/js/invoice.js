angular
   .module('mainApp', ['ngMaterial', 'directivelibrary','12thdirective', 'uiMicrokernel', 'ui.router', 'ui.sortable'])
   .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');
   })
   .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/settings/invoice_app');
      $stateProvider
         .state('settings', {
            url: '/settings',
            templateUrl: 'Invoicepartials/settings.html',
            controller: 'viewCtrl'
         })
         .state('settings.invoice_app', {
            url: '/invoice_app',
            templateUrl: 'Invoicepartials/AllInvoicePartial.html',
            controller: 'viewCtrl'
         })
         .state('app', {
            url: '/NewInvoice_app',
            templateUrl: 'Invoicepartials/NewInvoice.html',
            controller: 'AppCtrl'
         })
         .state('view', {
            url: '/viewInvoice/INo=:invoiceno',
            templateUrl: 'Invoicepartials/viewInvoice.html',
            controller: 'viewCtrl'
         })
         .state('contactView', {
            url: '/contactView/INo=:invoiceno',
            templateUrl: 'Invoicepartials/suplierInterface.html',
            controller: 'viewCtrl'
          })
         .state('settings.AllRecurring_Invoices', {
            url: '/AllRecurring_Invoices',
            templateUrl: 'Invoicepartials/AllRecurringInvoices.html',
            controller: 'ViewRecurring'
         })
         .state('NewRecurring_profile', {
            url: '/NewRecurring_profile',
            templateUrl: 'Invoicepartials/NewRecurringProfile.html',
            controller: 'newRecurringCtrl'
         })
         .state('edit', {
             url: '/editInvoiceDetails/INo=:invoiceno',
            templateUrl: 'Invoicepartials/editInvoice.html',
            controller: 'editCtrl'
            //params:['invoice']
         })

         .state('copy',{
            url: '/copyInvoiceDetails',
            templateUrl: 'Invoicepartials/editInvoice.html',
            controller: 'editCtrl'
         })

         .state('estimateInvoice',{
            url: '/estimateInvoice/IName=:cusName',
            templateUrl: 'Invoicepartials/editInvoice.html',
            controller: 'estimateCtrl'
         })
         .state('ediTRec',{
            url: '/EditRecurringDetails/RecNO=:profilename',
            templateUrl: 'Invoicepartials/editRecurring.html',
            controller: 'editRecurring'
         })
          .state('CopyRec',{
            url: '/copyRecurringProfile',
            templateUrl: 'Invoicepartials/editRecurring.html',
            controller: 'editRecurring'
         })
         .state('viewProfile', {
             url: '/viewRecurringProfile/RecNO=:profileName',
            templateUrl: 'Invoicepartials/viewRecurringProfile.html',
            controller: 'ViewRecurring'
            //params:['invoice']
         })
   })

//------------APPCtrl starts--------------------------------------------------------------------------------------------------------
   .controller('AppCtrl', function($scope, $objectstore, $uploader,$state, $mdDialog , InvoiceService, invoiceDetails,$window, $objectstore, $auth, $timeout, $q, $http, $mdToast, $rootScope, InvoiceService, $filter, $location, UploaderService, MultipleDudtesService) {
      
      $scope.list = [];
      $scope.TDinvoice = {};
      $scope.Settings = {};
      $scope.total = 0;
      $scope.product = {};
      $scope.TDinvoice.invoiceRefNo = 'N/A';
      $scope.showdate = false;
      // $scope.TDinvoice.termtype = "7days";
      $scope.TDinvoice.Startdate = new Date();
      $scope.showEditCustomer = false;
      $scope.dueDtaesShow = false;
       // $scope.displayshipaddress = true;
       $scope.totalSection = false;
      $scope.ShippingSwitch = false;
      $scope.TDinvoice.fdiscount = 0;
      $scope.TDinvoice.salesTax = 0;
      $scope.TDinvoice.anotherTax = 0;
      $scope.TDinvoice.shipping = 0;
       $scope.AllTaxes = [];
       $scope.individualTax = [];
       $scope.UnitOfMeasure = [];
       $scope.CusFields = [];

       // if($rootScope.testArray.val.length > index && $rootScope.testArray.val[0] !== null){
       //  $scope.totalSection = false;
       // }

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
               
               $scope.cusF = $scope.Settings[i].preference.invoicepref.CusFiel

               for (var x = $scope.Settings[i].taxes.individualtaxes.length - 1; x >= 0; x--) {
                 
                 $scope.individualTax.push($scope.Settings[i].taxes.individualtaxes[x]);
                 // console.log($scope.individualTax );
               };
               for (var y = $scope.Settings[i].taxes.multipletaxgroup.length - 1; y >= 0; y--) {
                $scope.individualTax.push($scope.Settings[i].taxes.multipletaxgroup[y]); 
                 // console.log($scope.multiTax);
               };
                for (var z = $scope.Settings[i].preference.productpref.units.length - 1; z >= 0; z--) {
                  $scope.UnitOfMeasure.push($scope.Settings[i].preference.productpref.units[z])
                };
                
            };
         }
        $scope.TDinvoice.comments = $scope.com;
        $scope.TDinvoice.notes = $scope.note;
        $scope.TDinvoice.termtype =  $scope.paymentTerm;
        $scope.TDinvoice.allowPartialPayments = $scope.partialPayment;
       $scope.AllTaxes = $scope.individualTax;
        $scope.UOM = $scope.UnitOfMeasure;
        $scope.CusFields = $scope.cusF;
        $scope.Displaydiscount = $scope.ShowDiscount;
        
          console.log($scope.ShowDiscount);
      });
      client.onError(function(data) {
      });
      client.getByFiltering("*");

      if($scope.dis == "SubTotal Items" ){
        checkDiscout = false;
      }
      
      $scope.selectedItemChange = function(c) {
         $scope.showEditCustomer = true;
      };
     
      //check whether the the user select the dudate. if the user enters a due date the payment type will be change to custom
      $scope.$watch("TDinvoice.duedate", function() {
        

         if ($scope.TDinvoice.duedate != null && $scope.TDinvoice.termtype==null) {
            $scope.Settings[i].preference.invoicepref.defaultPaymentTerms = "Custom";
         }
         else if($scope.TDinvoice.duedate != null && $scope.TDinvoice.duedate != $scope.sevenDays && 
            $scope.TDinvoice.duedate != $scope.fourteendays && $scope.TDinvoice.duedate != $scope.twentyOneDays &&
             $scope.TDinvoice.duedate != $scope.thirtyDays && $scope.TDinvoice.duedate != $scope.fourtyFiveDays &&
             $scope.TDinvoice.duedate != $scope.sixtyDays && $scope.TDinvoice.duedate != $scope.dueOnReceiptDay&&
              $scope.TDinvoice.duedate != $scope.ninetyDays){
            $scope.TDinvoice.termtype = "Custom";
         }

      });

//----------set date according to the payment term type----------------------------
     $scope.$watch("TDinvoice.termtype", function() {
         if ($scope.TDinvoice.termtype == "DueonReceipt") {
            $scope.dueOnReceiptDay = new Date();
            $scope.TDinvoice.duedate = $scope.dueOnReceiptDay;
            $scope.showdate = false;
         }
     });

      $scope.$watch("TDinvoice.termtype", function() {
         if ($scope.TDinvoice.termtype == "Net 7 days") {
             $scope.sevenDays= new Date();
            $scope.sevenDays.setDate($scope.sevenDays.getDate() + 7);
            $scope.TDinvoice.duedate =$scope.sevenDays;
            $scope.showdate = false;
         }
      });

       $scope.$watch("TDinvoice.termtype", function() {
         if ($scope.TDinvoice.termtype == "Net 14 days") {
            $scope.fourteendays = new Date();
            $scope.fourteendays.setDate($scope.fourteendays.getDate() + 14);
            $scope.TDinvoice.duedate = $scope.fourteendays;
            $scope.showdate = false;
         }
      });

        $scope.$watch("TDinvoice.termtype", function() {
         if ($scope.TDinvoice.termtype == "Net 21 days") {
            $scope.twentyOneDays = new Date();
            $scope.twentyOneDays.setDate($scope.twentyOneDays.getDate() + 21);
            $scope.TDinvoice.duedate = $scope.twentyOneDays;
            $scope.showdate = false;
         }
      });

        $scope.$watch("TDinvoice.termtype", function() {
         if ($scope.TDinvoice.termtype == "Net 30 days") {
            $scope.thirtyDays = new Date();
            $scope.thirtyDays.setDate($scope.thirtyDays.getDate() + 30);
            $scope.TDinvoice.duedate = $scope.thirtyDays;
            $scope.showdate = false;
         }
      });

        $scope.$watch("TDinvoice.termtype", function() {
         if ($scope.TDinvoice.termtype == "Net 45 days") {
            $scope.fourtyFiveDays = new Date();
            $scope.fourtyFiveDays.setDate($scope.fourtyFiveDays.getDate() + 45);
            $scope.TDinvoice.duedate = $scope.fourtyFiveDays;
            $scope.showdate = false;
         }
      });

        $scope.$watch("TDinvoice.termtype", function() {
         if ($scope.TDinvoice.termtype == "Net 60 days") {
            $scope.sixtyDays = new Date();
            $scope.sixtyDays.setDate($scope.sixtyDays.getDate() + 60);
            $scope.TDinvoice.duedate = $scope.sixtyDays;
            $scope.showdate = false;
         }
      });
        $scope.$watch("TDinvoice.termtype", function() {
         if ($scope.TDinvoice.termtype == "Net 90 days") {
            $scope.ninetyDays = new Date();
            $scope.ninetyDays.setDate($scope.ninetyDays.getDate() + 90);
            $scope.TDinvoice.duedate = $scope.ninetyDays;
            $scope.showdate = false;
         }
      });
         $scope.$watch("TDinvoice.termtype", function() {
         if ($scope.TDinvoice.termtype == "multipleDueDates") {
            $scope.showdate = true;
         }
      });
         
//-------------------------------------------------------------------------------------

      $scope.sortableOptions = {
         containment: '#sortable-container'
      };

      //pops a dialog box to edit or view product
      $scope.viewProduct = function(obj) {
            $mdDialog.show({
               templateUrl: 'Invoicepartials/showproduct.html',
               controller: 'testCtrl',
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
         //pops a dialog box which enble the user to add Multiple du dates
      $scope.MultiDuDates = function(data) {
         $scope.showdate = true;
         $scope.TDinvoice.termtype = "multipleDueDates";
          $scope.TDinvoice.duedate = null;

            $mdDialog.show({
               templateUrl: 'Invoicepartials/MultipleDuedates.html',
               controller: function addMultipleDueDates($scope, $mdDialog) {
               $scope.aDatearr = {value:[]};
               $scope.aDatearr = angular.copy($rootScope.dateArray);
               $scope.duePaymenet = $rootScope.famount;
                  $scope.newfamount = angular.copy($rootScope.famount)

                  $scope.testarr = [{
                     duedate: '',
                     percentage: '',
                     duDatePrice:$scope.newfamount,
                     paymentStatus:'Unpaid'
                  }];

                  $scope.dateArray = {
                     value: [{
                        duedate: '',
                        percentage: '',
                        duDatePrice: '',
                        paymentStatus:'Unpaid',
                     }]
                  };

                  $scope.AddDueDates = function() {
                     for (var i = $scope.testarr.length - 1; i >= 0; i--) {
                        MultipleDudtesService.setDateArray({
                           DueDate: $scope.testarr[i].duedate,
                           Percentage: $scope.testarr[i].percentage,
                           dueDateprice: $scope.testarr[i].duDatePrice,
                           paymentStatus:"Unpaid"
                        });
                     };
                     $scope.aDatearr = angular.copy($rootScope.dateArray);

                    $mdDialog.hide();
                  }
                  $scope.addItem = function() {

                     $scope.testarr.push({
                        duedate: '',
                        percentage: '',
                        duDatePrice: parseInt($rootScope.famount-$scope.newfamount),
                        paymentStatus:'Unpaid'
                     });
                     // console.log(parseInt($rootScope.famount-$scope.newfamount));
                  };

                  $scope.rmoveDate = function(index){
                     $scope.aDatearr.value.splice( $scope.aDatearr.value.indexOf(index), 1 );
                  }
                  $scope.removeItem = function(index) {
                      $scope.testarr.splice( $scope.testarr.indexOf(index), 1 );
                  };
                  $scope.cancel = function() {
                      $scope.showdate = false;
                     $mdDialog.cancel();
                  }
                   $scope.duecost = 0;
                   
                  $scope.DueAmount = function(cn,index) {

                    $scope.newfamount =(parseInt($rootScope.famount*cn.percentage)/100);
                     $scope.testarr[index] = { 
                     duedate: cn.duedate,
                     percentage: cn.percentage,
                     duDatePrice :  $scope.newfamount,
                      }
                          return  $scope.newfamount ;
                  }
               }
            })
         }

      //Delete added products
      $scope.deleteproduct = function(name) {
            InvoiceService.removeArray(name);
         }
       
      //dialog box pop up to add product
      $scope.addproduct = function(ev) {

           $rootScope.taxType = angular.copy($scope.AllTaxes);
            $rootScope.AllUnitOfMeasures = angular.copy($scope.UOM)
           $rootScope.Showdiscount == angular.copy($scope.Displaydiscount);
            console.log($scope.Displaydiscount); 
             $rootScope.discount == angular.copy($scope.dis);
            
         $mdDialog.show({
            templateUrl: 'Invoicepartials/addproduct.html',
            targetEvent: ev,
            controller: function addProductController($scope, $mdDialog) {
               $scope.prducatsAdd = {};
               $scope.prod = {};
               $scope.promoItems = [];
                $scope.taxType = [];
               $scope.AllUnitOfMeasures = [];
                console.log($rootScope.Showdiscount);
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
                     InvoiceService.setArray({
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
                       $scope.prod.tags = [];
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
                              $scope.SProductUnit = "each";
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
                    // console.log(pDis.tax);
                    // for (var i =  $rootScope.taxType.length - 1; i >= 0; i--) {
                    //   if(pDis.tax == $rootScope.taxType[i].taxname){
                    //     $scope.percentage = $rootScope.taxType[i].rate;
                        
                    //   }

                    // };
                    
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
                      var client = $objectstore.getClient("contact");
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
            // console.log(cusform)
            //updatedform.customerid = cid;
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
                  // console.log($rootScope.selectedItem1)
               }
            }
      function querySearch(query) {
         $scope.enter = function(keyEvent) {
               if (keyEvent.which == 40) {
                  // console.log($rootScope.selectedItem1)
               }
            }
            //Custom Filter
         $rootScope.results = [];
         for (i = 0, len = $rootScope.customerNames.length; i < len; ++i) {
            if ($rootScope.customerNames[i].display.indexOf(query) != -1) {
               $rootScope.results.push($rootScope.customerNames[i]);
            }
         }
         return $rootScope.results;
      }
      function loadAll() {
         var client = $objectstore.getClient("contact");
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
      
      $scope.view = function() {
               location.href = '#/invoice_app';
         }


      //save invoice details
       $scope.submit = function() {
          // console.log();
         $scope.ProgressBar = {PaymentScheme:"",PaymentSchemeActive:"",PaymentSchemeData:[]};
         $scope.ProgressBar.PaymentScheme = $scope.TDinvoice.termtype;
          $scope.ProgressBar.PaymentSchemeActive= "false";
        
          if($scope.TDinvoice.termtype != "multipleDueDates"){
         $scope.TDinvoice.MultiDueDAtesArr= {
                           DueDate: $scope.TDinvoice.duedate,
                           Percentage: "0",
                           dueDateprice: "0",
                           paymentStatus:'Unpaid'
                        };
        }else{
          $scope.TDinvoice.MultiDueDAtesArr = $rootScope.dateArray.value;
         // console.log($scope.ProgressBar);
        }

 $scope.ProgressBar.PaymentSchemeData.push($rootScope.dateArray.value);

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
         var client = $objectstore.getClient("twelfthdoorInvoice");
         $scope.TDinvoice.ProgressBarDetails = $scope.ProgressBar;
         $scope.TDinvoice.invoiceProducts = $rootScope.testArray.val;
         $scope.TDinvoice.commentsAndHistory=[];
         $scope.TDinvoice.commentsAndHistory.push({
              done: false,
              text: "Invoice was created by Shehana",
              date:new Date()
         });
         $scope.TDinvoice.total = $scope.total;
         $scope.TDinvoice.finalamount = $scope.famount;
         $scope.TDinvoice.discountAmount = $scope.finalDisc;
         $scope.TDinvoice.salesTaxAmount = $scope.salesTax;
         $scope.TDinvoice.otherTaxAmount = $scope.otherTax;
         $scope.TDinvoice.CuSFields = $scope.CusFields;
         $scope.TDinvoice.status = "Unpaid";
         $scope.TDinvoice.favourite = false;
         $scope.TDinvoice.favouriteStarNo = 1;
         $scope.TDinvoice.Name = $rootScope.selectedItem1.display;
         $scope.TDinvoice.Email = $rootScope.selectedItem1.value.Email;
         $scope.TDinvoice.billingAddress = $rootScope.selectedItem1.BillingValue;
         $scope.TDinvoice.shippingAddress = $rootScope.selectedItem1.shippingValue;
         
         $scope.TDinvoice.UploadImages = {
            val: []
         };
        
         $rootScope.invoiceArray.splice(0, 1);
        invoiceDetails.setArray($scope.TDinvoice);
        //console.log($rootScope.invoiceArray);

         if($rootScope.testArray.val.length >0){

         

         $scope.TDinvoice.UploadImages.val = UploaderService.loadBasicArray();
         client.onComplete(function(data) {
          //location.href = '#/viewInvoice';
          $state.go('view', {'invoiceno': $scope.TDinvoice.invoiceRefNo});
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

         $scope.TDinvoice.invoiceNo = "-999";
         client.insert([$scope.TDinvoice], {
            KeyProperty: "invoiceNo"
         });

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
               .content('Error saving invoice')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
         }); 
      }

       $scope.InvoiceDetails = [];
       var client = $objectstore.getClient("twelfthdoorInvoice");
              client.onGetMany(function(data) {
                 if (data) {
                  $scope.InvoiceDetails = data;

                for (var i = $scope.InvoiceDetails.length - 1; i >= 0; i--) {
                  $scope.ID = $scope.InvoiceDetails[i].maxCount;
            };
            $scope.maxID = parseInt($scope.ID)+1;
            $scope.TDinvoice.invoiceRefNo = $scope.maxID.toString();
             
                 }
              });
              client.getByFiltering("select maxCount from domainClassAttributes where class='twelfthdoorInvoice'");

      $scope.calculatetotal = function() {
         $scope.total = 0;
         angular.forEach($rootScope.testArray.val, function(tdIinvoice) {
            $scope.total += parseInt(tdIinvoice.price * tdIinvoice.quantity);
            //(((tdIinvoice.price * tdIinvoice.quantity) - ((tdIinvoice.price * tdIinvoice.quantity) * tdIinvoice.discount / 100)) + ((tdIinvoice.price * tdIinvoice.quantity)) * tdIinvoice.tax / 100);
         })
         return $scope.total;
      };
      $scope.finaldiscount = function() {
         $scope.finalDisc = 0;
         $scope.Discount = 0;

         if($scope.dis == "SubTotal Items" ){
          $scope.finalDisc = parseInt($scope.total*$scope.TDinvoice.fdiscount/100)
       }else{
         angular.forEach($rootScope.testArray.val, function(tdIinvoice) {
            $scope.Discount +=   parseInt(tdIinvoice.discount);
            $scope.finalDisc = parseInt($scope.total*$scope.Discount/100);
         })
         
       }
       
       return $scope.finalDisc;
      }
      $scope.CalculateTax = function() {
         $scope.salesTax = 0;
         // angular.forEach($rootScope.testArray.val, function(tdIinvoice) {
         //    $scope.salesTax += parseInt($scope.total*tdIinvoice.tax/100);
         // })
         return $scope.salesTax;
      }
      $scope.CalculateOtherTax = function() {
         $scope.otherTax = 0;
         $scope.otherTax = ($scope.total * $scope.TDinvoice.anotherTax / 100);
         return $scope.otherTax;
      }
      $scope.finalamount = function() {
         $rootScope.famount = 0;
         $rootScope.famount = parseInt($scope.total - $scope.finalDisc)+
          parseInt($scope.salesTax)+parseInt($scope.otherTax)+parseInt($scope.TDinvoice.shipping);
         return $rootScope.famount;
      };
      
      $scope.DemoCtrl = function($timeout, $q) {
         var self = this;
         self.readonly = false;
         // Lists of tags names and Vegetable objects
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

      $scope.clearAll = function(ev){
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

         var client = $objectstore.getClient("twelfthdoorInvoiceDraft");
         $scope.TDinvoice.invoiceProducts = $rootScope.testArray.val;
         $scope.TDinvoice.total = $scope.total;
         $scope.TDinvoice.finalamount = $scope.famount;
         $scope.TDinvoice.status = "Draft";
         $scope.TDinvoice.Name = $rootScope.selectedItem1.display;
         $scope.TDinvoice.billingAddress = $rootScope.selectedItem1.BillingValue;
         $scope.TDinvoice.shippingAddress = $rootScope.selectedItem1.shippingValue;
         $scope.TDinvoice.MultiDueDAtesArr = $scope.dateArray.value;
        
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

                 location.href = '#/invoice_app';
         
            });
      }
   }) //END OF AppCtrl
   