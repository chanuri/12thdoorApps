rasm.controller('AppCtrlAdd', function($scope, $state, $objectstore, $location, $mdDialog,UploaderService,$uploader, $window, $objectstore, $auth, $q, $http, $compile, $timeout, $mdToast, $rootScope, invoiceDetails) {
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
    $scope.allInvoiceArr = [];
    $scope.maxDate = new Date();


     $scope.tests = [{
        invono:"12",
        sdate: new Date(),
        duedate: new Date(),
        famount: "1100",
        mduedate: new Date(),
        instalment: "200",
        termtype: "new one ",
        checked: false
    },{
        invono:"12",
        sdate: new Date(),
        duedate: new Date(),
        famount: "1100",
        mduedate: new Date(),
        instalment: "200",
        termtype: "new one ",
        checked: false
    }];

    /*______________________________________paymentID Genaration_____________________________________*/
    var client = $objectstore.getClient("domainClassAttributes");
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
        paymentMethod(data, function() {
            paymentCustArr(data);
        });
    });
    settingsClient.onError(function(data) {
        console.log("Error retreving the settings data");
    });
    settingsClient.getByFiltering("*");
    //get paymentMethod from the settings app 
    function paymentMethod(obj, callback) {
        $scope.PayArr = [];
        var payMethod = obj[0].preference.paymentpref.PaymentMethod;
        for (i = 0; i <= payMethod.length - 1; i++) {
            if (payMethod[i].activate) {
                $scope.PayArr.push(payMethod[i].paymentmethod);
            }
        }
        callback();
        //console.log($scope.PayArr);
    }

    function paymentCustArr(arr) {
        $scope.payCustArr = [];
        var fieldArr = arr[0].preference.paymentpref.CusFiel;
        for (var l = 0; l <= fieldArr.length - 1; l++) {
            $scope.payCustArr.push(fieldArr[l]);
        }
    }
    // maxdate in the calander 
    $scope.maxDate = new Date();
    // get all payment data 
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
                        paidAmount: data[i].paidInvoice[j].balance,
                        comments: data[i].comments
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
        console.log(event)
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
                        Email : data[i].Email
                    });
                }
            }
        });
        client.onError(function(data) {
            console.log("error loading contacts")
        });
        client.getByFiltering("*");
    }
    // load invoice details 
    $scope.loadAllInvoiceDetails =  function(){        
        var invoiceClient = $objectstore.getClient("invoice12thdoor")
        invoiceClient.onGetMany(function(data) {
            $scope.invoiceData = [];
            $scope.invoiceData = angular.copy(data);
            console.log($scope.invoiceData)
            console.log($scope.invoiceData.length);
            loadAdvancePaymentDetails();
        });
        invoiceClient.onError(function(data) {
            console.log("Error retrieving invoice data");
        });
        invoiceClient.getByFiltering("*");   
    }

    // load payment details

    function loadAdvancePaymentDetails(){

        var paymentClient = $objectstore.getClient("advancedPayment");
        paymentClient.onGetMany(function(data) {
            $scope.paymentDetails = data;
        });
        paymentClient.onError(function(data) {
            console.log("error loading payment details ")
        });
        paymentClient.getByFiltering("*");

    }
    $scope.selectedItemChange = function(name) {
            if ($scope.invoiceData) {
                $scope.allInvoiceArr = [];
                $scope.TDInvoice.updateInvoice = $scope.invoiceData;
                for (i = 0; i < $scope.TDInvoice.updateInvoice.length; i++) {
                    for (j = 0; j < $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr.length; j++) {
                        if (name == null) {
                            $scope.outstandingInvoices.splice(name, 1);
                            $scope.payment.uAmount = 0;
                        }else if (($scope.TDInvoice.updateInvoice[i].Name == name) && ($scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].paymentStatus == "Unpaid" || $scope.TDInvoice.updateInvoice[i].status == "Cancelled")) {
                            
                            if ($scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].dueDateprice == "0") {
                                
                                $scope.outstandingInvoices.push({
                                    invono: $scope.TDInvoice.updateInvoice[i].invoiceNo,
                                    sdate: $scope.TDInvoice.updateInvoice[i].Startdate,
                                    duedate: $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].DueDate,
                                    famount: $scope.TDInvoice.updateInvoice[i].finalamount,
                                    mduedate: $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].DueDate,
                                    instalment: $scope.TDInvoice.updateInvoice[i].finalamount,
                                    termtype: $scope.TDInvoice.updateInvoice[i].termtype,
                                    checked: false
                                });
                            }else{                                
                                $scope.outstandingInvoices.push({
                                    invono: $scope.TDInvoice.updateInvoice[i].invoiceNo,
                                    sdate: $scope.TDInvoice.updateInvoice[i].Startdate,
                                    duedate: $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].DueDate,
                                    famount: $scope.TDInvoice.updateInvoice[i].finalamount,
                                    mduedate: $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].DueDate,
                                    instalment: $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].balance,
                                    termtype: $scope.TDInvoice.updateInvoice[i].termtype,
                                    checked: false
                                });   
                            }
                            $scope.allInvoiceArr.push($scope.invoiceData[i]);
                        }
                    }
                }

                $scope.allInvoiceArr = remove_duplicates($scope.allInvoiceArr);
                console.log($scope.allInvoiceArr);
            }
            if ($scope.paymentDetails) {
                var copyUamount = 0;
                for (k = 0; k < $scope.paymentDetails.length; k++) {
                    if ($scope.paymentDetails[k].customer == name) {
                        copyUamount +=  angular.copy(parseInt($scope.paymentDetails[k].uAmount));
                    }
                }
                $scope.payment.uAmount = copyUamount;

                if ($scope.payment.amountReceived) {
                    $scope.nAmount = parseInt($scope.payment.amountReceived) + copyUamount;  
                }else{
                    $scope.nAmount = copyUamount;
                }

                console.log($scope.outstandingInvoices);
                console.log($scope.payment.uAmount);
            }
        }

    function remove_duplicates(objectsArray) {  //remove duplicates object in an array 
        var usedObjects = {};

        for (var i=objectsArray.length - 1;i>=0;i--) {
            var so = JSON.stringify(objectsArray[i]);

            if (usedObjects[so]) {
                objectsArray.splice(i, 1);

            } else {
                usedObjects[so] = true;          
            }
        }

        return objectsArray;

    }
 
        /*________________________________________CheckItem__________________________________________*/
    $scope.checkItem = function(index, invo) { //outstanding invoice check box
            if ($scope.checkbox[index] == true) { //if checkbox is checked 
                invo.checked = true;
                // $scope.payment.total = 0;
                invo.amount = 0;
                if (invo.termtype != "multipleDueDates") { //if thr is only 1 due date
                    invo.amount = invo.instalment;
                    $scope.nAmount = parseInt($scope.nAmount) - parseInt(invo.instalment); //updating total available (nAmount=totalavailable)
               
                } else if (invo.termtype == "multipleDueDates") { //if multipleDuedate
                    invo.amount = invo.instalment;
                    $scope.nAmount = parseInt($scope.nAmount) - parseInt(invo.instalment);
               
                }
                $scope.payment.paidInvoice.push({ //array for insert paid invoices             
                    amount: invo.amount,
                    invono: invo.invono,
                    sdate: invo.sdate,
                    duedate: invo.mduedate,
                    balance : "0",
                    termtype : invo.termtype
                });

                 $scope.payment.total = (parseInt($scope.payment.total) + parseInt(invo.amount));
               
                //$scope.payment.total = $scope.totPayment;

            } else if ($scope.checkbox[index] == false) { //if checkbox is unchecked
                invo.checked = false; //disable check box
                // $scope.totPayment = 0;
                invo.amount = "";
                for (var i = 0; i < $scope.payment.paidInvoice.length; i++) { //removing invoice details from paid invoice array
                    if ($scope.payment.paidInvoice[i]['invono'] == invo.invono) { //cheking index for praticular invoice details
                        $scope.payment.paidInvoice.splice(i,1);
                    }
                }
                if (invo.termtype != "multipleDueDates") {
                    $scope.payment.total = parseInt($scope.payment.total) - parseInt(invo.instalment)
                    $scope.nAmount = parseInt($scope.nAmount) + parseInt(invo.instalment)  
                }
                else if (invo.termtype == "multipleDueDates") {
                    $scope.payment.total = parseInt($scope.payment.total) - parseInt(invo.instalment)
                    $scope.nAmount = parseInt($scope.nAmount) + parseInt(invo.instalment)
                }
            }
        }

    function savePaymentToObjectstore(callback){

        var payment = $objectstore.getClient("payment");
        payment.onComplete(function(data){
            $scope.savePaymentId = data.Data[0].ID;
            callback();
        });
        payment.onError(function(data){
            console.log("error saving payment");
            callback();
        });
        payment.insert($scope.payment, {KeyProperty: "paymentid"})
    }

    function saveAdvancePaymentToObjectstore(callback){
        var paymentSave = $objectstore.getClient("advancedPayment");
        paymentSave.onComplete(function(data){
            // $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Payment Added Successfully.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
            callback();
        });
        paymentSave.onError(function(data){
            console.log("error saving Advanced payment");
            callback();
        });
        paymentSave.insert($scope.advancedPayment, {KeyProperty: "advancedPayment_code"});
        //insertng Unapplied Advances details into advancedPayment class
    }

        /*__________________________________________submit______________________________________________*/
    $scope.submit = function() {

        $scope.payment.favoritestar = false;
        $scope.payment.favouriteStarNo = 1;
        $scope.payment.namount = $scope.nAmount;
        $scope.payment.paymentid = "-999";
        $scope.payment.paymentStatus = "active";
        $scope.payment.customer = $rootScope.selectedItem1.display;        
        $scope.payment.UploadImages = {
            val: []
        };
        $scope.payment.custField = [];
        for(j=0; j<= $scope.payCustArr.length-1; j++){
            $scope.payment.custField.push({
                lable : $scope.payCustArr[j].labelshown,
                type : $scope.payCustArr[j].type,
                value : $scope.payCustArr[j].inputType
            })  
        }
        console.log($scope.payment.custField)
        $scope.payment.UploadImages.val = UploaderService.loadBasicArray();
        $scope.advancedPayment.advancedPayment_code = $scope.payment.customer +' '+ $rootScope.selectedItem1.Email;
        $scope.advancedPayment.customer = $scope.payment.customer;
        $scope.advancedPayment.uAmount = $scope.payment.uAmount;       

        if ($scope.payment.total == 0) {
            $scope.payment.uAmount = $scope.payment.namount;
            $scope.advancedPayment.uAmount = $scope.payment.uAmount;
        } else if ($scope.payment.namount > 0) {
            $scope.payment.uAmount = $scope.payment.namount;
            $scope.advancedPayment.uAmount = $scope.payment.uAmount;
        }

        if ((parseInt($scope.payment.namoun) == parseInt($scope.payment.total)) || parseInt($scope.payment.namoun) == 0){
            savePaymentToObjectstore(function(){
                uInvoice(function(data){
                    uploadImage();
                });//update invoice
            }); // save payment

        }else if(parseInt($scope.payment.namount) > 0){
            var confirm = $mdDialog.confirm()
              .title('Unapplied advances')
              .content('Unapplied advances USD ' + $scope.payment.namount + ' This amount can be applied on future invoices.')
              .ariaLabel('Lucky day')
              .targetEvent()
              .ok('OK')
              .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                savePaymentToObjectstore(function(){
                    saveAdvancePaymentToObjectstore(function(){
                        updateInvoice(function(){                            
                           uploadImage();
                        });
                    }); // save payment and advance payment 
                })
            }, function() {
                $mdDialog.hide();
            }); 
        }else if(parseInt($scope.payment.namount) < 0){
             $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('Warning').content('Total payments applied exceeds the total available').ariaLabel('').ok('OK').targetEvent());
           
        }
    }

    function uploadImage(){
        $scope.imagearray = [];
        $scope.imagearray = UploaderService.loadArray();
        if ($scope.imagearray.length > 0) {
            for (indexx = 0; indexx < $scope.imagearray.length; indexx++) {
                $uploader.upload("45.55.83.253", "paymentImage", $scope.imagearray[indexx]);
                $uploader.onSuccess(function (e, data) {
                    $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Payment Added Successfully.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
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
            }
        };
    }
    $scope.invoiceStatus = false;

    function updateInvoice(callback){
        for (var y = 0; y < $scope.payment.paidInvoice.length; y++) { 
            for(k=0; k <= $scope.allInvoiceArr.length-1; k++ ){
                if ($scope.payment.paidInvoice[y].invono == $scope.allInvoiceArr[k].invoiceNo) {                    
                    for(o=0; o <= $scope.allInvoiceArr[k].MultiDueDAtesArr.length-1; o++){
                        if ($scope.allInvoiceArr[k].MultiDueDAtesArr[o]['DueDate'] == $scope.payment.paidInvoice[y].duedate) {
                            if ($scope.payment.paidInvoice[y].termtype == "multipleDueDates") {
                                if ( parseInt($scope.payment.paidInvoice[y].balance) != 0) {
                                    console.log($scope.payment.paidInvoice[y].balance);
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['balance'] = parseInt($scope.payment.paidInvoice[y].balance);                                    
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['paymentStatus'] = "Unpaid"; 
                                    $scope.invoiceStatus = true;
                                    
                                }else if (parseInt($scope.payment.paidInvoice[y].balance) == 0) {
                                    console.log($scope.allInvoiceArr[k].invoiceNo + ' paid' );
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['paymentStatus'] = "paid"; 
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['balance'] = 0; 
                                    $scope.invoiceStatus = true;                                       
                                }
                            }else{
                                if ( parseInt($scope.payment.paidInvoice[y].balance) != 0) {
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['dueDateprice'] = parseInt($scope.payment.paidInvoice[y].amount);                                    
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['balance'] = parseInt($scope.payment.paidInvoice[y].balance);                                    
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['paymentStatus'] = "Unpaid"; 
                                    $scope.invoiceStatus = true;
                                    
                                }else if (parseInt($scope.payment.paidInvoice[y].balance) == 0) {
                                    console.log($scope.allInvoiceArr[k].invoiceNo + ' paid' );
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['dueDateprice'] = parseInt($scope.payment.paidInvoice[y].amount);
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['paymentStatus'] = "paid"; 
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['balance'] = 0; 
                                    $scope.invoiceStatus = true;                                    
                                };
                            }
                        }
                        if ($scope.invoiceStatus) {  
                            $scope.invoiceStatus = false;                      
                            invoiceInsert($scope.allInvoiceArr[k]); 
                        };                                                          
                    }  
                }         
            }
        }        
        $state.go('View_Payment', {
            'paymentid': $scope.savePaymentId
        });
        callback()
    }
    function invoiceInsert(arr){
        var client = $objectstore.getClient("invoice12thdoor");
        client.onComplete(function(data) {
            console.log("successfully invoice updated '"+data.Data[0].ID+"'");
        });
        client.onError(function(data) {
            console.log("error updating invoice");
        });
        client.insert(arr, {
            KeyProperty: "invoiceNo"
        });
    }

    $scope.cancelFunc = function(){
        $state.go("home");
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
    /*________________________Customerview________________________________________________________*/
    $scope.Customerview = function() {
            location.href = '#/home';
        }
        /*__________________________________save______________________________________________*/
    $scope.save = function() {
            $timeout(function() {
                $('#mySignup').click();
            })
        }
        /*______________________________viewpromotion_______________________________________*/
    $scope.nAmount = "";
    $scope.netAmount = function() {
       
        if( parseInt($scope.payment.total) != 0){
            $scope.nAmount = ( ( parseInt($scope.payment.uAmount) -  parseInt($scope.payment.total) )    + parseInt($scope.payment.amountReceived) );
        }
        else {           
            $scope.nAmount = (parseInt($scope.payment.uAmount) + parseInt($scope.payment.amountReceived));
        }
        // console.log($scope.nAmount);
    }
    $scope.upload = function(ev) {
        $mdDialog.show({
            templateUrl: 'payment_partial/showUploader.html',
            targetEvent: ev,
            controller: UploadCtrl,
            locals: {
                dating: ev
            }
        })
    }

    function UploadCtrl($scope, $mdDialog, $state){
        $scope.uploadimages = {
            val: []
        };
        $scope.uploadimages.val = UploaderService.loadBasicArray();
        //directive table content start
        $scope.$on('viewRecord', function (event, args) {
            $scope.uploadimages.val.splice(args, 1);
        });
        $scope.toggleSearch = false;
        $scope.headers = [{
            name: 'Name'
            , field: 'name'
        }, {
            name: 'Size'
            , field: 'size'
        }];
        $scope.custom = {
            name: 'bold'
            , size: 'grey'
        };
        $scope.sortable = ['name', 'size'];
        $scope.thumbs = 'thumb';
        $scope.count = 3;
        //directive table conten end.
        $scope.closeDialog = function () {
            $mdDialog.hide();
        }
        $scope.AddImage = function () {
            $scope.uploadimages.val = UploaderService.loadBasicArray();
        }
    }


    $scope.getPaidAmount = function(obj, oldValue,e){
        if (obj.amount == "") {
            obj.amount = 0;
        }
        else if (oldValue == "") {
            oldValue = 0;
        }

        if (parseInt(obj.amount) > parseInt(obj.instalment)) {
           obj.amount = oldValue;
        }else{

            $scope.payment.total = ( parseInt($scope.payment.total) - parseInt(oldValue) ) + parseInt(obj.amount); 
            var difference = parseInt(oldValue) - parseInt(obj.amount);
            console.log(difference);

            if ($scope.nAmount >= 0) {
                $scope.nAmount =  parseInt($scope.nAmount) + difference;            
            }else{
                $scope.nAmount = ( parseInt($scope.nAmount) + parseInt(oldValue) ) - parseInt(obj.amount); 
            }           
           // $scope.nAmount = ( parseInt($scope.nAmount) - parseInt($scope.payment.total ) ) ;
      

            for (var i = 0; i < $scope.payment.paidInvoice.length; i++) {  
                if ( ($scope.payment.paidInvoice[i]['invono'] == obj.invono) && ($scope.payment.paidInvoice[i]['duedate'] == obj.mduedate) ) {
                    $scope.payment.paidInvoice[i].balance = parseInt($scope.payment.paidInvoice[i].amount) - parseInt(obj.amount);                
                    console.log($scope.payment.paidInvoice[i].balance);
                }
            }
            //$scope.netAmount();   
        }
    }
});
//END OF AppCtrlAdd