angular
   .module('mainApp', ['ngMaterial', 'directivelibrary', 'uiMicrokernel', 'ui.router','ngAnimate'])
   .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');
   })
   .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/settings/invoice_app');
      $stateProvider
         .state('settings', {
            url: '/settings',
            templateUrl: 'contact_partial/settings.html',
            controller: 'viewCtrl'
         })
         .state('settings.invoice_app', {
            url: '/invoice_app',
            templateUrl: 'contact_partial/contact_view.html',
            controller: 'viewCtrl'
         })
         .state('app', {
            url: '/NewInvoice_app',
            templateUrl: 'contact_partial/contact_add.html',
            controller: 'AppCtrl'
         })
        
         .state('settings.AllRecurring_Invoices', {
            url: '/AllRecurring_Invoices',
            templateUrl: 'contact_partial/supplier_view.html',
            controller: 'ViewRecurring'
         })
         .state('NewRecurring_profile', {
            url: '/NewRecurring_profile',
            templateUrl: 'contact_partial/supplier_add.html',
            controller: 'newRecurringCtrl'
         })
   })
   .controller('AppCtrl', function($scope, $objectstore, $uploader, $mdDialog, $window, $objectstore, $auth, $timeout, $q, $http, $mdToast, $rootScope, InvoiceService, $filter, $location, UploaderService, MultipleDudtesService) {
      $scope.list = [];
      $scope.TDinvoice = {};
      $scope.total = 0;
      $scope.product = {};
      $scope.TDinvoice.invoiceNo = 'N/A'
      $scope.Showdate = false;
      $scope.TDinvoice.Startdate = $filter("date")(Date.now(), 'yyyy-MM-dd');
      $scope.showEditCustomer = false;
      $scope.dueDtaesShow = false;
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
            $mdDialog.show({
               templateUrl: 'Invoicepartials/MultipleDuedates.html',
               controller: function addMultipleDueDates($scope, $mdDialog) {
                  $scope.testarr = [{
                     duedate: '',
                     percentage: '',
                     duDatePrice: '',
                  }];
                  $scope.dateArray = {
                     value: [{
                        duedate: '',
                        percentage: '',
                        duDatePrice: '',
                     }]
                  };
                  $scope.AddDueDates = function() {
                     for (var i = $scope.testarr.length - 1; i >= 0; i--) {
                        MultipleDudtesService.setDateArray({
                           DueDate: $scope.testarr[i].duedate,
                           Percentage: $scope.testarr[i].percentage,
                           dueDateprice: $scope.testarr[i].duDatePrice
                        });
                     };
                     $mdDialog.hide();
                  }
                  $scope.addItem = function() {
                     $scope.testarr.push({
                        duedate: '',
                        percentage: '',
                        duDatePrice: '',
                     });
                  };
                  $scope.removeItem = function(index) {
                     $scope.testarr[i].splice(index, 1);
                  };
                  $scope.cancel = function() {
                     $mdDialog.cancel();
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
         $mdDialog.show({
            templateUrl: 'Invoicepartials/addproduct.html',
            targetEvent: ev,
            controller: function addProductController($scope, $mdDialog) {
               //add product to the invoice
               $scope.addproductToarray = function() {
                     InvoiceService.setArray({
                        Productname: $rootScope.selectedItemm.valuep.Productname,
                        price: $rootScope.selectedItemm.valuep.costprice,
                        quantity: $scope.tdIinvoice.qty,
                        ProductUnit: $rootScope.selectedItemm.valuep.ProductUnit,
                        discount: $scope.tdIinvoice.MaxDiscount,
                        tax: $rootScope.selectedItemm.valuep.producttax,
                        olp: $scope.tdIinvoice.olp,
                        amount: $scope.Amount
                     });
                     $mdDialog.hide();
                  }
                  //close dialog box
               $scope.cancel = function() {
                     $mdDialog.cancel();
                  }
                  
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
                           // $scope.contact =data;
                           for (i = 0, len = data.length; i < len; ++i) {
                              $rootScope.proName.push({
                                 dis: data[i].Productname.toLowerCase(),
                                 valuep: data[i]
                              });
                           }
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
                  }
                  //calculate the invoice amount for each product
               $scope.calAMount = function() {
                  $scope.Amount = 0;
                  $scope.Amount = ((($rootScope.selectedItemm.valuep.costprice * $scope.tdIinvoice.qty) - (($rootScope.selectedItemm.valuep.costprice * $scope.tdIinvoice.qty) * $scope.tdIinvoice.MaxDiscount / 100)) + (($rootScope.selectedItemm.valuep.costprice * $scope.tdIinvoice.qty)) * $rootScope.selectedItemm.valuep.producttax / 100);
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
                     client.onError(function(data) {});
                     $scope.contact.customerid = "-999";
                     client.insert([$scope.contact], {
                        KeyProperty: "customerid"
                     });
                     $mdDialog.hide();
                  }
               }
            })
         }
         // end of Add Contact function
      $scope.favouriteFunction = function(obj) {
         var client = $objectstore.getClient("twethdoorInvoice");
         client.onComplete(function(data) {
            if (obj.favourite) {} else if (!(obj.favourite)) {};
         });
         client.onError(function(data) {
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .content('Error Occure while Adding to Favourite')
               .ariaLabel('')
               .ok('OK')
               .targetEvent(data)
            );
         });
         obj.favourite = !obj.favourite;
         client.insert(obj, {
            KeyProperty: "invoiceNo"
         });
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
                     client.insert(cusform, {
                        KeyProperty: "customerid"
                     });
                  }
               }
            })
         }
         //Autocomplete stuff
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
                     display: data[i].Name,
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
         var client = $objectstore.getClient("contact");
         client.onComplete(function(data) {
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('')
               .content('contact Successfully Saved')
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
         client.insert([$scope.contact], {
            KeyProperty: "customerid"
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
      
      $scope.view = function() {
               location.href = '#/invoice_app';
         }

         //save invoice details
      $scope.submit = function() {
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
                     //whatever
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
         var client = $objectstore.getClient("twethdoorInvoice");
         $scope.TDinvoice.table = $rootScope.testArray.val;
         $scope.TDinvoice.total = $scope.total;
         $scope.TDinvoice.finalamount = $scope.famount;
         $scope.TDinvoice.status = "N";
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
               .content('invoioce Successfully Saved')
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
               .content('Error saving invoioce')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
         });
         $scope.TDinvoice.invoiceNo = "-999";
         client.insert([$scope.TDinvoice], {
            KeyProperty: "invoiceNo"
         });
      }
      $scope.draft = function() {
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
                  $mdToast.show(toast).then(function() {});
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
         var client = $objectstore.getClient("twethdoorInvoiceDraft");
         $scope.TDinvoice.table = $rootScope.testArray.val;
         $scope.TDinvoice.total = $scope.total;
         $scope.TDinvoice.finalamount = $scope.famount;
         $scope.TDinvoice.status = "N";
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
      }
      $scope.calculatetotal = function() {
         $scope.total = 0;
         angular.forEach($rootScope.testArray.val, function(tdIinvoice) {
            $scope.total += (((tdIinvoice.price * tdIinvoice.quantity) - ((tdIinvoice.price * tdIinvoice.quantity) * tdIinvoice.discount / 100)) + ((tdIinvoice.price * tdIinvoice.quantity)) * tdIinvoice.tax / 100);
         })
         return $scope.total;
      };
      $scope.finaldiscount = function() {
         $scope.finalDisc = 0;
         $scope.finalDisc = $scope.total - ($scope.total * $scope.TDinvoice.fdiscount / 100);
         return $scope.finalDisc;
      }
      $scope.CalculateTax = function() {
         $scope.salesTax = 0;
         $scope.salesTax = $scope.finalDisc + ($scope.total * $scope.TDinvoice.salesTax / 100);
         return $scope.salesTax;
      }
      $scope.CalculateOtherTax = function() {
         $scope.otherTax = 0;
         $scope.otherTax = $scope.salesTax + ($scope.total * $scope.TDinvoice.anotherTax / 100);
         return $scope.otherTax;
      }
      $scope.finalamount = function() {
         $scope.famount = 0;
         $scope.famount = parseInt($scope.otherTax) + parseInt($scope.TDinvoice.shipping);
         return $scope.famount;
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
      $scope.sortarr = [{
         name: "Starred",
         id: "favourite",
         src: "img/ic_grade_48px.svg",
         upstatus: false,
         downstatus: false,
         divider: true
      }, {
         name: "Date",
         id: "Startdate",
         upstatus: true,
         downstatus: false,
         divider: false
      }, {
         name: "Invoice No",
         id: "invoiceNo",
         upstatus: false,
         downstatus: false,
         divider: false
      }, {
         name: "Customer",
         id: "Name",
         upstatus: false,
         downstatus: false,
         divider: false
      }, {
         name: "Final Amount",
         id: "finalamount",
         upstatus: false,
         downstatus: false,
         divider: false
      }, {
         name: "Balance",
         id: "balanceDue",
         upstatus: false,
         downstatus: false,
         divider: false
      }, {
         name: "Due Date",
         id: "duedate",
         upstatus: false,
         downstatus: false,
         divider: true
      }, {
         name: "Drafts",
         id: "drafts",
         upstatus: false,
         downstatus: false,
         divider: false
      }, {
         name: "Status 2",
         id: "Status1",
         upstatus: false,
         downstatus: false,
         divider: false
      }, {
         name: "Status 2",
         id: "Status2",
         upstatus: false,
         downstatus: false,
         divider: false
      }]
      $rootScope.prodSearch = "-Startdate";
      $scope.self = this;
      $scope.indexno = 1;
      $scope.starfunc = function(item, index) {
         if (item.id === "Starred") {
            $scope.self.searchText = "true";
         } else {
            if (item.id == "drafts") {
               location.href = '#/settings/Drafts_app';
            } else {
               if (item.upstatus == false && item.downstatus == false) {
                  item.upstatus = !item.upstatus;
                  $scope.sortarr[$scope.indexno].upstatus = false;
                  $scope.sortarr[$scope.indexno].downstatus = false;
                  $scope.indexno = index;
                  if (item.id == "Status1" || item.id == "Status2" || item.id == "drafts") {
                     item.upstatus = !item.upstatus;
                     item.downstatus = item.downstatus;
                  }
               } else {
                  item.upstatus = !item.upstatus;
                  item.downstatus = !item.downstatus;
               }
               self.searchText = null;
               if (item.upstatus) {
                  $rootScope.prodSearch = '-' + item.id;
               }
               if (item.downstatus) {
                  $rootScope.prodSearch = item.id;
               }
            }
         }
      }
   }) //END OF AppCtrl
   //--------------------------------------------------------------------------------------------------------------------------------
   //---------------------------------------------------------------------------------------------------------------------------------
   .controller('viewCtrl', function($scope, $mdDialog, $objectstore, $window, $rootScope, InvoiceService, $filter, $state, $location, UploaderService) {
      $scope.TDinvoice = {};
      $scope.newItems = [];
      $scope.show = false;
      $scope.showTable = false;
      $scope.obtable = [];
      var vm = this;


        if ($state.current.name == 'settings.invoice_app') {
                $rootScope.showinvoice = true;
                $scope.selectedIndex = 0;
            }
            else if ($state.current.name == 'settings.AllRecurring_Invoices') {
                $rootScope.showinvoice = false;
                $scope.selectedIndex = 1;
            };

     // $scope.showaddProject = true;
      $scope.changeTab = function(ind){
             switch (ind) {
                case 0:
                   // $location.url("/settings/invoice_app");
                    $rootScope.showinvoice = true;
					// $scope.showaddProject = true;
                  
                    break;
                case 1:
                   // $location.url("/settings/AllRecurring_Invoices");
                    $rootScope.showinvoice = false;
					//$scope.showaddProject = false;
                   
                    break;
            }
        };

      $scope.announceClick = function(index) {
         $mdDialog.show(
            $mdDialog.alert()
            .title('You clicked!')
            .content('You clicked the menu item at index ' + index)
            .ok('ok')
         );
      };
 
      $scope.$watch('selectedIndex', function(current, old) {
         switch (current) {
            case 0:
               $location.url("/settings/invoice_app");
               break;
            case 1:
               $location.url("/settings/AllRecurring_Invoices");
               break;
         }
      });
      $scope.sortableOptions = {
         containment: '#sortable-container'
      };
      //$rootScope.tenants = loadAll();
      $rootScope.selectedItem2 = null;
      $rootScope.searchText1 = null;
      $rootScope.querySearch1 = querySearch1;

      function querySearch1(query) {
         $scope.enter = function(keyEvent) {
               if (keyEvent.which === 13) {
                  if ($rootScope.selectedItem2 === null) {
                     $rootScope.selectedItem2 = query;
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
		$scope.contacts=[];
      function loadAllcontact() {
         var client = $objectstore.getClient("twethdoorInvoice");
         client.onGetMany(function(data) {
            if (data) {
				//$scope.contacts = data;
               for (i = 0, len = data.length; i < len; ++i) {
                  $scope.customerNames.push({
                     display: data[i].Name,
                     value: data[i]
                  });
               }
            }
         });
         client.onError(function(data) {});
         client.getByFiltering("*");
      }
      $scope.viewSavedProducts = function(obj) {
         $mdDialog.show({
            templateUrl: 'Invoicepartials/showproduct.html',
            controller: 'testCtrl',
            locals: {
               item: obj
            }
         });
      }
      $scope.onChangeinventory = function(cbState) {
         if (cbState == true) {
            $scope.checkAbility = false;
         } else {
            $scope.checkAbility = true;
         }
      };
      $scope.Billingaddress = true;
      $scope.Shippingaddress = false;
      $scope.changeAddress = function() {
         $scope.Billingaddress = !$scope.Billingaddress;
         $scope.Shippingaddress = !$scope.Shippingaddress;
      }
      $scope.checkAbility = true;
      $scope.onChange = function(cbState) {
         if (cbState == true) {
            $scope.checkAbility = false;
         } else {
            $scope.checkAbility = true;
         }
      };
      $scope.edit = function(updatedForm) {
         var client = $objectstore.getClient("twethdoorInvoice");
         $scope.TDinvoice.table = $rootScope.testArray.val;
         $scope.TDinvoice.total = $scope.total;
         $scope.TDinvoice.finalamount = $scope.famount;
         $scope.TDinvoice.status = "N";
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
      }
      $scope.deleteRecord = function(deleteform, ev) {
         var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('')
            .content('Are You Sure You Want To Delete This Record?')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(ev);
         $mdDialog.show(confirm).then(function() {
            var client = $objectstore.getClient("twethdoorInvoice");
            client.onComplete(function(data) {
               $mdDialog.show(
                  $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .content('Record Successfully Deleted')
                  .ariaLabel('')
                  .ok('OK')
                  .targetEvent(data)
               );
               $state.go($state.current, {}, {
                  reload: true
               });
            });
            client.onError(function(data) {
               $mdDialog.show(
                  $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .content('Error Deleting Record')
                  .ariaLabel('')
                  .ok('OK')
                  .targetEvent(data)
               );
            });
            client.deleteSingle(deleteform.invoiceNo, "invoiceNo");
         }, function() {
            $mdDialog.hide();
         });
      }
      $scope.calAMount = function(data) {
         $scope.Amount = 0;
         $scope.Amount = (((data.price * data.quantity) - ((data.price * data.quantity) * data.discount / 100)) + ((data.price * data.quantity)) * data.tax / 100);
         return $scope.Amount;
      }
      $scope.calculatetotal = function(data) {
         $scope.total = 0;
         angular.forEach(data.table, function(tdIinvoice) {
            $scope.total += (((tdIinvoice.price * tdIinvoice.quantity) - ((tdIinvoice.price * tdIinvoice.quantity) * tdIinvoice.discount / 100)) + ((tdIinvoice.price * tdIinvoice.quantity)) * tdIinvoice.tax / 100);
         })
         return $scope.total;
      };
      $scope.finaldiscount = function(data) {
         $scope.finalDisc = 0;
         $scope.finalDisc = $scope.total - ($scope.total * data.fdiscount / 100);
         return $scope.finalDisc;
      }
      $scope.CalculateTax = function(data) {
         $scope.salesTax = 0;
         $scope.salesTax = $scope.finalDisc + ($scope.total * data.salesTax / 100);
         return $scope.salesTax;
      }
      $scope.CalculateOtherTax = function(data) {
         $scope.otherTax = 0;
         $scope.otherTax = $scope.salesTax + ($scope.total * data.anotherTax / 100);
         return $scope.otherTax;
      }
      $scope.finalamount = function(data) {
         $scope.famount = 0;
         $scope.famount = parseInt($scope.otherTax) + parseInt(data.shipping);
         return $scope.famount;
      };

      $scope.add = function() {
            location.href = '#/NewInvoice_app';
      }
      $scope.addProfile = function() {
            location.href = '#/NewRecurring_profile';
      }

      $scope.DemoCtrl1 = function($timeout, $q) {
         var self = this;
         self.readonly = false;
         self.invoice.roFruitNames = $scope.invoices.roFruitNames;
         self.newVeg = function(chip) {
            return {
               name: chip,
               type: 'unknown'
            };
         };
      }
      $scope.contacts=[];
      //retrieve Data from invoice class
      var client = $objectstore.getClient("contact");
      client.onGetMany(function(data) {
         if (data) {
            $scope.contacts = data;
           // console.log($scope.TDinvoice)
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

      $scope.getSelected = function(inv) {
         $scope.obtable = inv.table;
      }
      
      $scope.$on('viewRecord', function(event, args) {
         $scope.imageDetails = args;

          var fileExt = args.name.split('.').pop()

               console.log(args.name);
                if (fileExt == "jpg" || fileExt == "png" || fileExt == "svg") {

                var client = $objectstore.getClient("invoiceUploades");
                client.onGetMany(function(data){
                 if (data){
                  $scope.brochurebody = [];

                  $scope.brochurebody = data;
                  var pbody = data

                  console.log(pbody);

                  for (var i = $scope.brochurebody.length - 1; i >= 0; i--) {
                    $scope.dialogstart($scope.brochurebody[i].Body);
                  };
                 }
                }); 
                client.onError(function(data){
                 $mdDialog.show(
                  $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .title('This is embarracing')
                  .content('There was an error Downloading the Document.')
                  .ariaLabel('Alert Dialog Demo')
                  .ok('OK')
                  .targetEvent(data)
                  );

                  $scope.progressbrochure = false;
                });

                client.getByFiltering("select Body from invoiceUploades where FileName like '%"+args.name+"'%");

               }
         console.log(args)
        
      });


$scope.dialogstart = function(arr){

     $mdDialog.show({
         template: acceptContentTemplate,
         controller: mycontroller,
         locals: {
            employee:  arr
         }
      });
}

   
   function mycontroller($scope, $mdDialog, $rootScope,employee){
      $scope.test = employee;
      $scope.cancel = function() {
         $mdDialog.cancel();
      }
   }

      var acceptContentTemplate = '\
          <md-dialog>\
          <md-dialog-content style="padding:24px;">\
          <div layout layout-sm="column" layout-margin>\
           <div flex="5">\
            <img src="img/material alperbert/avatar_tile_f_28.png" style="margin-top:22px;border-radius:20px"/>\
            </div>\
            <div flex="30" style="margin-top:35px;">\
             <label style="font-weight:700">File Details</label>\
              </div>\
              <md-input-container flex >\
              <label>Notes</label>\
              <input ng-model="test.FileName">\
              </md-input-container>\
            </div>\
         <div style="margin-left:120px;">\
       <img data-ng-src="data:image/png;base64,{{test}}" data-err-src="images/png/avatar.png" style="with:100px; height:100px;/>\
      </div></br><br>\
      <md-divider></md-divider>\
      <div class="md-actions"> \
              <md-button class="md-primary md-button md-default-theme" ng-click="cancel()">Cancel</md-button> \
            <md-button class="md-primary md-button md-default-theme" ng-click="hideAccept()">OK</md-button> \
          </div> \
          </md-content> \
        </md-dialog> ';

      $scope.cancel = function() {
         $mdDialog.cancel();
      }
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
   }) //END OF viewCtrl
   //-------------------------------------------------------------------------------------------------------------------------------------------
   .controller('viewDraftCtrl', function($scope, $mdDialog, $objectstore, $window, $rootScope, InvoiceService, $filter, $state) {
      $scope.TDinvoice = {};
      $scope.newItems = [];
      $scope.show = false;
      $scope.showTable = false;
      $scope.obtable = [];
      $scope.scrollbarConfig = {
         autoHideScrollbar: false,
         theme: 'minimal-dark',
         axis: 'y',
         advanced: {
            updateOnContentResize: true
         },
         scrollInertia: 300
      }
      var vm = this;
      $scope.announceClick = function(index) {
         $mdDialog.show(
            $mdDialog.alert()
            .title('You clicked!')
            .content('You clicked the menu item at index ' + index)
            .ok('ok')
         );
      };
      $scope.onChangeinventory = function(cbState) {
         if (cbState == true) {
            $scope.checkAbility = false;
         } else {
            $scope.checkAbility = true;
         }
      };
      $scope.savetoInvoices = function(obj) {
         var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('')
            .content('Are You Sure You Want To Delete This Record?')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(obj);
         $mdDialog.show(confirm).then(function() {
            var draftdelete = $objectstore.getClient("twethdoorInvoiceDraft");
            draftdelete.onComplete(function(data) {
               var newInsert = $objectstore.getClient("twethdoorInvoice");
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
                  $state.go($state.current, {}, {
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
            draftdelete.deleteSingle(obj.invoiceNo, "invoiceNo");
         }, function() {
            $mdDialog.hide();
         });
      }
      $scope.Billingaddress = true;
      $scope.Shippingaddress = false;
      $scope.changeAddress = function() {
         $scope.Billingaddress = !$scope.Billingaddress;
         $scope.Shippingaddress = !$scope.Shippingaddress;
      }
      $scope.checkAbility = true;
      $scope.onChange = function(cbState) {
         if (cbState == true) {
            $scope.checkAbility = false;
         } else {
            $scope.checkAbility = true;
         }
      };
      $scope.edit = function(draftForm) {
         var client = $objectstore.getClient("twethdoorInvoiceDraft");
         $scope.TDinvoice.table = $rootScope.testArray.val;
         $scope.TDinvoice.total = $scope.total;
         $scope.TDinvoice.finalamount = $scope.famount;
         $scope.TDinvoice.status = "N";
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
         client.insert(draftForm, {
            KeyProperty: "invoiceNo"
         });
      }
      $scope.deleteRecord = function(deleteform, ev) {
         var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('')
            .content('Are You Sure You Want To Delete This Record?')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(ev);
         $mdDialog.show(confirm).then(function() {
            var client = $objectstore.getClient("twethdoorInvoiceDraft");
            client.onComplete(function(data) {
               $mdDialog.show(
                  $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .content('Record Successfully Deleted')
                  .ariaLabel('')
                  .ok('OK')
                  .targetEvent(data)
               );
               $state.go($state.current, {}, {
                  reload: true
               });
            });
            client.onError(function(data) {});
            client.deleteSingle(deleteform.invoiceNo, "invoiceNo");
         }, function() {
            $mdDialog.hide();
         });
      }
      $scope.calAMount = function(data) {
         $scope.Amount = 0;
         $scope.Amount = (((data.price * data.quantity) - ((data.price * data.quantity) * data.discount / 100)) + ((data.price * data.quantity)) * data.tax / 100);
         return $scope.Amount;
      }
      $scope.calculatetotal = function(data) {
         $scope.total = 0;
         angular.forEach(data.table, function(tdIinvoice) {
            $scope.total += (((tdIinvoice.price * tdIinvoice.quantity) - ((tdIinvoice.price * tdIinvoice.quantity) * tdIinvoice.discount / 100)) + ((tdIinvoice.price * tdIinvoice.quantity)) * tdIinvoice.tax / 100);
         })
         return $scope.total;
      };
      $scope.finalamount = function(data) {
         $scope.famount = 0;
         var finalDiscount = $scope.total * data.fdiscount / 100;
         var salesTax = $scope.total * data.salesTax / 100;
         var otherTax = $scope.total * data.anotherTax / 100;
         $scope.famount = (parseInt($scope.total) - parseInt(finalDiscount)) + parseInt(salesTax) +
            parseInt(otherTax) + parseInt(data.shipping);
         return $scope.famount;
      };
      $scope.add = function() {
            location.href = '#/NewRecurring_profile';
      }
      $scope.viewInvoice = function() {
            location.href = '#/invoice_app';
      }
      $scope.DemoCtrl1 = function($timeout, $q) {
         var self = this;
         self.readonly = false;
         self.invoice.roFruitNames = $scope.invoices.roFruitNames;
         self.newVeg = function(chip) {
            return {
               name: chip,
               type: 'unknown'
            };
         };
      }
      $scope.demo = {
         topDirections: ['left', 'up'],
         bottomDirections: ['down', 'right'],
         isOpen: false,
         availableModes: ['md-fling', 'md-scale'],
         selectedMode: 'md-fling',
         availableDirections: ['up', 'down', 'left', 'right'],
         selectedDirection: 'up'
      };
      var client = $objectstore.getClient("twethdoorInvoiceDraft");
      client.onGetMany(function(data) {
         if (data) {
            $scope.TDinvoice = data;
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
      $scope.getSelected = function(inv) {
         $scope.obtable = inv.table;
      }
      $scope.demo = {
         topDirections: ['left', 'up'],
         bottomDirections: ['down', 'right'],
         isOpen: false,
         availableModes: ['md-fling', 'md-scale'],
         selectedMode: 'md-fling',
         availableDirections: ['up', 'down', 'left', 'right'],
         selectedDirection: 'up'
      };
   }) //END OF viewCtrl
   //--------------------------------------------------------------------------------------------------------------
   .controller('testCtrl', function($scope, $mdDialog, $rootScope, InvoiceService, item) {
      $scope.test = item;
      $scope.cancel = function() {
         $mdDialog.cancel();
      };
      $scope.edit = function() {
         // InvoiceService.setArray({Productname: item.Productname,
         //                price: item.price,
         //                quantity: item.quantity,
         //                ProductUnit: item.ProductUnit,
         //                discount: item.discount,
         //                tax: item.tax,
         //                olp: item.olp,
         //                amount: $scope.Amount});
         $mdDialog.cancel();
         console.log(item);
      };
      $scope.calAMount = function() {
         $scope.Amount = 0;
         $scope.Amount = (((item.price * item.quantity) - ((item.price * item.quantity) * item.discount / 100)) + ((item.price * item.quantity)) * item.tax / 100);
         return $scope.Amount;
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
   //-----------------------------------------------------
   //----------------------------------------------------------------------------
   .factory('InvoiceService', function($rootScope) {
      $rootScope.testArray = {
         val: []
      };
      return {
         setArray: function(newVal) {
            $rootScope.testArray.val.push(newVal);
            return $rootScope.testArray;
         },
         removeArray: function(newVals) {
            $rootScope.testArray.val.splice(newVals, 1);
            return $rootScope.testArray;
         }
      }
   })
   //-----------------------------------------------------------------------------------------------
   //------------------------------------------------------------------------------------------------
   .factory('UploaderService', function($rootScope) {
      $rootScope.uploadArray = [];
      $rootScope.basicinfo = [];
      return {
         setFile: function(val) {
            $rootScope.uploadArray.push(val);
            return $rootScope.uploadArray;
         },
         BasicArray: function(name, size) {
            $rootScope.basicinfo.push({
               'name': name,
               'size': size
            });
            return $rootScope.basicinfo;
         },
         removebasicArray: function(arr) {
            for (var i = arr.length - 1; i >= 0; i--) {
               $rootScope.basicinfo.splice(arr[i], 1);
            };
            return $rootScope.basicinfo;
         },
         removefileArray: function(arr) {
            for (var i = arr.length - 1; i >= 0; i--) {
               $rootScope.uploadArray.splice(arr[i], 1);
            };
            return $rootScope.uploadArray;
         },
         loadArray: function() {
            return $rootScope.uploadArray;
         },
         loadBasicArray: function() {
            return $rootScope.basicinfo;
         },
      }
   })
   //-------------------------------------------------------------------------------------------------
   //---------------------------------------------------------------------------------------------------
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
   .directive('fileUpLoaderInvoice', ['$uploader', "$rootScope", "$mdToast", 'UploaderService', function($uploader, $rootScope, $mdToast, UploaderService) {
      return {
         restrict: 'E',
         template: "<div class='content' ng-init='showUploadButton=false;showDeleteButton=false;showUploadTable=false;'><div id='drop-files' ondragover='return false' layout='column' layout-align='space-around center'><div id='uploaded-holder' flex ><div id='dropped-files' ng-show='showUploadTable'><table id='Tabulate' ></table></div></div><div flex ><md-button class='md-raised' id='deletebtn' ng-show='showDeleteButton' class='md-raised' style='color:rgb(244,67,54);margin-left:30px;'><md-icon md-svg-src='img/directive_library/ic_delete_24px.svg'></md-icon></md-button></div><div flex><md-icon md-svg-src='img/directive_library/ic_cloud_upload_24px.svg'></md-icon><text style='font-size:12px;margin-left:10px'>{{label}}<text></div></div></div>",
         scope: {
            label: '@',
            uploadType: '@'
         },
         link: function(scope, element) {
               jQuery.event.props.push('dataTransfer');
               var files;
               var filesArray = [];
               var sampleArray = [];
               element.find("#drop-files").bind('drop', function(e) {
                  files = e.dataTransfer.files || e.dataTransfer.files;
                  for (indexx = 0; indexx < files.length; indexx++) {
                     filesArray.push(files[indexx]);
                     UploaderService.setFile(files[indexx]);
                     UploaderService.BasicArray(filesArray[indexx].name, filesArray[indexx].size);
                     sampleArray.push({
                        'name': filesArray[indexx].name,
                        'size': filesArray[indexx].size
                     });
                  }
                  var newHtml = "<tr class='md-table-headers-row'><th class='md-table-header' style='Padding:0px 16px 10px 0'>Name</th><th class='md-table-header' style='Padding:0px 16px 10px 0'>Type</th><th class='md-table-header' style='Padding:0px 16px 10px 0'>Size</th></tr>";
                  for (var i = 0; i < filesArray.length; i++) {
                     var tableRow = "<tr><td class='upload-table' style='float:left'>" + filesArray[i].name + "</td><td class='upload-table'>" +
                        filesArray[i].type + "</td><td class='upload-table'>" +
                        filesArray[i].size + " bytes" + "</td></tr>";
                     newHtml += tableRow;
                  }
                  element.find("#Tabulate").html(newHtml);
                  $rootScope.$apply(function() {
                     scope.showUploadButton = true;
                     scope.showDeleteButton = true;
                     scope.showUploadTable = true;
                  })
               });

               function restartFiles() {
                  $rootScope.$apply(function() {
                     scope.showUploadButton = false;
                     scope.showDeleteButton = false;
                     scope.showUploadTable = false;
                  })
                  UploaderService.removefileArray(filesArray);
                  UploaderService.removebasicArray(sampleArray);
                  filesArray = [];
                  return false;
               }
               element.find('#drop-files').bind('dragenter', function() {
                  $(this).css({
                     'box-shadow': 'inset 0px 0px 20px rgba(0, 0, 0, 0.1)',
                     'border': '2px dashed rgb(255,64,129)'
                  });
                  return false;
               });
               element.find('#drop-files').bind('drop', function() {
                  $(this).css({
                     'box-shadow': 'none',
                     'border': '2px dashed rgba(0,0,0,0.2)'
                  });
                  return false;
               });
               element.find('#deletebtn').click(restartFiles);
            } //end of link
      };
   }])
   //--------------------------------------------------------------------------------
   //--------------------------------------------------------------------------------
   