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
    
    function loadMaxPaymentNum(){
        var client = $objectstore.getClient("domainClassAttributes");
        client.onGetMany(function(data) {
            if (data) {
                if(data.length == 0){
                    $scope.payment.paymentref = "1";
                }else{ 
                    for (var i = data.length - 1; i >= 0; i--) {
                        $scope.ID = data[i].maxCount;
                        // $scope.payment.uAmount=$scope.paymentDetails[i].uAmount;
                        // console.log($scope.payment.uAmount);
                    };
                    $scope.maxID = parseInt($scope.ID) + 1;
                    $scope.payment.paymentref = $scope.maxID.toString();
                }
            }
        });
        client.getByFiltering("select maxCount from domainClassAttributes where class='payment'");
    }
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
    $scope.history = function(item) { 
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
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.keyPressAutoComplete = function(keyEvent) {
        if (keyEvent.which == 40) {
            console.log("working");  
        }
    }
    function querySearch(query, event) { 
        $rootScope.results = [];
        for (i = 0, len = $scope.customerNames.length; i < len; ++i) {
            if ($scope.customerNames[i].display.indexOf(query) != -1) {
                $rootScope.results.push($scope.customerNames[i]);
            }
        }
        return $rootScope.results;
    }

    function loadAll() { //get customer name for auto compleate field from contact class
        var client = $objectstore.getClient("contact12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                for (i = 0, len = data.length; i < len; ++i) {
                    $scope.customerNames.push({
                        display: data[i].Name.toLowerCase(),
                        value: data[i],
                        invo_No: data[i].invoiceNo,
                        Email : data[i].Email,
                        customerid : data[i].customerid
                    });
                }
            }
        });
        client.onError(function(data) {
            console.log("error loading contacts")
        });
        client.getByFiltering("select * from contact12thdoor where status = 'Active'");
    }

    // load payment details
    $scope.AdvancefullArr = [];
    function loadAdvancePaymentDetails(name, callback){

        var paymentClient = $objectstore.getClient("advancedPayment12thdoor");
        paymentClient.onGetMany(function(data) {
            $scope.AdvancefullArr = [];
            if (data.length > 0) {
                data[0].status = "Inactive"
                $scope.paymentDetails = data[0];
                $scope.AdvancefullArr.push(data[0]);

                var copyUamount = 0;               
                copyUamount +=  angular.copy(parseInt($scope.paymentDetails.uAmount));
                 
                $scope.payment.uAmount = copyUamount;

                if ($scope.payment.amountReceived) {
                    $scope.nAmount = parseInt($scope.payment.amountReceived) + copyUamount;  
                }else{
                    $scope.nAmount = copyUamount;
                }            
            }           
            loadMaxPaymentNum();
            callback("success")
        });
        paymentClient.onError(function(data) {
            console.log("error loading payment details")
            callback("error")
        });
        paymentClient.getByFiltering("select * from advancedPayment12thdoor where status ='Active' and customer = '"+name+"'");

    }
    $scope.selectedItemChange = function(name) {        
        $scope.outstandingInvoices = [];
        $scope.fullArr = [];

        $scope.payment.uAmount = 0
        if ( $scope.payment.amountReceived) {
            $scope.nAmount = $scope.payment.amountReceived;
        }else{
            $scope.nAmount = 0
        }

        var invoiceClient = $objectstore.getClient("invoice12thdoor")
        invoiceClient.onGetMany(function(data) {
            if (data.length > 0) {

                $scope.TDInvoice.updateInvoice = [];
                $scope.allInvoiceArr = [];
                $scope.TDInvoice.updateInvoice = angular.copy(data)

                for (i = 0; i < $scope.TDInvoice.updateInvoice.length; i++) {
                    for (j = 0; j < $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr.length; j++) {
                        if (name == null) {
                            $scope.outstandingInvoices.splice(name, 1);
                            $scope.payment.uAmount = 0;
                        }else if (($scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].paymentStatus == "Unpaid" || $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].paymentStatus == "Partially Paid")) {
                            
                            if ($scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].dueDateprice == "0") {
                                
                                $scope.outstandingInvoices.push({
                                    invono: $scope.TDInvoice.updateInvoice[i].invoiceNo,
                                    sdate: $scope.TDInvoice.updateInvoice[i].Startdate,
                                    duedate: $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].DueDate,
                                    famount: $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].dueDateprice,
                                    mduedate: $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].DueDate,
                                    instalment: $scope.TDInvoice.updateInvoice[i].finalamount,
                                    termtype: $scope.TDInvoice.updateInvoice[i].termtype,
                                    checked: false,
                                    checkDisable : false,
                                    inputDisable : true
                                });
                            }else{                                
                                $scope.outstandingInvoices.push({
                                    invono: $scope.TDInvoice.updateInvoice[i].invoiceNo,
                                    sdate: $scope.TDInvoice.updateInvoice[i].Startdate,
                                    duedate: $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].DueDate,
                                    famount: $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].dueDateprice,
                                    mduedate: $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].DueDate,
                                    instalment: $scope.TDInvoice.updateInvoice[i].MultiDueDAtesArr[j].balance,
                                    termtype: $scope.TDInvoice.updateInvoice[i].termtype,
                                    checked: false,
                                    checkDisable : false,
                                    inputDisable : true
                                });   
                            }
                            $scope.allInvoiceArr.push($scope.TDInvoice.updateInvoice[i]);
                        }
                    }
                }
                loadAdvancePaymentDetails(name,function(status){                    
                    $scope.allInvoiceArr = remove_duplicates($scope.allInvoiceArr); 
                    sortInvoiceArr();
                })
            }
        });
        invoiceClient.onError(function(data) {
            console.log("Error retrieving invoice data");
        });
        invoiceClient.getByFiltering("select * from invoice12thdoor where Name = '"+name+"'");             
        
    }

    function sortInvoiceArr(){
        var oneInvoiceNoArr = [];
        $scope.fullArr = [];
        if ($scope.outstandingInvoices.length > 0) {
            for(i=0; i<=$scope.outstandingInvoices.length; i++){
                if ($scope.outstandingInvoices[i+1]) {
                    if ($scope.outstandingInvoices[i].invono == $scope.outstandingInvoices[i+1].invono) {
                        
                        oneInvoiceNoArr.push($scope.outstandingInvoices[i]);
                    }else if($scope.outstandingInvoices[i].invono != $scope.outstandingInvoices[i+1].invono){
                        
                        oneInvoiceNoArr.push($scope.outstandingInvoices[i]);
                        if (oneInvoiceNoArr.length > 1) {
                            oneInvoiceNoArr = oneInvoiceNoArr.sort(function(a,b){
                                return new Date(a.duedate) - new Date(b.duedate)
                            })
                            for(k=0; k<=oneInvoiceNoArr.length-1; k++){
                                if ( k!= 0) {
                                    oneInvoiceNoArr[k].checkDisable = true;
                                }
                            }
                        }
                        $scope.fullArr = $scope.fullArr.concat(oneInvoiceNoArr)
                        oneInvoiceNoArr = [];
                    }
                }else{
                    if ($scope.outstandingInvoices.length != i) {
                        $scope.fullArr.push($scope.outstandingInvoices[i])
                    }
                }
            }
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
 
    $scope.checkItem = function(index, invo) { //outstanding invoice check box
            if (invo.checked) { //if checkbox is checked 
              
                if ( $scope.fullArr[index + 1]) {                    
                    if ($scope.fullArr[index].invono == $scope.fullArr[index +1].invono) {
                        $scope.fullArr[index + 1].checkDisable = false;
                    }
                }
                if ($scope.fullArr[index -1]) {                    
                    if ($scope.fullArr[index].invono == $scope.fullArr[index -1].invono) {
                        $scope.fullArr[index - 1].inputDisable = true;
                    }
                }

                // $scope.payment.total = 0;
                invo.amount = 0;
                invo.inputDisable = false;
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
             
            } else if (!invo.checked) { //if checkbox is unchecked

                for(o=index; o<=$scope.fullArr.length-1; o++){  
                    if ($scope.fullArr[o-1]) {   
                        if ($scope.fullArr[o].invono == $scope.fullArr[o -1].invono) {
                            $scope.fullArr[o - 1].inputDisable = false;
                            $scope.fullArr[o].inputDisable = true;
                            break;
                        }else{
                            $scope.fullArr[o].inputDisable = true;
                            break;
                        }
                    }else{
                        $scope.fullArr[o].inputDisable = true;
                        break;
                    }
                }
                
                for(o=index; o<=$scope.fullArr.length-1; o++){ 

                    if ($scope.fullArr[o+1]) {
                        if ($scope.fullArr[o].invono == $scope.fullArr[o +1].invono) {                       
                            if ($scope.fullArr[o + 1].checked) {                            
                                $scope.fullArr[o + 1].checked = false;
                                $scope.fullArr[o + 1].checkDisable = true;
                                $scope.fullArr[o + 1].inputDisable = true;
                                reverseCheckItem(o);
                            }else{
                                reverseCheckItem(o);
                                $scope.fullArr[o + 1].checkDisable = true;
                                break;
                            }

                        }else if ($scope.fullArr[o].invono != $scope.fullArr[o +1].invono){
                            reverseCheckItem(o);
                            break; 
                        }  
                    }else{
                        reverseCheckItem(o);
                        break; 
                    }                    

                                      
                }              
              
                function reverseCheckItem(o){
                    for (var i = 0; i < $scope.payment.paidInvoice.length; i++) { //removing invoice details from paid invoice array
                        if ($scope.payment.paidInvoice[i]['invono'] == $scope.fullArr[o].invono) { //cheking index for praticular invoice details
                            $scope.payment.paidInvoice.splice(i,1);
                        }
                    }
                    if ($scope.fullArr[o].termtype != "multipleDueDates") {
                        $scope.payment.total = parseInt($scope.payment.total) - parseInt($scope.fullArr[o].amount)
                        $scope.nAmount = parseInt($scope.nAmount) + parseInt($scope.fullArr[o].amount)  
                    }
                    else if ($scope.fullArr[o].termtype == "multipleDueDates") {
                        $scope.payment.total = parseInt($scope.payment.total) - parseInt($scope.fullArr[o].amount)
                        $scope.nAmount = parseInt($scope.nAmount) + parseInt($scope.fullArr[o].amount)
                    }

                    $scope.fullArr[o].amount = "";
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

        $scope.AdvancefullArr.push($scope.advancedPayment)
        var paymentSave = $objectstore.getClient("advancedPayment12thdoor");
        paymentSave.onComplete(function(data){
            callback();
        });
        paymentSave.onError(function(data){
            console.log("error saving Advanced payment");
            callback();
        });
        paymentSave.insertMultiple($scope.AdvancefullArr,"advancedPayment_code"); 
    }
 
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

        if ($scope.payCustArr.length > 0) {
            for(j=0; j<= $scope.payCustArr.length-1; j++){
                $scope.payment.custField.push({
                    lable : $scope.payCustArr[j].labelshown,
                    type : $scope.payCustArr[j].type,
                    value : $scope.payCustArr[j].inputType
                })  
            }            
        }
        
        $scope.payment.UploadImages.val = UploaderService.loadBasicArray();
        $scope.advancedPayment.advancedPayment_code = "-999";
        $scope.advancedPayment.name = $scope.payment.customer +' '+ $rootScope.selectedItem1.Email;
        $scope.advancedPayment.customer = $scope.payment.customer;
        $scope.advancedPayment.uAmount = $scope.payment.uAmount;  
        $scope.advancedPayment.status = "Active";       

        if ($scope.payment.total == 0) {
            $scope.payment.uAmount = $scope.payment.namount;
            $scope.advancedPayment.uAmount = $scope.payment.uAmount;
        } else if ($scope.payment.namount > 0) {
            $scope.payment.uAmount = $scope.payment.namount;
            $scope.advancedPayment.uAmount = $scope.payment.uAmount;
        }

        if ((parseInt($scope.payment.namoun) == parseInt($scope.payment.total)) || parseInt($scope.nAmount) == 0){
            savePaymentToObjectstore(function(){
                updateInvoice(function(){
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

                                    console.log($scope.allInvoiceArr[k].invoiceNo + ' Paid' );
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['balance'] = parseInt($scope.payment.paidInvoice[y].balance);                                    
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['paymentStatus'] = "Partially Paid"; 
                                    $scope.invoiceStatus = true;
                                    
                                }else if (parseInt($scope.payment.paidInvoice[y].balance) == 0) {
                                    console.log($scope.allInvoiceArr[k].invoiceNo + 'Partially Paid' );
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['paymentStatus'] = "Paid"; 
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['balance'] = 0; 
                                    $scope.invoiceStatus = true;                                       
                                }
                            }else{
                                if ( parseInt($scope.payment.paidInvoice[y].balance) != 0) {

                                    console.log($scope.allInvoiceArr[k].invoiceNo + 'Partially Paid' );
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['dueDateprice'] = parseInt($scope.payment.paidInvoice[y].amount);                                    
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['balance'] = parseInt($scope.payment.paidInvoice[y].balance);                                    
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['paymentStatus'] = "Partially Paid"; 
                                    $scope.invoiceStatus = true;
                                    
                                }else if (parseInt($scope.payment.paidInvoice[y].balance) == 0) {
                                    console.log($scope.allInvoiceArr[k].invoiceNo + ' Paid' );
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['dueDateprice'] = parseInt($scope.payment.paidInvoice[y].amount);
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['paymentStatus'] = "Paid"; 
                                    $scope.allInvoiceArr[k].MultiDueDAtesArr[o]['balance'] = 0; 
                                    $scope.invoiceStatus = true;                                    
                                };
                            }
                        }
                        if ($scope.invoiceStatus) {  
                            $scope.invoiceStatus = false;                      
                            invoiceInsert($scope.allInvoiceArr[k],$scope.payment.paidInvoice[y].amount,function(status){
                                if (status == "success") {
                                    console.log("working")
                                }
                            })
                        }                                                      
                    }  
                }         
            }
        }        
        $state.go('View_Payment', {
            'paymentid': $scope.savePaymentId
        });
        callback()
    }
    function invoiceInsert(arr,paidAmount,callback){
        var client = $objectstore.getClient("invoice12thdoor");
        client.onComplete(function(data) {
            console.log("successfully invoice updated '"+data.Data[0].ID+"'");
            addTOLegger(data.Data[0].ID,paidAmount)
            callback("success")
        });
        client.onError(function(data) {
            console.log("error updating invoice");
        });
        client.insert(arr, {
            KeyProperty: "invoiceNo"
        });
    }

    function addTOLegger(invoiceID,paidAmount){
        var leggerObj = {            
            "AccountNo": $rootScope.selectedItem1.customerid,
            "Amount": paidAmount,
            "Date": new Date(),
            "Description": "Payment added",
            "ID": "-999",
            "InvoiceRefID": invoiceID,
            "Name": $rootScope.selectedItem1.display,
            "RefID": $scope.savePaymentId,
            "Type": "Receipt"
        }

        var leggerClient = $objectstore.getClient("leger12thdoor");
        leggerClient.onComplete(function(data) {
            console.log("successfully legger updated '"+data.Data[0].ID+"'");
        });
        leggerClient.onError(function(data) {
            console.log("error updating legger");
        });
        leggerClient.insert(leggerObj, {
            KeyProperty: "ID"
        });

    }

    $scope.cancelFunc = function(){     $state.go("home")   }

    $scope.demo = {
        topDirections: ['left', 'up'],
        bottomDirections: ['down', 'right'],
        isOpen: false,
        availableModes: ['md-fling', 'md-scale'],
        selectedMode: 'md-fling',
        availableDirections: ['up', 'down', 'left', 'right'],
        selectedDirection: 'up'
    };
    $scope.Customerview = function() { $state.go("home")      }
    $scope.save = function() {
        $timeout(function() {
            $('#mySignup').click();
        })
    }
    $scope.nAmount = "";
    $scope.netAmount = function() {
       
        if( parseInt($scope.payment.total) != 0){
            $scope.nAmount = ( ( parseInt($scope.payment.uAmount) -  parseInt($scope.payment.total) )    + parseInt($scope.payment.amountReceived) );
        }
        else {           
            $scope.nAmount = (parseInt($scope.payment.uAmount) + parseInt($scope.payment.amountReceived));
        }
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
        $scope.uploadimages = {val: []};
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
        $scope.closeDialog = function () {  $mdDialog.hide()    }
        $scope.AddImage = function () { $scope.uploadimages.val = UploaderService.loadBasicArray()  }
    }

    $scope.getPaidAmount = function(obj, oldValue,e,index){
        if (obj.amount == "")   obj.amount = 0;      
        else if (oldValue == "")    oldValue = 0;       
        
        if (parseInt(obj.amount) > parseInt(obj.instalment)) {
            obj.amount = oldValue

        }

        else{

            $scope.payment.total = ( parseInt($scope.payment.total) - parseInt(oldValue) ) + parseInt(obj.amount); 
            var difference = parseInt(oldValue) - parseInt(obj.amount);

            if ($scope.nAmount >= 0)    $scope.nAmount =  parseInt($scope.nAmount) + difference;            
            else    $scope.nAmount = ( parseInt($scope.nAmount) + parseInt(oldValue) ) - parseInt(obj.amount);            

            for (var i = 0; i < $scope.payment.paidInvoice.length; i++) {  
                if ( ($scope.payment.paidInvoice[i]['invono'] == obj.invono) && ($scope.payment.paidInvoice[i]['duedate'] == obj.mduedate) ) {
                    $scope.payment.paidInvoice[i].balance = parseInt($scope.payment.paidInvoice[i].amount) - parseInt(obj.amount);
                }
            } 
        }
        if (parseInt(obj.amount) < parseInt(obj.instalment) ){
            if ($scope.fullArr[index].invono == $scope.fullArr[index +1].invono) {
                $scope.fullArr[index + 1].checkDisable = true;
            }
        }else if(parseInt(obj.amount) == parseInt(obj.instalment)){
            $scope.fullArr[index + 1].checkDisable = false;
        }
    }
})
