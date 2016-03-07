rasm.controller('UploadCtrl', function($scope, $mdDialog, $rootScope, $state, UploaderService) {
        $scope.uploadimages = {
            val: []
        };
        $scope.uploadimages.val = UploaderService.loadBasicArray();
        //directive table content start
        $scope.$on('viewRecord', function(event, args) {
            $scope.uploadimages.val.splice(args, 1);
        });
        $scope.toggleSearch = false;
        $scope.headers = [{
            name: 'Name',
            field: 'name'
        }, {
            name: 'Size',
            field: 'size'
        }];
        $scope.custom = {
            name: 'bold',
            size: 'grey'
        };
        $scope.sortable = ['name', 'size'];
        $scope.thumbs = 'thumb';
        $scope.count = 3;
        $scope.AddImage = function() {
            $scope.uploadimages.val = UploaderService.loadBasicArray();
            $mdDialog.cancel();
        }
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    });
     //END OF UploadCtrl