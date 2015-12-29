 /*________________________________________________AppCtrlGet_________________________________________*/
 rasm.controller('AppCtrlGet', function($scope, $state, $rootScope, $objectstore, $location, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $timeout, $mdToast, $log) {
    $scope.payments = [];
    $scope.checkAbilityBtn = true;
    $scope.checkAbilityEditing = true;
    $scope.proSearch = "";
    $scope.sortproNumber = "number";
    $scope.sortproDate = "date";
    $scope.sortbudgetedHours = "bhours";
    $scope.sorthourlyprojectRate = "prate";
    $scope.sortfinalprojectAmount = "pamount";
    $rootScope.prodSearch = "";
    $scope.self = this;
    $scope.self.searchText = "";
   
    
    $scope.openPayment = function(obj) {
        $state.go('View_Payment', {
            'paymentid': obj.paymentid
        })
    }

    var settingClient = $objectstore.getClient("Settings12thdoor");
    settingClient.onGetMany(function(data){
        $scope.PayArr = [];
        var payMethod = data[0].preference.paymentpref.PaymentMethod;
        for (i = 0; i <= payMethod.length - 1; i++) {
            if (payMethod[i].activate) {
                $scope.PayArr.push(payMethod[i].paymentmethod);
            }
        }
    });
    settingClient.onError(function(data){
        console.log("error loading settings data")
    });
    settingClient.getByFiltering("*");

    var allPaymentData;
    var payClient = $objectstore.getClient("payment");
    payClient.onGetMany(function(data) {
        allPaymentData = data; // pass this array in mdDialog locals in history function 
    });
    payClient.onError(function(data) {
        console.log("Error Loading Payment data")
    });
    payClient.getByFiltering("*")
        /*_________________________________________history_________________________________________*/
    $scope.history = function(item) { //payment history dialog box
        //console.log(ev)
        $mdDialog.show({
            templateUrl: 'payment_partial/paymentHistory.html',
            controller: paymentHistory,
            locals: {
                obj: item,
                data: allPaymentData
            }
        })
    }

    function paymentHistory($scope, obj, $mdDialog, data) {
        $scope.historyDetails = {};
        $scope.historyDetails = obj;
        console.log(obj)

        $scope.moveToInvoice = function(item){
            console.log("working")
        }

        $scope.close = function() {
            $mdDialog.hide();
        }
        $scope.invoiceHistory = [];
        for (i = 0; i <= data.length - 1; i++) {
            for (j = 0; j <= data[i].paidInvoice.length - 1; j++) {
                if (data[i].paidInvoice[j].invono == obj.invono) {
                    $scope.invoiceHistory.push({
                        date: data[i].date,
                        payNo: data[i].paymentid,
                        payMethod: data[i].paymentMethod,
                        paidAmount: data[i].paidInvoice[j].amount,
                        comments: data[i].comments
                    });
                }
            }
        }
        console.log($scope.invoiceHistory);
    }

        /*___________________________loadAllpayments______________________________________*/
    $scope.loadAllpayments = function() {
        var client = $objectstore.getClient("payment");
        client.onGetMany(function(data) {
            if (data) {
                $scope.payments = data;
                if ($scope.PayArr) {
                    for(i=0; i<= $scope.payments.length-1; i++){
                        $scope.payments[i].settingsMethods = [];
                        $scope.payments[i].settingsMethods = $scope.PayArr;    
                    }
                }
            }
        });
        client.onError(function(data) {
            $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('This is embarracing').content('There was an error retreving the data.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
        });
        client.getByFiltering("*");
    };
        /*___________________________________favouriteFunction________________________________________*/
    $scope.favouriteFunction = function(obj) {
            var client = $objectstore.getClient("payment");
            client.onComplete(function(data) {
                if (obj.favoritestar) {
                    var toast = $mdToast.simple().content('Add To Favourite').action('OK').highlightAction(false).position("bottom right");
                    $mdToast.show(toast).then(function() {});
                } else if (!(obj.favoritestar)) {
                    var toast = $mdToast.simple().content('Remove from Favourite').action('OK').highlightAction(false).position("bottom right");
                    $mdToast.show(toast).then(function() {});
                };
            });
            client.onError(function(data) {
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Error Occure while Adding to Favourite').ariaLabel('').ok('OK').targetEvent(data));
            });
            obj.favoritestar = !obj.favoritestar;
            client.insert(obj, {
                KeyProperty: "paymentid"
            });
        }
        /*___________________________demo_____________________________________________*/
    $scope.demo = {
        topDirections: ['left', 'up'],
        bottomDirections: ['down', 'right'],
        isOpen: false,
        availableModes: ['md-fling', 'md-scale'],
        selectedMode: 'md-fling',
        availableDirections: ['up', 'down', 'left', 'right'],
        selectedDirection: 'up'
    };
    /*________________________________addCustomer_______________________________________________*/
    $scope.addCustomer = function() {
            $state.go('Add_Payment');
        }
        /*_________________________________savetn________________________________________________*/
    $scope.savebtn = function() {
            $('#save').animate({
                width: "100%",
                height: "100%",
                borderRadius: "0px",
                right: "0px",
                bottom: "0px",
                opacity: 0.25
            }, 400, function() {
                $('#mySignup').click();
            });
        }
        /*_______________________________________save________________________________________________*/
    $scope.save = function() {
            $('#mySignup').click();
        }
        /*_____________________________________viewpromotion______________________________________*/
    $scope.viewpromotion = function() {
        $('#view').animate({
            width: "100%",
            height: "100%",
            borderRadius: "0px",
            right: "0px",
            bottom: "0px",
            opacity: 0.25
        }, 400, function() {});
    }
 });
 /*_______________________________End of ApCtrlGet________________________________________________*/