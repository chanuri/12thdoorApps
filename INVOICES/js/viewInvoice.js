 
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
    app.controller('viewCtrl', function($scope,$filter, $mdBottomSheet, $auth, $interval, $mdDialog, $mdToast, $state, uiInitilize, $objectstore, recurringInvoiceService, $window, $stateParams, $rootScope, invoiceDetails, InvoiceService, $filter, $state, $location, UploaderService) {
        $scope.TDinvoice = [];
        $scope.Payment = [];
        $scope.newItems = [];
        $scope.show = false;
        $scope.showTable = false;
        $scope.obtable = [];
        var vm = this;
        $scope.Makepayment = false;
        $scope.showEdit = true;
        $scope.userName = $auth.getSession().Name;
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
               for (var z = obj.MultiDueDAtesArr.length - 1; z >= 0; z--) {

                    if(obj.MultiDueDAtesArr[z].paymentStatus == "Unpaid"){
                         var client = $objectstore.getClient("invoice12thdoor");
                obj.invoiceNo = obj.invoiceNo.toString();
                $scope.systemMessage.push({
                    text: "The Invoice was Cancelled by"+" "+$scope.userName,
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
            }else{
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .title('')
                        .content('This invoice cannot be Cancelled')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                        )}
                }
                
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

                         for (var z = deleteform.MultiDueDAtesArr.length - 1; z >= 0; z--) {

                            if(deleteform.MultiDueDAtesArr[z].paymentStatus == "Unpaid" || deleteform.MultiDueDAtesArr[z].paymentStatus =="Cancelled"){
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
                        client.insert(deleteform, {KeyProperty: "invoiceNo"});
                            }else{
                                $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .content('You cannot delete this record')
                                .ariaLabel('')
                                .ok('OK')
                            );
                            }
                        }

                        
                    }, function() {
                        $mdDialog.hide();
                    });
                }
            // }
            location.href = '#/invoice_app';
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
                controller: 'ViewUploadCtrl',
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
        $scope.calculateBalance = 0;
        //retrieve Data from invoice class

        $scope.LoadAll = function() {
            var client = $objectstore.getClient("invoice12thdoorDraft");
        client.onGetMany(function(data) {
            if (data) {

                for (var i = data.length - 1; i >= 0; i--) {
                    data[i].addView = "";
                    data[i].invoiceNo = parseInt(data[i].invoiceNo);
                    $scope.TDinvoice.push(data[i]);
                    
                };
            }
        });
        client.onError(function(data) {
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
                            $scope.Address = data[i].billingAddress.street + data[i].billingAddress.city + data[i].billingAddress.state +
                                            data[i].billingAddress.zip + data[i].billingAddress.country
                            $scope.calBalance += data[i].MultiDueDAtesArr[x].balance;
                            
                        } 
                        }
                        
                    };
                   
                }
            }
        });
        client.onError(function(data) {
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
                    // if (data[i].paymentStatus != "Cancelled") {
                        for (var x = data[i].paidInvoice.length - 1; x >= 0; x--) {
                            if ($stateParams.invoiceno == data[i].paidInvoice[x].invono) {

                                $scope.Payment.push(data[i]);
                                console.log(data[i])
                            }
                        };
                    // }
                };

            }
        });
        client.onError(function(data) {
        });
        client.getByFiltering("select * from payment where paymentStatus != 'Cancelled'");
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
        
        function toDataUrl(url, callback){
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function() {
              var reader  = new FileReader();
              reader.onloadend = function () {
                  callback(reader.result);
              }
              reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.send();
        }

        function hasNull(target) {
            for (var member in target) {
                if (target[member] == null)
                   target[member] = "";
            }
          return target;
        }

       $scope.convertTopdf = function(content) {
            content = hasNull(content);
            toDataUrl('img/image1.jpg', function(base64Img){
            var doc = new jsPDF();
                doc.addImage(base64Img, 'JPEG', 5, 5, 60, 40);
                var proHeight = 137;

                var newDate = $filter('date')(content.Startdate);

                doc.setFontSize(20);
                doc.setFontType("bold");
                doc.text(30,55,"INVOICE");

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30,60,"#INV -" + content.invoiceNo.toString());

                doc.setFontSize(12);
                doc.text(30,77,"Invoice Date");
                doc.setFontSize(12);
                doc.text(65,77,newDate);
              
                doc.setFontSize(12);
                doc.text(30,84,"Due Date");
                doc.setFontSize(12);
                doc.text(65,84,content.termtype);

                doc.setFontSize(12);
                   doc.text(30,91,"PO");
                if(content.poNum){                
                   doc.setFontSize(12);
                   doc.text(65,91,content.poNum);  
                }
                
                doc.setFontSize(12);
                doc.text(30,98,"Currency");
                if (content.BaseCurrency) {                    
                    doc.setFontSize(12);
                    doc.text(65,98,content.BaseCurrency);
                }

                doc.setFontSize(12);
                doc.text(30,110,"Comments");
                doc.setFontSize(12);
                doc.text(65,110,content.comments);

                //Address Details

                doc.setFontSize(12);
                doc.text(127, 70,"To:");

                doc.setFontSize(12);
                doc.text(127, 77, content.Name);

                doc.setFontSize(12);
                doc.text(127, 84, content.billingAddress.street);

                doc.setFontSize(12);
                doc.text(127, 91, content.billingAddress.city + content.billingAddress.state + 
                    content.billingAddress.zip + content.billingAddress.country);

                // doc.setFontSize(12);
                // doc.text(125, 120, country);

                doc.setFontSize(12);
                doc.text(127, 98, content.Email);

                //Product Table headers

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(30,125,"Description");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(110,125,"Qty");

                 doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(130,125,"Unit");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(150,125,"Price");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(170,125,"Amount");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(30, 130,"___________________________________________________________________"); 

                for(pp=0; pp<= content.invoiceProducts.length-1; pp++){

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(30,proHeight,content.invoiceProducts[pp].Productname);

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(30,proHeight+5,"Optional product line comment-");

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(110,proHeight, content.invoiceProducts[pp].quantity.toString());

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(130,proHeight,content.invoiceProducts[pp].ProductUnit);

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(150,proHeight,content.invoiceProducts[pp].price.toString());

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(170,proHeight,content.invoiceProducts[pp].amount.toString());

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(30, proHeight +  10 ,"___________________________________________________________________"); 
                    proHeight += 20;

                    if (proHeight > 272) {
                        doc.addPage()
                        proHeight = 10
                    }
                }

                    var balance = 0;
                    var paid = 0;
               
               for (var i = content.MultiDueDAtesArr.length - 1; i >= 0; i--) {
                   balance += content.MultiDueDAtesArr[i].balance;
               }
               paid = balance - content.finalamount;

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(93, proHeight + 10,"Sub Total"); 
                doc.setFontSize(12);
                doc.text(170, proHeight + 10, content.total.toString()); 

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(93, proHeight + 20,"Discount");
                doc.setFontSize(12);
                doc.text(170, proHeight + 20, content.fdiscount.toString()); 

                var taxHeight = proHeight + 30;

                for(x=0; x<= content.taxAmounts.length-1; x++){

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(93,taxHeight , content.taxAmounts[x].taxName + content.taxAmounts[x].rate +"%" );
                 doc.setFontSize(12);
                 var salesTax = content.taxAmounts[x].salesTax.toFixed(2) 
                doc.text(170, taxHeight,salesTax.toString()); 

                taxHeight += 10;
                }

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(93, taxHeight + 5,"Shipping");
                doc.setFontSize(12);
                doc.text(170, taxHeight + 5, content.shipping.toString()); 

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(93, taxHeight + 15,"Total" + content.BaseCurrency);
                doc.setFontSize(12);
                doc.text(170, taxHeight + 15, content.finalamount.toString()); 

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(93, taxHeight + 25,"Paid");
                doc.setFontSize(12);
                doc.text(170, taxHeight + 25, paid.toString());

                doc.setFillColor(192, 192, 192);
                doc.rect(90, taxHeight + 30, 100, 10, 'F');

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(93, taxHeight + 35,"Balance Due");
                doc.setFontSize(12);
                doc.text(170, taxHeight + 35, balance.toString());

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30, taxHeight + 50, "Payment Options");

                var payHeight = taxHeight + 50;

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30, payHeight + 10, content.notes);

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30, payHeight + 15, "Any damages must be noticed upon reciept of goods");

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30, payHeight + 22, "GST Registration No:1231564878");

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30, payHeight + 29, "PST Registration No:1231564878");

                if (content.paymentOptions && content.paymentOptions.length > 0) {
                    var arrLength = content.paymentOptions.length - 1;
                    var count = 0;
                    var imageXaxsis = 65
                    for (var i = 0; i<= content.paymentOptions.length - 1; i++) {
                    doc.setFontSize(12);
                        toDataUrl(content.paymentOptions[i].url, function(pImage){
                        // doc.text(50, payHeight, content.paymentOptions[i].url);
                            doc.addImage(pImage, 'PNG', imageXaxsis, payHeight-10, 20, 20);
                            if (count == arrLength) {
                                doc.save(content.invoiceNo.toString()+'.pdf');
                                console.log(count+' == '+ arrLength)
                            }                           
                            count += 1;
                            imageXaxsis += 20;
                        })

                    }
                }else{
                    doc.save(content.invoiceNo.toString()+'.pdf');
                }                
            })

        }

        $scope.PrintPDF = function(content){
            content = hasNull(content);
            toDataUrl('img/image1.jpg', function(base64Img){

                var doc = new jsPDF();
                doc.addImage(base64Img, 'JPEG', 5, 5, 60, 40);
                var proHeight = 137;

                var newDate = $filter('date')(content.Startdate);
                doc.setFontSize(20);
                doc.setFontType("bold");
                doc.text(30,55,"INVOICE");

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30,60,"#INV -" + content.invoiceNo.toString());

                doc.setFontSize(12);
                doc.text(30,77,"Invoice Date");
                doc.setFontSize(12);
                doc.text(65,77,newDate);
              
                doc.setFontSize(12);
                doc.text(30,84,"Due Date");
                doc.setFontSize(12);
                doc.text(65,84,content.termtype);

                doc.setFontSize(12);
                doc.text(30,91,"PO");
                if(content.poNum){                  
                   doc.setFontSize(12);
                   doc.text(65,91,content.poNum);  
                }
                
                doc.setFontSize(12);
                doc.text(30,98,"Currency"); 
                if (content.BaseCurrency) {
                    doc.setFontSize(12);
                    doc.text(65,98,content.BaseCurrency);
                }

                doc.setFontSize(12);
                doc.text(30,110,"Comments");
                doc.setFontSize(12);
                doc.text(65,110,content.comments);

                //Address Details

                doc.setFontSize(12);
                doc.text(127, 70,"To:");

                doc.setFontSize(12);
                doc.text(127, 77, content.Name);

                doc.setFontSize(12);
                doc.text(127, 84, content.billingAddress.street);

                doc.setFontSize(12);
                doc.text(127, 91, content.billingAddress.city + content.billingAddress.state + 
                    content.billingAddress.zip + content.billingAddress.country);

                doc.setFontSize(12);
                doc.text(127, 98, content.Email);

                //Product Table headers

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(30,125,"Description");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(110,125,"Qty");

                 doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(130,125,"Unit");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(150,125,"Price");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(170,125,"Amount");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(30, 130,"___________________________________________________________________"); 

                for(pp=0; pp<= content.invoiceProducts.length-1; pp++){

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(30,proHeight,content.invoiceProducts[pp].Productname);

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(30,proHeight+5,"Optional product line comment-");

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(110,proHeight, content.invoiceProducts[pp].quantity.toString());

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(130,proHeight,content.invoiceProducts[pp].ProductUnit);

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(150,proHeight,content.invoiceProducts[pp].price.toString());

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(170,proHeight,content.invoiceProducts[pp].amount.toString());

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(30, proHeight +  10 ,"___________________________________________________________________"); 
                    proHeight += 20;

                    if (proHeight > 272) {
                        doc.addPage()
                        proHeight = 10
                    }
                }

                    var balance = 0;
                    var paid = 0;
               
               for (var i = content.MultiDueDAtesArr.length - 1; i >= 0; i--) {
                   balance += content.MultiDueDAtesArr[i].balance;
               }
               paid = balance - content.finalamount;

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(93, proHeight + 10,"Sub Total"); 
                doc.setFontSize(12);
                doc.text(170, proHeight + 10, content.total.toString()); 

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(93, proHeight + 20,"Discount");
                doc.setFontSize(12);
                doc.text(170, proHeight + 20, content.fdiscount.toString()); 

                var taxHeight = proHeight + 30;

                for(x=0; x<= content.taxAmounts.length-1; x++){

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(93,taxHeight , content.taxAmounts[x].taxName + content.taxAmounts[x].rate +"%" );
                 doc.setFontSize(12);
                 var salesTax = content.taxAmounts[x].salesTax.toFixed(2) 
                doc.text(170, taxHeight,salesTax.toString()); 

                taxHeight += 10;
                }

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(93, taxHeight + 5,"Shipping");
                doc.setFontSize(12);
                doc.text(170, taxHeight + 5, content.shipping.toString()); 

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(93, taxHeight + 15,"Total" + content.BaseCurrency);
                doc.setFontSize(12);
                doc.text(170, taxHeight + 15, content.finalamount.toString()); 

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(93, taxHeight + 25,"Paid");
                doc.setFontSize(12);
                doc.text(170, taxHeight + 25, paid.toString());

                doc.setFillColor(192, 192, 192);
                doc.rect(90, taxHeight + 30, 100, 10, 'F');

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(93, taxHeight + 35,"Balance Due");
                doc.setFontSize(12);
                doc.text(170, taxHeight + 35, balance.toString());

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30, taxHeight + 45, "Payment Options");

                var payHeight = taxHeight + 45;
                // for (var i = 0; i<= content.paymentOptions.length - 1; i++) {
                // doc.setFontSize(12);
                // doc.text(50, payHeight, content.paymentOptions[i].url);
                //     payHeight += 10;
                // }

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30, payHeight + 5, content.notes);

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30, payHeight + 15, "Any damages must be noticed upon reciept of goods");

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30, payHeight + 22, "GST Registration No:1231564878");

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30, payHeight + 29, "PST Registration No:1231564878");
                
               if (content.paymentOptions && content.paymentOptions.length > 0) {
                    var arrLength = content.paymentOptions.length - 1;
                    var count = 0;
                    var imageXaxsis = 65
                    for (var i = 0; i<= content.paymentOptions.length - 1; i++) {
                    doc.setFontSize(12);
                        toDataUrl(content.paymentOptions[i].url, function(pImage){
                        // doc.text(50, payHeight, content.paymentOptions[i].url);
                            doc.addImage(pImage, 'PNG', imageXaxsis, payHeight-10, 20, 20);
                            if (count == arrLength) {
                                //doc.save(content.invoiceNo.toString()+'.pdf');

                                 doc.autoPrint();
                                doc.output('dataurlnewwindow');
                                // console.log(count+' == '+ arrLength)
                            }                           
                            count += 1;
                            imageXaxsis += 20;
                        })

                    }
                }else{
                     doc.autoPrint();
                                doc.output('dataurlnewwindow');
                }    
               
            })
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
       
        
        $scope.markAll = false;

        $scope.addTodo = function(todoText) {
            $scope.todos = [];
            if (event.keyCode == 13) {
                $scope.todos.push({
                    text: todoText.addView + " " + $scope.userName,
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
                client.insert(todoText, {KeyProperty: "invoiceNo"});
            }
        };


        $scope.deleteNote = function(val,index){
          val.commentsAndHistory.splice(val.commentsAndHistory.indexOf(index), 1 );

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
    app.controller('emailCtrl', function($scope, $mdDialog, $rootScope,$helpers, invo, $rootScope, $uploader, $mdToast, $document,$objectstore,$sce,$filter) {
       $scope.test = invo;
        //console.log($scope.test)
        $scope.subject = "invoice No." + $scope.test.invoiceRefNo + " " + $scope.test.Name;

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

         var client = $objectstore.getClient("t12thdoorSettingEmailBodyy");
        client.onGetMany(function(data) {
            if (data) {
             $scope.emailBody = data[0].emailBody;
        console.log(data[0].emailBody) 
        var newOne = [];
        // newOne.push(data[0].emailBody.substring(data[0].emailBody.indexOf("{{")+2,data[0].emailBody.indexOf("}}")));
        $scope.emailBody = $scope.emailBody.replace("@@invoiceNo@@", $scope.test.invoiceNo);
        $scope.emailBody = $scope.emailBody.replace("@@accounturl@@","<a href= 'http://12thdoor.com' >http://12thdoor.com </a>") 
        $scope.emailBody = $scope.emailBody.replace("@@companyName@@", $scope.test.Name);
        $scope.emailBody = $sce.trustAsHtml($scope.emailBody);
            }
        });
        client.onError(function(data) {});
        client.getByFiltering("select * from t12thdoorSettingEmailBodyy where uniqueRecord ='1' ");

        $scope.Emailerror = false;
        $scope.emailrec = [$scope.test.Email];
        

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

        $scope.pdfChipArr = [];
        $scope.pdfChipArr.push($scope.test.invoiceRefNo+".pdf")
        $scope.emailBCCrec = [];
        $scope.pdfInvoNo = [$scope.test.invoiceNo] 
            

        $scope.listItemClick = function($index) {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);
        };
        var jsondata = {};
        
        function emailWithPdf(){
            jsondata.attachments = [{
                "filename": invo.invoiceNo+'.pdf',
                "path": "http://"+$helpers.getHost()+"/apis/media/tenant/invoicePdf/"+invo.invoiceNo+'.pdf'
            }]
            sendEmailBody()
        }
        
        function sendEmailBody(){

            var xhttp = []
            var emailSend = false;
            

            for(em=0; em<=$scope.emailrec.length-1; em++ ){
               
                (function (em){
                    xhttp[em] = new XMLHttpRequest();

                    jsondata.to = $scope.emailrec[em]; 

                    xhttp[em].onreadystatechange = function() {
                        if (xhttp[em].readyState  == 4) { 
                            if (!emailSend) {
                                emailSend = true;
                                $mdDialog.hide();
                                var toast = $mdToast.simple()
                                  .content('Email Successfully send')
                                  .action('OK')
                                  .highlightAction(false)
                                  .position("bottom right");
                                $mdToast.show(toast).then(function () {

                                });                                 
                            }
                        }
                    }

                    xhttp[em].onerror = function() {}
                    xhttp[em].ontimeout = function() {}

                    xhttp[em].open("POST", "http://test.12thdoor.com:3500/command/notification", true);        
                    xhttp[em].setRequestHeader('securitytoken', 'eb93cca7a7f19ff5ecb48d24c9767024');
                    xhttp[em].setRequestHeader('Content-type', 'application/json');
                    xhttp[em].send(JSON.stringify(jsondata));

                })(em);
            } 
        }

        $scope.sendmail = function(){
            jsondata =  {
                 "type": "email", 
                 "subject": $scope.subject,
                 "bcc": $scope.emailBCCrec,
                 "from": "Invoice <noreply-12thdoor@duoworld.com>",
                 "Namespace": "com.duosoftware.com",
                 "TemplateID": "T_Invoice_1",
                 "DefaultParams": {
                  "@@no@@": invo.invoiceNo,
                  "@@accounturl@@": "http://12thdoor.com",
                  "@@companyName@@": invo.Name
                },
                 "CustomParams": {
                  "@@no@@": "0001",
                  "@@accounturl@@": "http://12thdoor.com",
                  "@@companyName@@": "12thdoor"
                }
            }

            if ($scope.pdfChipArr.length > 0) { 
                emailPdf(invo)
                setTimeout(function(){
                    var decodeUrl = $rootScope.dataUrl;
                    var blobFile = dataURItoBlob(decodeUrl) 
                    blobFile.name = invo.invoiceNo+'.pdf'
                    // console.log(decodeUrl)
                    $uploader.uploadMedia("invoicePdf",blobFile,blobFile.name);
                    $uploader.onSuccess(function (e, data) {
                        emailWithPdf()
                    });
                    $uploader.onError(function (e, data) {
                        var toast = $mdToast.simple()
                            .content('There was an error, please upload!')
                            .action('OK')
                            .highlightAction(false)
                            .position("bottom right");
                        $mdToast.show(toast).then(function () {
                            //whatever
                        }); 
                    });
                },1000)
            }else
                sendEmailBody()
        }
        function dataURItoBlob(dataURI, callback) {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            var byteString = atob(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // write the ArrayBuffer to a blob, and you're done
            var bb = new Blob([ab]);
            return bb;
        }

        function toDataUrl(url, callback){
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function() {
              var reader  = new FileReader();
              reader.onloadend = function () {
                  callback(reader.result);
              }
              reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.send();
        }

        function hasNull(target) {
            for (var member in target) {
                if (target[member] == null)
                   target[member] = "";
            }
          return target;
        }
         function emailPdf(content){
        content = hasNull(content);
        toDataUrl('img/image1.jpg', function(base64Img){

            var doc = new jsPDF();
            doc.addImage(base64Img, 'JPEG', 5, 5, 60, 40);
            var proHeight = 132;

            var newDate = $filter('date')(content.Startdate);
            doc.setFontSize(20);
            doc.setFontType("bold");
            doc.text(30,55,"INVOICE");

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(30,60,"#INV -" + content.invoiceNo.toString());

            doc.setFontSize(12);
            doc.text(30,77,"Invoice Date");
            doc.setFontSize(12);
            doc.text(65,77,newDate);
          
            doc.setFontSize(12);
            doc.text(30,84,"Due Date");
            doc.setFontSize(12);
            doc.text(65,84,content.termtype);

            doc.setFontSize(12);
            doc.text(30,91,"PO");
            if(content.poNum){                  
               doc.setFontSize(12);
               doc.text(65,91,content.poNum);  
            }
            
            doc.setFontSize(12);
            doc.text(30,98,"Currency"); 
            if (content.BaseCurrency) {
                doc.setFontSize(12);
                doc.text(65,98,content.BaseCurrency);
            }

            doc.setFontSize(12);
            doc.text(30,110,"Comments");
            doc.setFontSize(12);
            doc.text(65,110,content.comments);

            //Address Details

            doc.setFontSize(12);
            doc.text(127, 70,"To:");

            doc.setFontSize(12);
            doc.text(127, 77, content.Name);

            doc.setFontSize(12);
        doc.text(127, 84, content.billingAddress.street);

        doc.setFontSize(12);
        doc.text(127, 91, content.billingAddress.city + content.billingAddress.state + 
            content.billingAddress.zip + content.billingAddress.country);

            doc.setFontSize(12);
            doc.text(127, 98, content.Email);

            //Product Table headers

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(30,125,"Description");

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(110,125,"Qty");

             doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(130,125,"Unit");

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(150,125,"Price");

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(170,125,"Amount");

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(30, 125,"___________________________________________________________________"); 

            for(pp=0; pp<= content.invoiceProducts.length-1; pp++){

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30,proHeight,content.invoiceProducts[pp].Productname);

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30,proHeight+5,"Optional product line comment-");

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(110,proHeight, content.invoiceProducts[pp].quantity.toString());

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(130,proHeight,content.invoiceProducts[pp].ProductUnit);

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(150,proHeight,content.invoiceProducts[pp].price.toString());

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(170,proHeight,content.invoiceProducts[pp].amount.toString());

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30, proHeight +  10 ,"___________________________________________________________________"); 
                proHeight += 20;

                if (proHeight > 272) {
                    doc.addPage()
                    proHeight = 10
                }
            }

                var balance = 0;
                var paid = 0;
           
           for (var i = content.MultiDueDAtesArr.length - 1; i >= 0; i--) {
               balance += content.MultiDueDAtesArr[i].balance;
           }
           paid = balance - content.finalamount;

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(93, proHeight + 10,"Sub Total"); 
            doc.setFontSize(12);
            doc.text(170, proHeight + 10, content.total.toString()); 

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(93, proHeight + 20,"Discount");
            doc.setFontSize(12);
            doc.text(170, proHeight + 20, content.fdiscount.toString()); 

            var taxHeight = proHeight + 30;

            for(x=0; x<= content.taxAmounts.length-1; x++){

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(93,taxHeight , content.taxAmounts[x].taxName + content.taxAmounts[x].rate +"%" );
             doc.setFontSize(12);
             var salesTax = content.taxAmounts[x].salesTax.toFixed(2) 
            doc.text(170, taxHeight,salesTax.toString()); 

            taxHeight += 10;
            }

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(93, taxHeight + 5,"Shipping");
            doc.setFontSize(12);
            doc.text(170, taxHeight + 5, content.shipping.toString()); 

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(93, taxHeight + 15,"Total" + content.BaseCurrency);
            doc.setFontSize(12);
            doc.text(170, taxHeight + 15, content.finalamount.toString()); 

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(93, taxHeight + 25,"Paid");
            doc.setFontSize(12);
            doc.text(170, taxHeight + 25, paid.toString());

            doc.setFillColor(192, 192, 192);
            doc.rect(90, taxHeight + 30, 100, 10, 'F');

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(93, taxHeight + 35,"Balance Due");
            doc.setFontSize(12);
            doc.text(170, taxHeight + 35, balance.toString());

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(30, taxHeight + 55, "Payment Options");

            var payHeight = taxHeight + 55;
            // for (var i = 0; i<= content.paymentOptions.length - 1; i++) {
            // doc.setFontSize(12);
            // doc.text(50, payHeight, content.paymentOptions[i].url);
            //     payHeight += 10;
            // }

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(30, payHeight + 5, content.notes);

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(30, payHeight + 15, "Any damages must be noticed upon reciept of goods");

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(30, payHeight + 22, "GST Registration No:1231564878");

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(30, payHeight + 29, "PST Registration No:1231564878");
            $rootScope.dataUrl = ""
           if (content.paymentOptions && content.paymentOptions.length > 0) {
                var arrLength = content.paymentOptions.length - 1;
                var count = 0;
                var imageXaxsis = 65
                for (var i = 0; i<= content.paymentOptions.length - 1; i++) {
                doc.setFontSize(12);
                    toDataUrl(content.paymentOptions[i].url, function(pImage){
                    // doc.text(50, payHeight, content.paymentOptions[i].url);
                        doc.addImage(pImage, 'PNG', imageXaxsis, payHeight-10, 20, 20);
                        if (count == arrLength) {
                            //doc.save(content.invoiceNo.toString()+'.pdf');
 
                            $rootScope.dataUrl= doc.output('datauristring') 
                            // console.log(count+' == '+ arrLength)
                        }                           
                        count += 1;
                        imageXaxsis += 20;
                    })

                }
            }else
                $rootScope.dataUrl= doc.output('datauristring')  
           
        })
    }

    })