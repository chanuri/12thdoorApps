rasm.controller('AppCtrlGetSuppliers', function($scope, $rootScope, $state,$SupliertNotes, $objectstore, $location, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $timeout, $mdToast) {

    $scope.suppliers = [];
    $scope.baddress = {};
    $scope.saddress = {};
   $scope.showShipping = $scope.showShipping;
  $scope.showBilling = true;
  $scope.cb = false;

    $scope.customerNotes = function(obj){
        $SupliertNotes.viewSuplierNotes(obj,"supplier12thdoor","supplierid")
    }


    $scope.changeStatus = function(obj){
      
      function changeStatus(obj){
        if (obj.status == "Active") obj.status = "Inactive";
        else if (obj.status == "Inactive") obj.status = "Active";
      }

      changeStatus(obj);

      var statusClient = $objectstore.getClient("supplier12thdoor");
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
      statusClient.insert(obj,{ KeyProperty: "supplierid" })
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

    $scope.loadAllsupplier = function() {
      var client = $objectstore.getClient("supplier12thdoor");
      client.onGetMany(function(data) {
        if (data) {
          $scope.suppliers = data;
        }
      });
      client.onError(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('Error')
          .content('There was an error retreving the data.')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
      });
      client.getByFiltering("select * from supplier12thdoor Where deleteStatus = 'false'");
    };

    $scope.updateSupplier = function(updatedform, sid) {} 
    $scope.deleteSupplier = function(deleteform, ev) {} 
    
    $scope.addressChange = function() {
      $scope.showShipping = !$scope.showShipping;
      $scope.showBilling = !$scope.showBilling;
    }

    $scope.exist = false;
    $scope.SupplierDelete = function(deleteform, ev){

    //     var client = $objectstore.getClient("leger12thdoor");
    // client.onGetMany(function(data) {
    //     if (data) {
    //         $scope.Leger = data;
    //         for (var i = data.length - 1; i >= 0; i--) {  
    //                 if(deleteform.supplierid){
    //                     $scope.exist = true;
    //                 }
    //         }
    //     }
    // });
    // client.onError(function(data) {});
    // client.getByFiltering("select * from leger12thdoor where AccountNo = '"+deleteform.supplierid+"'");

        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('')
            .content('Are You Sure You Want To Delete This Record? This process is not reversible')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {

            var client = $objectstore.getClient("supplier12thdoor");
            deleteform.DeleteStatus = true;
            deleteform.supplierid =  deleteform.supplierid.toString();
            if(deleteform.status == "Inactive" ){
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
               client.insert(deleteform, {KeyProperty: "supplierid"});
           }else{
            $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('')
                    .content('Unable to delete supplierid.  Please inactivate to disable for future transactions')
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


  }) 