rasm.controller('View_Payment', function($scope, $objectstore, $mdDialog, $stateParams,$state) {
    console.log($stateParams.paymentid)
    $scope.viewPyamentArr = [];
    var client = $objectstore.getClient('payment');
    client.onGetOne(function(data) {
        $scope.viewPyamentArr = [];
        $scope.viewPyamentArr.push(data);

        $scope.advancePaymentData = [];

        var advanceClient = $objectstore.getClient("advancedPayment");
        advanceClient.onGetMany(function(data){
            $scope.viewPyamentArr[0].outStandingPayment = 0;

            if (data) {
                $scope.advancePaymentData = data[0];
                $scope.viewPyamentArr[0].outStandingPayment = data[0].uAmount;
            }
        });
        advanceClient.onError(function(data){
            console.log("error retriveing advance payment data");
        });
        advanceClient.getByFiltering("select * from advancedPayment where customer = '"+$scope.viewPyamentArr[0].customer+"'");

    });
    client.onError(function(data) {
        console.log("error loading payment data");
    });
    client.getByKey($stateParams.paymentid);


    function reverseInvoicePayment(item,callback){
        var status = "error";
        var invoiceData = $objectstore.getClient("invoice12thdoor");
        invoiceData.onGetMany(function(data){
            console.log(data); // load invoice data by name 
            //status = "save";
            for(i=0; i<= item.paidInvoice.length-1; i++){
                for(j=0; j<=data.length-1; j++ ){
                    for(k=0; k<=data[j].MultiDueDAtesArr.length-1; k++ ){
                        if ( (data[j].invoiceNo == item.paidInvoice[i].invono ) &&  (parseInt(data[j].MultiDueDAtesArr[k].dueDateprice) == parseInt(item.paidInvoice[i].amount)) ) {
                            data[j].MultiDueDAtesArr[k].paymentStatus = "Unpaid"; //change the status 
                            // advanceAmount += item.paidInvoice[i].amount; 

                            var client = $objectstore.getClient("invoice12thdoor");
                            client.onComplete(function(data) {
                                console.log("successfully invoice updated '"+data.Data[0].ID+"'");
                                status = "save";

                            });
                            client.onError(function(data) {
                                console.log("error updating invoice");
                                status = "error";
                            });
                            client.insert(data[j], {
                                KeyProperty: "invoiceNo"
                            });                           
                        }
                    }
                }
            }
            callback(status);
        });
        invoiceData.onError(function(data){
            console.log("error loading invoice data")
            status = "error";
            callback(status);
        });
        invoiceData.getByFiltering("select * from invoice12thdoor where Name = '"+item.customer+"'");

    }

    function savePayment(item,callback){
        var updatePayment = $objectstore.getClient("payment");
        updatePayment.onComplete(function(data){
            callback("save");
        });
        updatePayment.onError(function(data){
            callback("error");
        });
        updatePayment.insert(item, {KeyProperty: "paymentid"})
    }

    function removePayment(item,callback){
        var deletePayment = $objectstore.getClient("payment");
        deletePayment.onComplete(function(data){
            callback("save")
        });
        deletePayment.onError(function(data){
            console.log("error deleting payment");
            callback("error");
        });
        deletePayment.deleteSingle(item.paymentid,"paymentid");
    }

    function updateAdvancePayment(item){

        var updateaAdvancePayment = $objectstore.getClient("advancedPayment");
        updateaAdvancePayment.onComplete(function(data){
            $state.go("home");
        });

        updateaAdvancePayment.onError(function(data){
            console.log("error updating advance payment ")
        });

        $scope.advancePaymentData.uAmount = parseInt($scope.advancePaymentData.uAmount) + parseInt(item.total);
        updateaAdvancePayment.insert($scope.advancePaymentData, {KeyProperty: "advancedPayment_code"})
    }

    $scope.deletePayment = function(item){

        var confirm = $mdDialog.confirm()
            .title('Would you like to delete your Payment?')
            .content('This action cannot be reversed')
            .targetEvent()
            .ok('Delete')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            deleteFunc(item);
        }, function() {
            $mdDialog.hide();
        });
    }

    function deleteFunc(item){
        reverseInvoicePayment(item,function(reverseStatus){

            rollbackInvoicePayment(item,reverseStatus);
            function rollbackInvoicePayment(item,reverseStatus){
                if(reverseStatus = "save"){
                    removePayment(item,function(status){
                        rollbackremovePayment(item,status);
                        function rollbackremovePayment(item,status){
                            if (status == "save") {
                                updateAdvancePayment(item);  
                            }else if (status == "error") {
                                rollbackremovePayment(item,status);
                            }
                        }                        
                    });
                }else if (reverseStatus == "error") {
                    rollbackInvoicePayment(item,reverseStatus);
                };
            }             
        });
    }

    $scope.cancelPayment = function(item){
        item.paymentStatus = "Cancelled";
        reverseInvoicePayment(item,function(reverseStatus){

            rollbackInvoicePayment(item,reverseStatus);
            function rollbackInvoicePayment(item,reverseStatus){
                if(reverseStatus = "save"){
                    savePayment(item,function(status){

                        rollbackSavePayment(item,status);
                        function rollbackSavePayment(item,status){
                            if (status == "save") {
                            updateAdvancePayment(item);

                            }else if (status == "error") {
                                rollbackSavePayment(item,status);
                            };
                        }                        
                    })
                }else if(reverseStatus = "error"){
                    rollbackInvoicePayment(item,reverseStatus);
                }
            }
            
        });
    }
});