//Angular Material Design - v0.11.0
var app = angular.module('mainApp', ['ngMaterial', 'directivelibrary', '12thdirective', 'uiMicrokernel', 'ui.router', 'ui.sortable','ngMessages']);
    
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
            .state('InvoiceCopyRec', {
                url: '/copyToRecurringProfile',
                templateUrl: 'Invoicepartials/copyRec.html',
                controller: 'copyRecurring'
            })
            .state('viewProfile', {
                url: '/viewRecurringProfile/RecNO=:profileName',
                templateUrl: 'Invoicepartials/viewRecurringProfile.html',
                controller: 'ViewRecurring'
            })
    });
app.config(function($mdThemingProvider){

    $mdThemingProvider.definePalette('12thDoorPrimary', {
        '50': '235B91',
        '100': '235B91',
        '200': '235B91',
        '300': '235B91',
        '400': '235B91',
        '500': '235B91',
        '600': '235B91',
        '700': '235B91',
        '800': '235B91',
        '900': '235B91',
        'A100': '235B91',
        'A200': '235B91',
        'A400': '235B91',
        'A700': '235B91',
        'contrastDefaultColor': 'light',          
        'contrastDarkColors': ['50', '100',
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined  

    });

    $mdThemingProvider.definePalette('12thDoorAccent', {
        '50': 'ffffff',
        '100': 'ffffff',
        '200': 'ffffff',
        '300': 'ffffff',
        '400': 'ffffff',
        '500': 'ffffff',
        '600': 'ffffff',
        '700': 'ffffff',
        '800': 'ffffff',
        '900': 'ffffff',
        'A100': 'ffffff',
        'A200': 'ffffff',
        'A400': 'ffffff',
        'A700': 'ffffff',
        'contrastDefaultColor': 'dark',
        'contrastDarkColors': ['50', '100',
         '200', '300', '400', 'A100'],
        'contrastLightColors': '7c7c7c'
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('12thDoorPrimary')
        .accentPalette('12thDoorAccent')
        .warnPalette('red');

    $mdThemingProvider.alwaysWatchTheme(true);
});

//------------APPCtrl starts--------------------------------------------------------------------------------------------------------
app.controller('AppCtrl', function($scope, $objectstore, $focus, $auth, $uploader, $state, $mdDialog, InvoiceService, invoiceDetails, $window, $objectstore, $auth, $timeout, $q, $http, $mdToast, $rootScope, InvoiceService, $filter, $location, UploaderService, MultipleDudtesService) {

    $auth.checkSession();
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
    $rootScope.famount = 0;
    $scope.TDinvoice.anotherTax = 0;
    $scope.TDinvoice.shipping = 0;
    $scope.AllTaxes = [];
    $scope.individualTax = [];
    $scope.UnitOfMeasure = [];
    $scope.CusFields = [];
    $scope.roles = [];
    $scope.permission = [];
    $scope.TDinvoice.paymentOptions = [];
    $rootScope.testArray.val = [];
    $rootScope.dateArray.val = [];
    $scope.paymentMethod = [];
    $rootScope.discountDesc = false;
    $rootScope.currencyStatus = false;

    $scope.paymentMethod.push({
    paymentmethod: 'Offline Payments Only',
    paymentType: 'offline',
    activate: "Active"
})

    var client = $objectstore.getClient("Settings12thdoor");
    client.onGetMany(function(data) {
        if (data) {
            $scope.Settings = data;
            for (var i = $scope.Settings.length - 1; i >= 0; i--) {

                
                if($scope.Settings[i].payments){
                    for (var x = $scope.Settings[i].payments.length - 1; x >= 0; x--) {
                   if($scope.Settings[i].payments[x].activate == true){
                    $scope.TDinvoice.paymentOptions.push($scope.Settings[i].payments[x]);
                   }
                }
                    
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

                    if ($scope.Settings[i].preference.invoicepref.enableDisscounts == true) {
                        $scope.dis = $scope.Settings[i].preference.invoicepref.disscountItemsOption;
                    } else {

                    }
                }

                if ($scope.Settings[i].profile) {
                    $scope.mail = $scope.Settings[i].profile.adminEmail;
                     $rootScope.BaseCurrency = $scope.Settings[i].profile.baseCurrency;
                    $scope.TDinvoice.BaseCurrency = $scope.Settings[i].profile.baseCurrency;
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
               
                if ($scope.Settings[i].preference.paymentpref) {
                    for (var x = $scope.Settings[i].preference.paymentpref.PaymentMethod.length - 1; x >= 0; x--) {
                        $scope.paymentMethod.push({
                            paymentmethod: $scope.Settings[i].preference.paymentpref.PaymentMethod[x].paymentmethod,
                            paymentType: $scope.Settings[i].preference.paymentpref.PaymentMethod[x].paymentType,
                            activate: $scope.Settings[i].preference.paymentpref.PaymentMethod[x].activate
                        })
                    };
                }

                 $scope.paymentMethod.push({
                        paymentmethod: 'All Online Payment Options',
                        paymentType: 'offline',
                        activate: "Active"
                    })
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
        $scope.TDinvoice.DiplayShipiingAddress = $scope.ShowShipAddress;
        $scope.TDinvoice.allowPartialPayments = $scope.partialPayment;

        $scope.AllTaxes = $scope.individualTax;
        $scope.UOM = $scope.UnitOfMeasure;
        $scope.CusFields = $scope.cusF;
        $scope.Displaydiscount = $scope.ShowDiscount;
    });
    client.onError(function(data) {});
    client.getByFiltering("*");

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
    $scope.minDate = new Date();


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
                    item: ev
                }
            })
        }
        //pops a dialog box which enble the user to change currency
    $scope.acceptAccount = function(ev, user) {
        $mdDialog.show({
            templateUrl: 'Invoicepartials/changeCurrency.html',
            targetEvent: ev,
            controller: 'currencyCtrl',
            locals: {
                    item: ev
                }
        })
    }

//------------------pops a dialog box which enble the user to add Multiple du dates--------------------------------
    $scope.MultiDuDates = function(data) {
        if ($rootScope.testArray.val.length == 0) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('Sorry')
                .content('Please add a line item to configure multiple due dates')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent(data)
            );
        } else if($rootScope.testArray.val.length != 0){
            $scope.showdate = true;
           $scope.TDinvoice.termtype = "multipleDueDates";
            $scope.TDinvoice.duedate = null;
            $scope.showPercentage = false;
            $rootScope.showmsg = false;

            $mdDialog.show({
                templateUrl: 'Invoicepartials/MultipleDuedates.html',
                controller: function addMultipleDueDates($scope, $mdDialog) {
                    $scope.minDate = new Date();
                    $scope.aDatearr = {
                        val: []
                    };
            
                    $scope.newfamount = angular.copy($rootScope.famount)
                    $scope.editDueDates = false;
                    $scope.DueDateprice = 0;
                    $scope.showEditButton = false;
                    $scope.editMultipleDuedates = [];
                    $scope.editMultipleDuedates = angular.copy($rootScope.dateArray.val)
                       $scope.editMultipleDuedates = $scope.editMultipleDuedates.sort(function(a,b){
                        return new Date(a.DueDate) - new Date(b.DueDate)
                        })
                        
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
                            $scope.calc += parseFloat($scope.testarr[i].percentage);
                            MultipleDudtesService.calDateArray({
                                DueDate: $scope.testarr[i].duedate,
                                Percentage: $scope.testarr[i].percentage,
                                dueDateprice: $scope.testarr[i].duDatePrice,
                                paymentStatus: "Unpaid",
                                balance: $scope.testarr[i].duDatePrice,
                                count: $scope.testarr[i].count
                            });
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
                                duDatePrice: '',
                                paymentStatus: 'Unpaid',
                                balance: parseFloat($rootScope.famount - $scope.newfamount),
                                count: numbers,
                                uniqueKey: $scope.focus

                            });
                        }
                    };

                    $scope.addEditDueDates = function(index) {
                        $scope.arrr = [];
                        $scope.perCount = 0;
                        $scope.focus = 0;
                        for (i = 0; i <= $scope.editMultipleDuedates.length - 1; i++) {
                            $scope.perCount += parseInt($scope.editMultipleDuedates[i].Percentage);
                            var numbers = parseInt($scope.editMultipleDuedates[i].count) + 1;
                            $scope.focus = 'checkfocus' + (parseInt($scope.editMultipleDuedates[i].count) + 1).toString();
                        };
                        if ($scope.perCount >= 100) {

                        } else if ($scope.perCount < 100) {
                            $scope.editMultipleDuedates.push({
                                DueDate: '',
                                Percentage: '',
                                dueDateprice: '',
                                paymentStatus: 'Unpaid',
                                balance: $scope.DueDateprice,
                                count: numbers,
                                uniqueKey: $scope.focus
                            });
                        }
                    }

                    $scope.removeeditArray = function(cc,index) {
                        var tt = index + 1;
                        if($scope.editMultipleDuedates.length > 1){
                         $scope.editMultipleDuedates.splice($scope.editMultipleDuedates.indexOf(cc), 1);   

                         if($scope.editMultipleDuedates.length >= tt){
                            $scope.deletedP = parseInt($scope.editMultipleDuedates[index].Percentage) +parseInt(cc.Percentage);
                                $scope.editMultipleDuedates[index] = {
                                DueDate: $scope.editMultipleDuedates[index].DueDate,
                                Percentage: $scope.deletedP,
                                dueDateprice: parseFloat($scope.editMultipleDuedates[index].dueDateprice+cc.dueDateprice),
                                balance: parseFloat($scope.editMultipleDuedates[index].balance+cc.balance),
                                count: $scope.editMultipleDuedates[index].count,
                                paymentStatus: $scope.editMultipleDuedates[index].paymentStatus,
                                uniqueKey: $scope.editMultipleDuedates[index].uniqueKey
                            }
                        }else if($scope.editMultipleDuedates.length < tt){
                            $scope.deletedP = parseInt($scope.editMultipleDuedates[index-1].Percentage) +parseInt(cc.Percentage);
                            $scope.editMultipleDuedates[index-1] = {
                                DueDate: $scope.editMultipleDuedates[index-1].DueDate,
                                Percentage: $scope.deletedP,
                                dueDateprice: parseFloat($scope.editMultipleDuedates[index-1].dueDateprice+cc.dueDateprice),
                                balance: parseFloat($scope.editMultipleDuedates[index-1].balance+cc.balance),
                                count: $scope.editMultipleDuedates[index-1].count,
                                paymentStatus: $scope.editMultipleDuedates[index-1].paymentStatus,
                                uniqueKey: $scope.editMultipleDuedates[index-1].uniqueKey
                            }
                        }

                        }
                        $scope.editDueDates = true;
                    };

                    $scope.removeItem = function(cc, index) {
                        $scope.testarr.splice($scope.testarr.indexOf(cc), 1);
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
                            $scope.cal += parseFloat($scope.testarr[i].percentage);

                            if ($scope.cal > 100) {
                                $scope.showPercentage = true;
                            }
                        }
                        $scope.newfamount = (parseFloat($rootScope.famount * cn.percentage) / 100);
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

                    $scope.EditDueAmount = function(cn, index) {
                        $scope.showPercentage = false;
                        $scope.cal = 0;
                
                        $scope.newfamount = (parseFloat($rootScope.famount * cn.Percentage) / 100);
                        $scope.editMultipleDuedates[index] = {
                            DueDate: cn.DueDate,
                            Percentage: cn.Percentage,
                            dueDateprice: $scope.newfamount,
                            balance: $scope.newfamount,
                            count: cn.count,
                            paymentStatus: 'Unpaid',
                            uniqueKey: cn.uniqueKey
                        }
                        $focus(cn.uniqueKey);
                    }

                    $scope.UpdateDueDates = function() {
                        $scope.calc = 0;
                        $rootScope.checkArr = [];
                        $rootScope.checkArr = angular.copy($scope.editMultipleDuedates);
                        $scope.oldPercentage = 0;

                        for (var i = $rootScope.dateArray.val.length - 1; i >= 0; i--) {
                            $rootScope.dateArray.val.splice($rootScope.dateArray.val.indexOf($rootScope.dateArray.val[i]),1)
                        }
                        $rootScope.dateArray.val = $scope.editMultipleDuedates;
                        $mdDialog.hide();
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

//--------------------dialog box pop up to add product------------------------------------

    $scope.addproduct = function(ev) {
        $rootScope.termType = angular.copy($scope.TDinvoice.termtype);
        $rootScope.taxType = angular.copy($scope.AllTaxes);
        $rootScope.AllUnitOfMeasures = angular.copy($scope.UOM)
        $rootScope.Showdiscount = angular.copy($scope.Displaydiscount);
        $rootScope.discounts = angular.copy($scope.dis);
        $rootScope.DisplayTaxes = angular.copy($scope.ShowTaxes);
        $rootScope.BaseCurrency1 = angular.copy($scope.BaseCurrency)
        
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
                $scope.showProduct = false;
                 $scope.displayDiscountLine = true;
                
                if ($rootScope.discounts == "Individual Items" && $rootScope.Showdiscount == true) {
                    $scope.displayDiscountLine = false;
                }

                 $scope.$watch("$root.selectedItemm", function() {
                        if ($rootScope.selectedItemm != null) {
                           $scope.showProduct = false; 
                        }
                    });
                 $scope.$watch("qty", function() {
                        if ($scope.qty != null) {
                           $scope.showProduct = false; 
                        }
                    });

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
                                $scope.showProduct = true;
                            } else if ($scope.promoItems[i].ProductUnit == null) {
                                 $scope.showProduct = true;

                            }else if ($scope.promoItems[i].ProductUnit == "") {
                                 $scope.showProduct = true;

                            }else if ($scope.promoItems[i].price == null) {
                                 $scope.showProduct = true;
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
                                if( $rootScope.termType){
                                    if($rootScope.termType == "multipleDueDates"){
                                    $scope.UpdateDates();
                                    } 
                                }
                               
                                if ($scope.promoItems[i].status == 'notavailable') {
                                    var confirm = $mdDialog.confirm()
                                        .title('Would you like to save this product for future use?')
                                        .content('')
                                        .ariaLabel('Lucky day')
                                        .targetEvent(ev)
                                        .ok('save')
                                        .cancel('cancel');
                                    $mdDialog.show(confirm).then(function(item) {

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
                                        for (var i = 0; i <= $scope.promoItems.length - 1; i++) {
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

                                        $scope.prod.ProductCategory = "Product";
                                        $scope.prod.progressshow = false
                                        $scope.prod.deleteStatus = false
                                        $scope.prod.favouriteStar = false;
                                        $scope.prod.favouriteStarNo = 1;
                                        $scope.prod.tags = [];
                                        $scope.prod.status = "Active"
                                        $scope.prod.deleteStatus = false
                                        $scope.prod.todaydate = new Date();
                                        $scope.prod.UploadImages = {
                                            val: []
                                        };
                                        $scope.prod.UploadBrochure = {
                                            val: []
                                        };
                                        var client = $objectstore.getClient("product12thdoor");
                                        client.onComplete(function(data) {
                                            $mdToast.show(
                                              $mdToast.simple()
                                                .textContent('Product Successfully Saved')
                                                .position('bottom right')
                                                .hideDelay(2000)
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
                                        client.insert([$scope.prod], {KeyProperty: "product_code"});
                                    }, function() {});
                                }
                                $mdDialog.hide();
                            }
                        }
                    }

                    $scope.UpdateDates = function(){
                        $scope.updateDate = [];
                        $scope.newfamount = 0;
                        $scope.updateDate = angular.copy($rootScope.dateArray.val);
                        for (var i = $rootScope.dateArray.val.length - 1; i >= 0; i--) {
                            $rootScope.dateArray.val.splice($rootScope.dateArray.val.indexOf($rootScope.dateArray.val[i]),1)
                        }
                        
                        for (var i = $scope.updateDate.length - 1; i >= 0; i--) {
                            $scope.newfamount = parseFloat(($rootScope.famount +$scope.Amount)  * $scope.updateDate[i].Percentage) / 100;
                               MultipleDudtesService.calDateArray({
                                        DueDate: $scope.updateDate[i].DueDate,
                                        Percentage: $scope.updateDate[i].Percentage,
                                        dueDateprice: $scope.newfamount,
                                        paymentStatus: $scope.updateDate[i].paymentStatus,
                                        balance:$scope.newfamount,
                                        count: $scope.updateDate[i].count
                                    });
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
                    $scope.showProduct = false; 
                    $scope.Sprice = pd.price;
                    $scope.calAMount()
                }

                $scope.setUOM = function(val) {
                    $scope.showProduct = false;
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
                        $scope.disc = parseFloat($scope.totall * $scope.discount / 100);
                        $scope.Amount = $scope.totall - $scope.disc;
                    } else {
                        $scope.Amount = $scope.totall;
                    }
                    if($rootScope.currencyStatus == true){
                         $scope.Amount = $scope.Amount* $rootScope.exchangeRate;
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

//------------------------------------------------------------------------------------------------------------



//-------------------------/dialog box pop up to add customer through invoice-----------------------------------
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
                    $scope.contact["baddress"] = {
                                city: "",
                                country: "",
                                state: "",
                                street: "",
                                zip: ""
                              };
                     $scope.contact["saddress"] = {
                                s_city: "",
                                s_country: "",
                                s_state: "",
                                s_street: "",
                                s_zip: ""
                              };
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
                    $scope.emailExsist = false;
                    $scope.validateEmail = function(obj){
                        $scope.emailExsist = false;
                        var emailClient = $objectstore.getClient("contact12thdoor");
                        emailClient.onGetMany(function(data){
                          if (data.length > 0) {
                            $scope.emailExsist = true;
                          }
                        });
                        emailClient.onError(function(data){

                        });
                        emailClient.getByFiltering("select Email from contact12thdoor where Email = '"+obj.Email+"'")
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
                                 $mdToast.show(
                                      $mdToast.simple()
                                        .textContent('Customer Registed Successfully')
                                        .position('bottom right')
                                        .hideDelay(2000)
                                    );
                            });
                            $scope.contact.favoritestar = false;
                            $scope.contact.status = 'Active';
                            $scope.contact.deleteStatus = 'false'
                            $scope.contact.cb = true;
                            $scope.contact.customerid = "-999";
                            client.insert($scope.contact, {KeyProperty: "customerid"});

                            $rootScope.customerNames = [];
                            $rootScope.customerNames.push({
                                display: $scope.contact.Name.toLowerCase(),
                                value: $scope.contact,
                                BillingValue: $scope.contact.baddress.street + ' ' + $scope.contact.baddress.city + ' ' + $scope.contact.baddress.zip + ' ' + $scope.contact.baddress.state + ' ' + $scope.contact.baddress.country,
                                shippingValue: $scope.contact.saddress.s_street + ' ' + $scope.contact.saddress.s_city + ' ' + $scope.contact.saddress.s_zip + ' ' + $scope.contact.saddress.s_state + ' ' +
                                    $scope.contact.saddress.s_country
                            });
                            var self = this;
                            for (var i = $rootScope.customerNames.length - 1; i >= 0; i--) {
                                    $rootScope.selectedItem1 = $rootScope.customerNames[i];
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
                       $mdToast.show(
                                      $mdToast.simple()
                                        .textContent('Contact Updated Successfully')
                                        .position('bottom right')
                                        .hideDelay(2000)
                                    );

                         $rootScope.customerNames = [];
                    $rootScope.customerNames.push({
                        display: cusform.Name.toLowerCase(),
                        value: cusform,
                        BillingValue: cusform.baddress.street + ' ' + cusform.baddress.city + ' ' + cusform.baddress.zip + ' ' + cusform.baddress.state + ' ' + cusform.baddress.country,
                        shippingValue: cusform.saddress.s_street + ' ' + cusform.saddress.s_city + ' ' + cusform.saddress.s_zip + ' ' + cusform.saddress.s_state + ' ' +
                            cusform.saddress.s_country
                    });
                   
                    for ( i = $rootScope.customerNames.length - 1; i >= 0; i--) {
                            $rootScope.selectedItem1 = $rootScope.customerNames[i];
                            $rootScope.selectedItem1.BillingValue = $rootScope.customerNames[i].BillingValue;
                    };
                    });
                    client.onError(function(data) {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .content('There was an error updating the customer details.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            .targetEvent(data)
                        );
                    });

                    client.insert(cusform, {KeyProperty: "customerid"});
                    $mdDialog.hide();
                   
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
                        BillingValue: data[i].baddress.street + ' ' + data[i].baddress.city + ' ' + data[i].baddress.zip + ' ' + data[i].baddress.state + ' ' + data[i].baddress.country,
                        shippingValue: data[i].saddress.s_street + ' ' + data[i].saddress.s_city + ' ' + data[i].saddress.s_zip + ' ' + data[i].saddress.s_state + ' ' +
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
         $mdToast.show(
          $mdToast.simple()
            .textContent('There is no products available')
            .position('bottom right')
            .hideDelay(2000)
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

     var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
  $scope.toastPosition = angular.extend({},last);

var userName = $auth.getSession().Name;
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
                $uploader.uploadMedia("invoiceUploades", $scope.imagearray[indexx], $scope.imagearray[indexx].name );
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
            text: "Invoice created by"+" "+userName,
            date: new Date(),
            type:"Auto",
            RefID:$scope.TDinvoice.invoiceRefNo
        });
        $scope.TDinvoice.total = $scope.total;
        $scope.TDinvoice.finalamount = $scope.famount;
        $scope.TDinvoice.discountAmount = $rootScope.finalDisc;
        $scope.TDinvoice.salesTaxAmount = $scope.salesTax;
        $scope.TDinvoice.cardOpen = false;
        $scope.TDinvoice.favourite = false;
        $scope.TDinvoice.favouriteStarNo = 1;
        $scope.TDinvoice.DraftActive = false;
        $scope.TDinvoice.CurrencyChanged = $rootScope.currencyStatus;
        $scope.TDinvoice.Name = $rootScope.selectedItem1.display;
        $scope.TDinvoice.Email = $rootScope.selectedItem1.value.Email;
        $scope.TDinvoice.customerid = $rootScope.selectedItem1.value.customerid;
        $scope.TDinvoice.billingAddress = $rootScope.selectedItem1.value.baddress;
        $scope.TDinvoice.shippingAddress = $rootScope.selectedItem1.value.saddress;
        $scope.TDinvoice.invoiceNo = "-999";
        $scope.TDinvoice.taxAmounts = [];
        $scope.TDinvoice.taxAmounts = $rootScope.taxArr;
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
                    $mdToast.show(
                      $mdToast.simple()
                        .textContent('Invoice Successfully Saved')
                        .position('bottom right')
                        .theme('success-toast')
                        .hideDelay(2000)
                    );
                
                $rootScope.invoiceArray.splice(0, 1);
                invoiceDetails.setArray($scope.TDinvoice);
                $state.go('view', {
                    'invoiceno': $scope.TDinvoice.invoiceRefNo
                });
            });

            client.insert($scope.TDinvoice, {
                KeyProperty: "invoiceNo"
            });
            leger.insert($scope.TDleger, {
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
                .title('Warning')
                .content('Error Saving Invoice')
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
            $scope.total += parseFloat(tdIinvoice.amount);
        })
        return $scope.total;
    };

    $rootScope.finalDisc = 0;
    $rootScope.adddiscount = 0
    $scope.finaldiscount = function(tt) {
        $scope.Discount = 0;
        if ($scope.dis == "SubTotal Items") {
            $rootScope.discountDesc = true;
           $rootScope.finalDisc = parseFloat($scope.total* tt / 100)
        } else if ($scope.dis == "Individual Items") {
            $rootScope.discountDesc = false;
            $rootScope.finalDisc = 0;
        }
        return $rootScope.finalDisc;
        $scope.calDiscAgain(tt);
    }

    $scope.totalDisc = 0;

    $scope.calDiscAgain = function (obj) {
        $rootScope.taxArr = [];
        for (var i = $rootScope.testArray.val.length - 1; i >= 0; i--) {
            $scope.totalDisc =  parseFloat($rootScope.testArray.val[i].amount - ($rootScope.testArray.val[i].amount*obj/100));
                InvoiceService.setFullArr1({
                                    Productname: $rootScope.testArray.val[i].productName,
                                    price: $rootScope.testArray.val[i].price,
                                    quantity: $rootScope.testArray.val[i].qty,
                                    ProductUnit:$rootScope.testArray.val[i].ProductUnit,
                                    discount: $rootScope.testArray.val[i].discount,
                                    tax: $rootScope.testArray.val[i].tax,
                                    olp: $rootScope.testArray.val[i].olp,
                                    amount:$scope.totalDisc,
                                    status: $rootScope.testArray.val[i].status,
                                });
            }
            $scope.finaldiscount(obj)
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
        $rootScope.famount = parseFloat($scope.total - $rootScope.finalDisc) + parseFloat($scope.salesTax) +
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
        if($rootScope.selectedItem1 == null){
            $state.go('settings.invoice_app');
        }else{
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
                $scope.TDinvoice.Email = $rootScope.selectedItem1.value.Email;
                $scope.TDinvoice.billingAddress = $rootScope.selectedItem1.value.baddress;
                $scope.TDinvoice.shippingAddress = $rootScope.selectedItem1.value.saddress;
                $scope.TDinvoice.DraftActive = true;
                $scope.TDinvoice.DeleteStatus = false;
                client.onComplete(function(data) {

                    $mdToast.show(
                      $mdToast.simple()
                        .textContent('invoice Saved to drafts')
                        .position('bottom right')
                        .theme('success-toast')
                        .hideDelay(2000)
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
            $rootScope.testArray.val = [];
            $rootScope.dateArray.val = [];
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
        
    }
})
//----------------------------------------------------------------------------------------------------------------
//----------------------------Currency exchange (get currency by openexchangerates API)-------------------------------------
app.controller('currencyCtrl', function($scope, $mdDialog, $rootScope, $objectstore,$http,  $state, InvoiceService, item) {

    
$scope.Currency = [];
$scope.ll = [];
$rootScope.testArray1 = {val:[]};
$rootScope.testArray1.val = angular.copy(item);

    $http({
        url : 'http://openexchangerates.org/api/latest.json?app_id=32c5a0d1a1204a57be97937c10121785&base=USD',
        method : 'GET'
    }).then(function(response){
        for (var key in response.data.rates) {
            $scope.Currency.push(key)
            if($scope.currency == key){
                $rootScope.exchangeRate = response.data.rates[key];
            }

        }
        $scope.changeCurrency = function(){
            for (var key in response.data.rates) {
            $scope.Currency.push(key)
            if($scope.currency == key){
                $rootScope.exchangeRate = response.data.rates[key];
            }
        }
        }
    },function(response){
        console.log(response)
    })
      $scope.ChangeCurrency = function (cur) {
        $rootScope.BaseCurrency = cur;
        $rootScope.currencyStatus = true;
        for (var i = $rootScope.testArray.val.length - 1; i >= 0; i--) {
            InvoiceService.ReverseTax($rootScope.testArray.val[i], 1);
        $rootScope.testArray.val.splice($rootScope.testArray.val.indexOf($rootScope.testArray.val[i]), 1);

    }
            for (var i = $rootScope.testArray1.val.length - 1; i >= 0; i--) {

            InvoiceService.setFullArr({
                Productname: $rootScope.testArray1.val[i].Productname,
                price: $rootScope.testArray1.val[i].price,
                quantity: $rootScope.testArray1.val[i].quantity,
                ProductUnit: $rootScope.testArray1.val[i].ProductUnit,
                discount: $rootScope.testArray1.val[i].discount,
                tax: $rootScope.testArray1.val[i].tax,
                olp: $rootScope.testArray1.val[i].olp,
                amount: parseFloat($rootScope.testArray1.val[i].amount*$rootScope.exchangeRate),
                status: $rootScope.testArray1.val[i].status
            })
            // $rootScope.testArray.val.splice(0, 1);
            }
        // $rootScope.testArray.val.splice($rootScope.testArray.val.indexOf(tst), 1);
            // InvoiceService.ReverseTax(tst, index);

        $mdDialog.hide();
    }

    $scope.cancel = function () {
       $mdDialog.hide();
    }

})