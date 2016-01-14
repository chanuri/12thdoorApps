 rasm.factory('invoiceDetails', function($rootScope) {
    $rootScope.invoiceArray = [];
    return {
        setArray: function(newVal) {
            $rootScope.invoiceArray.push(newVal);
            return $rootScope.invoiceArray;
        },
        removeArray: function(newVals) {
            $rootScope.invoiceArray.splice(newVals, 1);
            return $rootScope.invoiceArray;
        }
    }
 });
 rasm.factory('UploaderService', function($rootScope) {
    $rootScope.uploadArray = [];
    $rootScope.basicinfo = [];
    return {
        setFile: function(val) {
            $rootScope.uploadArray.push(val);
            return $rootScope.uploadArray;
        },
        BasicArray: function(name, size) {
            $rootScope.basicinfo.push({
                'name': name,
                'size': size
            });
            return $rootScope.basicinfo;
        },
        removebasicArray: function(arr) {
            for (var i = arr.length - 1; i >= 0; i--) {
                $rootScope.basicinfo.splice(arr[i], 1);
            };
            return $rootScope.basicinfo;
        },
        removefileArray: function(arr) {
            for (var i = arr.length - 1; i >= 0; i--) {
                $rootScope.uploadArray.splice(arr[i], 1);
            };
            return $rootScope.uploadArray;
        },
        loadArray: function() {
            return $rootScope.uploadArray;
        },
        loadBasicArray: function() {
            return $rootScope.basicinfo;
        },
    }
 }); // END OF UploaderService
 rasm.directive('fileUpLoaderInvoice', ['$uploader', "$rootScope", "$mdToast", 'UploaderService', function($uploader, $rootScope, $mdToast, UploaderService) {
    return {
        restrict: 'E',
        template: "<div class='content' ng-init='showUploadButton=false;showDeleteButton=false;showUploadTable=false;'><div id='drop-files' ondragover='return false' layout='column' layout-align='space-around center'><div id='uploaded-holder' flex ><div id='dropped-files' ng-show='showUploadTable'><table id='Tabulate' ></table></div></div><div flex ><md-button class='md-raised' id='deletebtn' ng-show='showDeleteButton' class='md-raised' style='color:rgb(244,67,54);margin-left:30px;'><md-icon md-svg-src='img/directive_library/ic_delete_24px.svg'></md-icon></md-button></div><div flex><md-icon md-svg-src='img/directive_library/ic_cloud_upload_24px.svg'></md-icon><text style='font-size:12px;margin-left:10px'>{{label}}<text></div></div></div>",
        scope: {
            label: '@',
            uploadType: '@'
        },
        link: function(scope, element) {
                jQuery.event.props.push('dataTransfer');
                var files;
                var filesArray = [];
                var sampleArray = [];
                element.find("#drop-files").bind('drop', function(e) {
                    files = e.dataTransfer.files || e.dataTransfer.files;
                    for (indexx = 0; indexx < files.length; indexx++) {
                        filesArray.push(files[indexx]);
                        UploaderService.setFile(files[indexx]);
                        UploaderService.BasicArray(filesArray[indexx].name, filesArray[indexx].size);
                        sampleArray.push({
                            'name': filesArray[indexx].name,
                            'size': filesArray[indexx].size
                        });
                    }
                    var newHtml = "<tr class='md-table-headers-row'><th class='md-table-header' style='Padding:0px 16px 10px 0'>Name</th><th class='md-table-header' style='Padding:0px 16px 10px 0'>Type</th><th class='md-table-header' style='Padding:0px 16px 10px 0'>Size</th></tr>";
                    for (var i = 0; i < filesArray.length; i++) {
                        var tableRow = "<tr><td class='upload-table' style='float:left'>" + filesArray[i].name + "</td><td class='upload-table'>" + filesArray[i].type + "</td><td class='upload-table'>" + filesArray[i].size + " bytes" + "</td></tr>";
                        newHtml += tableRow;
                    }
                    element.find("#Tabulate").html(newHtml);
                    $rootScope.$apply(function() {
                        scope.showUploadButton = true;
                        scope.showDeleteButton = true;
                        scope.showUploadTable = true;
                    })
                });

                function restartFiles() {
                    $rootScope.$apply(function() {
                        scope.showUploadButton = false;
                        scope.showDeleteButton = false;
                        scope.showUploadTable = false;
                    })
                    UploaderService.removefileArray(filesArray);
                    UploaderService.removebasicArray(sampleArray);
                    filesArray = [];
                    return false;
                }
                element.find('#drop-files').bind('dragenter', function() {
                    $(this).css({
                        'box-shadow': 'inset 0px 0px 20px rgba(0, 0, 0, 0.1)',
                        'border': '2px dashed rgb(255,64,129)'
                    });
                    return false;
                });
                element.find('#drop-files').bind('drop', function() {
                    $(this).css({
                        'box-shadow': 'none',
                        'border': '2px dashed rgba(0,0,0,0.2)'
                    });
                    return false;
                });
                element.find('#deletebtn').click(restartFiles);
            } //end of link
    };
}]);
rasm.filter('datetime', function($filter){
    return function(input){
      if(input == null){ return ""; } 
     
      var _date = $filter('date')(new Date(input),'dd/MM/yyyy H:MM');         
      return _date.toUpperCase();

    };
});

rasm.filter('unique', function () {

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var hashCheck = {}, newItems = [];

      var extractValueToCompare = function (item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };

      angular.forEach(items, function (item) {
        var valueToCheck, isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
});