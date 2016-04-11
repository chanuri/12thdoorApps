rasm.controller('emailCtrl',function($scope,obj,$objectstore,$mdDialog,$uploader,$mdToast,$DownloadPdf,UploaderService,$helpers,$sce){
 
    $scope.emailTo = [];
    $scope.emailBcc = [];
    $scope.emailSubject = "Payment No " + obj.paymentid + " " +obj.customer;
    $scope.paymentid = obj.paymentid
    $scope.pdfChipArr = [];
    $scope.pdfChipArr.push(obj.paymentid+".pdf")

    $scope.emailTo.push({
        email : obj.cusEmail,
        value : obj.customer
    })
    $scope.ContactDetails = []

    var contactClient = $objectstore.getClient("contact12thdoor");
    contactClient.onGetMany(function(data){
        for(i=0; i<=data.length-1; i++){
            $scope.ContactDetails.push({
                email : data[i].Email,
                display : data[i].Name,
                value : (data[i].Name).toLowerCase()
            })
        }
    });
    contactClient.onError(function(data){
        console.log("error loading contact details")
    });
    contactClient.getByFiltering("select * from contact12thdoor where status = 'Active'")

    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.selectedItemTo = null;
    $scope.searchTextTo = null;

    $scope.querySearch = querySearch;

    function querySearch(query) {
        var results = [];
        for (i = 0, len = $scope.ContactDetails.length; i < len; ++i) {
            if ($scope.ContactDetails[i].value.indexOf(query.toLowerCase()) != -1) 
                results.push($scope.ContactDetails[i]);
            
        }
        return results;
    }

    var emailBodyClient = $objectstore.getClient("t12thdoorSettingEmailBody")
    emailBodyClient.onGetMany(function(data){ 
        $scope.emailBody = data[0].emailBody; 
        var newOne = [];
        // newOne.push(data[0].emailBody.substring(data[0].emailBody.indexOf("{{")+2,data[0].emailBody.indexOf("}}")));
        $scope.emailBody = $scope.emailBody.replace("@@paymentNo@@", obj.paymentid);
        $scope.emailBody = $scope.emailBody.replace("@@accounturl@@", "<a style='color: blue;' href='http://12thdoor.com'>http://12thdoor.com</a>") 
        $scope.emailBody = $scope.emailBody.replace("@@companyName@@", obj.customer);
        $scope.emailBody = '<p style="font-size:15px;">' + $scope.emailBody + '</p>'
        $scope.emailBody = $sce.trustAsHtml($scope.emailBody);
        
 
    });
    emailBodyClient.onError(function(data){
        console.log("error loading email body")
    });
    emailBodyClient.getByFiltering("select * from t12thdoorSettingEmailBody where uniqueRecord ='2' ")


    $scope.closeEmail = function(){ 
        $mdDialog.hide()
    }

    var jsondata = {}
    $scope.sendEmail = function(){
        var bccArr = [];

        if ($scope.emailBcc.length > 0) {
            for(t=0; t<=$scope.emailBcc.length-1; t++){
                bccArr.push($scope.emailBcc[t].email)
            }
        }

        jsondata =  {
             "type": "email", 
             "subject": $scope.emailSubject,
             "bcc": bccArr,
             "from": "Payment <noreply-12thdoor@duoworld.com>",
             "Namespace": "com.duosoftware.com",
             "TemplateID": "T_Invoice_1",
             "DefaultParams": {
              "@@no@@": obj.paymentid,
              "@@accounturl@@": "http://12thdoor.com",
              "@@companyName@@": obj.customer
            },
             "CustomParams": {
              "@@no@@": "0001",
              "@@accounturl@@": "http://12thdoor.com",
              "@@companyName@@": "12thdoor"
            }
        }
 
        if ($scope.pdfChipArr.length == 0) {
            sendEmailBody()
        }else{            
            var sampleObj =[];
            if (obj.paidInvoice)   sampleObj = angular.copy(obj.paidInvoice);
            else    sampleObj = [];
            
            $DownloadPdf.GetPdf(obj,"email",sampleObj) 
            
            setTimeout(function(){
                var decodeUrl =UploaderService.loadPdfUrl()
                var blobFile = dataURItoBlob(decodeUrl) 
                blobFile.name = obj.paymentid+'.pdf'
                // console.log(decodeUrl)
                $uploader.uploadMedia("paymentImage",blobFile,blobFile.name);
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
    }

    function emailWithPdf(){
      jsondata.attachments = [{
        "filename": obj.paymentid+'.pdf',
        "path": "http://"+$helpers.getHost()+"/apis/media/tenant/paymentImage/"+obj.paymentid+'.pdf'
      }]
      sendEmailBody()
    }
    
    function sendEmailBody(){

        var xhttp = []
        var emailSend = false;
        

        for(em=0; em<=$scope.emailTo.length-1; em++ ){
           
            (function (em){
                xhttp[em] = new XMLHttpRequest();

                jsondata.to = $scope.emailTo[em].email; 

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
});

rasm.controller('View_Payment', function($scope, $activityLog, $objectstore,$auth, $mdDialog, $stateParams,$state,$mdToast,$http,$DownloadPdf,$mdBottomSheet) {
 
$auth.checkSession();
    $scope.viewPyamentArr = [];
    $scope.progressBar = false;
    $scope.maxNumber = 0;

    console.log( $auth.getSession())
    $scope.emailFunction = function(item){
        $mdDialog.show({
            templateUrl: 'payment_partial/paymentEmail.html',
            controller: "emailCtrl",
            locals: {
                obj: item,
            }
        })
    }

    function pdfFuntions(type, item){
        html2canvas($("#canvas"), {
            onrendered: function(canvas) {                      
            var imgData = canvas.toDataURL('image/jpeg');              
            options = {
                orientation: "0",
                unit: "mm",
                format: "a4"
            };
            var doc = new jsPDF(options, '', '', '');
            doc.addImage(imgData, 'jpeg', 0, 0, 220, 0);
            var corte = 1295; // configura tamanho do corte
            var image = new Image();
            image = Canvas2Image.convertToJPEG(canvas);

            var croppingYPosition = corte;
            var count = (image.height)/corte;
            var i =1;

            while ( i < count) {
                    doc.addPage();
 

                    var sourceX = 0;
                    var sourceY = croppingYPosition;
                    var sourceWidth = image.width;
                    var sourceHeight = corte;
                    var destWidth = sourceWidth;
                    var destHeight = sourceHeight;
                    var destX = 0;
                    var destY = 0;
                    var canvas1 = canvas;
                    canvas1.setAttribute('height', (image.height)-(corte*i));
                    canvas1.setAttribute('width', destWidth);                         
                    var ctx = canvas1.getContext("2d");
                    ctx.drawImage(image, sourceX, 
                                         sourceY,
                                         sourceWidth,
                                         sourceHeight, 
                                         destX, 
                                         destY, 
                                         destWidth, 
                                         destHeight);
                    var image2 = new Image();
                    image2 = Canvas2Image.convertToJPEG(canvas1);
                    image2Data = image2.src;
                    doc.addImage(image2Data, 'JPEG', 0, 0, 220, 0);
                    croppingYPosition += destHeight; 

                    count =  (image.height)/croppingYPosition; 
                             
                } 

                if (type == 'download')     doc.save(item.paymentid+'.pdf')
                else if (type == 'print') {
                    doc.autoPrint();
                    doc.output('dataurlnewwindow');
                }
            }
        });
    }

    $scope.downloadPdf = function(item){
        // pdfFuntions('download', item)
        var sampleObj =[];
        if (item.paidInvoice)   sampleObj = angular.copy(item.paidInvoice);
        else    sampleObj = [];

        $DownloadPdf.GetPdf(item,"download",sampleObj)
    }

    $scope.printPdf = function(item){        
        // pdfFuntions('print', item)
        var sampleObj =[];
        if (item.paidInvoice)   sampleObj = angular.copy(item.paidInvoice);
        else    sampleObj = [];
        
        $DownloadPdf.GetPdf(item,"print",sampleObj)
    } 

    function getLatestPaymentId(custID){
        var domainClient = $objectstore.getClient("payment");
        domainClient.onGetMany(function(data) {
            if (data.length > 0) {            
                data = data.sort(function(a,b){
                    return b.auotIncrement - a.auotIncrement
                })
                $scope.latestPaymentId = data[0].paymentid; 
            }else
                $scope.latestPaymentId = $scope.viewPyamentArr[0].paymentid
                   
        });
        // domainClient.getByFiltering("select * from payment where paymentStatus <> 'Cancelled' order by auotIncrement desc").skip(0).take(1);
        domainClient.getByFiltering("select * from payment where paymentStatus <> 'Cancelled' and customerid = '"+custID+"'");
    }
    

    var client = $objectstore.getClient('payment');
    client.onGetOne(function(data) {
        $scope.viewPyamentArr = [];
        if (data.paymentStatus == 'delete') 
              $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('Already Deleted').content('This record already deleted').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent());
       
        else{
            $scope.viewPyamentArr.push(data);

            $scope.advancePaymentData = {}
            getLatestPaymentId($scope.viewPyamentArr[0].customerid)

            var advanceClient = $objectstore.getClient("advancedPayments12thdoor");
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
            advanceClient.getByFiltering("select * from advancedPayments12thdoor where customerid = '"+$scope.viewPyamentArr[0].customerid+"' ");
        }

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
            if (data) 
                loadAllActivities(Pcode,data);
                       
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
            if (item.paidInvoice) {
                for(i=0; i<= item.paidInvoice.length-1; i++){
                    for(j=0; j<=data.length-1; j++ ){
                        if (data[j].invoiceNo == item.paidInvoice[i].invono) {
                            for(k=0; k<=data[j].MultiDueDAtesArr.length-1; k++ ){
                                if (data[j].MultiDueDAtesArr[k]['DueDate'] == item.paidInvoice[i].duedate) {                                   
                                    if (parseFloat(item.paidInvoice[i].balance) !=  parseFloat(data[j].MultiDueDAtesArr[k].dueDateprice) ) {
                                        
                                        data[j].MultiDueDAtesArr[k].balance = parseFloat(item.paidInvoice[i].balance)
                                        if (parseFloat(data[j].MultiDueDAtesArr[k].balance) == 0) {
                                            data[j].MultiDueDAtesArr[k].paymentStatus = "Paid"
                                        }else {
                                            data[j].MultiDueDAtesArr[k].paymentStatus = "Partially Paid"
                                        }
                                        
                                    }else{
                                        data[j].MultiDueDAtesArr[k].balance = parseFloat(item.paidInvoice[i].balance);
                                        data[j].MultiDueDAtesArr[k].paymentStatus = "Unpaid"
                                    }
                                    $scope.invoiceStatus = true;
                                    addToLegger(type,data[j].invoiceNo,item)
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
            }
            saveToLegger();
            callback(status);
        })
        invoiceData.onError(function(data){
            console.log("error loading invoice data")
            status = "error";
            callback(status);
        })
        invoiceData.getByFiltering("select * from invoice12thdoor where Name = '"+item.customer+"'")
    }

    function saveToLegger(){
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
        $scope.paymentCode = item.paymentid;
        updatePayment.insert(item, {KeyProperty: "paymentid"})
    }

    function removePayment(item,callback){
        var oldStatus = item.paymentStatus;
        item.paymentStatus = "delete";
        delete item["Comments"];

        var deletePayment = $objectstore.getClient("payment");
        deletePayment.onComplete(function(data){
            callback("save")
        });
        deletePayment.onError(function(data){
            console.log("error deleting payment");
            callback("error");
            $scope.progressBar = false;
            item.paymentStatus = oldStatus
        });
        deletePayment.insert(item,{"KeyProperty":"paymentid"});      
    }

    function updateAdvancePayment(item,status){   

        var updateaAdvancePayment = $objectstore.getClient("advancedPayments12thdoor");
        updateaAdvancePayment.onComplete(function(data){
            saveToActivityClass($scope.paymentCode,status, function(){
                $state.go("home");
            })
        });

        updateaAdvancePayment.onError(function(data){
            console.log("error updating advance payment ")
            $scope.progressBar = false;
        });

        updateaAdvancePayment.insert($scope.advancePaymentData,{"KeyProperty":"advancedPayment_code"})
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

    function addToLegger(type,invoiceNo,item){
        var desc = type +" payment "
        var Name = item.customer +" "+ item.cusEmail

        var leggerObj = {            
            "AccountNo": item.customerid,
            "Amount": item.amountReceived,
            "Date": new Date(),
            "Description": desc,
            "ID": "-999",
            "InvoiceRefID": invoiceNo,
            "Name": Name,
            "RefID": $stateParams.paymentid,
            "Type": "Receipt"
        }

        $scope.leggerFullArr.push(leggerObj)      
    }

    function deleteFunc(item){
        var advancePayment =  $scope.advancePaymentData.uAmount
        var amountReceived = parseFloat(item.amountReceived)
        var payDiff;

        item.Comments = [];
        $scope.progressBar = true;
 
        if (amountReceived <= advancePayment) {
            $scope.advancePaymentData.uAmount =  advancePayment -  amountReceived; // amount need to reduce from the advence payment  
            removePayment(item,function(status){
                updateAdvancePayment(item,"delete");
                saveToLegger()
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('Successfully Deleted').content('Successfully Deleted the record.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent());                                        
            })
            addToLegger("delete","N/A",item)

        }else{
            $scope.advancePaymentData.uAmount = 0;
            payDiff = amountReceived - advancePayment; // amount need to reduce from the invoice 
            cancelInvoice(item,payDiff,"delete")
        }        
    }

    $scope.cancelPayment = function(item,type){
        $scope.progressBar = true;
        reverseInvoice(item,type,function(reverseStatus){
            item.Comments = [];
            savePayment(item,function(status){
                updateAdvancePayment(item,type);
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('Successfully '+type).content('Successfully '+type+' the record.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent());                     
            })           
        });
    }

    $scope.cancelPayment2 = function(item){
        var advancePayment =  $scope.advancePaymentData.uAmount
        var amountReceived = parseFloat(item.amountReceived)
        var payDiff;

        item.paymentStatus = "Cancelled";        
        delete item["Comments"];

        $scope.progressBar = true;
        if (amountReceived <= advancePayment) {
            $scope.advancePaymentData.uAmount =  advancePayment -  amountReceived; // amount need to reduce from the advence payment  
            console.log($scope.advancePaymentData)
            savePayment(item,function(status){
                updateAdvancePayment(item,"cancel");
                saveToLegger()
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('Successfully Cancelled').content('Successfully Cancelled the record.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent());       
            })            
            addToLegger("delete","N/A",item)
        }else{
            $scope.advancePaymentData.uAmount = 0;
            payDiff = amountReceived - advancePayment; // amount need to reduce from the invoice 
            cancelInvoice(item,payDiff,"cancel")
        }
    }

    function cancelInvoice(item,payDiff,type){

      if (item.paidInvoice) {
            var diff;
            for(r=item.paidInvoice.length-1; r>=0; r--){           
                diff = parseFloat(item.paidInvoice[r].amount) - parseFloat(item.paidInvoice[r].balance) // amount that already paid 
                console.log("diff "+ diff)
                if (diff <= payDiff) {
                    item.paidInvoice[r].balance =item.paidInvoice[r].amount  // new balance of that invoice 
                    console.log("diff <= payDiff balance" + item.paidInvoice[r].balance)
                    payDiff = payDiff - diff
                }else if (diff > payDiff) {
                    item.paidInvoice[r].balance = parseFloat(item.paidInvoice[r].balance) + payDiff // new balance of that invoice 
                    console.log("diff > payDiff balance" + item.paidInvoice[r].balance)
                    break;
                }else break;
            }
        }
        $scope.cancelPayment(item,type)
    }

    function saveToActivityClass(pcode,type,callback){ 
        var txt;

        if (type == 'cancel') 
            txt = "Payment Cancelled By ";
        else if (type == 'delete') 
            txt = "Payment Deleted By ";
        

        $activityLog.newActivity(txt,pcode,function(status){
          if (status == "success") 
            callback()
          
        });
    }


    // check comment label 
    $scope.CheckText = function(obj,event){
        if (obj.Commentstxt) {
            console.log('working')
            $scope.lblVisibility = 'Hidelabel';
        }else
            $scope.lblVisibility = 'Showlabel';
        
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
        client.deleteSingle({"comment_code":item.comment_code},"comment_code");
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
                 $scope.UserName =  $auth.getSession().Name;
                 console.log($scope.UserName);
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
             }else
                $scope.viewPyamentArr[0].Comments.unshift(obj);                        
             
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
            if (data.length > 0) 
                fullArr = commentArr.concat(data)
            else
                fullArr = data;
             

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