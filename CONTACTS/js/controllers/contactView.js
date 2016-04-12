rasm.controller('AppCtrlGet', function($scope, $rootScope,$contactNotes, $state, $objectstore, $location,$filter, customerFac, $mdDialog, $objectstore, $timeout, $mdToast) {
    $scope.contacts = [];
    $scope.baddress = {};
    $scope.saddress = {};
  
    $scope.checkAbilityBtn = true;
    $scope.checkAbilityEditing = true;
    $scope.contactNameupArrow = false;
    $scope.contactNamedownArrow = false;
    $scope.sortEmailAsc = "Email";
    $scope.sortEmailDes = "-Email";
    $scope.contactEmailupArrow = false;
    $scope.contactEmaildownArrow = false; 
    $scope.StatementDate = new Date();

    $scope.showShipping = $scope.showShipping;
    $scope.showBilling = true;
    $scope.cb = false;

    $scope.customerNotes = function(obj){
        $contactNotes.viewNotes(obj,"contact12thdoor","customerid")
    }

    $scope.Customerview = function() {
        location.href = '#/home'  
    }

    $scope.Leger  = {};
    $scope.leger = [];

     if ($state.current.name == 'settings.contact') {
            $rootScope.showsort = true;
            $rootScope.showaddProject = true;
            $scope.selectedIndex = 0;
        } else if ($state.current.name == 'settings.supplier') {
           $rootScope.showsort = false;
            $rootScope.showaddProject = false;
            $scope.selectedIndex = 1;
        };

         $scope.changeTab = function(ind) {
            switch (ind) {
                case 0:
                    $rootScope.showsort = true;
                     $rootScope.showaddProject = true;
                    break;
                case 1:
                     $rootScope.showsort = false;
                     $rootScope.showaddProject = false;
                    break;
            }
        };


 $scope.$watch('selectedIndex', function(current, old) {
            switch (current) {
                case 0:
                    $location.url("/settings/contact");
                    break;
                case 1:
                    $location.url("/settings/supplier");
                    break;
            }
        });

    $scope.AccountStatement = function(data){
        $state.go('view');
        $rootScope.customerArr.splice(0, 1);
        customerFac.setDateArray(data);
    }

    $scope.email = function(item) {
            $mdDialog.show({
                templateUrl: 'contact_partial/email.html',
                controller: 'emailCtrl',
                locals: {
                    invo: item
                }
            });
        };
        
         $scope.favouriteFunction = function(obj) {
            var client = $objectstore.getClient("contact12thdoor");
            obj.customerid = obj.customerid.toString();
            if (obj.favourite) {
                obj.favouriteStarNo = 0;

            } else if (!(obj.favourite)) {
                obj.favouriteStarNo = 1;
            };
            client.onComplete(function(data) {

            });
            client.onError(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content('Error Occure while Adding to Favourite')
                    .ariaLabel('')
                    .ok('OK')
                    .targetEvent(data)
                );
            });
            obj.favourite = !obj.favourite;
            client.insert(obj, {
                KeyProperty: "customerid"
            });
        }

    $scope.totalBalance = 0;
    $scope.Balance = 0;
    $scope.Intotal = 0;
    $scope.CredTotal = 0;
    $scope.PayTotal = 0;
    $scope.receiptBalance = 0;
    $scope.CreditNoteBalance = 0;
    $scope.bbb = 0;
    $scope.Addleger = [];
    $scope.loadData = function(val){
        var client = $objectstore.getClient("leger12thdoor");
    client.onGetMany(function(data) {
        if (data) {

            $scope.Leger = data;
            for (var i = 0; i <= data.length - 1;  i++) { 
                data[i].ID = parseInt(data[i].ID);
                    $scope.Addleger.push(data[i]);

                     $scope.leger = $scope.Addleger.sort(function(a, b) {
                                return a.Date > b.Date ? 1 : a.Date < b.Date ? -1 : 0;
                            });

                    if(data[i].Type == "Invoice"){
                       $scope.Intotal += data[i].Amount; 
                       console.log($scope.Intotal)
                    }
                    else if(data[i].Type == "Credit Note"){
                        $scope.CredTotal += data[i].Amount;
                        $scope.CreditNoteBalance = $scope.Intotal - data[i].Amount;
                    }else if(data[i].Type == "Receipt"){
                        $scope.PayTotal += data[i].Amount;
                        $scope.receiptBalance = $scope.Intotal - data[i].Amount;
                    }

                    $scope.totalBalance = parseFloat($scope.Intotal - $scope.PayTotal- $scope.CredTotal);
            }
        }
    });
    client.onError(function(data) {});
    client.getByFiltering("select * from leger12thdoor where AccountNo = '"+val.customerid+"'");
    }

    

    $scope.changeStatus = function(obj){
      
      function changeStatus(obj){
        if (obj.status == "Active") obj.status = "Inactive";
        else if (obj.status == "Inactive") obj.status = "Active";
      }

      changeStatus(obj);
      obj.customerid = obj.customerid.toString();
      var statusClient = $objectstore.getClient("contact12thdoor");
      statusClient.onComplete(function(data){
      });
      statusClient.onError(function(data){
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .title('Unsuccessful')
            .content('There was an error changing the status')
            .ariaLabel('Alert Dialog Demo')
            .ok('OK')
            .targetEvent(data)
          );
          changeStatus(obj);
      });
      statusClient.insert(obj,{ KeyProperty: "customerid" })
    }

    
    $scope.loadAllcontact = function() {
        var client = $objectstore.getClient("contact12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                $scope.contacts = data;
                for (var i = data.length - 1; i >= 0; i--) {
                    data[i].customerid = parseInt(data[i].customerid);
                }
            }
        });
        client.onError(function(data) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .title()
                .content('There was an error retreving the data.')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent(data)
            );
        });
        client.getByFiltering("select * from contact12thdoor Where deleteStatus = 'false'");
    }; 
   
    $scope.addressChange = function() {
        $scope.showShipping = !$scope.showShipping;
        $scope.showBilling = !$scope.showBilling;
    }    

    $scope.exist = false;
    $scope.ContactDelete = function(deleteform, ev){

        var client = $objectstore.getClient("leger12thdoor");
    client.onGetMany(function(data) {
        if (data) {
            $scope.Leger = data;
            for (var i = data.length - 1; i >= 0; i--) {  
                    if(deleteform.customerid){
                        $scope.exist = true;
                    }
            }
        }
    });
    client.onError(function(data) {});
    client.getByFiltering("select * from leger12thdoor where AccountNo = '"+deleteform.customerid+"'");

        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('')
            .content('Are You Sure You Want To Delete This Record? This process is not reversible')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {

            var client = $objectstore.getClient("contact12thdoor");
            deleteform.DeleteStatus = true;
            deleteform.customerid =  deleteform.customerid.toString();
            if(deleteform.status == "Inactive" && $scope.exist == false){
               client.onComplete(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content('Record Successfully Deleted')
                    .ariaLabel('')
                    .ok('OK')
                    .targetEvent(data)
                );
                $state.go($state.current, {}, {
                    reload: true
                });
            }); 
               client.insert(deleteform, {KeyProperty: "customerid"});
           }else{
            $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('')
                    .content('Unable to delete customer due to transactions. Please inactivate to disable for future transactions')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                );
           }
            
            client.onError(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content('Error Occure while Adding Invoice')
                    .ariaLabel('')
                    .ok('OK')
                    .targetEvent(data)
                );
            });
            
        }, function() {
            $mdDialog.hide();
        });
    }


         function toDataUrl(url, callback){
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function() {
              var reader  = new FileReader();
              reader.onloadend = function () {
                  callback(reader.result);
              }
              reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.send();
        }

        function hasNull(target) {
            for (var member in target) {
                if (target[member] == null)
                   target[member] = "";
            }
          return target;
        }

        $scope.convertpdf = function(content){
            
             content = hasNull(content);
            toDataUrl('img/image1.jpg', function(base64Img){
            var doc = new jsPDF();
                doc.addImage(base64Img, 'JPEG', 5, 5, 60, 40);

                var proHeight = 170;

                
                var newDate = $filter('date')(new Date());

                doc.setFontSize(20);
                doc.setFontType("bold");
                doc.text(30,55,"ACCOUNT STATEMENT");

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30,60,"Period 01/20/2016 to 2/20/2016" );

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30,80,"To" );

                doc.setFontSize(12);
                doc.text(30,87, content.Name);

                doc.setFontSize(12);
                doc.text(30,94, content.baddress.street);

                doc.setFontSize(12);
                doc.text(30,101, content.baddress.city + content.baddress.state + content.baddress.zip + content.baddress.country);

                doc.setFontSize(12);
                doc.text(30,108, content.Email);

                doc.setFontSize(12);
                doc.text(30,120, "Statement Date");
                doc.setFontSize(12);
                doc.text(60,120, newDate);

                doc.setFillColor(192, 192, 192);
                doc.rect(130, 75, 63, 55, 'F');

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(130,83,"Summary");

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(130,90,"Balance B/F");
                doc.setFontSize(12);
                doc.text(170,90,content.BaseCurrency + "0.00");

                doc.setFontSize(12);
                doc.text(130,97,"Invoices");
                doc.setFontSize(12);
                doc.text(170,97,content.BaseCurrency + $scope.Intotal.toString());

                doc.setFontSize(12);
                doc.text(130,104,"Credits");
                doc.setFontSize(12);
                doc.text(170,104,content.BaseCurrency + $scope.CredTotal.toString());

                 doc.setFontSize(12);
                doc.text(130,111,"Payments");
                doc.setFontSize(12);
                doc.text(170,111,content.BaseCurrency + $scope.PayTotal.toString());

                 doc.setFontSize(12);
                 doc.setFontType("bold");
                doc.text(130,120,"Balance Due");
                doc.setFontSize(12);
                doc.text(170,120,content.BaseCurrency + $scope.totalBalance.toString());


                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(30,160,"Date");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(60,160,"Description");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(140,160,"Amount");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(170,160,"Balance");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(30, 165,"___________________________________________________________________"); 

                for(pp=0; pp<= $scope.leger.length-1; pp++){

                var newLegerDate = $filter('date')($scope.leger[pp].Date);

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30,proHeight,  newLegerDate);

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(60,proHeight,$scope.leger[pp].Type);

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(140,proHeight,$scope.leger[pp].Amount.toString());

                 doc.setFontSize(12);
                doc.setFontType("normal");
                if($scope.leger[pp].Type == "Invoice"){
                    doc.text(170,proHeight,$scope.leger[pp].Amount.toString());
                }else if($scope.leger[pp].Type == "Receipt"){
                    doc.text(170,proHeight,$scope.receiptBalance.toString());
                }else if($scope.leger[pp].Type == "Credit Note"){
                    doc.text(170,proHeight,$scope.CreditNoteBalance.toString());
                }

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30, proHeight +  10 ,"___________________________________________________________________"); 

                proHeight += 20;
                if (proHeight > 272) {
                        doc.addPage()
                        proHeight = 10
                    }
                }
                

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(140, proHeight+10, "Balance Due");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(170, proHeight+10, $scope.totalBalance.toString());

                doc.save(content.customerid.toString()+'.pdf');
            })
        }

/*___________________________________________________________________________________________________________*/

        $scope.printDetails = function(content){

             content = hasNull(content);
            toDataUrl('img/image1.jpg', function(base64Img){
            var doc = new jsPDF();
                doc.addImage(base64Img, 'JPEG', 5, 5, 60, 40);

                var proHeight = 170;

                
                var newDate = $filter('date')(new Date());

                doc.setFontSize(20);
                doc.setFontType("bold");
                doc.text(30,55,"ACCOUNT STATEMENT");

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30,60,"Period 01/20/2016 to 2/20/2016" );

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30,80,"To" );

                doc.setFontSize(12);
                doc.text(30,87, content.Name);

                doc.setFontSize(12);
                doc.text(30,94, content.baddress.street);

                doc.setFontSize(12);
                doc.text(30,101, content.baddress.city + content.baddress.state + content.baddress.zip + content.baddress.country);

                doc.setFontSize(12);
                doc.text(30,108, content.Email);

                doc.setFontSize(12);
                doc.text(30,120, "Statement Date");
                doc.setFontSize(12);
                doc.text(60,120, newDate);

                doc.setFillColor(192, 192, 192);
                doc.rect(130, 75, 63, 55, 'F');

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(130,83,"Summary");

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(130,90,"Balance B/F");
                doc.setFontSize(12);
                doc.text(170,90,content.BaseCurrency + "0.00");

                doc.setFontSize(12);
                doc.text(130,97,"Invoices");
                doc.setFontSize(12);
                doc.text(170,97,content.BaseCurrency + $scope.Intotal.toString());

                doc.setFontSize(12);
                doc.text(130,104,"Credits");
                doc.setFontSize(12);
                doc.text(170,104,content.BaseCurrency + $scope.CredTotal.toString());

                 doc.setFontSize(12);
                doc.text(130,111,"Payments");
                doc.setFontSize(12);
                doc.text(170,111,content.BaseCurrency + $scope.PayTotal.toString());

                 doc.setFontSize(12);
                 doc.setFontType("bold");
                doc.text(130,120,"Balance Due");
                doc.setFontSize(12);
                doc.text(170,120,content.BaseCurrency + $scope.totalBalance.toString());


                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(30,160,"Date");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(60,160,"Description");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(140,160,"Amount");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(170,160,"Balance");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(30, 165,"___________________________________________________________________"); 

                for(pp=0; pp<= $scope.leger.length-1; pp++){

                var newLegerDate = $filter('date')($scope.leger[pp].Date);

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30,proHeight,  newLegerDate);

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(60,proHeight,$scope.leger[pp].Type);

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(140,proHeight,$scope.leger[pp].Amount.toString());

                doc.setFontSize(12);
                doc.setFontType("normal");
                if($scope.leger[pp].Type == "Invoice"){
                    doc.text(170,proHeight,$scope.leger[pp].Amount.toString());
                }else if($scope.leger[pp].Type == "Receipt"){
                    doc.text(170,proHeight,$scope.receiptBalance.toString());
                }else if($scope.leger[pp].Type == "Credit Note"){
                    doc.text(170,proHeight,$scope.CreditNoteBalance.toString());
                }
                

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30, proHeight +  10 ,"___________________________________________________________________"); 

                proHeight += 20;
                if (proHeight > 272) {
                        doc.addPage()
                        proHeight = 10
                    }
                }
                

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(140, proHeight+10, "Balance Due");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(170, proHeight+10, $scope.totalBalance.toString());

               doc.autoPrint();
                doc.output('dataurlnewwindow');
            })
        }

}); /*___________________________________End of view contact controller____________________________________________*/

 rasm.factory('customerFac', function($rootScope) {
        $rootScope.customerArr = [];
       
        return {
            setDateArray: function(newVal) {
                $rootScope.customerArr.push(newVal);
                return $rootScope.dateArray;
            },
            removeDateArray: function(newVals) {
                $rootScope.customerArr.splice(newVals, 1);
                return $rootScope.dateArray;
            },
    }
});
 /*____________________________________________________________________________________________________________________*/
 rasm.controller('emailCtrl', function($scope, $mdDialog, $rootScope,$helpers, invo, $rootScope, $uploader, $mdToast, $document,$objectstore,$sce,$filter) {

    $scope.test = invo;
        //console.log($scope.test)


    $scope.totalBalance = 0;
    $scope.Balance = 0;
    $scope.Intotal = 0;
    $scope.CredTotal = 0;
    $scope.PayTotal = 0;
    $scope.receiptBalance = 0;
    $scope.CreditNoteBalance = 0;
    $scope.bbb = 0;
    $scope.Addleger = [];
    $scope.leger1 = [];
    $scope.loadData = function(val){
        var client = $objectstore.getClient("leger12thdoor");
    client.onGetMany(function(data) {
        if (data) {

            $scope.Leger = data;
            for (var i = 0; i <= data.length - 1;  i++) { 
                data[i].ID = parseInt(data[i].ID);
                    $scope.Addleger.push(data[i]);

                     $scope.leger1 = $scope.Addleger.sort(function(a, b) {
                                return a.Date > b.Date ? 1 : a.Date < b.Date ? -1 : 0;
                            });

                    if(data[i].Type == "Invoice"){
                       $scope.Intotal += data[i].Amount; 
                       console.log($scope.Intotal)
                    }
                    else if(data[i].Type == "Credit Note"){
                        $scope.CredTotal += data[i].Amount;
                        $scope.CreditNoteBalance = $scope.Intotal - data[i].Amount;
                    }else if(data[i].Type == "Receipt"){
                        $scope.PayTotal += data[i].Amount;
                        $scope.receiptBalance = $scope.Intotal - data[i].Amount;
                    }

                    $scope.totalBalance = parseFloat($scope.Intotal - $scope.PayTotal- $scope.CredTotal);
            }
        }
    });
    client.onError(function(data) {});
    client.getByFiltering("select * from leger12thdoor where AccountNo = '"+val.customerid+"'");
    }


        $scope.subject = "Customer No." + $scope.test.customerid + " " + $scope.test.Name;

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

         var client = $objectstore.getClient("t12thdoorSettingEmailBodyy");
        client.onGetMany(function(data) {
            if (data) {
             $scope.emailBody = data[0].emailBody;
        console.log(data[0].emailBody) 
        var newOne = [];
        // newOne.push(data[0].emailBody.substring(data[0].emailBody.indexOf("{{")+2,data[0].emailBody.indexOf("}}")));
        $scope.emailBody = $scope.emailBody.replace("@@invoiceNo@@", $scope.test.CustomerFname);
        $scope.emailBody = $scope.emailBody.replace("@@accounturl@@","<a href= 'http://12thdoor.com' >http://12thdoor.com </a>") 
        $scope.emailBody = $scope.emailBody.replace("@@companyName@@", $scope.test.customer);
        $scope.emailBody = $sce.trustAsHtml($scope.emailBody);
            }
        });
        client.onError(function(data) {});
        client.getByFiltering("select * from t12thdoorSettingEmailBodyy where uniqueRecord ='1' ");

        $scope.Emailerror = false;
        $scope.emailrec = [$scope.test.Email];

         $scope.$watchCollection("emailrec", function() {
            var re = /\S+@\S+\.\S+/;
            $scope.Emailerror = false;
            for (var i = $scope.emailrec.length - 1; i >= 0; i--) {

                if (re.test($scope.emailrec[i]) == false) {
                    $scope.show = $scope.emailrec[i];
                    $scope.Emailerror = true;
                    $scope.emailrec.splice(i, 1);

                    $scope.showActionToast();
                }
            };
        });

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

        $scope.showActionToast = function() {
            $mdToast.show({
                controller: 'ToastCtrl',
                template: 'invalid',
                parent: $document[0].querySelector('#toastBounds'),
                hideDelay: 6000,
                position: $scope.getToastPosition()
            });
        };

        $scope.pdfChipArr = [];
        $scope.pdfChipArr.push($scope.test.customerid+".pdf")
        $scope.emailBCCrec = [];
        $scope.pdfInvoNo = [$scope.test.customerid]

        $scope.listItemClick = function($index) {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);
        };
        var jsondata = {};
        
        function emailWithPdf(){
            jsondata.attachments = [{
                "filename": invo.customerid+'.pdf',
                "path": "http://"+$helpers.getHost()+"/apis/media/tenant/invoicePdf/"+invo.customerid+'.pdf'
            }]
            sendEmailBody()
        } 

        function sendEmailBody(){

                    var xhttp = []
                    var emailSend = false;
                    

                    for(em=0; em<=$scope.emailrec.length-1; em++ ){
                       
                        (function (em){
                            xhttp[em] = new XMLHttpRequest();

                            jsondata.to = $scope.emailrec[em]; 

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


                $scope.sendmail = function(){
            jsondata =  {
                 "type": "email", 
                 "subject": $scope.subject,
                 "bcc": $scope.emailBCCrec,
                 "from": "Account Statement <noreply-12thdoor@duoworld.com>",
                 "Namespace": "com.duosoftware.com",
                 "TemplateID": "T_Invoice_1",
                 "DefaultParams": {
                  "@@no@@": invo.customerid,
                  "@@accounturl@@": "http://12thdoor.com",
                  "@@companyName@@": invo.Name
                },
                 "CustomParams": {
                  "@@no@@": "0001",
                  "@@accounturl@@": "http://12thdoor.com",
                  "@@companyName@@": "12thdoor"
                }
            }

            if ($scope.pdfChipArr.length > 0) { 
                emailPdf(invo)
                setTimeout(function(){
                    var decodeUrl = $rootScope.dataUrl;
                    var blobFile = dataURItoBlob(decodeUrl) 
                    blobFile.name = invo.customerid+'.pdf'
                    // console.log(decodeUrl)
                    $uploader.uploadMedia("invoicePdf",blobFile,blobFile.name);
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
            }else
                sendEmailBody()
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

        function toDataUrl(url, callback){
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function() {
              var reader  = new FileReader();
              reader.onloadend = function () {
                  callback(reader.result);
              }
              reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.send();
        }

        function hasNull(target) {
            for (var member in target) {
                if (target[member] == null)
                   target[member] = "";
            }
          return target;
        }

        function emailPdf(content){
             content = hasNull(content);
            toDataUrl('img/image1.jpg', function(base64Img){
            var doc = new jsPDF();
                doc.addImage(base64Img, 'JPEG', 5, 5, 60, 40);

                var proHeight = 170;

                
                var newDate = $filter('date')(new Date());

                doc.setFontSize(20);
                doc.setFontType("bold");
                doc.text(30,55,"ACCOUNT STATEMENT");

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30,60,"Period 01/20/2016 to 2/20/2016" );

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30,80,"To" );

                doc.setFontSize(12);
                doc.text(30,87, content.Name);

                doc.setFontSize(12);
                doc.text(30,94, content.baddress.street);

                doc.setFontSize(12);
                doc.text(30,101, content.baddress.city + content.baddress.state + content.baddress.zip + content.baddress.country);

                doc.setFontSize(12);
                doc.text(30,108, content.Email);

                doc.setFontSize(12);
                doc.text(30,120, "Statement Date");
                doc.setFontSize(12);
                doc.text(60,120, newDate);

                doc.setFillColor(192, 192, 192);
                doc.rect(130, 75, 63, 55, 'F');

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(130,83,"Summary");

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(130,90,"Balance B/F");
                doc.setFontSize(12);
                doc.text(170,90,content.BaseCurrency + "0.00");

                doc.setFontSize(12);
                doc.text(130,97,"Invoices");
                doc.setFontSize(12);
                doc.text(170,97,content.BaseCurrency + $scope.Intotal.toString());

                doc.setFontSize(12);
                doc.text(130,104,"Credits");
                doc.setFontSize(12);
                doc.text(170,104,content.BaseCurrency + $scope.CredTotal.toString());

                 doc.setFontSize(12);
                doc.text(130,111,"Payments");
                doc.setFontSize(12);
                doc.text(170,111,content.BaseCurrency + $scope.PayTotal.toString());

                 doc.setFontSize(12);
                 doc.setFontType("bold");
                doc.text(130,120,"Balance Due");
                doc.setFontSize(12);
                doc.text(170,120,content.BaseCurrency + $scope.totalBalance.toString());


                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(30,160,"Date");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(60,160,"Description");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(140,160,"Amount");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(170,160,"Balance");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(30, 165,"___________________________________________________________________"); 

                for(pp=0; pp<= $scope.leger1.length-1; pp++){

                var newLegerDate = $filter('date')($scope.leger1[pp].Date);

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30,proHeight,  newLegerDate);

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(60,proHeight,$scope.leger1[pp].Type);

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(140,proHeight,$scope.leger1[pp].Amount.toString());

                doc.setFontSize(12);
                doc.setFontType("normal");
                if($scope.leger[pp].Type == "Invoice"){
                    doc.text(170,proHeight,$scope.leger1[pp].Amount.toString());
                }else if($scope.leger[pp].Type == "Receipt"){
                    doc.text(170,proHeight,$scope.receiptBalance.toString());
                }else if($scope.leger[pp].Type == "Credit Note"){
                    doc.text(170,proHeight,$scope.CreditNoteBalance.toString());
                }
                

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(30, proHeight +  10 ,"___________________________________________________________________"); 

                proHeight += 20;
                if (proHeight > 272) {
                        doc.addPage()
                        proHeight = 10
                    }
                }
                

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(140, proHeight+10, "Balance Due");

                doc.setFontSize(12);
                doc.setFontType("bold");
                doc.text(170, proHeight+10, $scope.totalBalance.toString());

               $rootScope.dataUrl= doc.output('datauristring')  
            })
        }

        
 })