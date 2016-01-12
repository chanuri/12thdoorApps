angular
  .module('mainApp', ['ngMaterial', 'directivelibrary','12thdirective', 'uiMicrokernel', 'ui.router', 'ui.sortable'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');
})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/allEstimates');
  $stateProvider

    .state('new', {
    url: '/estimate',
    templateUrl: 'estimatePartial/newEstimate.html',
    controller: 'AppCtrl'
  })

  .state('app', {
    url: '/allEstimates',
    templateUrl: 'estimatePartial/AllEstimates.html',
    controller: 'viewCtrl'
  })
  .state('viewEst',{
      url: '/viewEstimate/EstNo=:estimateNo',
      templateUrl: 'estimatePartial/viewEstimate.html',
      controller: 'viewCtrl'
   })
  .state('editEst',{
      url: '/viewEstimate/EstNo=:estimateNo',
      templateUrl: 'estimatePartial/editEstimate.html',
      controller: 'editCtrl'
   })
  .state('copy',{
            url: '/copyEstimateDetails',
            templateUrl: 'estimatePartial/editEstimate.html',
            controller: 'editCtrl'
         })

})

.controller('AppCtrl', function($scope, $objectstore, $uploader, $state, $mdDialog, $window, $objectstore, $auth, $timeout, $q, $http, $mdToast, $rootScope, InvoiceService, $filter, $location, UploaderService,EstimateDetails ) {

    $scope.list = [];
    $scope.TDEstimate = {};
    $scope.total = 0;
    $scope.product = {};
    $scope.TDEstimate.estimateRefNo = 'N/A'
    $scope.Showdate = false;
    $scope.Settings = {};
    $scope.TDEstimate.Startdate =  new Date();
    $scope.showEditCustomer = false;
    $scope.dueDtaesShow = false;
    $scope.Billingaddress = true;
    $scope.Shippingaddress = false;
    $scope.TDEstimate.fdiscount = 0;
    $scope.TDEstimate.salesTax = 0;
    $scope.TDEstimate.anotherTax = 0;
    $scope.TDEstimate.shipping = 0;
     $scope.TDEstimate.famount = 0;
     $scope.individualTax = [];
       $scope.UnitOfMeasure = [];

      var client = $objectstore.getClient("Settings12thdoor");
      client.onGetMany(function(data) {
         if (data) {
           $scope.Settings = data;
            for (var i =  $scope.Settings.length - 1; i >= 0; i--) {
              //console.log($scope.Settings[i].preference.estimatepref.dafultnote)
              $scope.Dnote = $scope.Settings[i].preference.estimatepref.dafultnote;
              $scope.DComment = $scope.Settings[i].preference.estimatepref.defaultcomment;
              $scope.Davlidity = $scope.Settings[i].preference.estimatepref.defaultvalidity;
              $scope.showShippingAddress = $scope.Settings[i].preference.estimatepref.displayshiptoaddressestimate
              $scope.cusFields = $scope.Settings[i].preference.estimatepref.CusFiel;
              $scope.mail = $scope.Settings[i].profile.adminEmail;
              $scope.EmailPermission = $scope.Settings[i].preference.estimatepref.copyadminforallestimate;
               $scope.partialPyments =  $scope.Settings[i].preference.estimatepref.allowPartialPayments;
               $scope.discount = $scope.Settings[i].preference.estimatepref.enableDisscounts;
               $scope.enableShipping = $scope.Settings[i].preference.estimatepref.enableshipping;
               $scope.dis = $scope.Settings[i].preference.estimatepref.disscountItemsOption;

              for (var z = $scope.Settings[i].preference.productpref.units.length - 1; z >= 0; z--) {
                  $scope.UnitOfMeasure.push($scope.Settings[i].preference.productpref.units[z])
                };

              for (var x = $scope.Settings[i].taxes.individualtaxes.length - 1; x >= 0; x--) {
                 $scope.individualTax.push($scope.Settings[i].taxes.individualtaxes[x]);
                 };
              for (var y = $scope.Settings[i].taxes.multipletaxgroup.length - 1; y >= 0; y--) {
                $scope.individualTax.push($scope.Settings[i].taxes.multipletaxgroup[y]); 
               };

            };
         }

         if($scope.EmailPermission == true){
          $scope.TDEstimate.adminEmail = $scope.mail;
         }

          $scope.TDEstimate.notes = $scope.Dnote; 
          $scope.TDEstimate.comments = $scope.DComment;
          $scope.TDEstimate.displayShippingAddress = $scope.showShippingAddress;
          $scope.CutomFields = $scope.cusFields;
          $scope.UOM = $scope.UnitOfMeasure;
          $scope.calculateDiscount = $scope.discount;
           $scope.TDEstimate.allowPartialPayments =  $scope.partialPyments;
           $scope.AllTaxes = $scope.individualTax;
           $scope.DispalyShipping = $scope.enableShipping;
          //console.log($scope.UOM)

          if($scope.Davlidity == "7 Days"){
             $scope.sevenDays= new Date();
            $scope.sevenDays.setDate($scope.sevenDays.getDate() + 7);
            $scope.TDEstimate.validity =  $scope.sevenDays;
          }else if($scope.Davlidity == "14 Days"){
             $scope.fourteendays = new Date();
            $scope.fourteendays.setDate($scope.fourteendays.getDate() + 14);
            $scope.TDEstimate.validity = $scope.fourteendays;
          }else if($scope.Davlidity == "30 Days"){
            $scope.thirtyDays = new Date();
            $scope.thirtyDays.setDate($scope.thirtyDays.getDate() + 30);
            $scope.TDEstimate.validity = $scope.thirtyDays;
          }
          //console.log($scope.CutomFields)
      });
      client.onError(function(data) {
      });

      client.getByFiltering("*");

     
      if($scope.dis == "SubTotal Items" ){
        checkDiscout = false;
      }

    //checks whether the use has selected a name or not. if the name is selecter the it enebles the user to edit the customer details
    $scope.selectedItemChange = function(c) {
      $scope.showEditCustomer = true;
    };

    $scope.sortableOptions = {
      containment: '#sortable-container'
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
      $scope.TDEstimate.estimateRefNo = $scope.maxID.toString();
       console.log($scope.TDEstimate.estimateRefNo)
           }
        });
        client.getByFiltering("select maxCount from domainClassAttributes where class='Estimate12thdoor'");

    $scope.changeAddress = function() {
      $scope.Billingaddress = !$scope.Billingaddress;
      $scope.Shippingaddress = !$scope.Shippingaddress;
    }

  
    //Autocomplete stuff
    $rootScope.self = this;
    $rootScope.self.tenants = loadAll();
    $rootScope.selctedName = null;
     $rootScope.searchText = null;
    $rootScope.self.querySearch = querySearch;

    function querySearch(query) {

      $scope.enter = function(keyEvent) {
          if (keyEvent.which === 13) {
            if ($rootScope.selctedName === null) {
              $rootScope.selctedName = query;
              console.log($rootScope.results);
            } else {
              console.log($rootScope.selctedName);
            }
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
    $scope.customerNames = [];

    function loadAll() {

      var client = $objectstore.getClient("contact");
      client.onGetMany(function(data) {
        if (data) {
        $rootScope.customerNames = [];
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

//------------------------------------------------------------------------------------------------
    
    //dialog box pop up to add product
    $scope.addproduct = function(ev) {
      $rootScope.AllUnitOfMeasures = angular.copy($scope.UOM);
       $rootScope.taxType = angular.copy($scope.AllTaxes);
       $rootScope.discounts = angular.copy($scope.calculateDiscount);
       $rootScope.Showdiscount = angular.copy($scope.Displaydiscount);
      $mdDialog.show({
        templateUrl: 'estimatePartial/addproduct.html',
         targetEvent: ev,
            controller: function addProductController($scope, $mdDialog) {
               
                $scope.prducatsAdd = {};
               $scope.prod = {};
               $scope.promoItems = [];
               $scope.taxType = [];
               $scope.AllUnitOfMeasures = [];
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
                     InvoiceService.setFullArr({
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
//---------------------------------------------------------------------------------------
    //Delete added products
    $scope.deleteproduct = function(name) {
      InvoiceService.removeArray(name);
    }
//----------------------------------------------------------------------------------------
    //dialog box pop up to add customer through invoice
    $scope.addCustomer = function() {
        $mdDialog.show({

          templateUrl: 'estimatePartial/addCustomer.html',
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
                                 $rootScope.selctedName = $rootScope.customerNames[i];
                               }; 
                             };
                     $mdDialog.hide();
                  }
               }
            })
         }
      // end of Add Contact function
//---------------------------------------------------------------------------------------
    $scope.editContact = function() {
      $mdDialog.show({
        templateUrl: 'estimatePartial/editCustomer.html',
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

                     $rootScope.customerNames.splice( $rootScope.customerNames.indexOf($rootScope.selctedName), 1 );
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
                                 $rootScope.selctedName = $rootScope.customerNames[i];
                                  $rootScope.selctedName.Billingaddress = $rootScope.customerNames[i].Billingaddress;
                               }; 
                        };
                  }
               }
            })
         }

//----------------------------------------------------------------------------------------


    $scope.check = function(cc){
          $scope.TDEstimate.CutomFields ={};
          for (var i = $scope.CutomFields.length - 1; i >= 0; i--) {
           $scope.TDEstimate.CutomFields = ({name:  $scope.CutomFields[i].labelshown,
                                                 id: cc});
          };
         console.log($scope.TDEstimate.CutomFields)
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
      var client = $objectstore.getClient("Estimate12thdoor");

        for (var i = $scope.CutomFields.length - 1; i >= 0; i--) {
          if($scope.CutomFields[i].type== 'textBox'){
           $scope.TDEstimate.CutomFields = ({name:  $scope.CutomFields[i].type,
                                                 id:  $scope.CutomFields[i].textBoxFields});
          }
         }

      $scope.TDEstimate.EstimateProducts = $rootScope.testArray.val;
      $scope.TDEstimate.total = $scope.total;
      $scope.TDEstimate.finalamount = $scope.famount;
      $scope.TDEstimate.discountAmount = $scope.finalDisc;
      $scope.TDEstimate.salesTaxAmount = $scope.salesTax;
      $scope.TDEstimate.otherTaxAmount = $scope.otherTax;
      $scope.TDEstimate.status = "Valid";
      $scope.TDEstimate.Name = $rootScope.selctedName.display;
      $scope.TDEstimate.billingAddress = $rootScope.selctedName.BillingAddress;
      $scope.TDEstimate.shippingAddress = $rootScope.selctedName.ShippingAddress;
      $scope.TDEstimate.Email = $rootScope.selctedName.value.Email;
      $scope.TDEstimate.commentsAndHistory=[];
         $scope.TDEstimate.commentsAndHistory.push({
              done: false,
              text: "Estimate was created by Mr.dddd",
              date:new Date()
         });
      $scope.TDEstimate.UploadImages = {
        val: []
      };
      $scope.TDEstimate.UploadImages.val = UploaderService.loadBasicArray();

         EstimateDetails.removeArray(0, 1);
        EstimateDetails.setArray($scope.TDEstimate);

      client.onComplete(function(data) {
        
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('')
          .content('Estimate Successfully Saved')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
        $state.go('viewEst', {'estimateNo': $scope.TDEstimate.estimateRefNo});
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
      console.log($scope.TDEstimate);
      $scope.TDEstimate.estimateNo = "-999";
      client.insert([$scope.TDEstimate], {
        KeyProperty: "estimateNo"
      });
    }

    //pops a dialog box to edit or view product
    $scope.viewProduct = function(obj) {
      $mdDialog.show({
        templateUrl: 'estimatePartial/editproduct.html',
        controller: 'testCtrl',
        locals: {
          item: obj
        }
      });
    }

    //pops a dialog box which enble the user to upload the files
    $scope.upload = function(ev) {
      $mdDialog.show({
        templateUrl: 'estimatePartial/showUploader.html',
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
        templateUrl: 'estimatePartial/changeCurrency.html',
        targetEvent: ev,
        controller: 'AppCtrl'
      })
    }

    $scope.cancel = function() {
      $mdDialog.cancel();
    }

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
         }else if ($scope.dis == "Individual Items" ){
            angular.forEach($rootScope.testArray.val, function(tdIinvoice) {
            $scope.Discount +=   parseInt(tdIinvoice.discount);
            $scope.finalDisc = parseInt($scope.total*$scope.Discount/100);
         })
       }
      // $scope.CalculateTax();
       return $scope.finalDisc;
      }
     $scope.CalculateTax = function() {
         $scope.salesTax=0;
        //console.log($rootScope.taxArr)
         for (var i = $rootScope.taxArr.length - 1; i >= 0; i--) {

            $scope.salesTax += parseInt($rootScope.taxArr[i].salesTax);
          }
           //console.log($scope.salesTax)
           return $scope.salesTax;
       
      }
     
      $scope.finalamount = function() {
         $rootScope.famount = 0;
         $rootScope.famount = parseInt($scope.total - $scope.finalDisc)+parseInt($scope.salesTax)+
         parseInt($scope.TDEstimate.shipping);

         return $rootScope.famount;
         console.log($rootScope.famount)
      };

    $scope.view = function() {
        location.href = '#/allEstimates';
    }

    $scope.DemoCtrl = function($timeout, $q) {
      var self = this;
      self.readonly = false;
      // Lists of tags names and Vegetable objects
      self.fruitNames = [];
      self.TDEstimate.roFruitNames = angular.copy(self.fruitNames);
      self.tags = [];

      self.newVeg = function(chip) {
        return {
          name: chip,
          type: 'unknown'
        };
      };
    }

     $scope.EstimateDraftDetails = [];   
       var client = $objectstore.getClient("domainClassAttributes");
        client.onGetMany(function(data) {
           if (data) {
            $scope.EstimateDraftDetails = data;

          for (var i = $scope.EstimateDraftDetails.length - 1; i >= 0; i--) {
            $scope.ID = $scope.EstimateDraftDetails[i].maxCount;
      };
      $scope.maxID = parseInt($scope.ID)+1;
      $scope.refNo = $scope.maxID.toString();
           }
        });
        client.getByFiltering("select maxCount from domainClassAttributes where class='Estimate12thdoorDraft'");

    $scope.clearEstimate = function(ev){
      var confirm = $mdDialog.confirm()
          .title('Would you like save this to draft?')
          .content('')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('save')
          .cancel('clear');
            $mdDialog.show(confirm).then(function() {


      
     var client = $objectstore.getClient("Estimate12thdoorDraft");
     $scope.TDEstimate.estimateRefNo = $scope.refNo;
      $scope.TDEstimate.EstimateProducts = $rootScope.testArray.val;
      $scope.TDEstimate.total = $scope.total;
      $scope.TDEstimate.finalamount = $scope.famount;
      $scope.TDEstimate.discountAmount = $scope.finalDisc;
      $scope.TDEstimate.salesTaxAmount = $scope.salesTax;
      $scope.TDEstimate.otherTaxAmount = $scope.otherTax;
      $scope.TDEstimate.status = "Draft";
      $scope.TDEstimate.Name = $rootScope.selctedName.display;
      $scope.TDEstimate.billingAddress = $rootScope.selctedName.BillingAddress;
      $scope.TDEstimate.shippingAddress = $rootScope.selctedName.ShippingAddress;
      $scope.TDEstimate.Email = $rootScope.selctedName.value.Email;
      // $scope.TDEstimate.MultiDueDAtesArr = $scope.dateArray.value;
      // $scope.TDEstimate.UploadImages = {
      //   val: []
      // };
      // $scope.TDEstimate.UploadImages.val = UploaderService.loadBasicArray();

      client.onComplete(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('')
          .content('Estimate Saved to Drafts')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
        location.href = '#/allEstimates';
      });

      client.onError(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('Sorry')
          .content('Error saving Estimate ')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
      });
      $scope.TDEstimate.estimateNo = "-999";
      client.insert([$scope.TDEstimate], {
        KeyProperty: "estimateNo"
      });

            }, function() {
               $rootScope.testArray.val = "";
                 $scope.total = "";
                 $scope.famount="";
                 $rootScope.selctedName.display="";
                 $rootScope.selctedName.BillingAddress="";
                 $rootScope.selctedName.shippingValue="";
                 $rootScope.searchText = null;
                 $scope.TDEstimate.poNum = "";
                 $scope.TDEstimate.comments = "";
                 $scope.TDEstimate.fdiscount = "";
                 $scope.TDEstimate.salesTax = "";
                 $scope.TDEstimate.anotherTax = "";
                 $scope.TDEstimate.shipping = "";
                 $scope.TDEstimate.notes = "";
                 $scope.TDEstimate.paymentMethod = "";
                 $scope.TDEstimate.roFruitNames = "";
                 $scope.TDEstimate.termtype = "";
                 $scope.TDEstimate.Startdate = "";
                 $scope.TDEstimate.validity = "";


                 location.href = '#/allEstimates';
         
            });
      }
    

  })
  //-------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------


  //-------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------
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

//-------------------------------------------------------------------------------------------------------  
//------------------------------------------------------------------------------------------------------
