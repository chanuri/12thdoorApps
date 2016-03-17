//Angular Material Design - v0.11.0
var app = angular.module('mainApp', ['ngMaterial', 'directivelibrary', '12thdirective', 'uiMicrokernel', 'ui.router', 'ui.sortable']);
    
    app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');
    });
    app.factory('$focus', function($timeout, $window) {
        return function(id) {
            $timeout(function() {
                var element = $window.document.getElementById(id);
                if (element)
                    element.focus();
            });
        };
    });
    app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/settings/invoice_app');
        $stateProvider
            .state('settings', {
                url: '/settings',
                templateUrl: 'Invoicepartials/settings.html',
                controller: 'viewCtrl'
            })
            .state('settings.invoice_app', {
                url: '/invoice_app',
                templateUrl: 'Invoicepartials/AllInvoicePartial.html'
                // controller: 'viewCtrl'
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
            // .state('contactView', {
            //     url: '/contactView/INo=:invoiceno',
            //     templateUrl: 'Invoicepartials/suplierInterface.html',
            //     controller: 'viewCtrl'
            // })
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

        .state('copy', {
            url: '/copyInvoiceDetails/INo=:invoiceno',
            templateUrl: 'Invoicepartials/editInvoice.html',
            controller: 'editCtrl'
        })

        .state('estimateInvoice', {
                url: '/estimateInvoice/IName=:cusName',
                templateUrl: 'Invoicepartials/editInvoice.html',
                controller: 'estimateCtrl'
            })
            .state('ediTRec', {
                url: '/EditRecurringDetails/RecNO=:profilename',
                templateUrl: 'Invoicepartials/editRecurring.html',
                controller: 'editRecurring'
            })
            .state('CopyRec', {
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
app.controller('AppCtrl', function($scope, $objectstore, $focus, $uploader, $state, $mdDialog, InvoiceService, invoiceDetails, $window, $objectstore, $auth, $timeout, $q, $http, $mdToast, $rootScope, InvoiceService, $filter, $location, UploaderService, MultipleDudtesService) {

    $scope.list = [];
    $scope.TDinvoice = {};
    $scope.Settings = {};
    $scope.total = 0;
    $scope.product = {};
    $scope.TDinvoice.invoiceRefNo = 'N/A';
    $scope.showdate = false;
    $scope.TDinvoice.Startdate = new Date();
    $scope.showEditCustomer = false;
    $scope.dueDtaesShow = false;
    $scope.totalSection = false;
    $scope.ShippingSwitch = false;
    $scope.TDinvoice.fdiscount = 0;
    $scope.TDinvoice.salesTaxAmount = 0;
    $scope.TDinvoice.anotherTax = 0;
    $scope.TDinvoice.shipping = 0;
    $scope.AllTaxes = [];
    $scope.individualTax = [];
    $scope.UnitOfMeasure = [];
    $scope.CusFields = [];
    $scope.roles = [];
    $scope.permission = [];
    $scope.TDinvoice.paymentOptions = [];

    var client = $objectstore.getClient("Settings12thdoor");
    client.onGetMany(function(data) {
        if (data) {
            $scope.Settings = data;
            for (var i = $scope.Settings.length - 1; i >= 0; i--) {
                if($scope.Settings[i].payments){
                    $scope.TDinvoice.paymentOptions = $scope.Settings[i].payments;
                }
                if ($scope.Settings[i].preference.invoicepref) {
                    $scope.com = $scope.Settings[i].preference.invoicepref.defaultComm;
                    $scope.note = $scope.Settings[i].preference.invoicepref.defaultNote;
                    $scope.paymentTerm = $scope.Settings[i].preference.invoicepref.defaultPaymentTerms;

                    $scope.ShippingCharges = $scope.Settings[i].preference.invoicepref.enableshipping;
                    $scope.partialPayment = $scope.Settings[i].preference.invoicepref.allowPartialPayments;

                    $scope.ShowShipAddress = $scope.Settings[i].preference.invoicepref.displayshipaddress;
                    $scope.ShowTaxes = $scope.Settings[i].preference.invoicepref.enableTaxes;
                    $scope.offlinePayments = $scope.Settings[i].preference.invoicepref.offlinePayments;
                    $scope.EmailPermission = $scope.Settings[i].preference.invoicepref.copyadminallinvoices;
                    $scope.cusF = $scope.Settings[i].preference.invoicepref.CusFiel

                    $scope.ShowDiscount = $scope.Settings[i].preference.invoicepref.enableDisscounts;
                    $rootScope.email = $scope.Settings[i].preference.invoicepref.emailcontent.emailBody;

                    if ($scope.Settings[i].preference.invoicepref.enableDisscounts == true) {
                        $scope.dis = $scope.Settings[i].preference.invoicepref.disscountItemsOption;
                    } else {

                    }
                }

                if ($scope.Settings[i].profile) {
                    $scope.mail = $scope.Settings[i].profile.adminEmail;
                    $scope.BaseCurrency = $scope.Settings[i].profile.baseCurrency;
                }

                if ($scope.Settings[i].taxes) {
                    for (var x = $scope.Settings[i].taxes.individualtaxes.length - 1; x >= 0; x--) {
                        if ($scope.Settings[i].taxes.individualtaxes[x].activate == true) {
                            $scope.individualTax.push($scope.Settings[i].taxes.individualtaxes[x]);
                        }
                    };
                    for (var y = $scope.Settings[i].taxes.multipletaxgroup.length - 1; y >= 0; y--) {
                        if ($scope.Settings[i].taxes.multipletaxgroup[y].activate == true) {
                            $scope.individualTax.push($scope.Settings[i].taxes.multipletaxgroup[y]);
                        }
                    };
                }

                if ($scope.Settings[i].preference.productpref) {
                    for (var z = $scope.Settings[i].preference.productpref.units.length - 1; z >= 0; z--) {
                        if ($scope.Settings[i].preference.productpref.units[z].activate == true) {
                            $scope.UnitOfMeasure.push($scope.Settings[i].preference.productpref.units[z])
                        }
                    };
                }
                $scope.paymentMethod = [];
                if ($scope.Settings[i].preference.paymentpref) {
                    for (var x = $scope.Settings[i].preference.paymentpref.PaymentMethod.length - 1; x >= 0; x--) {
                        $scope.paymentMethod.push({
                            paymentmethod: $scope.Settings[i].preference.paymentpref.PaymentMethod[x].paymentmethod,
                            paymentType: $scope.Settings[i].preference.paymentpref.PaymentMethod[x].paymentType,
                            activate: $scope.Settings[i].preference.paymentpref.PaymentMethod[x].activate
                        })
                    };
                }

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
        $scope.TDinvoice.BaseCurrency = $scope.BaseCurrency
        $scope.TDinvoice.DiplayShipiingAddress = $scope.ShowShipAddress;
        $scope.TDinvoice.allowPartialPayments = $scope.partialPayment;

        $scope.AllTaxes = $scope.individualTax;
        $scope.UOM = $scope.UnitOfMeasure;
        $scope.CusFields = $scope.cusF;
        $scope.Displaydiscount = $scope.ShowDiscount;
        // $scope.TDinvoice.termtype = $scope.paymentTerm
    });
    client.onError(function(data) {});
    client.getByFiltering("*");


    if ($scope.dis == "SubTotal Items" && $scope.dis == true) {
        $scope.checkDiscout = false;
    }

    $scope.ss = [];
    $scope.getPayement = function(pay) {
        for (var i = $scope.paymentMethod.length - 1; i >= 0; i--) {
            if (pay == $scope.paymentMethod[i].paymentmethod) {
                $scope.ss.push({
                    sc: $scope.paymentMethod[i].paymentmethod,
                    dd: $scope.paymentMethod[i].paymentType
                })

                if ($scope.paymentMethod[i].paymentType == "Offline") {
                    $scope.TDinvoice.OfflinePaymentDetails = $scope.offlinePayments;
                }
            }
        };
    }

    $scope.selectedItemChange = function(c) {
        $scope.showEditCustomer = true;
    };

    //check whether the the user select the dudate. if the user enters a due date the payment type will be change to custom
    $scope.$watch("TDinvoice.duedate", function() {

        if ($scope.TDinvoice.duedate != null && $scope.TDinvoice.termtype == null) {
            $scope.Settings[i].preference.invoicepref.defaultPaymentTerms = "Custom";
        } else if ($scope.TDinvoice.duedate != null && $scope.TDinvoice.duedate != $scope.sevenDays &&
            $scope.TDinvoice.duedate != $scope.fourteendays && $scope.TDinvoice.duedate != $scope.twentyOneDays &&
            $scope.TDinvoice.duedate != $scope.thirtyDays && $scope.TDinvoice.duedate != $scope.fourtyFiveDays &&
            $scope.TDinvoice.duedate != $scope.sixtyDays && $scope.TDinvoice.duedate != $scope.dueOnReceiptDay &&
            $scope.TDinvoice.duedate != $scope.ninetyDays) {
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
            $scope.sevenDays = new Date();
            $scope.sevenDays.setDate($scope.sevenDays.getDate() + 7);
            $scope.TDinvoice.duedate = $scope.sevenDays;
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

//----------------------------Currency exchange (get currency by openexchangerates API)-------------------------------------
$scope.Currency = [];
$scope.ll = [];

    $http({
        url : 'http://openexchangerates.org/api/latest.json?app_id=32c5a0d1a1204a57be97937c10121785&base=USD',
        method : 'GET'
    }).then(function(response){
        for (var key in response.data.rates) {
            $scope.Currency.push(key)
            if($scope.TDinvoice.currency == key){
                $scope.TDinvoice.exchangeRate = response.data.rates[key];
            }

        }
        $scope.changeCurrency = function(){
            for (var key in response.data.rates) {
            $scope.Currency.push(key)
            if($scope.TDinvoice.currency == key){
                $scope.TDinvoice.exchangeRate = response.data.rates[key];
            }
        }
        }
    },function(response){
        console.log(response)
    })
//------------------pops a dialog box which enble the user to add Multiple du dates--------------------------------
    $scope.MultiDuDates = function(data) {
        if ($rootScope.famount == 0) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('Sorry')
                .content('Please add a line item')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent(data)
            );
        } else {
            $scope.showdate = true;
            $scope.TDinvoice.termtype = "multipleDueDates";
            $scope.TDinvoice.duedate = null;
            $scope.showPercentage = false;
            $rootScope.showmsg = false;

            $mdDialog.show({
                templateUrl: 'Invoicepartials/MultipleDuedates.html',
                controller: function addMultipleDueDates($scope, $mdDialog) {
                    $scope.aDatearr = {
                        val: []
                    };
                    $scope.duePaymenet = angular.copy($rootScope.famount);
                    $scope.newfamount = angular.copy($rootScope.famount)
                    $scope.editDueDates = false;
                    $scope.DueDateprice = 0;


                    $scope.testarr = [{
                        duedate: '',
                        percentage: '',
                        duDatePrice: '',
                        paymentStatus: 'Unpaid',
                        balance: $scope.newfamount,
                        count: 1,
                        uniqueKey: 'checkfocus1'
                    }];

                    $scope.AddDueDates = function() {
                        $scope.calc = 0;
                        $rootScope.checkArr = [];
                        $rootScope.checkArr = angular.copy($scope.testarr);
                        for (var i = $scope.testarr.length - 1; i >= 0; i--) {
                            $scope.calc += parseInt($scope.testarr[i].percentage);
                            // if($scope.calc <= 100){
                            MultipleDudtesService.calDateArray({
                                DueDate: $scope.testarr[i].duedate,
                                Percentage: $scope.testarr[i].percentage,
                                dueDateprice: $scope.testarr[i].duDatePrice,
                                paymentStatus: "Unpaid",
                                balance: $scope.testarr[i].duDatePrice,
                                count: $scope.testarr[i].count
                            });
                            // }
                        };

                        if ($scope.calc == 100) {
                            $mdDialog.hide();
                        }
                    }

                    $scope.addItem = function() {
                        $scope.arrr = [];
                        $scope.perCount = 0;
                        $scope.focus = 0;
                        for (i = 0; i <= $scope.testarr.length - 1; i++) {
                            $scope.perCount += parseInt($scope.testarr[i].percentage);
                            var numbers = parseInt($scope.testarr[i].count) + 1;
                            $scope.focus = 'checkfocus' + (parseInt($scope.testarr[i].count) + 1).toString();
                        };
                        if ($scope.perCount >= 100) {} else if ($scope.perCount < 100) {
                            $scope.testarr.push({
                                duedate: '',
                                percentage: '',
                                duDatePrice: parseInt($rootScope.famount - $scope.newfamount),
                                paymentStatus: 'Unpaid',
                                balance: parseInt($rootScope.famount - $scope.newfamount),
                                count: numbers,
                                uniqueKey: $scope.focus

                            });
                        }
                    };

                    $scope.addEditDueDates = function(index) {
                        $scope.arrr = [];
                        $scope.perCount = 0;
                        // $scope.numbers = 0;
                        $scope.focus = 0;
                        for (i = 0; i <= $scope.editMultipleDuedates.length - 1; i++) {
                            $scope.perCount += parseInt($scope.editMultipleDuedates[i].percentage);
                            $scope.calc += parseInt($scope.editMultipleDuedates[i].percentage);
                            var numbers = parseInt($scope.editMultipleDuedates[i].count) + 1;
                            $scope.focus = 'checkfocus' + (parseInt($scope.editMultipleDuedates[i].count) + 1).toString();
                        };
                        if ($scope.perCount >= 100) {} else if ($scope.perCount < 100) {
                            $scope.editMultipleDuedates.push({
                                duedate: '',
                                percentage: '',
                                duDatePrice: '',
                                paymentStatus: 'Unpaid',
                                balance: $scope.DueDateprice,
                                count: numbers,
                                uniqueKey: $scope.focus
                            });
                        }
                    }

                    $scope.rmoveDate = function(cc, index) {
                        $scope.cal = 0;
                        $rootScope.dateArray.val.splice($rootScope.dateArray.val.indexOf(cc), 1);

                        for (var i = $rootScope.dateArray.val.length - 1; i >= 0; i--) {
                            $scope.cal += $rootScope.dateArray.val[i].balance;
                        }
                        $scope.DueDateprice = $scope.newfamount - $scope.cal
                        console.log($rootScope.dateArray.val)

                        $scope.editMultipleDuedates = [{
                            duedate: '',
                            percentage: '',
                            duDatePrice: $scope.DueDateprice,
                            paymentStatus: 'Unpaid',
                            balance: $scope.DueDateprice,
                            count: 1,
                            uniqueKey: 'checkfocus1'
                        }];
                        $scope.editDueDates = true;
                    }

                    $scope.removeeditArray = function(index) {
                        $scope.editMultipleDuedates.splice($scope.editMultipleDuedates.indexOf(index), 1);
                    };

                    $scope.removeItem = function(index) {
                        $scope.testarr.splice($scope.testarr.indexOf(index), 1);
                    };
                    $scope.cancel = function() {
                        $scope.showdate = false;
                        $mdDialog.cancel();
                    }
                    $scope.duecost = 0;

                    $scope.DueAmount = function(cn, index) {
                        $scope.showPercentage = false;
                        $scope.cal = 0;
                        for (var i = $scope.testarr.length - 1; i >= 0; i--) {
                            $scope.showPercentage = false;
                            $scope.cal += parseInt($scope.testarr[i].percentage);

                            if ($scope.cal > 100) {
                                $scope.showPercentage = true;
                            }
                        }
                        $scope.newfamount = (parseInt($rootScope.famount * cn.percentage) / 100);
                        $scope.testarr[index] = {
                            duedate: cn.duedate,
                            percentage: cn.percentage,
                            duDatePrice: $scope.newfamount,
                            balance: $scope.newfamount,
                            count: cn.count,
                            uniqueKey: cn.uniqueKey
                        }
                        $focus(cn.uniqueKey);
                    }

                    $scope.EditDueAmount = function(cc, index) {
                        $scope.showPercentage = false;
                        $scope.cal = 0;
                        $scope.ccc = 0;
                        $scope.tot = 0;
                        $scope.finalTotal = 0;
                        $scope.oldPercentage = 0;

                        for (var i = $rootScope.dateArray.val.length - 1; i >= 0; i--) {
                            $scope.oldPercentage += parseInt($rootScope.dateArray.val[i].Percentage);
                        }
                        for (var i = $scope.editMultipleDuedates.length - 1; i >= 0; i--) {
                            $scope.showPercentage = false;
                            $scope.cal += parseInt($scope.editMultipleDuedates[i].percentage);
                        }

                        if ($scope.cal + $scope.oldPercentage > 100) {
                            $scope.showPercentage = true;
                        }
                        $scope.ccc = (parseInt($scope.newfamount * cc.percentage) / 100);
                        $scope.editMultipleDuedates[index] = {
                            duedate: cc.duedate,
                            percentage: cc.percentage,
                            duDatePrice: $scope.ccc,
                            balance: $scope.ccc,
                            count: cc.count,
                            uniqueKey: cc.uniqueKey
                        }
                        $focus(cc.uniqueKey);
                    }

                    $scope.UpdateDueDates = function() {
                        $scope.calc = 0;
                        $rootScope.checkArr = [];
                        $rootScope.checkArr = angular.copy($scope.editMultipleDuedates);
                        $scope.oldPercentage = 0;

                        for (var i = $rootScope.dateArray.val.length - 1; i >= 0; i--) {
                            $scope.oldPercentage += parseInt($rootScope.dateArray.val[i].Percentage);
                        }

                        for (var i = $scope.editMultipleDuedates.length - 1; i >= 0; i--) {
                            $scope.calc += parseInt($scope.editMultipleDuedates[i].percentage);

                            MultipleDudtesService.editDateArray({
                                DueDate: $scope.editMultipleDuedates[i].duedate,
                                Percentage: $scope.editMultipleDuedates[i].percentage,
                                dueDateprice: $scope.editMultipleDuedates[i].duDatePrice,
                                paymentStatus: "Unpaid",
                                balance: $scope.editMultipleDuedates[i].duDatePrice,
                                count: $scope.editMultipleDuedates[i].count
                            });
                        };

                        if ($scope.calc + $scope.oldPercentage == 100) {
                            $mdDialog.hide();
                        }
                    }
                }
            })
        }
    }

    //---------------------------Delete added products-----------------------------------------
    $scope.deleteproduct = function(name, index) {
        InvoiceService.ReverseTax(name, index);
        $rootScope.testArray.val.splice($rootScope.testArray.val.indexOf(name), 1);
    }

    //dialog box pop up to add product
    $scope.addproduct = function(ev) {
        $rootScope.taxType = angular.copy($scope.AllTaxes);
        $rootScope.AllUnitOfMeasures = angular.copy($scope.UOM)
        $rootScope.Showdiscount = angular.copy($scope.Displaydiscount);
        $rootScope.discounts = angular.copy($scope.dis);
        $rootScope.DisplayTaxes = angular.copy($scope.ShowTaxes);
        $rootScope.BaseCurrency1 = angular.copy($scope.BaseCurrency)
        
            // console.log($scope.BaseCurrency1);
        $mdDialog.show({
            templateUrl: 'Invoicepartials/addproduct.html',
            targetEvent: ev,
            controller: function addProductController($scope, $mdDialog) {
                $scope.prducatsAdd = {};
                $scope.prod = {};
                $scope.promoItems = [];
                $scope.taxType = [];
                $scope.AllUnitOfMeasures = [];
                $scope.discount = 0;
                $scope.displayDiscountLine = false;
                $scope.showPercentage = false;
                $scope.showPrice = false;
                $scope.showQuantity = false;
                $scope.showProduct = false;
                //console.log($rootScope.Showdiscount)
                if ($rootScope.discounts == "Individual Items" && $rootScope.Showdiscount == true) {
                    $scope.displayDiscountLine = true;
                }

                $scope.addproductToarray = function(item) {
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
                            if ($scope.promoItems[i].productName == null) {
                                $scope.showProduct = true;
                            } else if ($scope.promoItems[i].qty == null) {
                                $scope.showQuantity = true;
                            } else if ($scope.promoItems[i].ProductUnit == null) {
                                $scope.showPercentage = true;

                            } else if ($scope.promoItems[i].price == null) {
                                $scope.showPrice = true;
                            } else {
                                InvoiceService.setFullArr({
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
                                        $scope.prod.deleteStatus = false
                                        $scope.prod.favouriteStar = false;
                                        $scope.prod.favouriteStarNo = 1;
                                        $scope.prod.tags = [];
                                        $scope.prod.status = "Active"
                                        $scope.prod.deleteStatus = "false"
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
                            $scope.SProductUnit = $scope.promoItems[0].ProductUnit;
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
                    $scope.calAMount()
                }

                $scope.setUOM = function(val) {
                    $scope.SProductUnit = val.ProductUnit;
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

                $scope.Amount = 0;
                $scope.calAMount = function() {

                    $scope.disc = 0;
                    $scope.totall = 0;
                    $scope.totall = $scope.Sprice * $scope.Sqty;
                    if ($rootScope.discounts == "Individual Items") {
                        $scope.disc = parseInt($scope.totall * $scope.discount / 100);
                        $scope.Amount = $scope.totall - $scope.disc;
                    } else {
                        $scope.Amount = $scope.totall;
                    }
                    return $scope.Amount;
                }

                var client = $objectstore.getClient("product12thdoor");
                client.onGetMany(function(data) {
                    if (data) {
                        $scope.product = data;
                    }
                });
                client.getByFiltering("select * from product12thdoor where deleteStatus = 'false' and status = 'Active'");

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
                    client.onError(function(data) {});
                    client.getByFiltering("select * from product12thdoor where deleteStatus = 'false' and status = 'Active'");
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
                    $scope.addTask = "";
                    $scope.email = "";
                    $scope.contact = {};
                    $scope.baddress = {};
                    $scope.saddress = {};
                    $scope.contact["baddress"] = {};
                    $scope.contact["saddress"] = {};
                    $scope.showShipping = $scope.showShipping;
                    $scope.showBilling = !$scope.showBilling;
                    $scope.cb = false;
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    }
                    $scope.addressChange = function() {
                        $scope.showShipping = !$scope.showShipping;
                        $scope.showBilling = !$scope.showBilling;
                    }

                    $scope.onChange = function(cb) {
                        cb == true;
                        $scope.contact.saddress["s_street"] = $scope.contact.baddress["street"];
                        $scope.contact.saddress["s_city"] = $scope.contact.baddress["city"];
                        $scope.contact.saddress["s_country"] = $scope.contact.baddress["country"];
                        $scope.contact.saddress["s_zip"] = $scope.contact.baddress["zip"];
                        $scope.contact.saddress["s_state"] = $scope.contact.baddress["state"];
                        if (cb == false) {
                            $scope.contact.saddress["s_street"] = "";
                            $scope.contact.saddress["s_city"] = "";
                            $scope.contact.saddress["s_country"] = "";
                            $scope.contact.saddress["s_zip"] = "";
                            $scope.contact.saddress["s_state"] = "";
                        }
                    }
                    $scope.AddCus = function() {
                        var client = $objectstore.getClient("contact12thdoor");
                        if ($scope.contact.Name == null) {
                            var toast = $mdToast.simple()
                                .textContent('Please add Company or Individual Name')
                                .action('OK')
                                .highlightAction(false)
                                .position($scope.getToastPosition());
                            $mdToast.show(toast).then(function(response) {});
                        } else if ($scope.contact.Email == null) {
                            var toast = $mdToast.simple()
                                .textContent('Please enter your email')
                                .action('OK')
                                .highlightAction(false)
                                .position($scope.getToastPosition());
                            $mdToast.show(toast).then(function(response) {});
                        } else {
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
                            $scope.contact.favoritestar = false;
                            $scope.contact.status = 'Active';
                            $scope.contact.deleteStatus = 'false'
                            $scope.contact.cb = true;
                            $scope.contact.customerid = "-999";
                            client.insert($scope.contact, {KeyProperty: "customerid"});

                            $rootScope.customerNames.push({
                                display: $scope.contact.Name.toLowerCase(),
                                value: $scope.contact,
                                BillingValue: $scope.contact.baddress.street + ', ' + $scope.contact.baddress.city + ', ' + $scope.contact.baddress.zip + ', ' + $scope.contact.baddress.state + ', ' + $scope.contact.baddress.country,
                                shippingValue: $scope.contact.saddress.s_street + ', ' + $scope.contact.saddress.s_city + ', ' + $scope.contact.saddress.s_zip + ', ' + $scope.contact.saddress.s_state + ', ' +
                                    $scope.contact.saddress.s_country
                            });
                            var self = this;
                            for (var i = $rootScope.customerNames.length - 1; i >= 0; i--) {
                                if ($rootScope.customerNames[i].display == $scope.contact.Name) {
                                    $rootScope.selectedItem1 = $rootScope.customerNames[i];
                                    console.log($rootScope.selectedItem1);
                                };
                            };

                            $mdDialog.hide();
                        }

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
                        KeyProperty: "customerid"
                    });

                    $rootScope.customerNames.splice($rootScope.customerNames.indexOf($rootScope.selectedItem1), 1);
                    $rootScope.customerNames.push({
                        display: cusform.Name.toLowerCase(),
                        value: cusform,
                        BillingValue: cusform.baddress.street + ', ' + cusform.baddress.city + ', ' + cusform.baddress.zip + ', ' + cusform.baddress.state + ', ' + cusform.baddress.country,
                        shippingValue: cusform.saddress.s_street + ', ' + cusform.saddress.s_city + ', ' + cusform.saddress.s_zip + ', ' + cusform.saddress.s_state + ', ' +
                            cusform.saddress.s_country
                    });
                    var self = this;
                    for (var i = $rootScope.customerNames.length - 1; i >= 0; i--) {
                        if ($rootScope.customerNames[i].display == cusform.Name) {
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
            if (keyEvent.which == 40) {}
        }

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
        // client.skip(25).take(25).getByFiltering("select * from data where x like l%"){
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
        client.getByFiltering("select * from contact12thdoor Where status = 'Active'");
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
    var client = $objectstore.getClient("product12thdoor");
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
    client.getByFiltering("select * from product12thdoor where deleteStatus = 'false' and status = 'Active'");

    $scope.view = function() {
        $rootScope.taxArr1 = [];
        location.href = '#/invoice_app';

    }
    $scope.check = function(cc) {
        $scope.TDinvoice.CuSFields = {};
        for (var i = $scope.CusFields.length - 1; i >= 0; i--) {
            $scope.TDinvoice.CuSFields = ({
                name: $scope.CusFields[i].labelshown,
                id: cc
            });
        };
    }
    for (var i = $scope.CusFields.length - 1; i >= 0; i--) {
        if ($scope.CusFields[i].type == 'textBox') {
            $scope.TDinvoice.CuSFields = ({
                name: $scope.CusFields[i].type,
                id: $scope.CusFields[i].inputType
            });
        }
    }

    $scope.TDleger = {};
    //save invoice details
    $scope.submit = function() {
        if ($scope.TDinvoice.termtype != "multipleDueDates") {
            $scope.TDinvoice.MultiDueDAtesArr = [{
                DueDate: $scope.TDinvoice.duedate,
                Percentage: "0",
                dueDateprice: $scope.famount,
                paymentStatus: 'Unpaid',
                balance: $scope.famount
            }];
        } else {
            $scope.TDinvoice.MultiDueDAtesArr = $rootScope.dateArray.val;
        }

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
                    $mdToast.show(toast).then(function() {});
                });
            }
        };
        var client = $objectstore.getClient("invoice12thdoor");
        $scope.TDinvoice.ProgressBarDetails = $scope.ProgressBar;
        $scope.TDinvoice.invoiceProducts = $rootScope.testArray.val;
        $scope.TDinvoice.commentsAndHistory = [];
        $scope.TDinvoice.DeleteStatus = false;
        $scope.TDinvoice.commentsAndHistory.push({
            done: false,
            text: "Invoice was created by Mr.dddd",
            date: new Date()
        });
        $scope.TDinvoice.total = $scope.total;
        $scope.TDinvoice.finalamount = $scope.famount;
        $scope.TDinvoice.discountAmount = $scope.finalDisc;
        $scope.TDinvoice.salesTaxAmount = $scope.salesTax;
        $scope.TDinvoice.cardOpen = false;
        $scope.TDinvoice.favourite = false;
        $scope.TDinvoice.favouriteStarNo = 1;
        $scope.TDinvoice.Name = $rootScope.selectedItem1.display;
        $scope.TDinvoice.Email = $rootScope.selectedItem1.value.Email;
        $scope.TDinvoice.customerid = $rootScope.selectedItem1.value.customerid;
        $scope.TDinvoice.billingAddress = $rootScope.selectedItem1.BillingValue;
        $scope.TDinvoice.shippingAddress = $rootScope.selectedItem1.shippingValue;
        $scope.TDinvoice.invoiceNo = "-999";
        $scope.TDinvoice.UploadImages = {
            val: []
        };

        var leger = $objectstore.getClient("leger12thdoor");

        $scope.TDleger.Name = $rootScope.selectedItem1.display;
        $scope.TDleger.RefID = $scope.TDinvoice.invoiceRefNo;
        $scope.TDleger.Type = "Invoice";
        $scope.TDleger.Description = "Invoice added";
        $scope.TDleger.Amount = $scope.famount;
        $scope.TDleger.AccountNo = $rootScope.selectedItem1.value.customerid;
        $scope.TDleger.Date = new Date();
        $scope.TDleger.InvoiceRefID = "N/A"
        $scope.TDleger.ID = "-999";


        if ($rootScope.testArray.val.length > 0) {
            $scope.TDinvoice.UploadImages.val = UploaderService.loadBasicArray();
            client.onComplete(function(data) {

                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Confirmation')
                    .content('invoice Successfully Saved')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent(data)
                );
                $rootScope.invoiceArray.splice(0, 1);
                invoiceDetails.setArray($scope.TDinvoice);
                $state.go('view', {
                    'invoiceno': $scope.TDinvoice.invoiceRefNo
                });
            });

            client.insert([$scope.TDinvoice], {
                KeyProperty: "invoiceNo"
            });
            leger.insert([$scope.TDleger], {
                KeyProperty: "ID"
            });
        } else {
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
    var client = $objectstore.getClient("domainClassAttributes");
    client.onGetMany(function(data) {
        if (data) {
            $scope.InvoiceDetails = data;

            for (var i = $scope.InvoiceDetails.length - 1; i >= 0; i--) {
                $scope.ID = $scope.InvoiceDetails[i].maxCount;
            };

            if ($scope.InvoiceDetails.length == 0) {
                $scope.maxID = 1;
            } else {
                $scope.maxID = parseInt($scope.ID) + 1;
            }
            $scope.TDinvoice.invoiceRefNo = $scope.maxID.toString();
        }
    });
    client.getByFiltering("select maxCount from domainClassAttributes where class='invoice12thdoor'");


    $rootScope.calculatetotal = function() {
        $scope.total = 0;
        angular.forEach($rootScope.testArray.val, function(tdIinvoice) {
            $scope.total += parseInt(tdIinvoice.amount);
        })
        return $scope.total;
    };
    $scope.finalDisc = 0;
    $scope.finaldiscount = function() {

        $scope.Discount = 0;
        if ($scope.dis == "SubTotal Items") {
            $scope.finalDisc = parseFloat(($scope.salesTax + $scope.total) * $scope.TDinvoice.fdiscount / 100)
        } else if ($scope.dis == "Individual Items") {
            $scope.finalDisc = 0;
        }
        return $scope.finalDisc;
    }

    $scope.CalculateTax = function() {
        $scope.salesTax = 0;
        for (var i = $rootScope.taxArr.length - 1; i >= 0; i--) {
            $scope.salesTax += parseFloat($rootScope.taxArr[i].salesTax);
            // $scope.salesTax = tt;
        }
        return $scope.salesTax;
    }

    $scope.finalamount = function() {
        $rootScope.famount = 0;
        $rootScope.famount = parseFloat($scope.total - $scope.finalDisc) + parseFloat($scope.salesTax) +
            parseFloat($scope.TDinvoice.shipping);

        return $rootScope.famount;
    };

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

    $scope.clearAll = function(ev) {
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
                        $mdToast.show(toast).then(function() {});
                    });
                    $uploader.onError(function(e, data) {
                        var toast = $mdToast.simple()
                            .content('There was an error, please upload!')
                            .action('OK')
                            .highlightAction(false)
                            .position("bottom right");
                        $mdToast.show(toast).then(function() {});
                    });
                }
            };

            $scope.InvoiceDraftDetails = [];
            var client = $objectstore.getClient("domainClassAttributes");
            client.onGetMany(function(data) {
                if (data) {
                    $scope.InvoiceDraftDetails = data;

                    for (var i = $scope.InvoiceDraftDetails.length - 1; i >= 0; i--) {
                        $scope.IND = $scope.InvoiceDraftDetails[i].maxCount;
                    };
                    $scope.maxNo = parseInt($scope.IND) + 1;
                    $scope.RefNo = $scope.maxNo.toString();
                }
            });
            client.getByFiltering("select maxCount from domainClassAttributes where class='invoice12thdoorDraft'");

            var client = $objectstore.getClient("invoice12thdoorDraft");

            $scope.TDinvoice.invoiceRefNo = $scope.RefNo;
            $scope.TDinvoice.invoiceProducts = $rootScope.testArray.val;
            $scope.TDinvoice.total = $scope.total;
            $scope.TDinvoice.finalamount = $scope.famount;
            // $scope.TDinvoice.status = "Draft";


            $scope.TDinvoice.MultiDueDAtesArr = $scope.dateArray.value;
            if ($scope.TDinvoice.termtype != "multipleDueDates") {
                $scope.TDinvoice.MultiDueDAtesArr = [{
                    DueDate: $scope.TDinvoice.duedate,
                    Percentage: "0",
                    dueDateprice: $scope.famount,
                    paymentStatus: 'Draft',
                    balance: $scope.famount
                }];
            } else {
                $scope.TDinvoice.MultiDueDAtesArr = $rootScope.dateArray.val;
            }
            $scope.TDinvoice.UploadImages = {
                val: []
            };
            $scope.TDinvoice.UploadImages.val = UploaderService.loadBasicArray();
            if ($rootScope.selectedItem1 != null) {
                $scope.TDinvoice.Name = $rootScope.selectedItem1.display;
                $scope.TDinvoice.billingAddress = $rootScope.selectedItem1.BillingValue;
                $scope.TDinvoice.shippingAddress = $rootScope.selectedItem1.shippingValue;
                $scope.TDinvoice.DeleteStatus = false;
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
                    location.href = '#/invoice_app';
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
            } else {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Sorry')
                    .content('please select a cutomer')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')

                );
            }
            $scope.TDinvoice.invoiceNo = "-999";
            client.insert([$scope.TDinvoice], {
                KeyProperty: "invoiceNo"
            });

        }, function() {
            $rootScope.testArray.val = "";
            $rootScope.dateArray.val = "";
            $scope.total = "";
            $scope.famount = "";
            if ($rootScope.selectedItem1 != null) {
                $rootScope.selectedItem1.display = "";
                $rootScope.selectedItem1.BillingValue = "";
                $rootScope.selectedItem1.shippingValue = "";
            }

            $scope.dateArray.value = "";
            $rootScope.searchText = null;
            $scope.TDinvoice.poNum = "";
            $scope.TDinvoice.comments = "";
            $scope.TDinvoice.fdiscount = "";
            $scope.TDinvoice.salesTax = "";
            $scope.TDinvoice.anotherTax = "";
            $scope.TDinvoice.shipping = "";
            $scope.TDinvoice.notes = "";
            $scope.TDinvoice.termtype = "";
            $scope.TDinvoice.paymentMethod = "";
            $scope.TDinvoice.roFruitNames = "";
            $rootScope.taxArr = "";
            // location.href = '#/invoice_app';
            $state.go('settings.invoice_app');
        });
    }
})