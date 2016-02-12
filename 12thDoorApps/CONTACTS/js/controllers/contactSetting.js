rasm.controller('settingCtrl',function($scope,$state,$rootScope){

    $rootScope.showsort = true;
    $rootScope.showaddProject = true;
    $rootScope.showsort = true;


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
    $scope.addSupplier = function() {
        $state.go('addsupplier')
    }
    $scope.addCustomer = function() {
        $state.go('addcontact')
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
});