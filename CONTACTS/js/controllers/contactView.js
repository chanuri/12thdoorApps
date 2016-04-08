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

    $scope.totalBalance = 0;
    $scope.Balance = 0;
    $scope.Intotal = 0;
    $scope.CredTotal = 0;
    $scope.PayTotal = 0;
    $scope.receiptBalance = 0;
    $scope.CreditNoteBalance = 0;
    $scope.bbb = 0;

    $scope.loadData = function(val){
        var client = $objectstore.getClient("leger12thdoor");
    client.onGetMany(function(data) {
        if (data) {
            $scope.Leger = data;
            for (var i = data.length - 1; i >= 0; i--) { 
                data[i].ID = parseInt(data[i].ID);
                    $scope.leger.push(data[i]);

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
        // $mdDialog.show(
        //     $mdDialog.alert()
        //     .parent(angular.element(document.body))
        //     .title('Success')
        //     .content('status changed successfully')
        //     .ariaLabel('Alert Dialog Demo')
        //     .ok('OK')
        //     .targetEvent(data)
        // );
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

    var totalBalance = 0;
    var Balance = 0;
    var Intotal = 0;
    var CredTotal = 0;
    var PayTotal = 0;
    var receiptBalance = 0;
    var CreditNoteBalance = 0;
    var bbb = 0;

            var client = $objectstore.getClient("leger12thdoor");
    client.onGetMany(function(data) {
        if (data) {
            $scope.Leger = data;
            for (var i = data.length - 1; i >= 0; i--) { 
                data[i].ID = parseInt(data[i].ID);
                    $scope.leger.push(data[i]);

                    if(data[i].Type == "Invoice"){
                       Intotal += data[i].Amount; 
                       console.log(Intotal)
                    }
                    else if(data[i].Type == "Credit Note"){
                        CredTotal += data[i].Amount;
                        CreditNoteBalance = Intotal - data[i].Amount;
                    }else if(data[i].Type == "Receipt"){
                        PayTotal += data[i].Amount;
                        receiptBalance = Intotal - data[i].Amount;
                    }

                    $scope.totalBalance = parseFloat($scope.Intotal - PayTotal- CredTotal);
            }
        }
    });
    client.onError(function(data) {});
    client.getByFiltering("select * from leger12thdoor where AccountNo = '"+content.customerid+"'");
    


             content = hasNull(content);
            toDataUrl('img/image1.jpg', function(base64Img){
            var doc = new jsPDF();
                doc.addImage(base64Img, 'JPEG', 5, 5, 60, 40);
                var proHeight = 132;

                
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
                doc.rect(130, 75, 63, 50, 'F');

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
                doc.text(170,97,content.BaseCurrency + Intotal.toString());

                doc.setFontSize(12);
                doc.text(130,104,"Credits");
                doc.setFontSize(12);
                doc.text(170,104,content.BaseCurrency + CredTotal.toString());

                 doc.setFontSize(12);
                doc.text(130,111,"Payments");
                doc.setFontSize(12);
                doc.text(170,111,content.BaseCurrency + PayTotal.toString());

                 doc.setFontSize(12);
                 doc.setFontType("bold");
                doc.text(130,120,"Balance Due");
                doc.setFontSize(12);
                doc.text(170,120,content.BaseCurrency + totalBalance.toString());



                doc.save(content.customerid.toString()+'.pdf');
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