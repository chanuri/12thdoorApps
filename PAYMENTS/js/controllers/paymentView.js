 /*________________________________________________AppCtrlGet_________________________________________*/
 rasm.controller('AppCtrlGet', function($scope, $state, $rootScope, $objectstore, $location, $mdDialog, uiInitilize, $window, $objectstore, $auth, $q, $http, $compile, $timeout, $mdToast, $log) {
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



    $scope.testarr = [{
      name: "Starred",
      id: "favouriteStarNo",
      src: "img/ic_add_shopping_cart_48px.svg",
      upstatus : false,
      downstatus : false,
      divider: true,
      close: false
    }, {
      name: "Date",
      id: "date",
      src: "img/ic_add_shopping_cart_48px.svg",
      upstatus : false,
      downstatus : false,
      divider: false,
      close: true
    }, {
      name: 'Payment No',
      id: 'paymentid',
      src: "img/ic_add_shopping_cart_48px.svg",
      upstatus : false,
      downstatus : false,
      divider: false,
      close: false
    }, {
      name: "Customer",
      id: "customer",
      src: "img/ic_add_shopping_cart_48px.svg",
      upstatus : false,
      downstatus : false,
      divider: false,
      close: false
    }, {
      name: "Amount",
      id: "total",
      src: "img/ic_add_shopping_cart_48px.svg",
      upstatus : false,
      downstatus : false,
      divider: false,
      close: false
    }, {
      name: "Payment Method",
      id: "paymentMethod",
      src: "img/ic_add_shopping_cart_48px.svg",
      upstatus : false,
      downstatus : false,
      divider: true,
      close: false
    }, {
      name: "Cancelled",
      id: "paymentStatus",
      src: "img/ic_add_shopping_cart_48px.svg",
      upstatus : false,
      downstatus : false,
      divider: false,
      close: false
    }];

    setInterval(function interval(){
        $scope.viewPortHeight = window.innerHeight;
        $scope.viewPortHeight = $scope.viewPortHeight+"px";
    }, 100);

    $scope.toggles = {};
    $scope.toggleOne = function($index){
        for (ind in $scope.payments)
            if ($scope.toggles[ind] && ind != $index)
                $scope.toggles[ind] = false;

            if (!$scope.toggles[$index])
                $scope.toggles[$index] = true;
        else $scope.toggles[$index] = !$scope.toggles[$index];
    };
   

    $scope.self = this;
    $scope.self.searchText = "";
    $scope.prodSearch = '-date';
    $scope.indexno = 1;
    $scope.latest = '-date';

    $scope.DefaultCancel = function(item){
      $scope.testarr[1].close = true;
      $scope.testarr[$scope.indexno].upstatus = false;
      $scope.testarr[$scope.indexno].downstatus = false;
      item.close = false;
      $scope.prodSearch = '-date';
      $scope.indexno = 1;
      $scope.latest = '-date';
    }

    $scope.CheckFullArrayStatus = function(type,id){  
        $scope.BackUpArray = [];
        //remove all all object that status = paid and put them into backup array
            for (var i = $scope.payments.length - 1; i >= 0; i--) {
                if ($scope.payments[i].paymentStatus === type) {
                   $scope.BackUpArray.push($scope.payments[i]);            
                   $scope.payments.splice(i,1);           
                };
            };
        $scope.payments = MergeArr($scope.BackUpArray,$scope.payments);         
    }

    function MergeArr(backup,arr){
        //sort back up array by date in accending order       
        backup.sort(function(a,b){
            return new Date(b.date) - new Date(a.date);
        });        

        arr.sort(function(a,b){
         return new Date(b.date) - new Date(a.date);
        });

        //prepend backup array to fullarray 
        for (var i = backup.length - 1; i >= 0; i--) {
            arr.unshift(backup[i]);        
        }; 
        return arr;
      }

    function SortStarFunc(){
        $scope.BackUpArrayStar = [];
        for (var i = $scope.payments.length - 1; i >= 0; i--) {
            if ($scope.payments[i].favouriteStarNo === 0) {
              $scope.BackUpArrayStar.push($scope.payments[i]);            
              $scope.payments.splice(i,1);           
            };
        };
        $scope.payments = MergeArr($scope.BackUpArrayStar,$scope.payments);        
    }

    $scope.starfunc = function(item, index) {

        if (item.id === "favouriteStarNo") {
            $scope.prodSearch = null;
            item.upstatus == false;
            item.downstatus = false;
            $scope.testarr[$scope.indexno].upstatus = false;
            $scope.testarr[$scope.indexno].downstatus = false;
            $scope.testarr[$scope.indexno].close = false;
            item.close = true;
            $scope.indexno = index;
            $scope.latest = '-date'
            SortStarFunc();

        } else if (item.id === "paymentStatus") {
            $scope.latest = null;
            $scope.prodSearch = null;
            item.upstatus == false;
            item.downstatus = false;
            $scope.testarr[$scope.indexno].downstatus = false;
            $scope.testarr[$scope.indexno].upstatus = false;
            $scope.testarr[$scope.indexno].close = false;
            item.close = true;
            $scope.indexno = index;
            $scope.CheckFullArrayStatus(item.name, item.id);

        } else {

            if (item.upstatus == false && item.downstatus == false) {
                item.upstatus = !item.upstatus;
                item.close = true;
                if ($scope.indexno != index) {
                    $scope.testarr[$scope.indexno].upstatus = false;
                    $scope.testarr[$scope.indexno].downstatus = false;
                    $scope.testarr[$scope.indexno].close = false;
                    $scope.indexno = index;                    
                }
            } else {
                item.upstatus = !item.upstatus;
                item.downstatus = !item.downstatus;
                item.close = true;
            }

            $scope.self.searchText = "";

            if (item.upstatus) {
                $scope.prodSearch = item.id;
                $scope.latest = '-date';
            }
            if (item.downstatus) {
                $scope.prodSearch = '-' + item.id;
                $scope.latest = '-date';
            }
        }
    }
    
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
                $scope.payments = uiInitilize.insertIndex(data);
                //$scope.payments = data;
                if ($scope.PayArr) {
                    for(i=0; i<= $scope.payments.length-1; i++){
                        $scope.payments[i].settingsMethods = [];
                        $scope.payments[i].settingsMethods = $scope.PayArr;    
                    }
                }
                for(i=0; i<= $scope.payments.length-1; i++){
                    if ($scope.payments[i].paidInvoice.length > 0) {
                        for(y=0; y<= $scope.payments[i].paidInvoice.length-1; y++){
                            $scope.payments[i].paidInvoice[y].paidAmount = parseInt($scope.payments[i].paidInvoice[y].amount) - parseInt($scope.payments[i].paidInvoice[y].balance);
                        }                        
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

            if (obj.favouriteStarNo == 1 ) {
                obj.favouriteStarNo = 0;
            }
            else if (obj.favouriteStarNo == 0){
                obj.favouriteStarNo = 1;
            }

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