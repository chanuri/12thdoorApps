 
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
    app.controller('viewCtrl', function($scope, $mdBottomSheet, $auth, $interval, $mdDialog, $mdToast, $state, uiInitilize, $objectstore, recurringInvoiceService, $window, $stateParams, $rootScope, invoiceDetails, InvoiceService, $filter, $state, $location, UploaderService) {
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
                // $mdDialog.show(

                // );
                $mdToast.show(
                      $mdToast.simple()
                        .textContent('Invoice Successfully Approved')
                        .position('bottom right')
                        .theme('success-toast')
                        .hideDelay(2000)
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
                    date: new Date(),
                    type:"Auto",
                    RefID:obj.invoiceRefNo
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
                            date: new Date(),
                            type:"Auto",
                            RefID:deleteform.invoiceRefNo
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
            // $rootScope.testArray.val = [];
            // $rootScope.dateArray.val = [];
            invoiceDetails.removeArray(0, 1);
            location.href = '#/NewInvoice_app';
        }
        $scope.addProfile = function() {
            location.href = '#/NewRecurring_profile';
        }

        $scope.viewImage = function(obj) {
            $mdDialog.show({
                templateUrl: 'Invoicepartials/UploadedFiles.html',
                controller: 'UploadCtrl',
                locals: {
                    item: obj
                }
            });
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

        $scope.LoadAll = function() {
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
        }
        


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

        var client = $objectstore.getClient("payment");
        client.onGetMany(function(data) {
            if (data) {
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].paymentStatus != "Cancelled") {
                        for (var x = data[i].paidInvoice.length - 1; x >= 0; x--) {
                            if ($stateParams.invoiceno == data[i].paidInvoice[x].invono) {

                                $scope.Payment.push(data[i]);
                                console.log(data[i])
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
        }

        $scope.Totalbalance = function(data){
            $scope.viewBalance = 0;
                for (var x = data.MultiDueDAtesArr.length - 1; x >= 0; x--) {
                     $scope.viewBalance += data.MultiDueDAtesArr[x].balance;
                 
                }
           return $scope.viewBalance;
        }

        

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

        $scope.convertTopdf = function(content) {
            for (var i = content.invoiceProducts.length - 1; i >= 0; i--) {
         
   var docDefinition = { content: [
     {
              text:'Invoice No :'+" "+ content.invoiceNo ,
               margin: [ 5, 2, 10, 20 ]
         },
         {  
            image: 'data:image/jpeg;base64,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',
            width: 280,
            height: 85,
            style: "left"
          },
          {
           text: 'INVOICE'+"\n\n",
           style: 'header'
         },
         {
           text:'To :',
           style: 'normal'
         },
         {
           text:'Invoice Date :'+" "+ content.Startdate,
         },
         {
           text:content.Name,
           style: 'normal'
         },
          {
           text:'Due Date :'+" "+ content.termtype,
         },
          {
           text:content.billingAddress,
           style: 'normal'
         },
         {
           text:'PO :'+" "+ content.poNum,
         },
         {
           text:'Currency :'+" "+ 'USD',
         },
          {
           text:'Comment :'+" "+ content.comments+"\n\n",
         },

    {
      columns: [
        {
          width: 100,
          text: 'Description'
        },
        {
          width: 100,
          text: 'Qty'
        },
        {
          width: 100,
          text: 'Unit'
        },
        {
          width: 100,
          text: 'Price'
        },
        {
          width: 100,
          text: 'Amount'
        }
      ],
      columnGap: 10
    },
    {
      columns: [
        {
          width: 100,
          text: content.invoiceProducts[i].Productname,
        },
        {
          width: 100,
          text: content.invoiceProducts[i].quantity.toString(),
        },
        {
          width: 100,
           text: content.invoiceProducts[i].ProductUnit,
        },
        {
          width: 100,
          text: content.invoiceProducts[i].price,
        },
        {
          width: 100,
          text: content.invoiceProducts[i].amount.toString(),
        }
      ],
      columnGap: 10
    },

         ], 
         styles: {
            header: {
              fontSize: 18,
              bold: true
            },
            center: {
              fontSize: 10,
              alignment: 'center',
              italics: true
            },
            normal: {
              fontSize: 12,
              alignment: 'right'
            },
            normal1:{
              fontSize: 12,
            }
          }

        }
        };
   pdfMake.createPdf(docDefinition).open();
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
                    date: new Date(),
                    type:"Manual",
                    todoText:todoText.invoiceRefNo
                });

                var client = $objectstore.getClient("invoice12thdoor");
                todoText.invoiceNo = todoText.invoiceNo.toString();

                for (var i = $scope.todos.length - 1; i >= 0; i--) {
                    todoText.commentsAndHistory.push($scope.todos[i]);
                };
                todoText.addView = "";
                client.onComplete(function(data) {
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


        $scope.deleteNote = function(val,index){
          val.commentsAndHistory.splice( val.commentsAndHistory.indexOf(index), 1 );

          var noteClient = $objectstore.getClient("invoice12thdoor");

          val.invoiceNo = val.invoiceNo.toString();
           
            noteClient.onComplete(function(data){
                console.log("successfully Delete one"); 
            });
            noteClient.onError(function(data){
                console.log("error adding new note")
                val.notes.splice(index, 0, item);
            });
            noteClient.insert(val,{ KeyProperty: "invoiceNo"})
        }


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