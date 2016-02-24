rasm.controller('AppCtrlGet', function($scope, $rootScope, $state, $objectstore, $location, $mdDialog, $objectstore, $timeout, $mdToast) {
    $scope.contacts = [];
    $scope.baddress = {};
    $scope.saddress = {};
    $scope.showShipping = $scope.showShipping;
    $scope.showBilling = !$scope.showBilling;
    $scope.checkAbilityBtn = true;
    $scope.checkAbilityEditing = true;
    $scope.contactNameupArrow = false;
    $scope.contactNamedownArrow = false;
    $scope.sortEmailAsc = "Email";
    $scope.sortEmailDes = "-Email";
    $scope.contactEmailupArrow = false;
    $scope.contactEmaildownArrow = false;

    
    
    $scope.loadAllcontact = function() {
        var client = $objectstore.getClient("contact12thdoor");
        client.onGetMany(function(data) {
            if (data) {
                $scope.contacts = data;
            }
        });
        client.onError(function(data) {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('This is embarracing')
                .content('There was an error retreving the data.')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent(data)
            );
        });
        client.getByFiltering("*");
    }; 
    $scope.updateCustomer = function(updatedform, cid) {} 
    $scope.deleteCustomer = function(deleteform, ev) {}  
    $scope.addressChange = function() {
        $scope.showShipping = !$scope.showShipping;
        $scope.showBilling = !$scope.showBilling;
    } 
    $scope.demo = {
        topDirections: ['left', 'up'],
        bottomDirections: ['down', 'right'],
        isOpen: false,
        availableModes: ['md-fling', 'md-scale'],
        selectedMode: 'md-fling',
        availableDirections: ['up', 'down', 'left', 'right'],
        selectedDirection: 'up'
    };   

}); /*___________________________________End of ApCtrlGet____________________________________________*/