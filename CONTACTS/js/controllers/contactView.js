rasm.controller('AppCtrlGet', function($scope, $rootScope,$contactNotes, $state, $objectstore, $location, customerFac, $mdDialog, $objectstore, $timeout, $mdToast) {
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

    $scope.changeTab = function(ind) {
        switch (ind) {

        case 0:
            $state.go('settings.contact')
            $rootScope.showsort = true;
            break;
        case 1:
            $state.go('settings.supplier');
            $rootScope.showsort = false;
            $rootScope.showaddProject = false;
            break;
        }
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

            $scope.convertpdf = function(content) {
            html2canvas($("#canvas"), {
            onrendered: function(canvas) {                      
                var imgData = canvas.toDataURL('image/jpeg');              
            options = {
                orientation: "0",
                unit: "mm",
                format: "a4"
            };

            var doc = new jsPDF(options, '', '', '');
            doc.addImage(imgData, 'jpeg', 0, 0, 200, 0);
            var corte = 1395; // configura tamanho do corte
            var image = new Image();
            image = Canvas2Image.convertToJPEG(canvas);

            var croppingYPosition = corte;
            var count = (image.height)/corte;
            var i =1;
            console.log(image.height)
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
                    doc.addImage(image2Data, 'JPEG', 0, 0, 200, 0);
                    croppingYPosition += destHeight; 
                    console.log(croppingYPosition)
                    count =  (image.height)/croppingYPosition;
                             
                } 
                doc.save(content.invoiceNo+'.pdf')                
            }
        });
        }

}); /*___________________________________End of ApCtrlGet____________________________________________*/

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