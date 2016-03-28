app.controller('copyRecurring', function($scope, $auth, $mdDialog, $objectstore, $window, $rootScope, recurringInvoiceService, $filter, $state, $location, invoiceDetails, InvoiceService) {

$scope.TDinvoice = {};
$scope.invoicDEtails = {};
 $scope.refNo = 'N/A';
$scope.Startdate = new Date();
var userName = $auth.getUserName();
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
           
            $scope.refNo = $scope.maxID.toString();
             
                 }
              });
              client.getByFiltering("select maxCount from domainClassAttributes where class='RecurringProfile'");
               for (var i = $rootScope.invoiceArray.length - 1; i >= 0; i--) {
            //$rootScope.selctedName = $rootScope.invoiceArray[i].Name;
            // var bADD = $rootScope.invoiceArray[i].billingAddress;
            // var sADD = $rootScope.invoiceArray[i].shippingAddress;
           
            //$scope.Startdate = new Date($rootScope.invoiceArray[i].Startdate)
            for (var x = $rootScope.invoiceArray[i].invoiceProducts.length - 1; x >= 0; x--) {
                
                recurringInvoiceService.setTempArr({
                                Productname: $rootScope.invoiceArray[i].invoiceProducts[x].Productname,
                                price: $rootScope.invoiceArray[i].invoiceProducts[x].price,
                                quantity: $rootScope.invoiceArray[i].invoiceProducts[x].quantity,
                                ProductUnit: $rootScope.invoiceArray[i].invoiceProducts[x].ProductUnit,
                                discount: $rootScope.invoiceArray[i].invoiceProducts[x].discount,
                                tax: $rootScope.invoiceArray[i].invoiceProducts[x].tax,
                                olp: $rootScope.invoiceArray[i].invoiceProducts[x].olp,
                                amount: $rootScope.invoiceArray[i].invoiceProducts[x].amount,
                                status:$rootScope.invoiceArray[i].invoiceProducts[x].status,
                             });
            }
        }


            var client = $objectstore.getClient("Settings12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                $scope.Settings = data;
                for (var i = $scope.Settings.length - 1; i >= 0; i--) {
                    $scope.com = $scope.Settings[i].preference.invoicepref.defaultComm;
                    $scope.note = $scope.Settings[i].preference.invoicepref.defaultNote;
                    $scope.paymentTerm = $scope.Settings[i].preference.invoicepref.defaultPaymentTerms;
                    $scope.dis = $scope.Settings[i].preference.invoicepref.disscountItemsOption;
                    $scope.ShippingCharges = $scope.Settings[i].preference.invoicepref.enableshipping;
                    $scope.partialPayment = $scope.Settings[i].preference.invoicepref.allowPartialPayments;
                    $scope.ShowDiscount = $scope.Settings[i].preference.invoicepref.enableDisscounts;
                    $scope.ShowShipAddress = $scope.Settings[i].preference.invoicepref.displayshipaddress;
                    $scope.ShowTaxes = $scope.Settings[i].preference.invoicepref.enableTaxes;
                    $scope.offlinePayments = $scope.Settings[i].preference.invoicepref.offlinePayments;
                    $scope.EmailPermission = $scope.Settings[i].preference.invoicepref.copyadminallinvoices;
                    $scope.mail = $scope.Settings[i].profile.adminEmail;
                    $scope.BaseCurrency = $scope.Settings[i].profile.baseCurrency;

                    for (var z = $scope.Settings[i].users.roles.length - 1; z >= 0; z--) {
                        $scope.roles.push($scope.Settings[i].users.roles[z].rolename);
                        $scope.permission.push($scope.Settings[i].users.roles[z]);
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
                            paymentmethod: $scope.Settings[i].preference.paymentpref.PaymentMethod[x].paymentmethod,
                            paymentType: $scope.Settings[i].preference.paymentpref.PaymentMethod[x].paymentType,
                            activate: $scope.Settings[i].preference.paymentpref.PaymentMethod[x].activate
                        })
                    };
                    for (var y = $scope.Settings[i].payments.length - 1; y >= 0; y--) {
                        $scope.paymentMethod.push({
                            paymentmethod: $scope.Settings[i].payments[y].name,
                            paymentType: $scope.Settings[i].payments[y].paymentType,
                            activate: $scope.Settings[i].payments[y].activate
                                // url:$scope.Settings[i].payments[y].url
                        })
                    };
                };
            }

            if ($scope.EmailPermission == true) {
                $scope.TDinvoice.adminEmail = $scope.mail;
            }
            $scope.TDinvoice.comments = $scope.com;
            $scope.TDinvoice.notes = $scope.note;
            $scope.TDinvoice.termtype = $scope.paymentTerm;
            $scope.TDinvoice.baseCurrency = $scope.BaseCurrency;
            $scope.TDinvoice.DiplayShipiingAddress = $scope.ShowShipAddress;
            $scope.TDinvoice.allowPartialPayments = $scope.partialPayment;
            $scope.AllTaxes = $scope.individualTax;
            $scope.UOM = $scope.UnitOfMeasure;
            $scope.CusFields = $scope.cusF;
            $scope.Displaydiscount = $scope.ShowDiscount;
        });
        client.onError(function(data) {});
        client.getByFiltering("*");


$scope.copyToProfile = function(updatedForm) {
        var client = $objectstore.getClient("RecurringProfile");

         $scope.TDinvoice.recurringProducts = updatedForm.invoiceProducts;
         $scope.TDinvoice.total = $scope.total;
          $scope.TDinvoice.finalamount = $rootScope.famount;
         $scope.TDinvoice.discountAmount = $scope.finalDisc;
         $scope.TDinvoice.salesTaxAmount = $scope.salesTax;
          $scope.TDinvoice.otherTaxAmount = $scope.otherTax;
          $scope.TDinvoice.status = "Active";
          $scope.TDinvoice.commentsAndHistory=[];
         $scope.TDinvoice.commentsAndHistory.push({
              done: false,
              text: "Invoice was created by"+userName,
              date:new Date()
         });
         $scope.TDinvoice.DeleteStatus = false;
         $scope.TDinvoice.favourite = false;
         $scope.TDinvoice.favouriteStarNo = 1;
         $scope.TDinvoice.Name = updatedForm.Name;
         $scope.TDinvoice.Email = updatedForm.Email;
         $scope.TDinvoice.Startdate = $scope.Startdate
         $scope.TDinvoice.billingAddress = updatedForm.billingAddress;
         $scope.TDinvoice.shippingAddress = updatedForm.shippingAddress;
         // $scope.TDinvoice.MultiDueDAtesArr = $scope.dateArray.value;
         $scope.TDinvoice.UploadImages = {
            val: []
         };
         
         $scope.invoicDEtails.DeleteStatus = false;
         $scope.invoicDEtails.favourite = false;
         $scope.invoicDEtails.favouriteStarNo = 1;
         $scope.invoicDEtails.Name = updatedForm.Name;
         $scope.invoicDEtails.Email = updatedForm.Email;
         $scope.invoicDEtails.billingAddress = updatedForm.billingAddress;
         $scope.invoicDEtails.shippingAddress = updatedForm.shippingAddress;
         // $scope.invoicDEtails.MultiDueDAtesArr = $scope.dateArray.value;
         $scope.invoicDEtails.UploadImages = {
            val: []
         };
          $scope.invoicDEtails.invoiceProducts = $rootScope.prodArray.val;
         $scope.invoicDEtails.total = $scope.total;
         $scope.invoicDEtails.DraftActive = false;
          $scope.invoicDEtails.finalamount = $rootScope.famount;
         $scope.invoicDEtails.discountAmount = $scope.finalDisc;
         $scope.invoicDEtails.salesTaxAmount = $scope.salesTax;
          $scope.invoicDEtails.otherTaxAmount = $scope.otherTax;
          $scope.invoicDEtails.RecurringProfileNo =  $scope.refNo;
          $scope.invoicDEtails.paymentMethod = updatedForm.Name.paymentMethod;
           $scope.invoicDEtails.comments = updatedForm.Name.comments;
           $scope.invoicDEtails.Startdate =  $scope.Startdate;
           $scope.invoicDEtails.commentsAndHistory=[];
           $scope.invoicDEtails.termtype = "Custom";
           $scope.invoicDEtails.roFruitNames = angular.copy(updatedForm.roFruitNames);
             $scope.changeDate = angular.copy($scope.Startdate);

              
         $scope.invoicDEtails.commentsAndHistory.push({
              done: false,
              text: "Invoice was created by"+userName,
              date:new Date()
         });

          if($scope.TDinvoice.saveOption == "saveAsPending"){
          $scope.status = "Pending";
         }else{
          $scope.status = "Unpaid";
         }
         
         $scope.invoicDEtails.MultiDueDAtesArr= [{
                           DueDate: updatedForm.duedate,
                           Percentage: "0",
                           dueDateprice: $rootScope.famount,
                           paymentStatus:$scope.status,
                           balance :$rootScope.famount,
                        }];

         // if($rootScope.prodArray.val.length >0){
         //$scope.TDinvoice.UploadImages.val = UploaderService.loadBasicArray();
         client.onComplete(function(data) {
            $state.go('viewProfile', {'profileName': $scope.refNo});
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

         $scope.invoicCount = parseInt(updatedForm.occurences);
          $scope.invoDetails = [];
          $scope.invoicDEtails.invoiceNo = "-999";
          $scope.tryLogic = angular.copy($scope.invoicDEtails);

          for (var i = $scope.invoicCount- 1; i >= 0; i--) {
            $scope.invoicDEtails = {};
            $scope.invoicDEtails = angular.copy($scope.tryLogic);

            switch(updatedForm.billingFrequency) {
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
                        console.log(now.getFullYear())
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
      // }else{  
      //   $mdDialog.show(
      //          $mdDialog.alert()
      //          .parent(angular.element(document.body))
      //          .title('')
      //          .content('add line Item')
      //          .ariaLabel('Alert Dialog Demo')
      //          .ok('OK')
      //       );
      // }
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

    $scope.viewProfile = function() {
        $state.go('settings.AllRecurring_Invoices')
    }

    $scope.addProductArray = function(ev, arr) {
            $rootScope.taxType = angular.copy($scope.AllTaxes);
            $rootScope.AllUnitOfMeasures = angular.copy($scope.UOM)
            $rootScope.Showdiscount = angular.copy($scope.Displaydiscount);
            $rootScope.discounts = angular.copy($scope.dis);
            $rootScope.DisplayTaxes = angular.copy($scope.ShowTaxes);
            if ($rootScope.Showdiscount == true) {
                if ($rootScope.discounts == "Individual Items") {
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

                    $scope.addproductToarray = function(item, ev) {
                            $scope.promoItems[0] = {
                                productName: $scope.SproductName,
                                price: $scope.Sprice,
                                tax: $scope.Stax,
                                ProductUnit: $scope.SProductUnit,
                                qty: $scope.Sqty,
                                discount: $scope.discount,
                                olp: $scope.olp,
                                status: $scope.Sstatus
                            }
                            for (var i = $scope.promoItems.length - 1; i >= 0; i--) {

                                if ($scope.promoItems[i].qty == null) {
                                    $scope.showActionToast = function() {
                                        var toast = $mdToast.simple()
                                            .content('Action Toast!')
                                            .action('OK')
                                            .highlightAction(false)
                                            .position($scope.getToastPosition());
                                        $mdToast.show(toast).then(function(response) {
                                            if (response == 'ok') {
                                                alert('You clicked \'OK\'.');
                                            }
                                        });
                                    };
                                } else if ($scope.promoItems[i].ProductUnit == null) {

                                } else if ($scope.promoItems[i].price == null) {

                                } else {
                                   recurringInvoiceService.setTempArr({
                                        Productname: $scope.promoItems[i].productName,
                                        price: $scope.promoItems[i].price,
                                        quantity: $scope.promoItems[i].qty,
                                        ProductUnit: $scope.promoItems[i].ProductUnit,
                                        discount: $scope.promoItems[i].discount,
                                        tax: $scope.promoItems[i].tax,
                                        olp: $scope.promoItems[i].olp,
                                        amount: $scope.Amount,
                                        status: $scope.promoItems[i].status,
                                    });

                                    if ($scope.promoItems[i].status == 'notavailable') {
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
                                                $scope.prod.productprice = $scope.promoItems[i].price;
                                                $scope.prod.ProductUnit = $scope.promoItems[i].ProductUnit;
                                                $scope.prod.producttax = $scope.promoItems[i].tax;

                                                $scope.FirstLetters = $scope.promoItems[i].productName.substring(0, 3).toUpperCase();
                                                if ($scope.product.length > 0) {
                                                    $scope.PatternExsist = false;
                                                    $scope.MaxID = 0;
                                                    for (y = 0; y <= $scope.product.length - 1; y++) {
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
                                                    } else if ($scope.PatternExsist) {
                                                        $scope.GetMaxNumber($scope.prod, $scope.FirstLetters, $scope.MaxID)
                                                    }
                                                } else {
                                                    $scope.prod.ProductCode = $scope.FirstLetters + '-0001';
                                                    $scope.prod.ProductCodeID = 1;
                                                }
                                            }

                                            $scope.GetMaxNumber = function(obj, name, MaxID) {
                                                $scope.FinalNumber = MaxID + 1;
                                                $scope.FinalNumberLength = $scope.FinalNumber.toString().length;
                                                $scope.Zerros = "";
                                                for (i = 0; i < 4 - $scope.FinalNumberLength; i++) {
                                                    var str = "0";
                                                    $scope.Zerros = $scope.Zerros + str;
                                                }
                                                $scope.Zerros = $scope.Zerros + $scope.FinalNumber.toString();
                                                obj.ProductCodeID = $scope.FinalNumber;
                                                obj.ProductCode = name + '-' + $scope.Zerros;
                                            }

                                            $scope.prod.ProductCategory = "Product";
                                            $scope.prod.progressshow = "false"
                                            $scope.prod.favouriteStar = false;
                                            $scope.prod.favouriteStarNo = 1;
                                            $scope.prod.tags = [];
                                            $scope.prod.todaydate = new Date();
                                            $scope.prod.UploadImages = {
                                                val: []
                                            };
                                            $scope.prod.UploadBrochure = {
                                                val: []
                                            };
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
                                        }, function() {});
                                    }
                                    for (var i = $rootScope.editProdArray.val.length - 1; i >= 0; i--) {
                                        $rootScope.invoiceArray[0].invoiceProducts.push($rootScope.editProdArray.val[i]);
                                        for (var i = $rootScope.calTax.length - 1; i >= 0; i--) {
                                            $rootScope.getTax.push($rootScope.calTax[i])
                                        };
                                    };
                                    $mdDialog.hide();
                                }
                            }
                        }

                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    }

                    $scope.promoItems.push({
                        productName: '',
                        price: '',
                        tax: '',
                        ProductUnit: '',
                        qty: '',
                        discount: '',
                        olp: '',
                        status: ''
                    });
                    $scope.TaxDisabled = false;
                    $scope.setSelectedClient = function(package) {
                        $scope.promoItems.tax = 0;
                        $scope.discount = 0;

                        for (var i = 0; i < $scope.product.length; i++) {

                            if ($scope.product[i].Productname.toLowerCase() === package.toLowerCase()) {
                                $scope.SproductName = package;
                                $scope.Sprice = $scope.product[i].productprice;
                                $scope.SProductUnit = $scope.product[i].ProductUnit;
                                $scope.Sqty = $scope.qty;
                                $scope.Solp = $scope.olp;
                                $scope.Stax = $scope.product[i].producttax;
                                $scope.Sstatus = "available"
                                $scope.promoItems.splice(0, 1)
                                $scope.promoItems.push({
                                    productName: package,
                                    price: $scope.product[i].productprice,
                                    tax: $scope.product[i].producttax,
                                    ProductUnit: $scope.product[i].ProductUnit,
                                    qty: $scope.qty,
                                    discount: $scope.discount,
                                    olp: $scope.olp,
                                    status: "available"
                                });
                                $scope.TaxDisabled = false;
                                break;
                            } else if ($scope.product[i].Productname.toLowerCase() != package.toLowerCase()) {
                                $scope.SproductName = package;
                                $scope.Sprice = $scope.productPrice;
                                $scope.SProductUnit = $scope.promoItems.ProductUnit;
                                $scope.Sqty = $scope.qty;
                                $scope.Solp = $scope.olp;
                                $scope.Stax = $scope.Ptax;
                                $scope.Sstatus = "notavailable"
                                $scope.promoItems.splice(0, 1)
                                $scope.promoItems.push({
                                    productName: '',
                                    price: '',
                                    tax: '',
                                    qty: '',
                                    discount: '',
                                    ProductUnit: "each",
                                    olp: '',
                                    status: "notavailable"
                                });
                                $scope.TaxDisabled = false;
                            }
                        }
                    };

                    $scope.setprice = function(pd) {
                        $scope.Sprice = pd.price;
                    }
                    $scope.setTax = function(pDis) {
                        for (var i = $rootScope.taxType.length - 1; i >= 0; i--) {
                            if ($rootScope.taxType[i].taxname == pDis.tax.taxname) {
                                $scope.Ptax = ({
                                    taxname: $rootScope.taxType[i].taxname,
                                    activate: $rootScope.taxType[i].activate,
                                    compound: $rootScope.taxType[i].compound,
                                    rate: $rootScope.taxType[i].rate,
                                    type: $rootScope.taxType[i].type,
                                    individualtaxes: $rootScope.taxType[i].individualtaxes
                                });
                            }
                        };
                        $scope.Stax = $scope.Ptax;
                    }
                    $scope.setUOM = function(pUOM) {
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
                        client.onError(function(data) {});
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

        $scope.deleteEditproduct = function(name, index) {
          $rootScope.invoiceArray[0].invoiceProducts.splice($rootScope.invoiceArray[0].invoiceProducts.indexOf(name), 1);
            recurringInvoiceService.ReverseTax(name, index);
            console.log($rootScope.getTax)
            $scope.CalculateTax();
        }

        $scope.viewSavedProducts = function(obj) {
            $mdDialog.show({
                templateUrl: 'Invoicepartials/showproduct.html',
                controller: 'RecshowproductCtrl',
                locals: {
                    item: obj
                }
            });
        }

});
app.controller('RecshowproductCtrl', function($scope, $mdDialog, $rootScope, recurringInvoiceService, item, $objectstore, $uploader, $state) {
    $scope.test = item;
    $scope.settings = {};
        $scope.UnitOfMeasure = [];
        $scope.taxType = []
        $scope.AllTaxes = [];
        $scope.individualTax = [];
         $scope.test = item;
        $scope.prevTrax = angular.copy($scope.test)

        var client = $objectstore.getClient("Settings12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                $scope.settings = data;
                for (var i = $scope.settings.length - 1; i >= 0; i--) {
                    for (var z = $scope.settings[i].preference.productpref.units.length - 1; z >= 0; z--) {
                        if ($scope.settings[i].preference.productpref.units[z].activate == true) {
                            $scope.UnitOfMeasure.push($scope.settings[i].preference.productpref.units[z])
                        }
                        $scope.ShowDiscount = $scope.settings[i].preference.invoicepref.enableDisscounts;
                        $scope.dis = $scope.settings[i].preference.invoicepref.disscountItemsOption;
                    };
                    if ($scope.settings[i].taxes) {
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
        client.onError(function(data) {});
        client.getByFiltering("*");

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.setTax = function(pDis) {
            for (var i = $scope.AllTaxes.length - 1; i >= 0; i--) {
                if ($scope.AllTaxes[i].taxname == pDis.tax.taxname) {
                    $scope.Ptax = ({
                        taxname: $scope.AllTaxes[i].taxname,
                        activate: $scope.AllTaxes[i].activate,
                        compound: $scope.AllTaxes[i].compound,
                        rate: $scope.AllTaxes[i].rate,
                        type: $scope.AllTaxes[i].type,
                        individualtaxes: $scope.AllTaxes[i].individualtaxes
                    });
                }
            };
            item.tax = $scope.Ptax;
        }

    $scope.edit = function(tst, index) {
        // $rootScope.editProdArray.val.splice(tst, 1);
        for (var i = $rootScope.invoiceArray[0].MultiDueDAtesArr.length - 1; i >= 0; i--) {
            $scope.ttt = $rootScope.invoiceArray[0].MultiDueDAtesArr[i].paymentStatus;
            }
            if($state.current.name == 'edit'){
               if( $scope.ttt == "Paid"){

                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Warning')
                    .content('Since you have done a payment to this invoice you cannot edit this nvoice')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                );

            }else{
                // $rootScope.editProdArray.val.splice($rootScope.editProdArray.val.indexOf(tst), 1);
                 $rootScope.invoiceArray[0].invoiceProducts.splice($rootScope.invoiceArray[0].invoiceProducts.indexOf(tst), 1);
                recurringInvoiceService.ReverseTax($scope.prevTrax, index);

                recurringInvoiceService.setTempArr({
                    Productname: item.Productname,
                    price: item.price,
                    quantity: item.quantity,
                    ProductUnit: item.ProductUnit,
                    discount: item.discount,
                    tax: item.tax,
                    olp: item.olp,
                    amount: $scope.Amount,
                    status: item.status
                })
                for (var i = $rootScope.editProdArray.val.length - 1; i >= 0; i--) {
                $rootScope.invoiceArray[0].invoiceProducts.push($rootScope.editProdArray.val[i]);
                for (var i = $rootScope.calTax.length - 1; i >= 0; i--) {
                    $rootScope.getTax.push($rootScope.calTax[i])
                };
            };
                $mdDialog.cancel();
                    }     

            }else{
                //$rootScope.editProdArray.val.splice($rootScope.editProdArray.val.indexOf(tst), 1);
                $rootScope.invoiceArray[0].invoiceProducts.splice($rootScope.invoiceArray[0].invoiceProducts.indexOf(tst), 1);
                recurringInvoiceService.ReverseTax($scope.prevTrax, index);

                recurringInvoiceService.setTempArr({
                    Productname: item.Productname,
                    price: item.price,
                    quantity: item.quantity,
                    ProductUnit: item.ProductUnit,
                    discount: item.discount,
                    tax: item.tax,
                    olp: item.olp,
                    amount: $scope.Amount,
                    status: item.status
                })
                for (var i = $rootScope.editProdArray.val.length - 1; i >= 0; i--) {
                $rootScope.invoiceArray[0].invoiceProducts.push($rootScope.editProdArray.val[i]);
                for (var i = $rootScope.calTax.length - 1; i >= 0; i--) {
                    $rootScope.getTax.push($rootScope.calTax[i])
                };
            };
                $mdDialog.cancel();
            }
    };
    $scope.calAMount = function() {
         $scope.Amount = 0;
            $scope.total = 0;
            $scope.disc = 0;

            $scope.total = (item.price * item.quantity);

            if ($scope.dis == "Individual Items") {
                $scope.disc = parseFloat($scope.total * item.discount / 100);
                $scope.Amount = $scope.total - $scope.disc;
            } else {
                $scope.Amount = $scope.total;
            }

            return $scope.Amount;
        }
    
});