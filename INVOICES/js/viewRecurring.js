// angular.module('mainApp')
app.controller('ViewRecurring', function($scope, $mdDialog, $objectstore, $stateParams, uiInitilize, $window, $rootScope, recurringInvoiceService, $filter, $state, $location, invoiceDetails, InvoiceService) {
        $scope.TDinvoice = [];
        $scope.newItems = [];
        $scope.show = false;
        $scope.showTable = false;
        $scope.obtable = [];
        $scope.invoiceArray.shipping = 0;

        // ------------------------------------virtual repeat start-----------------


        setInterval(function interval() {
            $scope.viewPortHeight = window.innerHeight;
            $scope.viewPortHeight = $scope.viewPortHeight + "px";
        }, 100);

        $scope.items = uiInitilize.insertIndex($scope.TDinvoice);

        //This holds the UI logic for the collapse cards
        $scope.toggles = {};
        $scope.toggleOne = function($index) {
            $scope.toggles = uiInitilize.openOne($scope.TDinvoice, $index);
        }

        // ------------------------------------virtual repeat end -------------




        var vm = this;
        $scope.announceClick = function(index) {
            $mdDialog.show(
                $mdDialog.alert()
                .title('You clicked!')
                .content('You clicked the menu item at index ' + index)
                .ok('ok')
            );
        };
        $scope.sortableOptions = {
            containment: '#sortable-container'
        };
        $rootScope.tenants = loadAll();
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

        function loadAll() {
            var client = $objectstore.getClient("RecurringProfile");
            client.onGetMany(function(data) {
                if (data) {
                    for (i = 0, len = data.length; i < len; ++i) {
                        $scope.customerNames.push({
                            display: data[i].Name,
                            value: data[i]
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
        $scope.viewSavedProducts = function(obj) {
            $mdDialog.show({
                templateUrl: 'Invoicepartials/showproduct.html',
                controller: 'productCtrl',
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

        $scope.deleteRecurringInvoice = function(deleteform, ev) {
            if (deleteform.invoiceNo == "-999") {
                deleteform.invoiceNo = angular.copy(deleteform.profileRefName);
            }
            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.body))
                .title('')
                .content('Are You Sure You Want To Delete This Record? This process is not reversible')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                var client = $objectstore.getClient("RecurringProfile");
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

                client.deleteSingle(deleteform.profileName.toString(), "profileName");
            }, function() {
                $mdDialog.hide();

            });

            $state.go('settings.AllRecurring_Invoices')
        }

        $scope.EditRecurringInvoice = function(InvoItem) {
            recurringInvoiceService.removeArray1(InvoItem, 1);
            recurringInvoiceService.setArray1(InvoItem);
            //location.href = '#/editInvoiceDetails/'+InvoItem.invoiceNo;
            //$state.go('#/editInvoiceDetails/',{'invoiceno':InvoItem.invoiceNo});
            $state.go('ediTRec', {
                'profilename': InvoItem.profileName
            })
        }

        $scope.copyRecurringInvoice = function(InvoItem) {
            recurringInvoiceService.removeArray1(InvoItem, 1);
            recurringInvoiceService.setArray1(InvoItem);
            $state.go('CopyRec')
        }

        $scope.systemMessage = [];
        $scope.cancelStatus = function(obj, ev) {
            var confirm = $mdDialog.confirm()
                .title('Do you wish to cancel this Recurring Profile' + obj.profileName + '? This process is not reversible')
                .content('')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {
                var client = $objectstore.getClient("RecurringProfile");
                obj.profileName = obj.profileName.toString();
                // if(obj.status != "Draft"){
                $scope.systemMessage.push({
                    text: "The Recurring Profile was Cancelled by mr.Perera",
                    done: false,
                    date: new Date()
                });
                for (var i = $scope.systemMessage.length - 1; i >= 0; i--) {
                    obj.commentsAndHistory.push($scope.systemMessage[i]);
                };

                obj.status = "Cancelled";
                client.onComplete(function(data) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .title('')
                        .content('invoice Successfully Cancelled')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                        .targetEvent(data)
                    );
                });
                client.onError(function(data) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .content('Error Occure while Adding cancelling Invoice')
                        .ariaLabel('')
                        .ok('OK')
                        .targetEvent(data)
                    );
                });
                client.insert(obj, {
                    KeyProperty: "profileName"
                });
                // }
            })
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

        $scope.finalamount = function(data) {
            $rootScope.famount = 0;
            $rootScope.famount = parseInt($scope.total - $scope.finalDisc) +
                parseInt($scope.salesTax) + parseInt(data.shipping);
            return $rootScope.famount;
        };

        $scope.addProfile = function() {
            location.href = '#/NewRecurring_profile';
            $rootScope.selctedName = null;
        }

        $scope.OpenProfile = function(InvoItem) {
            $rootScope.invoiceArray.splice(InvoItem, 1);
            recurringInvoiceService.setArray1(InvoItem);
            //location.href = '#/viewInvoice';
            $state.go('viewProfile', {
                'profileName': InvoItem.profileName
            });
        }
        $scope.viewProfile = function() {
            $state.go('settings.AllRecurring_Invoices');

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
        $scope.DemoCtrl2 = function($timeout, $q) {
            var self = this;
            self.readonly = true;
            self.invoice = [];
            self.tags = [];
            self.invoice.roFruitNames = $scope.TDinvoice.roFruitNames;
            self.newVeg = function(chip) {
                return {
                    name: chip,
                    type: 'unknown'
                };
            };
        }

        var client = $objectstore.getClient("RecurringProfile");
        client.onGetMany(function(data) {
            if (data) {
                for (var i = data.length - 1; i >= 0; i--) {
                    data[i].invoiceNo = parseInt(data[i].invoiceNo);
                    $scope.TDinvoice.push(data[i]);

                    if ($stateParams.profileName == data[i].profileName) {
                        recurringInvoiceService.removeArray1(data[i], 1);
                        recurringInvoiceService.setArray1(data[i]);
                        $scope.Address = data[i].billingAddress.split(',');
                        $scope.street = $scope.Address[0];
                        $scope.city = $scope.Address[1] + $scope.Address[3];
                        $scope.country = $scope.Address[2] + $scope.Address[4];

                        $scope.shippingAddress = data[i].shippingAddress.split(',');
                        $scope.ShippingStreet = $scope.shippingAddress[0];
                        $scope.ShippingCity = $scope.shippingAddress[1] + $scope.shippingAddress[3];
                        $scope.ShippingCountry = $scope.shippingAddress[2] + $scope.shippingAddress[4];
                    }
                };
            }
        });
        client.onError(function(data) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('This is embarracing')
                .content('There was an error retreving the data.')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent(data)
            );
        });
        client.getByFiltering("*");

        var client = $objectstore.getClient("twethdoorProfileDraft");
        client.onGetMany(function(data) {
            if (data) {
                for (var i = data.length - 1; i >= 0; i--) {
                    data[i].invoiceNo = parseInt(data[i].invoiceNo);
                    $scope.TDinvoice.push(data[i]);

                    if ($stateParams.profileName == data[i].profileName) {
                        recurringInvoiceService.removeArray1(data[i], 1);
                        recurringInvoiceService.setArray1(data[i]);
                        $scope.Address = data[i].billingAddress.split(',');
                        $scope.street = $scope.Address[0];
                        $scope.city = $scope.Address[1] + $scope.Address[3];
                        $scope.country = $scope.Address[2] + $scope.Address[4];

                        $scope.shippingAddress = data[i].shippingAddress.split(',');
                        $scope.ShippingStreet = $scope.shippingAddress[0];
                        $scope.ShippingCity = $scope.shippingAddress[1] + $scope.shippingAddress[3];
                        $scope.ShippingCountry = $scope.shippingAddress[2] + $scope.shippingAddress[4];
                    }
                };
            }
        });
        client.onError(function(data) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('This is embarracing')
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

        $scope.invoiceDetails = [];

        var client = $objectstore.getClient("invoice12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                // $scope.TDinvoice = data;
                for (var i = data.length - 1; i >= 0; i--) {
                    //data[i].invoiceNo = parseInt(data[i].invoiceNo);
                    $scope.invoiceDetails.push(data[i]);

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

        $scope.todos = [];
        $scope.markAll = false;

        $scope.addTodo = function(todoText) {
            if (event.keyCode == 13) {
                $scope.todos.push({
                    text: todoText.addView,
                    done: false,
                    date: new Date()
                });

                console.log(todoText.addView)

                var client = $objectstore.getClient("RecurringProfile");
                todoText.invoiceNo = todoText.invoiceNo.toString();

                for (var i = $scope.todos.length - 1; i >= 0; i--) {
                    todoText.commentsAndHistory.push($scope.todos[i]);
                };
                todoText.addView = "";
                client.onComplete(function(data) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .content('successfull')
                        .ariaLabel('')
                        .ok('OK')
                        .targetEvent(data)
                    );
                });
                client.onError(function(data) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .content('Error Occure while Adding cancelling Invoice')
                        .ariaLabel('')
                        .ok('OK')
                        .targetEvent(data)
                    );
                });
                client.insert(todoText, {
                    KeyProperty: "profileName"
                });
            }
        };


    }); //END OF viewCtrl
    //-----------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------
    app.factory('recurringInvoiceService', function($rootScope) {
        $rootScope.prodArray = {val: []};
        $rootScope.invoiceArray = [];
        $rootScope.fullArr = {val: []};
        $rootScope.editProdArray = {val: []};
        $rootScope.correctArr = [];

        $rootScope.fullArr = {val: []};
        $rootScope.taxArr2 = [];
        $rootScope.taxArr1 = [];
        $rootScope.correctArr = [];
        $rootScope.compoundcal = [];

        $rootScope.setTempArr = {val: []};

        $rootScope.calTax = [];
        $rootScope.correctArr1 = [];
        $rootScope.calCompound = [];
        $rootScope.trueComp = [];
        $rootScope.falseComp = [];
        $rootScope.compountTrue = [];
        $rootScope.calculateCompound = [];
        return {
            setArray: function(newVal) {
                $rootScope.prodArray.val.push(newVal);
                return $rootScope.prodArray;
            },
            removeArray: function(newVals) {
                $rootScope.prodArray.val.splice(newVals, 1);
                return $rootScope.prodArray;
            },
            setArray1: function(newVal) {
                $rootScope.invoiceArray.push(newVal);
                return $rootScope.invoiceArray;
            },
            removeArray1: function(newVals) {
                $rootScope.invoiceArray.splice(newVals, 1);
                return $rootScope.invoiceArray;
            },
            seteditArrayView: function(vall, arry) {
                arry.push(vall);
                return arry;
            },
            setArray2: function(newVal) {
                $rootScope.editProdArray.val.push(newVal);
                return $rootScope.editProdArray;
            },
            removeArray2: function(newVals) {
                $rootScope.editProdArray.val.splice(newVals, 1);
                return $rootScope.editProdArray;
            },
            setFullArr: function(obj) {
                this.setArray(obj);
                $rootScope.correctArr = [];
                $rootScope.multiTax = [];
                $rootScope.total = 0;
                $rootScope.compoundcal = [];
                $rootScope.calculateCompound = [];
                $rootScope.falseComp = [];
                $rootScope.trueComp = [];

                if (obj.tax != null) {
                    if (obj.tax.type == "individualtaxes") {
                        if (obj.tax.rate == 0) {} else {
                            $rootScope.taxArr2.push({
                                taxName: obj.tax.taxname,
                                rate: obj.tax.rate,
                                salesTax: parseInt(obj.amount * obj.tax.rate / 100),
                                compoundCheck: obj.tax.compound
                            })
                        }
                    } else if (obj.tax.type == "multipletaxgroup") {
                        for (var x = obj.tax.individualtaxes.length - 1; x >= 0; x--) {

                            if (obj.tax.individualtaxes[x].compound == false) {
                                $rootScope.falseComp.push(obj.tax.individualtaxes[x]);
                            } else if (obj.tax.individualtaxes[x].compound == true) {
                                $rootScope.trueComp.push(obj.tax.individualtaxes[x])
                                $rootScope.compountTrue = $rootScope.trueComp.sort(function(a, b) {
                                    return a.positionId > b.positionId ? 1 : a.positionId < b.positionId ? -1 : 0;
                                });
                            }
                        }
                        $rootScope.calculateCompound = $rootScope.falseComp.concat($rootScope.compountTrue);
                        var tcopmAmount = 0;
                        var fcompAmount = 0;
                        var finalCal = 0;
                        for (var y = 0; y <= $rootScope.calculateCompound.length - 1; y++) {

                            if ($rootScope.calculateCompound[y].compound == false) {
                                fcompAmount = parseFloat(obj.amount * $rootScope.calculateCompound[y].rate / 100)
                                $rootScope.total = fcompAmount;
                            } else if (obj.tax.individualtaxes[y].compound == true) {
                                tcopmAmount = parseFloat(fcompAmount + obj.amount);
                                finalCal = (parseFloat(finalCal + tcopmAmount) * obj.tax.individualtaxes[y].rate / 100);
                                $rootScope.total = finalCal;
                            }
                            if ($rootScope.calculateCompound[y].rate == 0) {

                            } else {
                                $rootScope.taxArr2.push({
                                    taxName: $rootScope.calculateCompound[y].taxname,
                                    rate: $rootScope.calculateCompound[y].rate,
                                    salesTax: $rootScope.total,
                                    compoundCheck: $rootScope.calculateCompound[y].compound
                                })
                            }
                        }
                    }
                    $rootScope.taxArr2 = $rootScope.taxArr2.sort(function(a, b) {
                        return a.taxName.toLowerCase() > b.taxName.toLowerCase() ? 1 : a.taxName.toLowerCase() < b.taxName.toLowerCase() ? -1 : 0;
                    });

                    if ($rootScope.taxArr2.length > 1) {
                        for (l = 0; l <= $rootScope.taxArr2.length - 1; l++) {
                            if ($rootScope.taxArr2[l + 1]) {

                                if ($rootScope.taxArr2[l].taxName == $rootScope.taxArr2[l + 1].taxName) {
                                    var sumSalesTax = 0;
                                    var txtName = $rootScope.taxArr2[l].taxName;
                                    var rate = $rootScope.taxArr2[l].rate;
                                    var compound = $rootScope.taxArr2[l].compoundCheck;
                                    sumSalesTax = $rootScope.taxArr2[l].salesTax + $rootScope.taxArr2[l + 1].salesTax;

                                    $rootScope.taxArr2.splice(l, 2);
                                    $rootScope.taxArr2.push({
                                        taxName: txtName,
                                        rate: rate,
                                        salesTax: sumSalesTax,
                                        compoundCheck: compound
                                    })
                                    $rootScope.taxArr2.sort(function(a, b) {
                                        return a.taxName.toLowerCase() > b.taxName.toLowerCase() ? 1 : a.taxName.toLowerCase() < b.taxName.toLowerCase() ? -1 : 0;
                                    });
                                };
                            };
                        }
                    }
                }
            },
            ReverseEditTax: function(obj, index) {
                 var arr = [];
                var results = [];
                $rootScope.compoundcal = [];
                $rootScope.calculateCompound = [];
                $rootScope.falseComp = [];
                $rootScope.trueComp = [];
                var tcopmAmount = 0;
                var fcompAmount = 0;
                var finalCal = 0;
                var tax = 0;
                for (var i = $rootScope.prodArray.val.length - 1; i >= 0; i--) {

                    if ($rootScope.prodArray.val[i].tax.type == "individualtaxes") {
                        arr.push($rootScope.prodArray.val[i].tax.taxname)

                    } else if ($rootScope.prodArray.val[i].tax.type == "multipletaxgroup") {
                        for (var x = $rootScope.prodArray.val[i].tax.individualtaxes.length - 1; x >= 0; x--) {
                            arr.push($rootScope.prodArray.val[i].tax.individualtaxes[x].taxname)
                        }
                    }
                }

                var sorted_arr = arr.sort();
                var results = [];
                for (var i = 0; i < arr.length - 1; i++) {
                    if (sorted_arr[i + 1] == sorted_arr[i]) {
                        results.push(sorted_arr[i]);
                    }
                }
                if (obj.tax.type == "individualtaxes") {

                    for (var x = $rootScope.taxArr2.length - 1; x >= 0; x--) {

                        if ($rootScope.taxArr2[x].taxName == obj.tax.taxname) {

                            if ($.inArray(obj.tax.taxname, results) == -1) {
                                $rootScope.taxArr2.splice(x, 1);

                            } else if ($.inArray(obj.tax.taxname, results) == 0) {
                                $rootScope.taxArr2[x].salesTax = parseFloat($rootScope.taxArr2[x].salesTax) - parseFloat(obj.amount * obj.tax.rate / 100);
                            }
                        }
                    }
                } else if (obj.tax.type == "multipletaxgroup") {
                    for (var x = obj.tax.individualtaxes.length - 1; x >= 0; x--) {

                        if (obj.tax.individualtaxes[x].compound == false) {
                            $rootScope.falseComp.push(obj.tax.individualtaxes[x]);
                            console.log( $rootScope.falseComp)
                        } else if (obj.tax.individualtaxes[x].compound == true) {
                            $rootScope.trueComp.push(obj.tax.individualtaxes[x])
                            console.log( $rootScope.falseComp)
                            $rootScope.compountTrue = $rootScope.trueComp.sort(function(a, b) {
                                return a.positionId > b.positionId ? 1 : a.positionId < b.positionId ? -1 : 0;
                            });
                        }
                    }
                    $rootScope.calculateCompound = $rootScope.falseComp.concat($rootScope.compountTrue);
                        var fcompAmount = 0;
                        var taxAmount = 0;
                    for (var x = 0; x <= obj.tax.individualtaxes.length - 1; x++) {

                        tax = obj.tax.individualtaxes[x].rate / 100;
                        for (var y = $rootScope.taxArr2.length - 1; y >= 0; y--) {

                            if ($rootScope.taxArr2[y].taxName == obj.tax.individualtaxes[x].taxname) {

                                for(ps=0; ps <= results.length; ps++){
                                    if (results[ps] == obj.tax.individualtaxes[x].taxname) {
                                           for (var z = $rootScope.calculateCompound.length - 1; z >= 0; z--) {
                                            if ($rootScope.calculateCompound[z].compound == false) {
                                                 fcompAmount = parseFloat(obj.amount * obj.tax.individualtaxes[z].rate / 100)
                                                    }
                                                }
                                                
                                            if(obj.tax.individualtaxes[x].compound == false){
                                                $rootScope.taxArr2[y].salesTax = parseFloat($rootScope.taxArr2[y].salesTax - (obj.amount * obj.tax.individualtaxes[x].rate / 100));
                                                results.splice(ps, 1);
                                            }else if (obj.tax.individualtaxes[x].compound == true){
                                                tcopmAmount = parseFloat(fcompAmount + obj.amount);
                                                finalCal = (parseFloat(finalCal + tcopmAmount) * obj.tax.individualtaxes[x].rate / 100);
                                                    
                                                $rootScope.taxArr2[y].salesTax = parseFloat($rootScope.taxArr2[y].salesTax - finalCal);
                                            }

                                    } else if ($.inArray(obj.tax.individualtaxes[x].taxname, results) == -1) {
                                        $rootScope.taxArr2.splice(y, 1);
                                    }                                        
                                }
                            }
                        }
                    }
                }
            },
        }
    })