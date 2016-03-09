// angular.module('mainApp').
app.controller('editRecurring', function($scope, $mdDialog, $objectstore, $window, $rootScope, recurringInvoiceService, $filter, $state, $location, invoiceDetails, InvoiceService) {

    for (var i = $rootScope.invoiceArray.length - 1; i >= 0; i--) {
        if ($rootScope.invoiceArray[i].status == "Draft") {
            $scope.showSave = true;
        }
    };
    if ($state.current.name == 'CopyRec') {
        $scope.saveInvoiceB = true;
    } else if ($state.current.name == 'estimateInvoice') {
        $scope.saveInvoiceB = true;
    } else {
        $scope.editInvoiceB = true;
    }

    $scope.calAMount = function(data) {
        $scope.Amount = 0;
        $scope.Amount = (((data.price * data.quantity) - ((data.price * data.quantity) * data.discount / 100)) + ((data.price * data.quantity)) * data.tax / 100);
        return $scope.Amount;
    }

    $scope.calculatetotal = function(data) {
        $scope.total = 0;
        angular.forEach(data.recurringProducts, function(tdIinvoice) {
            $scope.total += (tdIinvoice.price * tdIinvoice.quantity);
        })
        return $scope.total;
    };
    $scope.finaldiscount = function(data) {
        $scope.finalDisc = 0;
        $scope.Discount = 0;
        angular.forEach(data.recurringProducts, function(tdIinvoice) {
            $scope.Discount += parseInt(tdIinvoice.discount);
            $scope.finalDisc = parseInt($scope.total * $scope.Discount / 100);
        })
        return $scope.finalDisc;
    }
    $scope.CalculateTax = function(data) {
        $scope.salesTax = 0;

        angular.forEach(data.recurringProducts, function(tdIinvoice) {
            $scope.salesTax += parseInt($scope.total * tdIinvoice.tax / 100);
        })
        return $scope.salesTax;

    }
    $scope.CalculateOtherTax = function(data) {
        $scope.otherTax = 0;
        $scope.otherTax = $scope.salesTax + ($scope.total * data.anotherTax / 100);
        return $scope.otherTax;
    }
    $scope.finalamount = function(data) {
        $rootScope.famount = 0;
        $rootScope.famount = parseInt($scope.total - $scope.finalDisc) +
            parseInt($scope.salesTax) + parseInt($scope.otherTax) + parseInt(data.shipping);
        return $rootScope.famount;
    };

    $scope.viewProfile = function() {
        $state.go('settings.AllRecurring_Invoices')
    }

    $scope.editRecurring = function(updatedForm) {
        updatedForm.profileName = updatedForm.profileName.toString();

        if (updatedForm.status == "Draft") {
            var client = $objectstore.getClient("twethdoorProfileDraft");
            //updatedForm.invoiceProducts = $rootScope.showprodArray.val;
            updatedForm.total = $scope.total;
            updatedForm.finalamount = $scope.famount;
            // for (var i = $rootScope.editProdArray.val.length - 1; i >= 0; i--) {
            //   updatedForm.invoiceProducts.push($rootScope.editProdArray.val[i]);
            // };
            //  $scope.systemMessage.push({text:"The Invoice was Edited by mr.Perera", done:false,  date:new Date()});
            // for (var i = $scope.systemMessage.length - 1; i >= 0; i--) {
            //  updatedForm.commentsAndHistory.push($scope.systemMessage[i]);
            // };
            console.log(updatedForm);
            client.onComplete(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('')
                    .content('Recurring Profile Successfully Saved')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent(data)
                );
            });
            client.onError(function(data) {});
            client.insert(updatedForm, {
                KeyProperty: "profileName"
            });
        } else {

            var client = $objectstore.getClient("RecurringProfile");
            //updatedForm.invoiceProducts = $rootScope.showprodArray.val;
            updatedForm.total = $scope.total;
            updatedForm.finalamount = $scope.famount;
            $scope.systemMessage.push({
                text: "The Invoice was Edited by mr.Perera",
                done: false,
                date: new Date()
            });
            for (var i = $scope.systemMessage.length - 1; i >= 0; i--) {
                updatedForm.commentsAndHistory.push($scope.systemMessage[i]);
            };
            client.onComplete(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('')
                    .content('Recurring Profile Successfully Saved')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent(data)
                );
            });
            client.onError(function(data) {});
            client.insert(updatedForm, {
                KeyProperty: "profileName"
            });
        }
    }

    $scope.saveRecurring = function(updatedForm) {
        recurringInvoiceService.removeArray1(0, 1);
        recurringInvoiceService.setArray1($scope.TDinvoice);

        var client = $objectstore.getClient("RecurringProfile");
        $scope.TDinvoice.recurringProducts = updatedForm.recurringProducts;
        $scope.TDinvoice.total = $scope.total;
        $scope.TDinvoice.profileRefName = $scope.refNo;
        $scope.TDinvoice.finalamount = $scope.famount;
        $scope.TDinvoice.discountAmount = $scope.finalDisc;
        $scope.TDinvoice.salesTaxAmount = $scope.salesTax;
        $scope.TDinvoice.otherTaxAmount = $scope.otherTax;
        $scope.TDinvoice.status = "Active";
        $scope.TDinvoice.favourite = false;
        $scope.TDinvoice.favouriteStarNo = 1;
        $scope.TDinvoice.Name = updatedForm.Name;
        // $scope.TDinvoice.Email = updatedForm.Email;
        $scope.TDinvoice.billingAddress = updatedForm.billingAddress;
        $scope.TDinvoice.shippingAddress = updatedForm.shippingAddress;
        // $scope.TDinvoice.UploadImages = {
        //    val: []
        // };

        //$scope.TDinvoice.UploadImages.val = UploaderService.loadBasicArray();
        client.onComplete(function(data) {
            $state.go('viewProfile', {
                'profileName': $scope.refNo
            });
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('')
                .content('Recurring Profile Successfully Saved')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent(data)
            );
        });

        $scope.TDinvoice.profileName = "-999";
        client.insert([$scope.TDinvoice], {
            KeyProperty: "profileName"
        });


        client.onError(function(data) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('Sorry')
                .content('Error saving Recurring Profile')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent(data)
            );
        });
    }
    $scope.deleteEditproduct = function(name) {
        InvoiceService.removeArray2(name);
    }
    $scope.addprofProduct = function(ev, arr) {
        $rootScope.tableContent = [];
        $rootScope.tableContent = arr;

        $mdDialog.show({
            templateUrl: 'Invoicepartials/addproduct.html',
            targetEvent: ev,
            controller: function editProductController($scope, $mdDialog) {
                $scope.prducatsAdd = {};
                $scope.prod = {};
                $scope.promoItems = [];
                //add product to the invoice
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
                                InvoiceService.setArray2({
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
                                //console.log($rootScope.editProdArray.val)
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

                                            console.log($scope.promoItems[i].tax);
                                            $scope.FirstLetters = $scope.promoItems[i].productName.substring(0, 3).toUpperCase();
                                            if ($scope.product.length > 0) {
                                                //if array is not empty
                                                $scope.PatternExsist = false; // use to check pattern match the object of a array 
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
                                // console.log($rootScope.editProdArray.val)
                                for (var i = $rootScope.editProdArray.val.length - 1; i >= 0; i--) {
                                    $rootScope.invoiceArray[0].recurringProducts.push($rootScope.editProdArray.val[i]);
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
                            $scope.Stax = $scope.promoItems.tax;
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
                    $scope.Stax = pDis.tax;
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
                    // angular.forEach($scope.promoItems, function(tdIinvoice) {
                    $scope.Amount = $scope.Sprice * $scope.Sqty;
                    // })
                    return $scope.Amount;
                }
            }
        })
    }

    $scope.InvoiceDetails = [];
    var client = $objectstore.getClient("domainClassAttributes");
    client.onGetMany(function(data) {
        if (data) {
            $scope.InvoiceDetails = data;

            for (var i = $scope.InvoiceDetails.length - 1; i >= 0; i--) {
                $scope.ID = $scope.InvoiceDetails[i].maxCount;
            };
            $scope.maxID = parseInt($scope.ID) + 1;
            $scope.refNo = $scope.maxID.toString();
        }
    });
    client.getByFiltering("select maxCount from domainClassAttributes where class='invoice12thdoorDraft'");

    $scope.savetoProfile = function(obj) {
        console.log(obj)
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('')
            .content('Are You Sure You Want To save it?')
            .ok('Save')
            .cancel('Cancel')
            .targetEvent(obj);
        $mdDialog.show(confirm).then(function() {
            var draftdelete = $objectstore.getClient("twethdoorProfileDraft");

            draftdelete.onComplete(function(data) {

                obj.profileRefName = $scope.refNo;
                obj.status = "Active";
                var newInsert = $objectstore.getClient("RecurringProfile");
                newInsert.onComplete(function(data) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .title('')
                        .content('Recurring Profile Successfully Saved')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                        .targetEvent(data)
                    );
                    $state.go('viewProfile', {
                        'profileName': $scope.refNo
                    }, {
                        reload: true
                    });
                });
                newInsert.onError(function(data) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .title('Sorry')
                        .content('Error saving Recurring Profile')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                        .targetEvent(data)
                    );
                });
                obj.profileName = "-999";
                newInsert.insert(obj, {
                    KeyProperty: "profileName"
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
            draftdelete.deleteSingle(obj.profileName.toString(), "profileName");
        }, function() {
            $mdDialog.hide();
        });
    }

})