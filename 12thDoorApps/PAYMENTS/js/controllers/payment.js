angular.module('mainApp', ['ngMaterial', 'directivelibrary', '12thdirective', 'uiMicrokernel', 'ngAnimate', 'ui.router']).config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
        $stateProvider.state('home', {
            url: '/home',
            controller: 'AppCtrlGet',
            templateUrl: 'payment_partial/payment_view.html'
        }).state('Add_Payment', {
            url: '/Add_Payment',
            controller: 'AppCtrlAdd',
            templateUrl: 'payment_partial/payment_add.html'
        }).state('View_Payment', {
            url: '/View_Payment',
            controller: 'AppCtrlAdd',
            templateUrl: 'payment_partial/viewPaymentRec.html'
        })
    }).config(function($mdThemingProvider) {
        $mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');
    })
    /*_______________________________START OF ADD AppCtrlAdd_____________________________________________*/
    .controller('AppCtrlAdd', function($scope, $state, $objectstore, $location, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $timeout, $mdToast, $rootScope, invoiceDetails) {
        $scope.payment = {}; //class name payment
        $scope.TDInvoice = {}; //class name for updating paid invoice
        $scope.advancedPayment = {};
        $scope.customerNames = []; //to store customer name
        $scope.contacts = [];
        $rootScope.results = [];
        $scope.checkAbility = true;
        $scope.payment.date = new Date(); //getting today's date
        $scope.paymentDetails = []; //to get maxcount of payment id
        $scope.customerNames = [];
        $scope.checked = true;
        $scope.payment.uAmount = 0;
        $scope.payment.total = 0;
        $scope.nAmount = 0; //initially total amount is 0 (Total Available=nAmount)
        $scope.checkbox = [];
        $scope.payment.paidInvoice = []; //this is where paid invoice details save when u click the checkbox if u uncheck check box it will splice from this array implementation is under checkItem Method.
        $scope.outstandingInvoices = []; //this is where all outstanding invoices r saved for praticular customer
        $scope.multipleDuedate = [];
        $scope.unAmount = [];
        $scope.TDInvoice.updateInvoice = []; //updated invoice details will save here when u do a paymet
        /*______________________________________paymentID Genaration_____________________________________*/
        var client = $objectstore.getClient("payment");
        client.onGetMany(function(data) {
            if (data) {
                $scope.paymentDetails = data;
                for (var i = $scope.paymentDetails.length - 1; i >= 0; i--) {
                    $scope.ID = $scope.paymentDetails[i].maxCount;
                    // $scope.payment.uAmount=$scope.paymentDetails[i].uAmount;
                    // console.log($scope.payment.uAmount);
                };
                $scope.maxID = parseInt($scope.ID) + 1;
                $scope.payment.paymentref = $scope.maxID.toString();
            }
        });
        client.getByFiltering("select maxCount from domainClassAttributes where class='payment");
        $rootScope.self = this;
        $rootScope.self.tenants = loadAll();
        $rootScope.selectedItem1 = null;
        $rootScope.self.searchText = null;
        $rootScope.self.querySearch = querySearch;
        $scope.myDate = new Date();
        $scope.tableclickArr = {};
        $scope.$on('viewRecord', function(event, args) {
            $scope.tableclickArr = args;
        });
        // get settings object 
        var settingsClient = $objectstore.getClient("Settings12thdoor");
        settingsClient.onGetMany(function(data) {
            //console.log(data)
            paymentMethod(data);
        });
        settingsClient.onError(function(data) {
            console.log("Error retreving the settings data");
        });
        settingsClient.getByFiltering("*");
        //get paymentMethod from the settings app 
        function paymentMethod(obj) {
            $scope.PayArr = [];
            var payMethod = obj[0].preference.paymentpref.PaymentMethod;
            for (i = 0; i <= payMethod.length - 1; i++) {
                if (payMethod[i].activate) {
                    $scope.PayArr.push(payMethod[i].paymentmethod);
                }
            }
            //console.log($scope.PayArr);
        }
        // maxdate in the calander 
        $scope.maxDate = new Date();

        // get all payment data 
        var allPaymentData;

        var  payClient = $objectstore.getClient("payment");
        payClient.onGetMany(function(data){
            allPaymentData = data; // pass this array in mdDialog locals in history function 
        });
        payClient.onError(function(data){
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
                        data : allPaymentData
                    }
                })
            }

        function paymentHistory($scope,obj,$mdDialog,data){
            $scope.historyDetails = {};
            $scope.historyDetails = obj;
            console.log(obj)

            $scope.close = function(){
                $mdDialog.hide();
            }

            $scope.invoiceHistory = [];
            for(i=0; i<=data.length-1; i++){
                for(j=0; j<=data[i].paidInvoice.length-1; j++){
                    if(data[i].paidInvoice[j].invono == obj.invono){
                       $scope.invoiceHistory.push({
                            date : data[i].date,
                            payNo : data[i].paymentid,
                            payMethod : data[i].paymentMethod,
                            paidAmount : data[i].paidInvoice[j].amount,
                            comments : data[i].comments
                       });
                    }
                }
            }
            console.log($scope.invoiceHistory);
        }


            /*_________________________________________cacel_______________________________________*/
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.keyPressAutoComplete = function(keyEvent) {
                if (keyEvent.which == 40) {
                    console.log("working");
                    //$rootScope.self.querySearch = querySearch;
                    //return $rootScope.results = $scope.customerNames; 
                    // $scope.$apply();    
                }
            }
            /*_____________________________________querySearch______________________________________________*/
        function querySearch(query, event) {
            $scope.enter = function(keyEvent) {
                    if (keyEvent.which === 13) {
                        if ($rootScope.selectedItem1 === null) {
                            // $rootScope.selectedItem1 = query;
                            //console.log($rootScope.results);
                        }
                    }
                }
                //Custom Filter
            $rootScope.results = [];
            for (i = 0, len = $scope.customerNames.length; i < len; ++i) {
                if ($scope.customerNames[i].display.indexOf(query) != -1) {
                    $rootScope.results.push($scope.customerNames[i]);
                }
            }
            //console.log($rootScope.results);
            return $rootScope.results;
        }
        /*_________________________________loadAll__________________________________________________*/
        function loadAll() { //get customer name for auto compleate field from contact class
            var client = $objectstore.getClient("contact");
            client.onGetMany(function(data) {
                if (data) {
                    for (i = 0, len = data.length; i < len; ++i) {
                        $scope.customerNames.push({
                            display: data[i].Name.toLowerCase(),
                            value: data[i],
                            invo_No: data[i].invoiceNo,
                        });
                    }
                }
            });
            client.onError(function(data) {
                $mdDialog.show(
                    // $mdDialog.alert()
                    //   .parent(angular.element(document.body))
                    //   .title('Sorry')
                    //   .content('There is no products available')
                    //   .ariaLabel('Alert Dialog Demo')
                    //   .ok('OK')
                    //   .targetEvent(data)
                );
            });
            client.getByFiltering("*");
        }
        // load invoice details 
        var invoiceClient = $objectstore.getClient("twelfthdoorInvoice")
        invoiceClient.onGetMany(function(data) {
            $scope.invoiceData = [];
            $scope.invoiceData = angular.copy(data);
            console.log($scope.invoiceData)
        });
        invoiceClient.onError(function(data) {
            console.log("Error retrieving invoice data");
        });
        invoiceClient.getByFiltering("*");


        // load payment details


        var paymentClient = $objectstore.getClient("advancedPayment");
        paymentClient.onGetMany(function(data) {
            $scope.paymentDetails = data;
        });
        paymentClient.onError(function(data) {
            console.log("error loading payment details ")
        });
        paymentClient.getByFiltering("*");
        $scope.selectedItemChange = function(name) {
                if ($scope.invoiceData) {
                    $scope.TDInvoice.updateInvoice = $scope.invoiceData;
                    for (i = 0; i < $scope.invoiceData.length; i++) {
                        for (j = 0; j < $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr.length; j++) {
                            if (name == null) {
                                $scope.outstandingInvoices.splice(name, 1);
                                $scope.payment.uAmount = 0;
                            }
                            else if (($scope.TDInvoice.updateInvoice[i].Name == name) && ($scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].paymentStatus == "Unpaid" || $scope.TDInvoice.updateInvoice[i].status == "Cancelled")) {
                                $scope.outstandingInvoices.push({
                                    invono: $scope.TDInvoice.updateInvoice[i].invoiceNo,
                                    sdate: $scope.TDInvoice.updateInvoice[i].Startdate,
                                    duedate: $scope.TDInvoice.updateInvoice[i].duedate,
                                    famount: $scope.TDInvoice.updateInvoice[i].finalamount,
                                    mduedate: $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].DueDate,
                                    instalment: $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].dueDateprice,
                                    termtype: $scope.TDInvoice.updateInvoice[i].termtype,
                                    checked: true
                                });
                            }
                        }
                    }
                }
                if ($scope.paymentDetails) {
                    var copyUamount = 0;
                    for (k = 0; k < $scope.paymentDetails.length; k++) {
                        if ($scope.paymentDetails[k].customer == name) {
                            copyUamount =angular.copy(parseInt($scope.paymentDetails[k].uAmount));
                        }
                    }

                $scope.payment.uAmount = copyUamount;
                console.log($scope.outstandingInvoices);
                console.log($scope.payment.uAmount);

                }
            }
            /*________________________________________CheckItem__________________________________________*/
        $scope.checkItem = function(index, invo) { //outstanding invoice check box
                if ($scope.checkbox[index] == true) { //if checkbox is checked 
                    invo.checked = false;
                    $scope.totPayment = 0;
                    $scope.payment.total = 0;
                    invo.amount = 0;
                    if (invo.termtype != "multipleDueDates") { //if thr is only 1 due date
                        invo.amount = invo.famount;
                    } else if (invo.termtype == "multipleDueDates") { //if multipleDuedate
                        invo.amount = invo.instalment;
                    }
                    $scope.payment.paidInvoice.push({ //array for insert paid invoices             
                        amount: invo.amount,
                        invono: invo.invono,
                        sdate: invo.sdate,
                        duedate: invo.duedate,
                        sdate: invo.sdate
                    });
                    $scope.vari = [];
                    for (var i = 0; i < $scope.TDInvoice.updateInvoice.length; i++) { //updating payment status inside "MultiDueDAtesArr inside invoice class
                        if ($scope.TDInvoice.updateInvoice[i]['invoiceNo'] == invo.invono) {
                            $scope.vari = $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr
                            for (var j = 0; j < $scope.vari.length; j++) {
                                if ($scope.vari[j]['DueDate'] == invo.mduedate) {
                                    $scope.vari[j]['paymentStatus'] = "paid"
                                }
                            }
                        }
                    }
                    for (var i = 0; i < $scope.payment.paidInvoice.length; i++) {
                        $scope.totPayment = (parseInt($scope.totPayment) + parseInt($scope.payment.paidInvoice[i].amount));
                    }
                    if (invo.termtype != "multipleDueDates") { //if multipledue date r not  thr updating total available (nAmount=totalAvailable)
                        $scope.nAmount = parseInt($scope.nAmount) - parseInt(invo.famount); //updating total available (nAmount=totalavailable)
                    } else if (invo.termtype == "multipleDueDates") { //if multipledue date r thr updating total available
                        $scope.nAmount = parseInt($scope.nAmount) - parseInt(invo.instalment);
                    }
                    $scope.payment.total = $scope.totPayment;
                } else if ($scope.checkbox[index] == false) { //if checkbox is unchecked
                    invo.checked = true;
                    $scope.totPayment = 0;
                    invo.amount = "";
                    for (var i = 0; i < $scope.payment.paidInvoice.length; i++) { //removing invoice details from paid invoice array
                        if ($scope.payment.paidInvoice[i]['invono'] == invo.invono) { //cheking index for praticular invoice details
                            $scope.payment.paidInvoice.splice(i);
                        }
                    }
                    if (invo.termtype != "multipleDueDates") {
                        $scope.payment.total = parseInt($scope.payment.total) - parseInt(invo.famount)
                        $scope.nAmount = parseInt($scope.nAmount) + parseInt(invo.famount)
                    }
                    if (invo.termtype == "multipleDueDates") {
                        $scope.payment.total = parseInt($scope.payment.total) - parseInt(invo.instalment)
                        $scope.nAmount = parseInt($scope.nAmount) + parseInt(invo.instalment)
                    }
                    if($scope.updateInvoice){
                        for (var i = 0; i < $scope.updateInvoice.length; i++) {
                            if ($scope.TDInvoice.updateInvoice[i]['invoiceNo'] == invo.invono) {
                                $scope.vari = $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr
                                for (var j = 0; j < $scope.vari.length; j++) {
                                    if ($scope.vari[j]['DueDate'] == invo.mduedate) {
                                        $scope.vari[j]['paymentStatus'] = "Unpaid"
                                    }
                                }
                            }
                        }
                    }
                }
            }
            /*__________________________________________submit______________________________________________*/
        $scope.submit = function() {
            $rootScope.invoiceArray.splice($scope.payment, 1);
            invoiceDetails.setArray($scope.payment);
            console.log($rootScope.invoiceArray);
            var client = $objectstore.getClient("payment");
            var client1 = $objectstore.getClient("advancedPayment");
            client.onComplete(function(data) {
                location.href = '#/View_Payment';
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Payment Added Successfully.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
                if ($scope.payment.namount > 0) {
                    $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Unapplied advances USD' + ' ' + $scope.payment.namount + ' ' + 'This amount can be applied on future invoices.').ariaLabel('').ok('OK').targetEvent(data));
                    $state.go($state.current, {}, {
                        reload: true
                    });
                }
            });
            client.onError(function(data) {
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('Warning').content('There was an error saving the data.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
            });
            $scope.payment.favoritestar = false;
            $scope.payment.namount = $scope.nAmount;
            $scope.payment.paymentid = "-999";
            $scope.payment.customer = $rootScope.selectedItem1.display;
            $scope.advancedPayment.customer = $scope.payment.customer;
            $scope.advancedPayment.uAmount = $scope.payment.uAmount;
            if ($scope.payment.total == 0) {
                $scope.payment.uAmount = $scope.payment.namount;
                $scope.advancedPayment.uAmount = $scope.payment.uAmount;
            } else if ($scope.payment.namount > 0) {
                $scope.payment.uAmount = $scope.payment.namount;
                $scope.advancedPayment.uAmount = $scope.payment.uAmount;
            }
            if ($scope.payment.namount > 0) {
                client.insert($scope.payment, {
                    KeyProperty: "paymentid"
                })
                client1.insert($scope.advancedPayment, { //insertng Unapplied Advances details into advancedPayment class
                    KeyProperty: "customer"
                })
                console.log($scope.advancedPayment)
                $scope.uInvoice(); //updating invoice as paid 
            } else {
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('warning').content('Total payments applied exceeds the total available').ariaLabel('Alert Dialog Demo').ok('OK'))
            }
        }
        $scope.uInvoice = function() {
                var client = $objectstore.getClient("twelfthdoorInvoice");
                client.onComplete(function(data) {});
                client.onError(function(data) {});
                client.insert($scope.TDInvoice.updateInvoice, {
                    KeyProperty: "invoiceNo"
                });
            }
            /*__________________________________demo____________________________________________________*/
        $scope.demo = {
            topDirections: ['left', 'up'],
            bottomDirections: ['down', 'right'],
            isOpen: false,
            availableModes: ['md-fling', 'md-scale'],
            selectedMode: 'md-fling',
            availableDirections: ['up', 'down', 'left', 'right'],
            selectedDirection: 'up'
        };
        /*_____________________________addCustomer________________________________________________*/
        $scope.addCustomer = function() {
                $('#add').animate({
                    width: "100%",
                    height: "100%",
                    borderRadius: "0px",
                    right: "0px",
                    bottom: "0px",
                    opacity: 0.25
                }, 400, function() {
                    location.href = '#/Add_Payment';
                });
            }
            /*________________________Customerview________________________________________________________*/
        $scope.Customerview = function() {
                location.href = '#/home';
            }
            /*__________________________savebtn________________________________________________________*/
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
            /*__________________________________save______________________________________________*/
        $scope.save = function() {
                $timeout(function() {
                    $('#mySignup').click();
                })
            }
            /*______________________________viewpromotion_______________________________________*/
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
        $scope.nAmount = "";
        //        $scope.creditAvailabe = function(type) {
        //            if (type == "Invoice Settlement") {
        //                $scope.cAmount = 20;
        //                return $scope.cAmount;
        //            }
        //        }
        $scope.netAmount = function() {
            if (($scope.payment.amountReceived.length != 0)) {
                $scope.nAmount = (parseInt($scope.payment.uAmount) + parseInt($scope.payment.amountReceived));
                return $scope.nAmount;
                console.log($scope.nAmount);
            }
            // console.log($scope.nAmount);
        }
        $scope.upload = function(ev) {
            $mdDialog.show({
                templateUrl: 'payment_partial/showUploader.html',
                targetEvent: ev,
                controller: 'UploadCtrl',
                locals: {
                    dating: ev
                }
            })
        }
    }) //END OF AppCtrlAdd
    /*________________________________________________AppCtrlGet_________________________________________*/
    .controller('AppCtrlGet', function($scope, $state, $rootScope, $objectstore, $location, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $timeout, $mdToast, $log) {
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
        $scope.outstandingInvoices = [{
            date: 'sep 3,2015',
            invno: 'INVO-0001',
            duedate: 'sep 5,2015',
            amount: '100$',
            balance: '50$',
            pamount: '50$'
        }, {
            date: 'sep 4,2015',
            invno: 'INVO-0002',
            duedate: 'sep 5,2015',
            amount: '100$',
            balance: '50$',
            pamount: '50$'
        }, {
            date: 'sep 5,2015',
            invno: 'INVO-0003',
            duedate: 'sep 5,2015',
            amount: '100$',
            balance: '50$',
            pamount: '50$'
        }, {
            date: 'sep 6,2015',
            invno: 'INVO-0004',
            duedate: 'sep 5,2015',
            amount: '100$',
            balance: '50$',
            pamount: '50$'
        }, {
            date: 'sep 7,2015',
            invno: 'INVO-0005',
            duedate: 'sep 5,2015',
            amount: '100$',
            balance: '50$',
            pamount: '50$'
        }, {
            date: 'sep 8,2015',
            invno: 'INVO-0006',
            duedate: 'sep 5,2015',
            amount: '100$',
            balance: '50$',
            pamount: '50$'
        }];
        /*___________________________loadAllpayments______________________________________*/
        $scope.loadAllpayments = function() {
            var client = $objectstore.getClient("payment");
            client.onGetMany(function(data) {
                if (data) {
                    $scope.payments = data;
                }
            });
            client.onError(function(data) {
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('This is embarracing').content('There was an error retreving the data.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
            });
            client.getByFiltering("*");
        };
        /*______________________________________updateProject________________________________________*/
        $scope.updateProject = function(updatedform, pid) {
                var client = $objectstore.getClient("payment");
                client.onComplete(function(data) {
                    $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Payment details updated Successfully').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
                });
                client.onError(function(data) {
                    $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('This is embarracing').content('There was an error updating the project details.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
                });
                updatedform.paymentid = pid;
                client.insert(updatedform, {
                    KeyProperty: "paymentid"
                });
            }
            /*_____________________________________________deleteProject______________________________________*/
        $scope.deleteProject = function(deleteform, ev) {
                var confirm = $mdDialog.confirm().parent(angular.element(document.body)).title('').content('Are You Sure You Want To Delete This Record?').ok('Delete').cancel('Cancel').targetEvent(ev);
                $mdDialog.show(confirm).then(function() {
                    var client = $objectstore.getClient("payment");
                    client.onComplete(function(data) {
                        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Record Successfully Deleted').ariaLabel('').ok('OK').targetEvent(data));
                        $state.go($state.current, {}, {
                            reload: true
                        });
                    });
                    client.onError(function(data) {
                        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Error Deleting Record').ariaLabel('').ok('OK').targetEvent(data));
                    });
                    client.deleteSingle(deleteform.paymentid, "paymentid");
                }, function() {
                    $mdDialog.hide();
                });
            }
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
                $('#add').animate({
                    width: "100%",
                    height: "100%",
                    borderRadius: "0px",
                    right: "0px",
                    bottom: "0px",
                    opacity: 0.25
                }, 400, function() {
                    location.href = '#/Add_Payment';
                });
            }
            /*__________________________________Customerview____________________________________________*/
        $scope.Customerview = function() {
                $('#view').animate({
                    width: "100%",
                    height: "100%",
                    borderRadius: "0px",
                    right: "0px",
                    bottom: "0px",
                    opacity: 0.25
                }, 400, function() {
                    location.href = '#/home';
                });
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
    }) /*_______________________________End of ApCtrlGet________________________________________________*/
    /*______________________________________START OFUploadCtrl___________________________________________*/
    .controller('UploadCtrl', function($scope, $mdDialog, $rootScope, $state, UploaderService) {
        $scope.uploadimages = {
            val: []
        };
        $scope.uploadimages.val = UploaderService.loadBasicArray();
        //directive table content start
        $scope.$on('viewRecord', function(event, args) {
            $scope.uploadimages.val.splice(args, 1);
        });
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
        $scope.AddImage = function() {
            $scope.uploadimages.val = UploaderService.loadBasicArray();
        }
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }) //END OF UploadCtrl
    /*_______________________________START OF UploaderService___________________________________________*/
    .factory('UploaderService', function($rootScope) {
        $rootScope.uploadArray = [];
        $rootScope.basicinfo = [];
        return {
            setFile: function(val) {
                $rootScope.uploadArray.push(val);
                return $rootScope.uploadArray;
            },
            BasicArray: function(name, size) {
                $rootScope.basicinfo.push({
                    'name': name,
                    'size': size
                });
                return $rootScope.basicinfo;
            },
            removebasicArray: function(arr) {
                for (var i = arr.length - 1; i >= 0; i--) {
                    $rootScope.basicinfo.splice(arr[i], 1);
                };
                return $rootScope.basicinfo;
            },
            removefileArray: function(arr) {
                for (var i = arr.length - 1; i >= 0; i--) {
                    $rootScope.uploadArray.splice(arr[i], 1);
                };
                return $rootScope.uploadArray;
            },
            loadArray: function() {
                return $rootScope.uploadArray;
            },
            loadBasicArray: function() {
                return $rootScope.basicinfo;
            },
        }
    }) // END OF UploaderService
    /*________________________________START OF fileUpLoaderInvoice___________________________________________*/
    .directive('fileUpLoaderInvoice', ['$uploader', "$rootScope", "$mdToast", 'UploaderService', function($uploader, $rootScope, $mdToast, UploaderService) {
        return {
            restrict: 'E',
            template: "<div class='content' ng-init='showUploadButton=false;showDeleteButton=false;showUploadTable=false;'><div id='drop-files' ondragover='return false' layout='column' layout-align='space-around center'><div id='uploaded-holder' flex ><div id='dropped-files' ng-show='showUploadTable'><table id='Tabulate' ></table></div></div><div flex ><md-button class='md-raised' id='deletebtn' ng-show='showDeleteButton' class='md-raised' style='color:rgb(244,67,54);margin-left:30px;'><md-icon md-svg-src='img/directive_library/ic_delete_24px.svg'></md-icon></md-button></div><div flex><md-icon md-svg-src='img/directive_library/ic_cloud_upload_24px.svg'></md-icon><text style='font-size:12px;margin-left:10px'>{{label}}<text></div></div></div>",
            scope: {
                label: '@',
                uploadType: '@'
            },
            link: function(scope, element) {
                    jQuery.event.props.push('dataTransfer');
                    var files;
                    var filesArray = [];
                    var sampleArray = [];
                    element.find("#drop-files").bind('drop', function(e) {
                        files = e.dataTransfer.files || e.dataTransfer.files;
                        for (indexx = 0; indexx < files.length; indexx++) {
                            filesArray.push(files[indexx]);
                            UploaderService.setFile(files[indexx]);
                            UploaderService.BasicArray(filesArray[indexx].name, filesArray[indexx].size);
                            sampleArray.push({
                                'name': filesArray[indexx].name,
                                'size': filesArray[indexx].size
                            });
                        }
                        var newHtml = "<tr class='md-table-headers-row'><th class='md-table-header' style='Padding:0px 16px 10px 0'>Name</th><th class='md-table-header' style='Padding:0px 16px 10px 0'>Type</th><th class='md-table-header' style='Padding:0px 16px 10px 0'>Size</th></tr>";
                        for (var i = 0; i < filesArray.length; i++) {
                            var tableRow = "<tr><td class='upload-table' style='float:left'>" + filesArray[i].name + "</td><td class='upload-table'>" + filesArray[i].type + "</td><td class='upload-table'>" + filesArray[i].size + " bytes" + "</td></tr>";
                            newHtml += tableRow;
                        }
                        element.find("#Tabulate").html(newHtml);
                        $rootScope.$apply(function() {
                            scope.showUploadButton = true;
                            scope.showDeleteButton = true;
                            scope.showUploadTable = true;
                        })
                    });

                    function restartFiles() {
                        $rootScope.$apply(function() {
                            scope.showUploadButton = false;
                            scope.showDeleteButton = false;
                            scope.showUploadTable = false;
                        })
                        UploaderService.removefileArray(filesArray);
                        UploaderService.removebasicArray(sampleArray);
                        filesArray = [];
                        return false;
                    }
                    element.find('#drop-files').bind('dragenter', function() {
                        $(this).css({
                            'box-shadow': 'inset 0px 0px 20px rgba(0, 0, 0, 0.1)',
                            'border': '2px dashed rgb(255,64,129)'
                        });
                        return false;
                    });
                    element.find('#drop-files').bind('drop', function() {
                        $(this).css({
                            'box-shadow': 'none',
                            'border': '2px dashed rgba(0,0,0,0.2)'
                        });
                        return false;
                    });
                    element.find('#deletebtn').click(restartFiles);
                } //end of link
        };
    }]) //END OF fileUpLoaderInvoice
    //.factory('InvoiceService', function($rootScope) {
    //    $rootScope.testArray = {
    //        val: []
    //    };
    //    return {
    //
    //        setArray: function(newVal) {
    //            $rootScope.testArray.val.push(newVal);
    //
    //            return $rootScope.testArray;
    //        },
    //        removeArray: function(newVals) {
    //
    //            $rootScope.testArray.val.splice(newVals, 1);
    //            return $rootScope.testArray;
    //        }
    //
    //    }
    //
    //});
    .factory('invoiceDetails', function($rootScope) {
        $rootScope.invoiceArray = [];
        return {
            setArray: function(newVal) {
                $rootScope.invoiceArray.push(newVal);
                return $rootScope.invoiceArray;
            },
            removeArray: function(newVals) {
                $rootScope.invoiceArray.splice(newVals, 1);
                return $rootScope.invoiceArray;
            }
        }
    })