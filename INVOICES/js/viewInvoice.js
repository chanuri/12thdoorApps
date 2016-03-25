 
    app.directive('customeProgressbar', [function() {
        return {
            restrict: 'E',
            template: " <div ng-if='invoiceObj.termtype == \"multipleDueDates\"'  style='margin-left:20px;height:10px; display:flex' md-swipe-right='onSwipeRight(invoiceObj.startPage,invoiceObj.endPage)' md-swipe-left='onSwipeLeft(invoiceObj.startPage,invoiceObj.endPage)'> <md-icon  ng-if='leftArrow'  style='height: 13px;z-index: 10; background-color: white; margin-top: -3px' md-svg-src='img/ic_keyboard_arrow_left_24px.svg' class='iconColor'  md-ink-ripple style='' ng-click='onSwipeRight(invoiceObj.startPage,invoiceObj.endPage)'></md-icon> <div  ng-repeat='item in invoiceObj.fullArr' style='height: 10px;    display: inline-block;' ng-style='{   \"width\" : item.fullWidth }'  >   <div style='display: flex;'> <div ng-if='$index != 0 ' ng-style='{ \"width\": item.whiteSpace }' > </div> <div ng-style='{ \"background-color\": item.color,\"width\": \"100%\" }' style='height: 10px;     display: inline-block;'  ></div>  </div> </div> <md-icon ng-if='rightArrow' md-svg-src='img/ic_keyboard_arrow_right_24px.svg' class='iconColor'  md-ink-ripple style='z-index: 10;     height: 13px;background-color: white; margin-top: -3px' ng-click='onSwipeLeft(invoiceObj.startPage,invoiceObj.endPage)'></md-icon> </div>",
            scope: {
                invoiceObj: '='
            },
            // controller: 'viewCtrl',
            link: function(scope) {

                var fullArrayLength = 0;
                scope.fullArr = [];
                scope.paidArr = [];
                scope.unpaidArr = [];
                scope.partialArr = [];
                scope.cancelArr = [];
                scope.leftArrow = false;
                scope.rightArrow = false;

                scope.onSwipeLeft = function(startPage, endPage) {
                    scope.overload = false;
                    scope.leftArrow = true;
                    var newStartPage = parseInt(endPage) + 1;
                    var newEndPage = parseInt(endPage) + 12;
                    if (scope.sortArr.length > newStartPage) {

                        scope.invoiceObj.startPage = newStartPage;
                        scope.invoiceObj.endPage = newEndPage;
                        scope.invoiceObj.fullArr = []

                        for (i = newStartPage; i <= newEndPage; i++) {
                            if (scope.sortArr[i]) scope.invoiceObj.fullArr.push(scope.sortArr[i])
                            else scope.overload = true;
                        }
                        if (scope.overload) {
                            var newLength = 100 / scope.invoiceObj.fullArr.length
                            for (p = 0; p <= scope.invoiceObj.fullArr.length - 1; p++) {
                                scope.invoiceObj.fullArr[p].fullWidth = newLength + '%';
                                scope.invoiceObj.fullArr[p].maxWidth = (newLength - 1) + '%';
                                scope.rightArrow = false;
                            }
                        }
                        if (scope.sortArr.length == parseInt(newEndPage + 1)) {
                            scope.rightArrow = false;
                        }
                    }
                }
                scope.onSwipeRight = function(startPage, endPage) {
                    var newStartPage = parseInt(startPage) - 12;
                    var newEndPage = parseInt(startPage) - 1;
                    scope.rightArrow = true;
                    if (newStartPage >= 0) {

                        scope.invoiceObj.startPage = newStartPage;
                        scope.invoiceObj.endPage = newEndPage;
                        scope.invoiceObj.fullArr = []
                        for (i = newStartPage; i <= newEndPage; i++) {
                            scope.invoiceObj.fullArr.push(scope.sortArr[i])
                        }
                    }
                    if (newStartPage == 0) {
                        scope.leftArrow = false;
                    }
                }

                if (scope.invoiceObj.MultiDueDAtesArr.length > 0) {
                    fullArrayLength = scope.invoiceObj.MultiDueDAtesArr.length;
                    var originalVal;
                    if (fullArrayLength > 12) {
                        originalVal = (100 / 12);
                        scope.rightArrow = true;
                    } else {
                        originalVal = (100 / fullArrayLength);
                    }
                    var originVal = originalVal + '%';
                    var withSpaceVal = (originalVal - 1) + '%';


                    for (l = 0; l <= scope.invoiceObj.MultiDueDAtesArr.length - 1; l++) {
                        switch (scope.invoiceObj.MultiDueDAtesArr[l].paymentStatus) {
                            case "Unpaid":
                                scope.unpaidCount += 1;
                                scope.fullArr.push({
                                    type: 'Unpaid',
                                    color: 'red',
                                    maxWidth: withSpaceVal,
                                    fullWidth: originVal,
                                    whiteSpace: '2%',
                                    duedate : scope.invoiceObj.MultiDueDAtesArr[l].DueDate
                                })
                                break;
                            case "Paid":
                                scope.paidCount += 1;
                                scope.fullArr.push({
                                    type: 'Paid',
                                    color: 'green',
                                    maxWidth: withSpaceVal,
                                    fullWidth: originVal,
                                    whiteSpace: '2%',
                                    duedate : scope.invoiceObj.MultiDueDAtesArr[l].DueDate
                                })
                                break;
                            case "Partially Paid":
                                scope.partialCount += 1;
                                scope.fullArr.push({
                                    type: 'Partially Paid',
                                    color: '#FF4500',
                                    maxWidth: withSpaceVal,
                                    fullWidth: originVal,
                                    whiteSpace: '2%',
                                    duedate : scope.invoiceObj.MultiDueDAtesArr[l].DueDate
                                })
                                break;
                            case "Cancelled":
                                scope.cancelCount += 1;
                                scope.fullArr.push({
                                    type: 'Cancelled',
                                    color: 'black',
                                    maxWidth: withSpaceVal,
                                    fullWidth: originVal,
                                    whiteSpace: '2%',
                                    duedate : scope.invoiceObj.MultiDueDAtesArr[l].DueDate
                                })
                                break;
                            default:
                                console.log("incorrect payment status")
                        }
                    }

                    scope.sortArr = scope.fullArr.sort(function(a, b) {
                        return new Date(a.duedate) - new Date(b.duedate)
                    })

                    scope.invoiceObj.fullArr = [];
                    scope.invoiceObj.startPage = 0;
                    scope.invoiceObj.endPage = 11;

                    if (scope.sortArr.length > 12) {
                        for (k = 0; k <= 11; k++) {
                            scope.invoiceObj.fullArr.push(scope.sortArr[k])
                        }
                    } else {
                        scope.invoiceObj.fullArr = scope.sortArr;
                    }
                }
            }
        }
    }]);
    app.controller('viewCtrl', function($scope, $mdBottomSheet, $auth, $interval, $mdDialog, $state, uiInitilize, $objectstore, recurringInvoiceService, $window, $stateParams, $rootScope, invoiceDetails, InvoiceService, $filter, $state, $location, UploaderService) {
        $scope.TDinvoice = [];
        $scope.Payment = [];
        $scope.newItems = [];
        $scope.show = false;
        $scope.showTable = false;
        $scope.obtable = [];
        var vm = this;
        $scope.Makepayment = false;
        $scope.showEdit = true;
        $scope.userName = $auth.getUserName();
        // ------------------------------------virtual repeat start-----------------
        $scope.toggles = {};
        $scope.toggleOne = function($index) {
            for (ind in $scope.items)
                if ($scope.toggles[ind] && ind != $index)
                    $scope.toggles[ind] = false;

            if (!$scope.toggles[$index])
                $scope.toggles[$index] = true;
            else $scope.toggles[$index] = !$scope.toggles[$index];
        };


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

        if ($state.current.name == 'settings.invoice_app') {
            $rootScope.showinvoice = true;
            $scope.selectedIndex = 0;
        } else if ($state.current.name == 'settings.AllRecurring_Invoices') {
            $rootScope.showinvoice = false;
            $scope.selectedIndex = 1;
        };

        $scope.changeTab = function(ind) {
            switch (ind) {
                case 0:
                    $rootScope.showinvoice = true;
                    break;
                case 1:
                    $rootScope.showinvoice = false;
                    break;
            }
        };

        $scope.sortarr = [{
            name: "Starred",
            id: "favouriteStarNo",
            src: "img/ic_grade_48px.svg",
            divider: true
        }, {
            name: "Date",
            id: "Startdate",
            divider: false
        }, {
            name: "Invoice No",
            id: "invoiceNo",
            divider: false
        }, {
            name: "Customer",
            id: "Name",
            divider: false
        }, {
            name: "Final Amount",
            id: "finalamount",
            divider: false
        }, {
            name: "Balance",
            id: "balanceDue",
            divider: false
        }, {
            name: "Due Date",
            id: "duedate",
            divider: true
        }, {
            name: "Draft",
            id: "Draft",
            divider: false
        }, {
            name: "Paid",
            id: "Paid",
            divider: false
        }, {
            name: "Unpaid",
            id: "Unpaid",
            divider: false
        }, {
            name: "Overdue",
            id: "Overdue",
            divider: false
        }, {
            name: "Partially Paid",
            id: "Partially Paid",
            divider: false
        }, {
            name: "Cancelled",
            id: "Cancelled",
            divider: false
        }]

        $rootScope.prodSearch = "";
        $rootScope.searchText1 = "";

        $scope.announceClick = function(index) {
            $mdDialog.show(
                $mdDialog.alert()
                .title('You clicked!')
                .content('You clicked the menu item at index ' + index)
                .ok('ok')
            );
        };

        $scope.favouriteFunction = function(obj) {
            var client = $objectstore.getClient("invoice12thdoor");
            obj.invoiceNo = obj.invoiceNo.toString();
            if (obj.favourite) {
                obj.favouriteStarNo = 0;

            } else if (!(obj.favourite)) {
                obj.favouriteStarNo = 1;
            };
            client.onComplete(function(data) {

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

        $scope.Approve = function(obj) {
            var client = $objectstore.getClient("invoice12thdoor");
            obj.invoiceNo = obj.invoiceNo.toString();
            for (var x = obj.MultiDueDAtesArr.length - 1; x >= 0; x--) {
                obj.MultiDueDAtesArr[x].paymentStatus = "Unpaid";
            }
            client.onComplete(function(data) {
                $mdDialog.show(

                );
            });
            client.onError(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content('Error Occure while Adding Invoice')
                    .ariaLabel('')
                    .ok('OK')
                    .targetEvent(data)
                );
            });
            client.insert(obj, {
                KeyProperty: "invoiceNo"
            });
        }

        $scope.systemMessage = [];
        $scope.cancelStatus = function(obj, ev) {
            var confirm = $mdDialog.confirm()
                .title('Do you wish to cancel this Invoice' + obj.invoiceNo + '? This process is not reversible')
                .content('')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {
                var client = $objectstore.getClient("invoice12thdoor");
                obj.invoiceNo = obj.invoiceNo.toString();
                $scope.systemMessage.push({
                    text: "The Invoice was Cancelled by"+$scope.userName,
                    done: false,
                    date: new Date()
                });
                for (var i = $scope.systemMessage.length - 1; i >= 0; i--) {
                    obj.commentsAndHistory.push($scope.systemMessage[i]);
                };

                for (var x = obj.MultiDueDAtesArr.length - 1; x >= 0; x--) {
                    obj.MultiDueDAtesArr[x].paymentStatus = "Cancelled";
                }
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
                        .content('Error Occure while cancelling Invoice')
                        .ariaLabel('')
                        .ok('OK')
                        .targetEvent(data)
                    );
                });
                client.insert(obj, {
                    KeyProperty: "invoiceNo"
                });
            })
        }
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

        $scope.viewSavedProducts = function(obj) {
            $mdDialog.show({
                templateUrl: 'Invoicepartials/showproduct.html',
                controller: 'showproductCtrl',
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

        $scope.deleteInvoice = function(deleteform, ev) {
            if (deleteform.invoiceNo == "-999") {
                deleteform.invoiceNo = angular.copy(deleteform.invoiceRefNo);
            }
            for (var x = deleteform.MultiDueDAtesArr.length - 1; x >= 0; x--) {
                var payementStatus = deleteform.MultiDueDAtesArr[x].paymentStatus;
            }
                if (payementStatus == "Draft") {
                    var confirm = $mdDialog.confirm()
                        .parent(angular.element(document.body))
                        .title('')
                        .content('Do you wish to cancel this Invoice deleteform.invoiceNo? This process is not reversible.')
                        .ok('Delete')
                        .cancel('Cancel')
                        .targetEvent(ev);
                    $mdDialog.show(confirm).then(function() {
                        var client = $objectstore.getClient("invoice12thdoorDraft");

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
                        client.deleteSingle(deleteform.invoiceNo.toString(), "invoiceNo");
                    }, function() {
                        $mdDialog.hide();
                    });
                } else {
                    var confirm = $mdDialog.confirm()
                        .parent(angular.element(document.body))
                        .title('')
                        .content('Are You Sure You Want To Delete This Record? This process is not reversible')
                        .ok('Delete')
                        .cancel('Cancel')
                        .targetEvent(ev);
                    $mdDialog.show(confirm).then(function() {

                        var client = $objectstore.getClient("invoice12thdoor");
                        deleteform.DeleteStatus = true;
                        deleteform.invoiceNo = deleteform.invoiceNo.toString();
                        $scope.systemMessage.push({
                            text: "The Invoice was Deleted by"+$scope.userName,
                            done: false,
                            date: new Date()
                        });

                        for (var i = $scope.systemMessage.length - 1; i >= 0; i--) {
                            deleteform.commentsAndHistory.push($scope.systemMessage[i]);
                        };
                        
                        for (var x = deleteform.MultiDueDAtesArr.length - 1; x >= 0; x--) {
                            deleteform.MultiDueDAtesArr[x].paymentStatus = "Deleted";
                        }
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
                                .content('Error Occure while Adding Invoice')
                                .ariaLabel('')
                                .ok('OK')
                                .targetEvent(data)
                            );
                        });
                        client.insert(deleteform, {
                            KeyProperty: "invoiceNo"
                        });
                    }, function() {
                        $mdDialog.hide();
                    });
                }
            // }
            location.href = '#/invoice_app';
        }

        $scope.printDetails = function() {
            window.print();
        }

        $scope.EditInvoice = function(InvoItem) {
            invoiceDetails.removeArray(InvoItem, 1);
            invoiceDetails.setArray(InvoItem);
            $state.go('edit', {
                'invoiceno': InvoItem.invoiceNo
            })
        }

        $scope.CopyAsRecurringProfile = function(item) {
            recurringInvoiceService.removeArray1(item, 1);
            recurringInvoiceService.setArray1(item);
            $state.go('InvoiceCopyRec')
        }

        $scope.copyInvoice = function(InvoItem) {
            invoiceDetails.removeArray(InvoItem, 1);
            $scope.InvoiceDetails = [];
            var client = $objectstore.getClient("invoice12thdoor");
            client.onGetMany(function(data) {
                if (data) {
                    $scope.InvoiceDetails = data;

                    for (var i = $scope.InvoiceDetails.length - 1; i >= 0; i--) {
                        $scope.ID = $scope.InvoiceDetails[i].maxCount;
                    };
                    $scope.maxID = parseInt($scope.ID) + 1;
                    InvoItem.invoiceRefNo = $scope.maxID.toString();
                    //console.log( $scope.TDinvoice.invoiceRefNo);
                }
            });
            client.getByFiltering("select maxCount from domainClassAttributes where class='invoice12thdoor'");


            invoiceDetails.setArray(InvoItem);
            // location.href = '#/copyInvoiceDetails';
            $state.go('copy', {
                'invoiceno': InvoItem.invoiceRefNo
            });
        }

        $scope.calAMount = function(data) {
            $scope.Amount = 0;
            $scope.Amount = (((data.price * data.quantity) - ((data.price * data.quantity) * data.discount / 100)) + ((data.price * data.quantity)) * data.tax / 100);
            return $scope.Amount;
        }
        $scope.calculatetotal = function(data) {
            $scope.total = 0;
            angular.forEach(data.invoiceProducts, function(tdIinvoice) {
                $scope.total += (tdIinvoice.price * tdIinvoice.quantity);
            })
            return $scope.total;
        };
        $scope.finaldiscount = function(data) {
            $scope.finalDisc = 0;
            $scope.Discount = 0;
            angular.forEach(data.invoiceProducts, function(tdIinvoice) {
                $scope.Discount += parseInt(tdIinvoice.discount);
                $scope.finalDisc = parseInt($scope.total * $scope.Discount / 100);
            })
            return $scope.finalDisc;
        }
        $scope.CalculateTax = function(data) {
            $scope.salesTax = 0;

            angular.forEach(data.invoiceProducts, function(tdIinvoice) {
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

        $scope.enterPayment = function(info) {
            $mdDialog.show({
                templateUrl: 'Invoicepartials/addPayment.html',
                controller: 'paymentCtrl',
                locals: {
                    pim: info
                }
            })
        }

        $scope.showMakepayment = function() {
            $scope.Makepayment = true;
        }

        $scope.add = function() {
            $rootScope.testArray.val = "";
            $rootScope.dateArray.value = "";
            invoiceDetails.removeArray(0, 1);
            location.href = '#/NewInvoice_app';
        }
        $scope.addProfile = function() {
            location.href = '#/NewRecurring_profile';
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
        var loading_spinner = angular.element('#loader');
        var self = this,
            j = 0,
            counter = 0;

        self.modes = [];
        self.activated = true;
        self.determinateValue = 30;

        $interval(function() {

            if ((j < 5) && !self.modes[j] && self.activated) {
                self.modes[j] = 'indeterminate';
            }
            if (counter++ % 4 == 0) j++;

        }, 100, 0, true);

        $scope.calBalance = 0;
        
        //retrieve Data from invoice class
        var client = $objectstore.getClient("invoice12thdoorDraft");
        client.onGetMany(function(data) {
            if (data) {

                for (var i = data.length - 1; i >= 0; i--) {
                    // loading_spinner.remove();
                    data[i].addView = "";
                    data[i].invoiceNo = parseInt(data[i].invoiceNo);
                    $scope.TDinvoice.push(data[i]);
                    // for (var x = data[i].MultiDueDAtesArr.length - 1; x >= 0; x--) {                       
                    //     if ($stateParams.invoiceno == data[i].invoiceNo && data[i].MultiDueDAtesArr[x].paymentStatus == "Draft") {
                    //         invoiceDetails.removeArray(data[i], 1);
                    //         invoiceDetails.setArray(data[i]);
                    //     }
                    // }
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
        client.getByFiltering("select * from invoice12thdoor where DeleteStatus = 'false'");

        var client = $objectstore.getClient("invoice12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                for (var i = data.length - 1; i >= 0; i--) {
                    loading_spinner.remove();
                    data[i].addView = "";
                    data[i].invoiceNo = parseInt(data[i].invoiceNo);
                    $scope.TDinvoice.push(data[i]);
                    // for (var x = data[i].MultiDueDAtesArr.length - 1; x >= 0; x--) {                       
                    //     if ($stateParams.invoiceno == data[i].invoiceNo && data[i].MultiDueDAtesArr[x].paymentStatus == "Paid") {
                    //         invoiceDetails.removeArray(data[i], 1);
                    //         invoiceDetails.setArray(data[i]);
                    //     }
                    // }
                }
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
        client.getByFiltering("select * from invoice12thdoor where DeleteStatus = 'false'");


        $scope.openOtherView = function(InvoItem) {
            $rootScope.invoiceArray.splice(InvoItem, 1);
            invoiceDetails.setArray(InvoItem);
            $state.go('view', {'invoiceno': InvoItem.invoiceNo});
            
        }

        $scope.loadData = function(val){
           if(val.DraftActive == false){
            var client = $objectstore.getClient("invoice12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                for (var i = data.length - 1; i >= 0; i--) {
                    for (var x = data[i].MultiDueDAtesArr.length - 1; x >= 0; x--) {
                        
                           if ($stateParams.invoiceno == data[i].invoiceNo) {
                            console.log(data[i].MultiDueDAtesArr[x].paymentStatus)
                            if(data[i].MultiDueDAtesArr[x].paymentStatus != "Draft"){
                            // invoiceDetails.removeArray(data[i], 1);
                            // invoiceDetails.setArray(data[i]);
                            $scope.Address = data[i].billingAddress.split(',');
                            $scope.street = $scope.Address[0];
                            $scope.city = $scope.Address[1] + $scope.Address[3];
                            $scope.country = $scope.Address[2] + $scope.Address[4];

                            $scope.shippingAddress = data[i].shippingAddress.split(',');
                            $scope.ShippingStreet = $scope.shippingAddress[0];
                            $scope.ShippingCity = $scope.shippingAddress[1] + $scope.shippingAddress[3];
                            $scope.ShippingCountry = $scope.shippingAddress[2] + $scope.shippingAddress[4];
                            
                            $scope.calBalance += data[i].MultiDueDAtesArr[x].balance;
                            
                        } 
                        }
                        
                    };
                   
                }
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
        client.getByFiltering("select * from invoice12thdoor where DeleteStatus = 'false'");
    }else{
        var client = $objectstore.getClient("invoice12thdoorDraft");
        client.onGetMany(function(data) {
            if (data) {

                for (var i = data.length - 1; i >= 0; i--) {
                    for (var x = data[i].MultiDueDAtesArr.length - 1; x >= 0; x--) {   
                    
                           if ($stateParams.invoiceno == data[i].invoiceNo) {
                            console.log(data[i].MultiDueDAtesArr[x].paymentStatus)
                            if(data[i].MultiDueDAtesArr[x].paymentStatus == "Draft") {
                                // invoiceDetails.removeArray(data[i], 1);
                                // invoiceDetails.setArray(data[i]);
                                $scope.Address = data[i].billingAddress.split(',');
                                $scope.street = $scope.Address[0];
                                $scope.city = $scope.Address[1] + $scope.Address[3];
                                $scope.country = $scope.Address[2] + $scope.Address[4];

                                $scope.shippingAddress = data[i].shippingAddress.split(',');
                                $scope.ShippingStreet = $scope.shippingAddress[0];
                                $scope.ShippingCity = $scope.shippingAddress[1] + $scope.shippingAddress[3];
                                $scope.ShippingCountry = $scope.shippingAddress[2] + $scope.shippingAddress[4];

                                $scope.calBalance += data[i].MultiDueDAtesArr[x].balance;
                            } 
                    }                   
                    
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
        client.getByFiltering("select * from invoice12thdoor where DeleteStatus = 'false'");
    }
        }

        $scope.Totalbalance = function(data){
            $scope.viewBalance = 0;
                for (var x = data.MultiDueDAtesArr.length - 1; x >= 0; x--) {
                     $scope.viewBalance += data.MultiDueDAtesArr[x].balance;
                 
                }
           return $scope.viewBalance;
        }

        var client = $objectstore.getClient("payment");
        client.onGetMany(function(data) {
            if (data) {
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].paymentStatus != "Cancelled") {
                        for (var x = data[i].paidInvoice.length - 1; x >= 0; x--) {
                            if ($stateParams.invoiceno == data[i].paidInvoice[x].invono) {

                                $scope.Payment.push(data[i]);
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

        $scope.paydate = [];

        $scope.getSelected = function(inv) {
            $scope.obtable = inv.table;
        }

        $scope.$on('viewRecord', function(event, args) {
            $scope.imageDetails = args;

            var fileExt = args.name.split('.').pop()
            if (fileExt == "jpg" || fileExt == "png" || fileExt == "svg") {

                var client = $objectstore.getClient("invoiceUploades");
                client.onGetMany(function(data) {
                    if (data) {
                        $scope.brochurebody = [];

                        $scope.brochurebody = data;
                        var pbody = data
                        $scope.hilpan = true;

                        for (var i = $scope.brochurebody.length - 1; i >= 0; i--) {
                            if ($scope.hilpan) {
                                $scope.dialogstart($scope.brochurebody[i].Body);
                                $scope.hilpan = false;
                            };
                        };
                    }
                });
                client.onError(function(data) {
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

                client.getByFiltering("select Body from invoiceUploades where FileName like '%" + args.name + "'%");

            }
        });
        $scope.convertpdf = function(content) {
            html2canvas($("#canvas"), {
            onrendered: function(canvas) {                      
                var imgData = canvas.toDataURL('image/jpeg');              
            options = {
                orientation: "0",
                unit: "mm",
                format: "a4"
            };

            var doc = new jsPDF(options, '', '', '');
            doc.addImage(imgData, 'jpeg', 0, 0, 200, 0);
            var corte = 1395; // configura tamanho do corte
            var image = new Image();
            image = Canvas2Image.convertToJPEG(canvas);

            var croppingYPosition = corte;
            var count = (image.height)/corte;
            var i =1;
            console.log(image.height)
            while ( i < count) {
                    doc.addPage();

                    var sourceX = 0;
                    var sourceY = croppingYPosition;
                    var sourceWidth = image.width;
                    var sourceHeight = corte;
                    var destWidth = sourceWidth;
                    var destHeight = sourceHeight;
                    var destX = 0;
                    var destY = 0;
                    var canvas1 = canvas;
                    canvas1.setAttribute('height', (image.height)-(corte*i));
                    canvas1.setAttribute('width', destWidth);                         
                    var ctx = canvas1.getContext("2d");
                    ctx.drawImage(image, sourceX, 
                                         sourceY,
                                         sourceWidth,
                                         sourceHeight, 
                                         destX, 
                                         destY, 
                                         destWidth, 
                                         destHeight);
                    var image2 = new Image();
                    image2 = Canvas2Image.convertToJPEG(canvas1);
                    image2Data = image2.src;
                    doc.addImage(image2Data, 'JPEG', 0, 0, 200, 0);
                    croppingYPosition += destHeight; 
                    console.log(croppingYPosition)
                    count =  (image.height)/croppingYPosition;
                             
                } 
                doc.save(content.invoiceNo+'.pdf')                
            }
        });
        }

        $scope.dialogstart = function(arr) {
            $mdDialog.show({
                template: acceptContentTemplate,
                controller: mycontroller,
                locals: {
                    employee: arr
                }
            });
        }

        function mycontroller($scope, $mdDialog, $rootScope, employee) {
            $scope.test = employee;
            $scope.cancel = function() {
                $mdDialog.cancel();
            }
        }
        $scope.email = function(item) {
            $mdDialog.show({
                templateUrl: 'Invoicepartials/email.html',
                controller: 'emailCtrl',
                locals: {
                    invo: item
                }
            });
        };
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
              <label>Name</label>\
              <input ng-model="test.name">\
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

                var client = $objectstore.getClient("invoice12thdoor");
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
                        .content('Error Occure while Adding the comment')
                        .ariaLabel('')
                        .ok('OK')
                        .targetEvent(data)
                    );
                });
                client.insert(todoText, {
                    KeyProperty: "invoiceNo"
                });
            }
        };


        // $scope.deleteComments = function(index){
        //   $scope.testarr.splice( $scope.testarr.indexOf(index), 1 );
        // }


    }); //END OF viewCtrl
    //--------------------------------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------------------------------
    app.controller('emailCtrl', function($scope, $mdDialog, $rootScope, invo, $mdToast, $document) {
        $scope.test = invo;
        //console.log($scope.test)
        $scope.subject = "invoice No." + $scope.test.invoiceNo + " " + $scope.test.Name;

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.recipientCtrl = function($timeout, $q) {
            var self = this;
            $scope.Emailerror = false;
            self.readonly = false;
            // self.emailrecipient = [$scope.test.Email];
            // $scope.emailrec = angular.copy(self.emailrecipient);
            $scope.emailrec = [$scope.test.Email];
            self.tags = [];
            self.newVeg = function(chip) {
                return {
                    name: chip,
                    type: 'unknown'
                };
            };
        }

        $scope.$watchCollection("emailrec", function() {
            var re = /\S+@\S+\.\S+/;
            $scope.Emailerror = false;
            for (var i = $scope.emailrec.length - 1; i >= 0; i--) {

                if (re.test($scope.emailrec[i]) == false) {
                    $scope.show = $scope.emailrec[i];
                    $scope.Emailerror = true;
                    $scope.emailrec.splice(i, 1);

                    $scope.showActionToast();
                }
            };
        });

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        $scope.toastPosition = angular.extend({}, last);
        $scope.getToastPosition = function() {
            sanitizePosition();
            return Object.keys($scope.toastPosition)
                .filter(function(pos) {
                    return $scope.toastPosition[pos];
                })
                .join(' ');
        };

        function sanitizePosition() {
            var current = $scope.toastPosition;
            if (current.bottom && last.top) current.top = false;
            if (current.top && last.bottom) current.bottom = false;
            if (current.right && last.left) current.left = false;
            if (current.left && last.right) current.right = false;
            last = angular.extend({}, current);
        }

        $scope.showActionToast = function() {
            $mdToast.show({
                controller: 'ToastCtrl',
                template: 'invalid',
                parent: $document[0].querySelector('#toastBounds'),
                hideDelay: 6000,
                position: $scope.getToastPosition()
            });
        };

        $scope.bccCtrl = function($timeout, $q) {
            var self = this;
            self.readonly = false;
            self.emailBCCrecipient = [$scope.test.adminEmail];
            self.emailBCCrec = angular.copy(self.emailBCCrecipient);
            self.tags = [];
            self.newVeg = function(chip) {
                return {
                    name: chip,
                    type: 'unknown'
                };
            };
        }

        $scope.listItemClick = function($index) {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);
        };
    })