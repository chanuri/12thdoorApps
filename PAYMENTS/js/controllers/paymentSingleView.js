rasm.controller('View_Payment', function($scope, $objectstore, $mdDialog, $stateParams,$state,$mdToast) {
 
    $scope.viewPyamentArr = [];
    $scope.progressBar = false;


    var client = $objectstore.getClient('payment');
    client.onGetOne(function(data) {
        $scope.viewPyamentArr = [];
        $scope.viewPyamentArr.push(data);

        $scope.advancePaymentData = [];

        var advanceClient = $objectstore.getClient("advancedPayment12thdoor");
        advanceClient.onGetMany(function(data){
            $scope.viewPyamentArr[0].outStandingPayment = 0;

            if (data.length > 0) {
                $scope.advancePaymentData = data[0];
                $scope.viewPyamentArr[0].outStandingPayment = data[0].uAmount;
            }

            LoadAllComments($stateParams.paymentid);
        });
        advanceClient.onError(function(data){
            console.log("error retriveing advance payment data");
        });
        advanceClient.getByFiltering("select * from advancedPayment12thdoor where customer = '"+$scope.viewPyamentArr[0].customer+"' and status = 'Active'");

    });
    client.onError(function(data) {
        console.log("error loading payment data");
    });
    client.getByKey($stateParams.paymentid);

    function LoadAllComments(Pcode){
        $scope.viewPyamentArr[0].Comments = [];
        var client = $objectstore.getClient("paymentComment");
        client.onGetMany(function(data){
            // if (data) {

            //     $scope.viewPyamentArr[0].Comments = data.sort(function(a,b){
            //       return new Date(b.TodayDate) - new Date(a.TodayDate);
            //     });
            // };
            if (data) {
                loadAllActivities(Pcode,data);
            };           
        });
        client.onError(function(data){
            console.log("error Loading comments");
        });
        client.getByFiltering("select * from paymentComment where paymentid = '"+Pcode+"'")
    }

    function reverseInvoice(item,type,callback){        
        var status = "error";
        var invoiceData = $objectstore.getClient("invoice12thdoor");
        invoiceData.onGetMany(function(data){
            $scope.invoiceStatus = false;
            for(i=0; i<= item.paidInvoice.length-1; i++){
                for(j=0; j<=data.length-1; j++ ){
                    if (data[j].invoiceNo == item.paidInvoice[i].invono) {
                        for(k=0; k<=data[j].MultiDueDAtesArr.length-1; k++ ){
                            if (data[j].MultiDueDAtesArr[k]['DueDate'] == item.paidInvoice[i].duedate) {
                                console.log(data[j].MultiDueDAtesArr[k]['DueDate'] +"=="+ item.paidInvoice[i].duedate)
                                // if ( parseInt(data[j].MultiDueDAtesArr[k].dueDateprice) == parseInt(item.paidInvoice[i].amount) ){
                                    if ( parseInt(data[j].MultiDueDAtesArr[k].dueDateprice) != parseInt(item.paidInvoice[i].balance) ) {
                                        var diff = parseInt(item.paidInvoice[i].amount) - parseInt(item.paidInvoice[i].balance);
                                        data[j].MultiDueDAtesArr[k].balance = parseInt(data[j].MultiDueDAtesArr[k].balance) + diff;
                                        
                                        if (parseInt(data[j].MultiDueDAtesArr[k].balance) == parseInt(data[j].MultiDueDAtesArr[k].dueDateprice)) {
                                            data[j].MultiDueDAtesArr[k].paymentStatus = "Unpaid";
                                        }else if (parseInt(data[j].MultiDueDAtesArr[k].balance) != parseInt(data[j].MultiDueDAtesArr[k].dueDateprice)) {
                                            data[j].MultiDueDAtesArr[k].paymentStatus = "Partially Paid";
                                        }
                                                                         
                                    }else{
                                        data[j].MultiDueDAtesArr[k].balance = 0;
                                    }
                                    
                                    $scope.invoiceStatus = true;
                                    addToLegger(type,data[j],diff)
                            }
                        }
                    }
                    if ($scope.invoiceStatus) {   
                        $scope.invoiceStatus = false;                     
                        var client = $objectstore.getClient("invoice12thdoor");
                        client.onComplete(function(data) {
                            console.log("successfully invoice updated '"+data.Data[0].ID+"'");
                            status = "save";
                        });
                        client.onError(function(data) {
                            console.log("error updating invoice");
                            status = "error";
                            $scope.progressBar = false;
                        });

                        client.insert(data[j], {
                            KeyProperty: "invoiceNo"
                        });  
                    }
                }
            }
            if ($scope.leggerFullArr.length>0) {

                var leggerClient = $objectstore.getClient("leger12thdoor");
                leggerClient.onComplete(function(data) {
                    console.log("successfully legger added '"+data.Data[0].ID+"'")
                });
                leggerClient.onError(function(data) {
                    console.log("error updating legger")
                    $scope.progressBar = false;
                }); 
                leggerClient.insertMultiple($scope.leggerFullArr,"ID");
            }

            callback(status);
        });
        invoiceData.onError(function(data){
            console.log("error loading invoice data")
            status = "error";
            callback(status);
        });
        invoiceData.getByFiltering("select * from invoice12thdoor where Name = '"+item.customer+"'")
    }

    function savePayment(item,callback){
        var updatePayment = $objectstore.getClient("payment");
        updatePayment.onComplete(function(data){
            callback("save");
        });
        updatePayment.onError(function(data){
            callback("error");
            $scope.progressBar = false;
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
            $scope.progressBar = false;
        });
        deletePayment.deleteSingle(item.paymentid,"paymentid");
    }

    function updateAdvancePayment(item,status){
        $scope.advenceFullArr = [];
        $scope.advancePaymentOld = {}
        $scope.advancePaymentOld = angular.copy($scope.advancePaymentData)        
        $scope.advancePaymentData.uAmount = parseInt($scope.advancePaymentData.uAmount) + parseInt(item.total);
        $scope.advancePaymentData.advancedPayment_code = "-999";
        
        if (status == "cancel") {
           $scope.advancePaymentOld.status = "cancel" 
        }else if (status == "delete") {
            $scope.advancePaymentOld.status = "delete"
        }
        $scope.advenceFullArr.push($scope.advancePaymentOld)
        $scope.advenceFullArr.push($scope.advancePaymentData) 

        var updateaAdvancePayment = $objectstore.getClient("advancedPayment12thdoor");
        updateaAdvancePayment.onComplete(function(data){
            $state.go("home");
        });

        updateaAdvancePayment.onError(function(data){
            console.log("error updating advance payment ")
            $scope.progressBar = false;
        });

        updateaAdvancePayment.insertMultiple($scope.advenceFullArr,"advancedPayment_code")
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

    $scope.leggerFullArr = [];

    function addToLegger(type,arr,amount){
        var desc = type +" payment "
        var Name = arr.Name +" "+ arr.Email

        var leggerObj = {            
            "AccountNo": arr.customerid,
            "Amount": amount,
            "Date": new Date(),
            "Description": desc,
            "ID": "-999",
            "InvoiceRefID": arr.invoiceNo,
            "Name": Name,
            "RefID": $stateParams.paymentid,
            "Type": "Receipt"
        }

        $scope.leggerFullArr.push(leggerObj)      
    }

    function deleteFunc(item){

        $scope.progressBar = true;
        reverseInvoice(item,function(reverseStatus){

            rollbackInvoicePayment(item,"delete",reverseStatus);
            function rollbackInvoicePayment(item,reverseStatus){
                if(reverseStatus = "save"){
                    removePayment(item,function(status){

                        rollbackremovePayment(item,status);
                        function rollbackremovePayment(item,status){
                            if (status == "save") {
                                updateAdvancePayment(item,"delete");  
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
        $scope.progressBar = true;
        reverseInvoice(item,"cancel",function(reverseStatus){

            rollbackInvoicePayment(item,reverseStatus);
            function rollbackInvoicePayment(item,reverseStatus){
                if(reverseStatus = "save"){
                    savePayment(item,function(status){

                        rollbackSavePayment(item,status);
                        function rollbackSavePayment(item,status){
                            if (status == "save") {
                                updateAdvancePayment(item,"cancel");
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
    // check comment label 
    $scope.CheckText = function(obj,event){
        if (obj.Commentstxt) {
            console.log('working')
            $scope.lblVisibility = 'Hidelabel';
        }else{
            $scope.lblVisibility = 'Showlabel';
        }
         event.preventDefault();
    }
    $scope.CommentEdit = function(pro,obj,index){
        $scope.ProgressBar = false;
        pro.Commentstxt = obj.Comment;
        $scope.lblVisibility = 'Hidelabel';
        $scope.CommentDelete(obj,index)
    }

    // current comment delete 
    $scope.CurrentCommentDelete = function(obj){
        obj = {};
        $scope.ProgressBar = false;
    }
    // comment delete 
    $scope.CommentDelete = function(item,index){
        var client = $objectstore.getClient("paymentComment");
        client.onComplete(function(data){

            $scope.viewPyamentArr[0].Comments.splice(index,1); //remove from array

            var toast = $mdToast.simple()
            .content('Successfully Deleted!')
            .action('OK')
            .highlightAction(false)
            .position("bottom right");
            $mdToast.show(toast).then(function() {

            });
            
        });
        client.onError(function(data){
            var toast = $mdToast.simple()
            .content('Fail to Delete')
            .action('OK')
            .highlightAction(false)
            .position("bottom right");
            $mdToast.show(toast).then(function() {

            });
        });
        client.deleteSingle(item.comment_code,"comment_code");
    }
    // comment repost 
    $scope.Repost = function(obj){              
        $scope.ProgressBar = false;
        CommentToObjectstore(obj);
    }
    // comment submit
    $scope.CommentObj = {};
    $scope.ProgressBar = false;    
    $scope.commentProgress = true;

    $scope.SaveComment = function(obj,event){
        var result = document.getElementById("CommentTxt").scrollHeight;
        $scope.Height = angular.element(result);
        
        if ((event.keyCode == 10 || event.keyCode == 13) && event.shiftKey){
            
        }else if ((event.keyCode == 10 || event.keyCode == 13) && !event.shiftKey) {
             event.preventDefault(); //prevent actions
             if (obj.Commentstxt) { // if comment is not null
                 var TodayDate = new Date();
                 $scope.UserName = "test ranawaka"
                 $scope.CommentObj = {
                    UserName : $scope.UserName,
                    TodayDate : TodayDate,
                    Comment : obj.Commentstxt,
                    paymentid : $scope.viewPyamentArr[0].paymentid,
                    textareaHeight : $scope.Height[0] + 'px;',
                    type : "comment",
                    edited : false
                 };
                 obj.Commentstxt = ""; //make textare empty
                 $scope.CommentObj.comment_code = "-999";
                 $scope.ProgressBar = true;
                CommentToObjectstore($scope.CommentObj);
            };

        };
    }

    //function to submit comment to objectstore
    function CommentToObjectstore(obj){
         var client = $objectstore.getClient("paymentComment");
         client.onComplete(function(data){
            //console.log(data.Data[0])
             obj.comment_code = data.Data[0].ID; 
             if (!$scope.viewPyamentArr[0].Comments) {
                $scope.viewPyamentArr[0].Comments = [];
                $scope.viewPyamentArr[0].Comments.unshift(obj);
             }else{
                $scope.viewPyamentArr[0].Comments.unshift(obj);                        
             }
             //console.log($scope.viewPyamentArr[0].Comments);
             obj = {};
             $scope.ProgressBar = false;

            var toast = $mdToast.simple()
            .content('Successfully Added!')
            .action('OK')
            .highlightAction(false)
            .position("bottom right");
            $mdToast.show(toast).then(function() {});

         });
         client.onError(function(data){
            var toast = $mdToast.simple()
            .content('Fail to add comment')
            .action('OK')
            .highlightAction(false)
            .position("bottom right");
            $mdToast.show(toast).then(function() {
                $scope.ProgressBar = true;
            });
         });
         client.insert(obj, {
            KeyProperty: "comment_code"
         });

    }


    function loadAllActivities(Pcode,commentArr){
        var ActivityClient = $objectstore.getClient("paymentActivity");
        ActivityClient.onGetMany(function(data){
            var fullArr = [];
            if (data.length > 0) {
                fullArr = commentArr.concat(data)
            }else{
                fullArr = data;
            }

            $scope.viewPyamentArr[0].Comments = fullArr.sort(function(a,b){
              return new Date(b.date) - new Date(a.date);
            });
            $scope.commentProgress = false;
        });
        ActivityClient.onError(function(data){
            console.log("error loading data");
        }); 
        ActivityClient.getByFiltering("select * from paymentActivity where payment_code = '"+Pcode+"'")

    }

});