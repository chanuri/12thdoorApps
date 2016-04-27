// angular.module('mainApp')
    app.controller('testCtrl', function($scope, $mdDialog, $rootScope, $objectstore, $uploader, $state, InvoiceService, item) {
        $scope.settings = {};
        $scope.UnitOfMeasure = [];
        $scope.taxType = []
        $scope.AllTaxes = [];
        $scope.individualTax = [];
         $scope.test = item;
        $scope.prevTrax = angular.copy($scope.test)

        $scope.checkAvaialability = false;

        var client = $objectstore.getClient("Settings12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                $scope.settings = data;
                for (var i = $scope.settings.length - 1; i >= 0; i--) {
                    for (var z = $scope.settings[i].preference.productpref.units.length - 1; z >= 0; z--) {
                        if ($scope.settings[i].preference.productpref.units[z].activate == true) {
                            $scope.UnitOfMeasure.push($scope.settings[i].preference.productpref.units[z])
                        }
                        $scope.ShowDiscount = $scope.settings[i].preference.invoicepref.enableDisscounts;
                        $scope.dis = $scope.settings[i].preference.invoicepref.disscountItemsOption;
                    };
                    if ($scope.settings[i].taxes) {
                        for (var x = $scope.settings[i].taxes.individualtaxes.length - 1; x >= 0; x--) {
                            $scope.individualTax.push($scope.settings[i].taxes.individualtaxes[x]);
                        };
                        for (var y = $scope.settings[i].taxes.multipletaxgroup.length - 1; y >= 0; y--) {
                            $scope.individualTax.push($scope.settings[i].taxes.multipletaxgroup[y]);
                        };
                    }
                }
            }
            $scope.AllTaxes = $scope.individualTax;
            $scope.Displaydiscount = $scope.ShowDiscount;
        });
        client.onError(function(data) {});
        client.getByFiltering("*");

        var client = $objectstore.getClient("product12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                for (var i = data.length - 1; i >= 0; i--) {
                    if(data[i].Productname.toLowerCase() == item.Productname.toLowerCase()){
                         $scope.checkAvaialability = true;

                    }
                }
        };
    });
        client.onError(function(data) {});
        client.getByFiltering("select * from product12thdoor where deleteStatus = 'false' and status = 'Active'");



        $scope.cancel = function() {
            $rootScope.taxArr1 = [];
            $mdDialog.cancel();
        };

        $scope.setTax = function(pDis) {
            for (var i = $scope.AllTaxes.length - 1; i >= 0; i--) {
                if ($scope.AllTaxes[i].taxname == pDis.tax.taxname) {
                    $scope.Ptax = ({
                        taxname: $scope.AllTaxes[i].taxname,
                        activate: $scope.AllTaxes[i].activate,
                        compound: $scope.AllTaxes[i].compound,
                        rate: $scope.AllTaxes[i].rate,
                        type: $scope.AllTaxes[i].type,
                        individualtaxes: $scope.AllTaxes[i].individualtaxes
                    });
                }
            };
            item.tax = $scope.Ptax;
        }

        $scope.edit = function(tst, index) {

            $rootScope.testArray.val.splice($rootScope.testArray.val.indexOf(tst), 1);
            InvoiceService.ReverseTax($scope.prevTrax, index);
            // console.log($scope.prevTrax);
            InvoiceService.setFullArr({
                Productname: item.Productname,
                price: item.price,
                quantity: item.quantity,
                ProductUnit: item.ProductUnit,
                discount: item.discount,
                tax: item.tax,
                olp: item.olp,
                amount: $scope.Amount,
                status: item.status
            })
            $mdDialog.cancel();
        };
        $scope.calAMount = function() {
            $scope.Amount = 0;
            $scope.total = 0;
            $scope.disc = 0;

            $scope.total = (item.price * item.quantity);

            if ($scope.dis == "Individual Items") {
                $scope.disc = parseFloat($scope.total * item.discount / 100);
                $scope.Amount = $scope.total - $scope.disc;
            } else {
                $scope.Amount = $scope.total;
            }

            return $scope.Amount;
        }
    });
    //----------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------
    app.controller('paymentCtrl', function($scope, $mdDialog, $auth, $rootScope, pim, $objectstore, $mdToast) {

        $scope.InvoiceDetails = [];
        $scope.RefID = "";
    var client = $objectstore.getClient("domainClassAttributes");
    client.onGetMany(function(data) {
        if (data) {
            $scope.InvoiceDetails = data;

            for (var i = $scope.InvoiceDetails.length - 1; i >= 0; i--) {
                $scope.ID = $scope.InvoiceDetails[i].maxCount;
            };

            if ($scope.InvoiceDetails.length == 0) 
                $scope.maxID = 1;
            else 
                $scope.maxID = parseInt($scope.ID) + 1;
            
            $scope.RefID = $scope.maxID.toString();
        }
    });
    client.getByFiltering("select maxCount from domainClassAttributes where class='payment'");

        $scope.pay = pim;
        $scope.payment = {};
        $scope.payment.paymentMethod = pim.paymentMethod
        $scope.payment.namount = 0;
        $scope.fullArr = [];
        $scope.payment.paidInvoice = [];
        $scope.payment.total = 0
        $scope.payment.customerid = pim.customerid;
        $scope.payment.amountReceived = 0;
        
        var userName = $auth.getSession().Name;

        $scope.payment.cusAddress = pim.billingAddress
        $scope.payment.cusEmail = pim.Email;

        $scope.advancedPayment = {};
        $scope.submitVisible = true;
        $scope.advancePayVisible = false;
        $scope.AdvancefullArr = [];
        $scope.maxDate = new Date(); 

        $scope.confirmOk = function(){
            if (parseFloat($scope.payment.namount) > 0) {                
                $scope.submitVisible = false;
                $scope.advancePayVisible = true;
            }else if(parseFloat($scope.payment.namount) == 0){                
                $scope.submitVisible = true;
                $scope.advancePayVisible = false;
                $scope.addPayement()
            }else if(parseFloat($scope.payment.namount) < 0){
                //create toast
            }
        }
        $scope.cancelAdvance = function(){   
            $scope.submitVisible = true;
            $scope.advancePayVisible = false;          
        }

        $scope.cancel = function() {    $mdDialog.cancel()  }

        for(j=0; j<= pim.MultiDueDAtesArr.length-1; j++){
            if (pim.MultiDueDAtesArr[j].paymentStatus == 'Partially Paid' || pim.MultiDueDAtesArr[j].paymentStatus == 'Unpaid') {
                if (pim.MultiDueDAtesArr[j].dueDateprice == "0") {
                                    
                    $scope.fullArr.push({
                        invono: pim.invoiceNo,
                        sdate: pim.Startdate,
                        duedate: pim.MultiDueDAtesArr[j].DueDate,
                        famount: pim.MultiDueDAtesArr[j].dueDateprice,
                        mduedate: pim.MultiDueDAtesArr[j].DueDate,
                        instalment: pim.finalamount,
                        termtype: pim.termtype,
                        checked: false,
                        checkDisable : false,
                        inputDisable : true
                    });
                }else{                                
                    $scope.fullArr.push({
                        invono: pim.invoiceNo,
                        sdate: pim.Startdate,
                        duedate: pim.MultiDueDAtesArr[j].DueDate,
                        famount: pim.MultiDueDAtesArr[j].dueDateprice,
                        mduedate: pim.MultiDueDAtesArr[j].DueDate,
                        instalment: pim.MultiDueDAtesArr[j].balance,
                        termtype: pim.termtype,
                        checked: false,
                        checkDisable : false,
                        inputDisable : true
                    });   
                }
            }
        }

        $scope.fullArr = $scope.fullArr.sort(function(a,b){
            return new Date(a.duedate) - new Date(b.duedate)
        })

        if ($scope.fullArr.length > 1) {
           for(i=1; i<=$scope.fullArr.length-1; i++){
                $scope.fullArr[i].checkDisable = true;
           }
        }

        $scope.checkItem = function(index,invo){
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

                invo.amount = invo.instalment;
                $scope.payment.namount = parseFloat($scope.payment.namount) - parseFloat(invo.instalment);

                $scope.payment.paidInvoice.push({ //array for insert paid invoices             
                    amount: invo.amount,
                    invono: pim.invoiceRefNo,
                    sdate: invo.sdate,
                    duedate: invo.mduedate,
                    balance : "0",
                    termtype : invo.termtype
                });

                invo.inputDisable = false;
                $scope.payment.total = (parseFloat($scope.payment.total) + parseFloat(invo.amount))

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
                        $scope.payment.total = parseFloat($scope.payment.total) - parseFloat($scope.fullArr[o].amount)
                        $scope.payment.namount = parseFloat($scope.payment.namount) + parseFloat($scope.fullArr[o].amount)  
                    }
                    else if ($scope.fullArr[o].termtype == "multipleDueDates") {
                        $scope.payment.total = parseFloat($scope.payment.total) - parseFloat($scope.fullArr[o].amount)
                        $scope.payment.namount = parseFloat($scope.payment.namount) + parseFloat($scope.fullArr[o].amount)
                    }
                    $scope.fullArr[o].amount = "";
                }
            }
        }

        $scope.netAmount = function() { 
            if( parseFloat($scope.payment.total) != 0){
                $scope.payment.namount = ( ( parseFloat($scope.payment.advancePayment) -  parseFloat($scope.payment.total) )    + parseFloat($scope.payment.amountReceived) );
            }
            else {           
                $scope.payment.namount = (parseFloat($scope.payment.advancePayment) + parseFloat($scope.payment.amountReceived));
            }
            if ($scope.payment.amountReceived == "") {
                $scope.payment.namount =   parseFloat($scope.payment.advancePayment) -  parseFloat($scope.payment.total)  
            } 
        }

        $scope.advancePaymentExsist = false;
        var paymentClient = $objectstore.getClient("advancedPayments12thdoor");
        paymentClient.onGetMany(function(data) {
            $scope.advancePaymentExsist = false;  
            if (data.length > 0)  {
                if (!data[0].uAmount)  data[0].uAmount = 0;
                $scope.payment.advancePayment =  data[0].uAmount;
                $scope.advancedPayment = data[0];  
                $scope.advancePaymentExsist = true; 
                $scope.payment.namount =  data[0].uAmount
            }else{
                $scope.payment.advancePayment =  0
            }
        });
        paymentClient.onError(function(data) {
            console.log("error loading payment details")
        });
        paymentClient.getByFiltering("select * from advancedPayments12thdoor where customerid = '"+pim.customerid+"'");

        $scope.getPaidAmount = function(obj, oldValue,e,index){
            if (obj.amount == "")   obj.amount = 0;      
            else if (oldValue == "")    oldValue = 0;       
            
            if (parseFloat(obj.amount) > parseFloat(obj.instalment)) obj.amount = oldValue

            else{

                $scope.payment.total = ( parseFloat($scope.payment.total) - parseFloat(oldValue) ) + parseFloat(obj.amount); 
                var difference = parseFloat(oldValue) - parseFloat(obj.amount);

                if ($scope.payment.namount >= 0)    $scope.payment.namount =  parseFloat($scope.payment.namount) + difference;            
                else    $scope.payment.namount = ( parseFloat($scope.payment.namount) + parseFloat(oldValue) ) - parseFloat(obj.amount);            

                for (var i = 0; i < $scope.payment.paidInvoice.length; i++) {  
                    if ( ($scope.payment.paidInvoice[i]['invono'] == obj.invono) && ($scope.payment.paidInvoice[i]['duedate'] == obj.mduedate) ) {
                        $scope.payment.paidInvoice[i].balance = parseFloat($scope.payment.paidInvoice[i].amount) - parseFloat(obj.amount);
                    }
                } 
            }
            if (parseFloat(obj.amount) < parseFloat(obj.instalment) ){
                if ($scope.fullArr[index +1]) {
                    if ($scope.fullArr[index].invono == $scope.fullArr[index +1].invono) {
                        $scope.fullArr[index + 1].checkDisable = true;
                    }                    
                }
            }else if(parseFloat(obj.amount) == parseFloat(obj.instalment)){
                if ($scope.fullArr[index +1]) {
                    $scope.fullArr[index + 1].checkDisable = false;
                }
            }
        }


        $scope.addPayement = function(){
            $scope.payment.favoritestar = false;
            $scope.payment.favouriteStarNo = 1; 
            $scope.payment.paymentid = "-999";
            $scope.payment.paymentStatus = "active";
            $scope.payment.paymentref = $scope.RefID;
        $scope.payment.auotIncrement = parseInt($scope.RefID);
            $scope.payment.customer = pim.Name; 
            $scope.payment.date = new Date();     
            $scope.payment.UploadImages = {
                val: []
            };
            $scope.payment.custField = []; 

            $scope.advancedPayment.uAmount = $scope.payment.namount;
            if (!$scope.advancePaymentExsist) {

                $scope.advancedPayment.name = $scope.payment.customer +' '+pim.Email;
                $scope.advancedPayment.customer = $scope.payment.customer;            
                $scope.advancedPayment.customerid = pim.customerid;
                $scope.advancedPayment.advancedPayment_code = "-999";

            }  

            $scope.submitVisible = true;
            $scope.advancePayVisible = false;
            savePaymentToObjectstore(function(){
                saveAdvancePaymentToObjectstore(function(){
                    updateInvoice(function(){                            
                       $mdDialog.hide();
                    });
                }); // save payment and advance payment 
            })
        }

        function savePaymentToObjectstore(callback){

            var activityObj = {
            UserName : userName,
            TodayDate : new Date(),
            Comment : 'Payment added by'+" "+userName,
            payment_code :$scope.RefID,
            textareaHeight : '30px;',
            activity_code : "-999",
            type : "activity"
        };

        console.log(activityObj)

            var payment = $objectstore.getClient("payment");
            var activityClient = $objectstore.getClient("paymentActivity");
            payment.onComplete(function(data){
                $scope.savePaymentId = data.Data[0].ID;
                callback();
                $mdToast.show(
                      $mdToast.simple()
                        .textContent('Payment Successfully Done')
                        .position('bottom right')
                        .theme('success-toast')
                        .hideDelay(2000)
                    );

                activityClient.onComplete(function(data){
                console.log("activity Successfully added")
            });
                activityClient.insert(activityObj, {KeyProperty:'activity_code'})
            activityClient.onError(function(data){
                console.log("error Adding new activity")
                });
            });
            payment.onError(function(data){
                console.log("error saving payment");
                callback();
            });
            payment.insert($scope.payment, {KeyProperty: "paymentid"})
            
            
        }

        function saveAdvancePaymentToObjectstore(callback){
            // $scope.AdvancefullArr.push($scope.advancedPayment)
            var paymentSave = $objectstore.getClient("advancedPayments12thdoor");
            paymentSave.onComplete(function(data){
                callback();
            });
            paymentSave.onError(function(data){
                console.log("error saving Advanced payment");
                callback();
            });
            paymentSave.insert($scope.advancedPayment,{"KeyProperty":"advancedPayment_code"}); 
        }
       
        function updateInvoice(callback){
            for(kal=0; kal<=pim.MultiDueDAtesArr.length-1; kal++){
                for(pay=0; pay<=$scope.payment.paidInvoice.length-1; pay++){

                    if (pim.MultiDueDAtesArr[kal]['DueDate'] == $scope.payment.paidInvoice[pay].duedate) {

                        if ($scope.payment.paidInvoice[pay].termtype == "multipleDueDates") {
                            if ( parseFloat($scope.payment.paidInvoice[pay].balance) != 0) {
                                    pim.MultiDueDAtesArr[kal]['balance'] = parseFloat($scope.payment.paidInvoice[pay].balance);                                    
                                    pim.MultiDueDAtesArr[kal]['paymentStatus'] = "Partially Paid";
                                    pim.commentsAndHistory.push({
                                        "date": new Date(),
                                        "done": false,
                                        "text": parseInt($scope.payment.paidInvoice[pay].amount - $scope.payment.paidInvoice[pay].balance) +" " + "of partial payment done by"+" "+userName,
                                        "type":"Auto",
                                        "RefID":$scope.RefID
                                    }) 
                                    
                                }else if (parseFloat($scope.payment.paidInvoice[pay].balance) == 0) {
                                    pim.MultiDueDAtesArr[kal]['paymentStatus'] = "Paid"; 
                                    pim.MultiDueDAtesArr[kal]['balance'] = 0;
                                    pim.commentsAndHistory.push({
                                        "date": new Date(),
                                        "done": false,
                                        "text": parseInt($scope.payment.paidInvoice[pay].amount - $scope.payment.paidInvoice[pay].balance) +" " +" of payment done by"+" "+userName,
                                        "type":"Auto",
                                        "RefID":$scope.RefID
                                    })                              
                                }

                        }else{
                                // console.log($scope.payment.paidInvoice[pay].amount)
                            if ( parseFloat($scope.payment.paidInvoice[pay].balance) != 0) {
                                pim.MultiDueDAtesArr[kal]['dueDateprice'] = parseFloat($scope.payment.paidInvoice[pay].amount);                                    
                                pim.MultiDueDAtesArr[kal]['balance'] = parseFloat($scope.payment.paidInvoice[pay].balance);                                    
                                pim.MultiDueDAtesArr[kal]['paymentStatus'] = "Partially Paid";
                                pim.commentsAndHistory.push({
                                    "date": new Date(),
                                    "done": false,
                                    "text": parseInt($scope.payment.paidInvoice[pay].amount - $scope.payment.paidInvoice[pay].balance) +" " + "of partial payment done by"+" "+userName,
                                    "type":"Auto",
                                    "RefID":$scope.RefID
                                }) 

                            }else if (parseFloat($scope.payment.paidInvoice[pay].balance) == 0) {
                                pim.MultiDueDAtesArr[kal]['dueDateprice'] = parseFloat($scope.payment.paidInvoice[pay].amount);
                                pim.MultiDueDAtesArr[kal]['paymentStatus'] = "Paid"; 
                                pim.MultiDueDAtesArr[kal]['balance'] = 0;
                                pim.commentsAndHistory.push({
                                    "date": new Date(),
                                    "done": false,
                                    "text": parseInt($scope.payment.paidInvoice[pay].amount - $scope.payment.paidInvoice[pay].balance) +" " + "of payment done by"+" "+userName,
                                    "type":"Auto",
                                    "RefID":$scope.RefID
                                })                   
                            }
                        }
                    }
                }
            }
            var client = $objectstore.getClient("invoice12thdoor");
            client.onComplete(function(data) {
                addTOLegger(data.Data[0].ID)
                callback("success")
            })
            client.onError(function(data) {
                console.log("error updating invoice");
            })
            if(pim.invoiceNo == "-999"){
                pim.invoiceNo = pim.invoiceRefNo.toString(); 
            }else{
               pim.invoiceNo = pim.invoiceNo.toString(); 
            }
            
            client.insert(pim, {KeyProperty: "invoiceNo"})
        }

        function addTOLegger(invoiceID){
            var leggerObj = {            
                "AccountNo": pim.customerid,
                "Amount": $scope.payment.total,
                "Date": new Date(),
                "Description": "Payment added",
                "ID": "-999",
                "InvoiceRefID": pim.invoiceNo,
                "Name": pim.Name,
                "RefID": $scope.RefID,
                "Type": "Receipt"
            }

            var leggerClient = $objectstore.getClient("leger12thdoor");
            leggerClient.onComplete(function(data) {
            });
            leggerClient.onError(function(data) {
                console.log("error updating legger");
            });
            leggerClient.insert(leggerObj, {
                KeyProperty: "ID"
            });
        }

    });
    //-------------------------------------------------------------------------------------------------------  
    //------------------------------------------------------------------------------------------------------
    app.controller('UploadCtrl', function($scope, $mdDialog, $rootScope, $state, UploaderService,item,$objectstore) {
        console.log(item)
        $scope.uploadimages = {
            val: []
        };
        $scope.uploadimages.val = UploaderService.loadBasicArray();
        //directive table content start
        $scope.$on('viewRecord', function(event, args) {
            $scope.uploadimages.val.splice(args, 1);
        });

        $scope.AddImage = function() {
            $scope.uploadimages.val = UploaderService.loadBasicArray();
            $mdDialog.cancel();
        }
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        // $scope.FullImage = {};
        // $scope.fileExt = 'png'
        // var client = $objectstore.getClient("invoiceUploades");
        // client.onGetOne(function(data){
        //     console.log(data)
        //     if (data) {
        //         $scope.FullImage = data
        //         $scope.fileExt = data.FileName.split('.').pop()
        //     }

        // });
        // client.onError(function(data){
        //     console.log("error loading the image")
        // });
        // client.getByKey(item.name);
    });
    //--------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------
    app.controller('ViewUploadCtrl', function($scope, $mdDialog, $rootScope, $state, UploaderService,item,$objectstore) {
        console.log(item)
       
        //directive table content start
        $scope.$on('viewRecord', function(event, args) {
            $scope.uploadimages.val.splice(args, 1);
        });

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.FullImage = {};
        $scope.fileExt = 'png'
        var client = $objectstore.getClient("invoiceUploades");
        client.onGetOne(function(data){
            console.log(data)
            if (data) {
                $scope.FullImage = data
                $scope.fileExt = data.FileName.split('.').pop()
            }

        });
        client.onError(function(data){
            console.log("error loading the image")
        });
        client.getByKey(item.name);
    });

    //---------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------
    app.factory('InvoiceService', function($rootScope) {
        $rootScope.testArray = {val: []};
        $rootScope.editProdArray = {val: []};
        $rootScope.showprodArray = {val: []};
        $rootScope.fullArr = {val: []};
        $rootScope.taxArr = [];
        $rootScope.taxArr1 = [];
        $rootScope.correctArr = [];
        $rootScope.compoundcal = [];

        $rootScope.setTempArr = {val: []};

        $rootScope.calTax = [];
        $rootScope.correctArr1 = [];
        $rootScope.calCompound = [];
        $rootScope.trueComp = [];
        $rootScope.falseComp = [];
        $rootScope.compountTrue = [];
        $rootScope.calculateCompound = [];

        return {
            setArray: function(newVal) {
                $rootScope.testArray.val.push(newVal);
                return $rootScope.testArray;
            },
            removeArray: function(newVals) {
                $rootScope.testArray.val.splice(newVals, 1);
                return $rootScope.testArray;
            },
            setArray2: function(newVal) {
                $rootScope.editProdArray.val.push(newVal);
                return $rootScope.editProdArray;
            },
            removeArray2: function(newVals) {
                $rootScope.editProdArray.val.splice(newVals, 1);
                return $rootScope.editProdArray;
            },
            setArrayview: function(val, arr) {
                arr.push(val);
                return arr;
            },
            seteditArrayView: function(vall, arry) {
                arry.push(vall);
                return arry;
            },
            setFullArr: function(obj) {
                 this.setArray(obj);
                $rootScope.correctArr = [];
                $rootScope.multiTax = [];
                $rootScope.total = 0;
                $rootScope.getFamount = 0;
                $rootScope.compoundcal = [];
                $rootScope.calculateCompound = [];
                $rootScope.falseComp = [];
                $rootScope.trueComp = [];

                if (obj.tax != null) {
                    if (obj.tax.type == "individualtaxes") {
                        if (obj.tax.rate == 0) {

                        } else {
                           
                            $rootScope.taxArr.push({
                                taxName: obj.tax.taxname,
                                rate: obj.tax.rate,
                                salesTax: parseFloat((obj.amount-(obj.amount * $rootScope.adddiscount/100))*(obj.tax.rate)/100),
                                compoundCheck: obj.tax.compound,
                                positionID: obj.tax.positionId
                            })  
                        }
                    } else if (obj.tax.type == "multipletaxgroup") {
                        for (var x = obj.tax.individualtaxes.length - 1; x >= 0; x--) {

                            if (obj.tax.individualtaxes[x].compound == false) {
                                $rootScope.falseComp.push(obj.tax.individualtaxes[x]);
                            } else if (obj.tax.individualtaxes[x].compound == true) {
                                $rootScope.trueComp.push(obj.tax.individualtaxes[x])
                                $rootScope.compountTrue = $rootScope.trueComp.sort(function(a, b) {
                                    return a.positionId > b.positionId ? 1 : a.positionId < b.positionId ? -1 : 0;
                                });
                            }
                        }
                        $rootScope.calculateCompound = $rootScope.falseComp.concat($rootScope.compountTrue);
                        var tcopmAmount = 0;
                        var fcompAmount = 0;
                        var finalCal = 0;
                        for (var y = 0; y <= $rootScope.calculateCompound.length - 1; y++) {
                            
                            if ($rootScope.calculateCompound[y].compound == false) {
                                fcompAmount = parseFloat(obj.amount * $rootScope.calculateCompound[y].rate / 100)
                                $rootScope.total = fcompAmount;
                                $rootScope.getFamount += fcompAmount;
                            } else if ($rootScope.calculateCompound[y].compound == true) {
                                tcopmAmount = parseFloat($rootScope.getFamount + obj.amount);
                                finalCal = (parseFloat(finalCal + tcopmAmount) * $rootScope.calculateCompound[y].rate / 100);
                                $rootScope.total = finalCal;
                            }
                            if ($rootScope.calculateCompound[y].rate == 0) {

                            } else {
                                $rootScope.taxArr.push({
                                    taxName: $rootScope.calculateCompound[y].taxname,
                                    rate: $rootScope.calculateCompound[y].rate,
                                    salesTax: $rootScope.total,
                                    compoundCheck: $rootScope.calculateCompound[y].compound,
                                    positionID: $rootScope.calculateCompound[y].positionId
                                })
                                console.log($rootScope.taxArr)
                            }
                        }
                    }
                      $rootScope.taxArr = $rootScope.taxArr.sort(function(a, b) {
                       return a.taxName.toLowerCase() > b.taxName.toLowerCase() ? 1 : a.taxName.toLowerCase() < b.taxName.toLowerCase() ? -1 : 0;
                    });

                    if ($rootScope.taxArr.length > 1) {

                        for (l = 0; l <= $rootScope.taxArr.length - 1; l++) {
                            if ($rootScope.taxArr[l + 1]) {

                                if ($rootScope.taxArr[l].taxName == $rootScope.taxArr[l + 1].taxName) {
                                    var sumSalesTax = 0;
                                    var txtName = $rootScope.taxArr[l].taxName;
                                    var rate = $rootScope.taxArr[l].rate;
                                    var compound = $rootScope.taxArr[l].compoundCheck;
                                    var pId = $rootScope.taxArr[l].positionID;
                                    sumSalesTax = $rootScope.taxArr[l].salesTax + $rootScope.taxArr[l + 1].salesTax;

                                    $rootScope.taxArr.splice(l, 2);
                                    $rootScope.taxArr.push({
                                        taxName: txtName,
                                        rate: rate,
                                        salesTax: sumSalesTax,
                                        compoundCheck: compound,
                                        positionID:pId
                                    })
                                     $rootScope.taxArr = $rootScope.taxArr.sort(function(a, b) {
                                       return a.positionID > b.positionID ? 1 : a.positionID < b.positionID ? -1 : 0;
                                    });
                                }
                            };
                        }
                        $rootScope.taxArr.sort(function(a, b) {
                            return a.positionID > b.positionID ? 1 : a.positionID < b.positionID ? -1 : 0;
                        }); 
                    }
                }
            },
            setFullArr1: function(obj) {
                // this.setArray(obj);
                $rootScope.correctArr = [];
                $rootScope.multiTax = [];
                $rootScope.total = 0;
                $rootScope.getFamount = 0;
                $rootScope.compoundcal = [];
                $rootScope.calculateCompound = [];
                $rootScope.falseComp = [];
                $rootScope.trueComp = [];
                
                if (obj.tax != null) {
                    if (obj.tax.type == "individualtaxes") {
                        if (obj.tax.rate == 0) {} else {
                            $rootScope.taxArr.push({
                                taxName: obj.tax.taxname,
                                rate: obj.tax.rate,
                                salesTax: parseFloat(obj.amount * obj.tax.rate / 100),
                                compoundCheck: obj.tax.compound,
                                positionID: obj.tax.positionId
                            })

                            console.log($rootScope.taxArr)
                        }
                    } else if (obj.tax.type == "multipletaxgroup") {
                        for (var x = obj.tax.individualtaxes.length - 1; x >= 0; x--) {

                            if (obj.tax.individualtaxes[x].compound == false) {
                                $rootScope.falseComp.push(obj.tax.individualtaxes[x]);
                            } else if (obj.tax.individualtaxes[x].compound == true) {
                                $rootScope.trueComp.push(obj.tax.individualtaxes[x])
                                $rootScope.compountTrue = $rootScope.trueComp.sort(function(a, b) {
                                    return a.positionId > b.positionId ? 1 : a.positionId < b.positionId ? -1 : 0;
                                });
                            }
                        }
                        $rootScope.calculateCompound = $rootScope.falseComp.concat($rootScope.compountTrue);
                        var tcopmAmount = 0;
                        var fcompAmount = 0;
                        var finalCal = 0;
                        for (var y = 0; y <= $rootScope.calculateCompound.length - 1; y++) {
                            
                            if ($rootScope.calculateCompound[y].compound == false) {
                                fcompAmount = parseFloat(obj.amount * $rootScope.calculateCompound[y].rate / 100)
                                $rootScope.total = fcompAmount;
                                $rootScope.getFamount += fcompAmount;
                            } else if ($rootScope.calculateCompound[y].compound == true) {
                                tcopmAmount = parseFloat($rootScope.getFamount + obj.amount);
                                finalCal = (parseFloat(finalCal + tcopmAmount) * $rootScope.calculateCompound[y].rate / 100);
                                $rootScope.total = finalCal;
                            }
                            if ($rootScope.calculateCompound[y].rate == 0) {

                            } else {
                                $rootScope.taxArr.push({
                                    taxName: $rootScope.calculateCompound[y].taxname,
                                    rate: $rootScope.calculateCompound[y].rate,
                                    salesTax: $rootScope.total,
                                    compoundCheck: $rootScope.calculateCompound[y].compound,
                                     positionID: $rootScope.calculateCompound[y].positionId
                                })
                                console.log($rootScope.taxArr)
                            }
                        }
                    }
                    $rootScope.taxArr = $rootScope.taxArr.sort(function(a, b) {
                        return a.taxName.toLowerCase() > b.taxName.toLowerCase() ? 1 : a.taxName.toLowerCase() < b.taxName.toLowerCase() ? -1 : 0;
                    });

                    if ($rootScope.taxArr.length > 1) {
                        for (l = 0; l <= $rootScope.taxArr.length - 1; l++) {
                            if ($rootScope.taxArr[l + 1]) {

                                if ($rootScope.taxArr[l].taxName == $rootScope.taxArr[l + 1].taxName) {
                                    var sumSalesTax = 0;
                                    var txtName = $rootScope.taxArr[l].taxName;
                                    var rate = $rootScope.taxArr[l].rate;
                                    var compound = $rootScope.taxArr[l].compoundCheck;
                                    var pId = $rootScope.taxArr[l].positionID;
                                    sumSalesTax = $rootScope.taxArr[l].salesTax + $rootScope.taxArr[l + 1].salesTax;

                                    $rootScope.taxArr.splice(l, 2);
                                    $rootScope.taxArr.push({
                                        taxName: txtName,
                                        rate: rate,
                                        salesTax: sumSalesTax,
                                        compoundCheck: compound,
                                        positionID:pId
                                    })
                                     $rootScope.taxArr = $rootScope.taxArr.sort(function(a, b) {
                                       return a.positionID > b.positionID ? 1 : a.positionID < b.positionID ? -1 : 0;
                                    });
                                }
                            };
                        }
                        $rootScope.taxArr.sort(function(a, b) {
                            return a.positionID > b.positionID ? 1 : a.positionID < b.positionID ? -1 : 0;
                        }); 
                    }
                }
            },
            ReverseTax: function(obj, index) {
                var arr = [];
                var results = [];
                $rootScope.compoundcal = [];
                $rootScope.calculateCompound = [];
                $rootScope.falseComp = [];
                $rootScope.trueComp = [];
                var tcopmAmount = 0;
                var fcompAmount = 0;
                var finalCal = 0;
                var tax = 0;
                for (var i = $rootScope.testArray.val.length - 1; i >= 0; i--) {

                    if ($rootScope.testArray.val[i].tax.type == "individualtaxes") {
                        arr.push($rootScope.testArray.val[i].tax.taxname)

                    } else if ($rootScope.testArray.val[i].tax.type == "multipletaxgroup") {
                        for (var x = $rootScope.testArray.val[i].tax.individualtaxes.length - 1; x >= 0; x--) {
                            arr.push($rootScope.testArray.val[i].tax.individualtaxes[x].taxname)
                        }
                    }
                }

                var sorted_arr = arr.sort();
                var results = [];
                for (var i = 0; i < arr.length - 1; i++) {
                    if (sorted_arr[i + 1] == sorted_arr[i]) {
                        results.push(sorted_arr[i]);
                    }
                }
                if (obj.tax.type == "individualtaxes") {

                    for (var x = $rootScope.taxArr.length - 1; x >= 0; x--) {

                        if ($rootScope.taxArr[x].taxName == obj.tax.taxname) {

                            if ($.inArray(obj.tax.taxname, results) == -1) {
                                $rootScope.taxArr.splice(x, 1);

                            } else if ($.inArray(obj.tax.taxname, results) == 0) {
                                $rootScope.taxArr[x].salesTax = parseFloat($rootScope.taxArr[x].salesTax) - parseFloat(obj.amount * obj.tax.rate / 100);
                            }
                        }
                    }
                } else if (obj.tax.type == "multipletaxgroup") {
                    for (var x = obj.tax.individualtaxes.length - 1; x >= 0; x--) {

                        if (obj.tax.individualtaxes[x].compound == false) {
                            $rootScope.falseComp.push(obj.tax.individualtaxes[x]);

                        } else if (obj.tax.individualtaxes[x].compound == true) {
                            $rootScope.trueComp.push(obj.tax.individualtaxes[x])
                            $rootScope.compountTrue = $rootScope.trueComp.sort(function(a, b) {
                                return a.positionId > b.positionId ? 1 : a.positionId < b.positionId ? -1 : 0;
                            });
                        }
                    }
                    $rootScope.calculateCompound = $rootScope.falseComp.concat($rootScope.compountTrue);
                        var fcompAmount = 0;
                        var taxAmount = 0;
                    for (var x = 0; x <= obj.tax.individualtaxes.length - 1; x++) {

                        tax = obj.tax.individualtaxes[x].rate / 100;
                        for (var y = $rootScope.taxArr.length - 1; y >= 0; y--) {

                            if ($rootScope.taxArr[y].taxName == obj.tax.individualtaxes[x].taxname) {

                                for(ps=0; ps <= results.length; ps++){
                                    if (results[ps] == obj.tax.individualtaxes[x].taxname) {
                                           for (var z = $rootScope.calculateCompound.length - 1; z >= 0; z--) {
                                            if ($rootScope.calculateCompound[z].compound == false) {
                                                 fcompAmount = parseFloat(obj.amount * obj.tax.individualtaxes[z].rate / 100)
                                                    }
                                                }
                                                
                                            if(obj.tax.individualtaxes[x].compound == false){
                                                $rootScope.taxArr[y].salesTax = parseFloat($rootScope.taxArr[y].salesTax - (obj.amount * obj.tax.individualtaxes[x].rate / 100));
                                                results.splice(ps, 1);
                                            }else if (obj.tax.individualtaxes[x].compound == true){
                                                tcopmAmount = parseFloat(fcompAmount + obj.amount);
                                                finalCal = (parseFloat(finalCal + tcopmAmount) * obj.tax.individualtaxes[x].rate / 100);
                                                    
                                                $rootScope.taxArr[y].salesTax = parseFloat($rootScope.taxArr[y].salesTax - finalCal);
                                            }

                                    } else if ($.inArray(obj.tax.individualtaxes[x].taxname, results) == -1) {
                                        $rootScope.taxArr.splice(y, 1);
                                    }                                        
                                }
                            }
                        }
                    }
                }
            },

            setTempArr : function(obj){
            this.setArray2(obj);
           $rootScope.correctArr = [];
                $rootScope.multiTax = [];
                $rootScope.total = 0;
                $rootScope.compoundcal = [];
                $rootScope.calculateCompound = [];
                $rootScope.falseComp = [];
                $rootScope.trueComp = [];
                $rootScope.getFamount = 0;

                if (obj.tax != null) {
                    if (obj.tax.type == "individualtaxes") {
                        if (obj.tax.rate == 0) {} else {
                            $rootScope.taxArr1.push({
                                taxName: obj.tax.taxname,
                                rate: obj.tax.rate,
                                salesTax: parseFloat(obj.amount * obj.tax.rate / 100),
                                compoundCheck: obj.tax.compound
                            })
                        }
                    } else if (obj.tax.type == "multipletaxgroup") {
                        for (var x = obj.tax.individualtaxes.length - 1; x >= 0; x--) {

                            if (obj.tax.individualtaxes[x].compound == false) {
                                $rootScope.falseComp.push(obj.tax.individualtaxes[x]);
                            } else if (obj.tax.individualtaxes[x].compound == true) {
                                $rootScope.trueComp.push(obj.tax.individualtaxes[x])
                                $rootScope.compountTrue = $rootScope.trueComp.sort(function(a, b) {
                                    return a.positionId > b.positionId ? 1 : a.positionId < b.positionId ? -1 : 0;
                                });
                            }
                        }
                        $rootScope.calculateCompound = $rootScope.falseComp.concat($rootScope.compountTrue);
                        var tcopmAmount = 0;
                        var fcompAmount = 0;
                        var finalCal = 0;
                        for (var y = 0; y <= $rootScope.calculateCompound.length - 1; y++) {
                            
                            if ($rootScope.calculateCompound[y].compound == false) {
                                fcompAmount = parseFloat(obj.amount * $rootScope.calculateCompound[y].rate / 100)
                                $rootScope.total = fcompAmount;
                           $rootScope.getFamount += fcompAmount;
                            } else if ($rootScope.calculateCompound[y].compound == true) {
                                tcopmAmount = parseFloat($rootScope.getFamount + obj.amount);
                                finalCal = (parseFloat(finalCal + tcopmAmount) * $rootScope.calculateCompound[y].rate / 100);
                                $rootScope.total = finalCal;
                            }
                            if ($rootScope.calculateCompound[y].rate == 0) {

                            } else {
                                $rootScope.taxArr1.push({
                                    taxName: $rootScope.calculateCompound[y].taxname,
                                    rate: $rootScope.calculateCompound[y].rate,
                                    salesTax: $rootScope.total,
                                    compoundCheck: $rootScope.calculateCompound[y].compound
                                })
                                console.log($rootScope.taxArr1)
                            }
                        }
                    }
                    $rootScope.taxArr1 = $rootScope.taxArr1.sort(function(a, b) {
                        return a.taxName.toLowerCase() > b.taxName.toLowerCase() ? 1 : a.taxName.toLowerCase() < b.taxName.toLowerCase() ? -1 : 0;
                    });

                    if ($rootScope.taxArr1.length > 1) {
                        for (l = 0; l <= $rootScope.taxArr1.length - 1; l++) {
                            if ($rootScope.taxArr1[l + 1]) {

                                if ($rootScope.taxArr1[l].taxName == $rootScope.taxArr1[l + 1].taxName) {
                                    var sumSalesTax = 0;
                                    var txtName = $rootScope.taxArr1[l].taxName;
                                    var rate = $rootScope.taxArr1[l].rate;
                                    var compound = $rootScope.taxArr1[l].compoundCheck;
                                    sumSalesTax = $rootScope.taxArr1[l].salesTax + $rootScope.taxArr1[l + 1].salesTax;

                                    $rootScope.taxArr1.splice(l, 2);
                                    $rootScope.taxArr1.push({
                                        taxName: txtName,
                                        rate: rate,
                                        salesTax: sumSalesTax,
                                        compoundCheck: compound
                                    })
                                    $rootScope.taxArr1.sort(function(a, b) {
                                        return a.taxName.toLowerCase() > b.taxName.toLowerCase() ? 1 : a.taxName.toLowerCase() < b.taxName.toLowerCase() ? -1 : 0;
                                    });
                      
                            };
                        };                  
                    }    
                }
             } 
        },
        ReverseEditTax: function(obj, index) {
                var arr = [];
                var results = [];
                $rootScope.compoundcal = [];
                $rootScope.calculateCompound = [];
                $rootScope.falseComp = [];
                $rootScope.trueComp = [];
                var tcopmAmount = 0;
                var fcompAmount = 0;
                var finalCal = 0;
                var tax = 0;
               
                    for (var x = $rootScope.invoiceArray[0].invoiceProducts.length - 1; x >= 0; x--) {

                        if ($rootScope.invoiceArray[0].invoiceProducts[x].tax.type == "individualtaxes") {
                        arr.push($rootScope.invoiceArray[0].invoiceProducts[x].tax.taxname)

                    } else if ($rootScope.invoiceArray[0].invoiceProducts[x].tax.type == "multipletaxgroup") {
                        for (var y = $rootScope.invoiceArray[0].invoiceProducts[x].tax.individualtaxes.length - 1; y >= 0; y--) {
                            arr.push($rootScope.invoiceArray[0].invoiceProducts[x].tax.individualtaxes[y].taxname)
                        }
                    }
                    }

                var sorted_arr = arr.sort();
                var results = [];
                for (var i = 0; i < arr.length - 1; i++) {
                    if (sorted_arr[i + 1] == sorted_arr[i]) {
                        results.push(sorted_arr[i]);
                    }
                }
                if (obj.tax.type == "individualtaxes") {
                    for (var x = $rootScope.taxArr1.length - 1; x >= 0; x--) {

                        if ($rootScope.taxArr1[x].taxName == obj.tax.taxname) {

                            if ($.inArray(obj.tax.taxname, results) == -1) {
                                $rootScope.taxArr1.splice(x, 1);

                            } else if ($.inArray(obj.tax.taxname, results) == 0) {
                                $rootScope.taxArr1[x].salesTax = parseFloat($rootScope.taxArr1[x].salesTax) - parseFloat(obj.amount * obj.tax.rate / 100);
                            }
                        }
                    }
                } else if (obj.tax.type == "multipletaxgroup") {
                    for (var x = obj.tax.individualtaxes.length - 1; x >= 0; x--) {

                        if (obj.tax.individualtaxes[x].compound == false) {
                            $rootScope.falseComp.push(obj.tax.individualtaxes[x]);

                        } else if (obj.tax.individualtaxes[x].compound == true) {
                            $rootScope.trueComp.push(obj.tax.individualtaxes[x])
                            $rootScope.compountTrue = $rootScope.trueComp.sort(function(a, b) {
                                return a.positionId > b.positionId ? 1 : a.positionId < b.positionId ? -1 : 0;
                            });
                        }
                    }
                    $rootScope.calculateCompound = $rootScope.falseComp.concat($rootScope.compountTrue);
                        var fcompAmount = 0;
                        var taxAmount = 0;
                    for (var x = 0; x <= obj.tax.individualtaxes.length - 1; x++) {

                        tax = obj.tax.individualtaxes[x].rate / 100;
                        for (var y = $rootScope.taxArr1.length - 1; y >= 0; y--) {

                            if ($rootScope.taxArr1[y].taxName == obj.tax.individualtaxes[x].taxname) {

                                for(ps=0; ps <= results.length; ps++){
                                    if (results[ps] == obj.tax.individualtaxes[x].taxname) {
                                           for (var z = $rootScope.calculateCompound.length - 1; z >= 0; z--) {
                                            if ($rootScope.calculateCompound[z].compound == false) {
                                                 fcompAmount = parseFloat(obj.amount * obj.tax.individualtaxes[z].rate / 100)
                                                    }
                                                }
                                                
                                            if(obj.tax.individualtaxes[x].compound == false){
                                                $rootScope.taxArr1[y].salesTax = parseFloat($rootScope.taxArr1[y].salesTax - (obj.amount * obj.tax.individualtaxes[x].rate / 100));
                                                results.splice(ps, 1);
                                            }else if (obj.tax.individualtaxes[x].compound == true){
                                                tcopmAmount = parseFloat(fcompAmount + obj.amount);
                                                finalCal = (parseFloat(finalCal + tcopmAmount) * obj.tax.individualtaxes[x].rate / 100);
                                                    
                                                $rootScope.taxArr1[y].salesTax = parseFloat($rootScope.taxArr1[y].salesTax - finalCal);
                                            }

                                    } else if ($.inArray(obj.tax.individualtaxes[x].taxname, results) == -1) {
                                        $rootScope.taxArr1.splice(y, 1);
                                    }                                        
                                }
                            }
                        }
                    }
                }
            },

        }
          
    });
    //------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------
    app.factory('MultipleDudtesService', function($rootScope) {
        $rootScope.dateArray = {
            val: []
        };
        $rootScope.getDateArr = {
            val: []
        };
        $rootScope.showmsg = false;
        return {
            setDateArray: function(newVal) {
                $rootScope.dateArray.val.push(newVal);
                return $rootScope.dateArray;
            },
            removeDateArray: function(newVals) {
                $rootScope.dateArray.val.splice(newVals, 1);
                return $rootScope.dateArray;
            },

            calDateArray: function(val) {
                $rootScope.showmsg = false;
                $rootScope.calPercentatge = 0;
                for (var i = $rootScope.checkArr.length - 1; i >= 0; i--) {
                    $rootScope.calPercentatge += parseFloat($rootScope.checkArr[i].percentage);
                };
                if ($rootScope.calPercentatge == 100) {
                    this.setDateArray(val);
                } else {
                    $rootScope.showmsg = true;
                }
            },

            editDateArray: function(val) {
                $rootScope.showmsg = false;
                $rootScope.calPercentatge = 0;
                $rootScope.oldPercentage = 0;

                for (var i = $rootScope.dateArray.val.length - 1; i >= 0; i--) {
                    $rootScope.oldPercentage += parseFloat($rootScope.dateArray.val[i].Percentage);
                }


                for (var i = $rootScope.checkArr.length - 1; i >= 0; i--) {
                    $rootScope.calPercentatge += parseFloat($rootScope.checkArr[i].percentage);
                };
                this.setDateArray(val);
                if ($rootScope.calPercentatge + $rootScope.oldPercentage == 100) {

                } else {
                    $rootScope.showmsg = true;
                }
            }
        }
    });
    //-----------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------
    app.factory('invoiceDetails', function($rootScope) {
        $rootScope.invoiceArray = [];
        $rootScope.invoiceArray2 = [];
        return {
            setArray: function(newVal) {
                $rootScope.invoiceArray.push(newVal);
                return $rootScope.invoiceArray;
            },
            removeArray: function(newVals) {
                $rootScope.invoiceArray.splice(newVals, 1);
                return $rootScope.invoiceArray;
            },
            setArray1: function(newVal) {
                $rootScope.invoiceArray2.push(newVal);
                return $rootScope.invoiceArray;
            },
            removeArray1: function(newVals) {
                $rootScope.invoiceArray2.splice(newVals, 1);
                return $rootScope.invoiceArray;
            }
        }
    });

//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

app.controller('showproductCtrl', function($scope, $mdDialog, $rootScope, InvoiceService, item, $objectstore, $uploader, $state) {
    $scope.test = item;
    $scope.settings = {};
        $scope.UnitOfMeasure = [];
        $scope.taxType = []
        $scope.AllTaxes = [];
        $scope.individualTax = [];
         $scope.test = item;
        $scope.prevTrax = angular.copy($scope.test)

        var client = $objectstore.getClient("Settings12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                $scope.settings = data;
                for (var i = $scope.settings.length - 1; i >= 0; i--) {
                    for (var z = $scope.settings[i].preference.productpref.units.length - 1; z >= 0; z--) {
                        if ($scope.settings[i].preference.productpref.units[z].activate == true) {
                            $scope.UnitOfMeasure.push($scope.settings[i].preference.productpref.units[z])
                        }
                        $scope.ShowDiscount = $scope.settings[i].preference.invoicepref.enableDisscounts;
                        $scope.dis = $scope.settings[i].preference.invoicepref.disscountItemsOption;
                    };
                    if ($scope.settings[i].taxes) {
                        for (var x = $scope.settings[i].taxes.individualtaxes.length - 1; x >= 0; x--) {
                            $scope.individualTax.push($scope.settings[i].taxes.individualtaxes[x]);
                        };
                        for (var y = $scope.settings[i].taxes.multipletaxgroup.length - 1; y >= 0; y--) {
                            $scope.individualTax.push($scope.settings[i].taxes.multipletaxgroup[y]);
                        };
                    }
                }
            }
            $scope.AllTaxes = $scope.individualTax;
            $scope.Displaydiscount = $scope.ShowDiscount;
        });
        client.onError(function(data) {});
        client.getByFiltering("*");

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.setTax = function(pDis) {
            for (var i = $scope.AllTaxes.length - 1; i >= 0; i--) {
                if ($scope.AllTaxes[i].taxname == pDis.tax.taxname) {
                    $scope.Ptax = ({
                        taxname: $scope.AllTaxes[i].taxname,
                        activate: $scope.AllTaxes[i].activate,
                        compound: $scope.AllTaxes[i].compound,
                        rate: $scope.AllTaxes[i].rate,
                        type: $scope.AllTaxes[i].type,
                        individualtaxes: $scope.AllTaxes[i].individualtaxes
                    });
                }
            };
            item.tax = $scope.Ptax;
        }

    $scope.edit = function(tst, index) {
        // $rootScope.editProdArray.val.splice(tst, 1);
        for (var i = $rootScope.invoiceArray[0].MultiDueDAtesArr.length - 1; i >= 0; i--) {
            $scope.ttt = $rootScope.invoiceArray[0].MultiDueDAtesArr[i].paymentStatus;
            }
            if($state.current.name == 'edit'){
               if( $scope.ttt == "Paid"){

                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Warning')
                    .content('Since you have done a payment to this invoice you cannot edit this nvoice')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                );

            }else{
                $rootScope.editProdArray.val.splice($rootScope.editProdArray.val.indexOf(tst), 1);
                $rootScope.invoiceArray[0].invoiceProducts.splice($rootScope.invoiceArray[0].invoiceProducts.indexOf(tst), 1);
                InvoiceService.ReverseEditTax($scope.prevTrax, index);

                InvoiceService.setTempArr({
                    Productname: item.Productname,
                    price: item.price,
                    quantity: item.quantity,
                    ProductUnit: item.ProductUnit,
                    discount: item.discount,
                    tax: item.tax,
                    olp: item.olp,
                    amount: $scope.Amount,
                    status: item.status
                })
                for (var i = $rootScope.editProdArray.val.length - 1; i >= 0; i--) {
                $rootScope.invoiceArray[0].invoiceProducts.push($rootScope.editProdArray.val[i]);
                for (var i = $rootScope.calTax.length - 1; i >= 0; i--) {
                    $rootScope.getTax.push($rootScope.calTax[i])
                };
            };
                $mdDialog.cancel();
                    }     

            }else{
                $rootScope.editProdArray.val.splice($rootScope.editProdArray.val.indexOf(tst), 1);
                $rootScope.invoiceArray[0].invoiceProducts.splice($rootScope.invoiceArray[0].invoiceProducts.indexOf(tst), 1);
                InvoiceService.ReverseEditTax($scope.prevTrax, index);

                InvoiceService.setTempArr({
                    Productname: item.Productname,
                    price: item.price,
                    quantity: item.quantity,
                    ProductUnit: item.ProductUnit,
                    discount: item.discount,
                    tax: item.tax,
                    olp: item.olp,
                    amount: $scope.Amount,
                    status: item.status
                })
                for (var i = $rootScope.editProdArray.val.length - 1; i >= 0; i--) {
                $rootScope.invoiceArray[0].invoiceProducts.push($rootScope.editProdArray.val[i]);
                for (var i = $rootScope.calTax.length - 1; i >= 0; i--) {
                    $rootScope.getTax.push($rootScope.calTax[i])
                };
            };
                $mdDialog.cancel();
            }
    };
    $scope.calAMount = function() {
         $scope.Amount = 0;
            $scope.total = 0;
            $scope.disc = 0;

            $scope.total = (item.price * item.quantity);

            if ($scope.dis == "Individual Items") {
                $scope.disc = parseFloat($scope.total * item.discount / 100);
                $scope.Amount = $scope.total - $scope.disc;
            } else {
                $scope.Amount = $scope.total;
            }

            return $scope.Amount;
        }
    
});