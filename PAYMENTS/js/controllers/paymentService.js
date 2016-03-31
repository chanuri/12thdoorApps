
rasm.service("$activityLog",["$objectstore","$auth", function($objectstore,$auth){

    var userName = $auth.getUserName()
    this.newActivity = function(ActivityTxt,pCode,callback){
        var txt = ActivityTxt + userName;
        
        var activityObj = {
            UserName : userName,
            TodayDate : new Date(),
            Comment : txt,
            payment_code :pCode,
            textareaHeight : '30px;',
            activity_code : "-999",
            type : "activity"
        };

        var activityClient = $objectstore.getClient("paymentActivity");
        activityClient.onComplete(function(data){
            console.log("activity Successfully added")
            callback("success")
        });
        activityClient.onError(function(data){
            console.log("error Adding new activity")
            callback("error")
        });
        activityClient.insert(activityObj, {KeyProperty:'activity_code'})
    }
}]);

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

rasm.service('$DownloadPdf',function($filter, $objectstore){
    this.GetPdf = function(obj,type,sampleObj){
     
        var doc = new jsPDF(); 
        obj = hasNull(obj);

        toDataUrl('img/image1.jpg', function(base64Img){
          
            var newDate = $filter('date')(obj.date);

            doc.setFontSize(12); 
            doc.text(10, 10,"Payment No.");
            doc.setFontSize(12);
            doc.text(35, 10, obj.paymentid.toString());
            doc.setFontSize(12);
            doc.text(50, 10,"USD :");
            doc.setFontSize(12);
            doc.text(65, 10,obj.amountReceived.toString());

            doc.addImage(base64Img, 'JPEG', 10, 15, 80, 60);            
            doc.setFontSize(20);
            doc.setFontType("bold");
            doc.text(27, 75,"PAYMENT RECEIPT");

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(27, 100,"Payment No:");
            doc.setFontSize(12);
            doc.text(70, 100,obj.paymentid.toString());
            
            doc.setFontSize(12);
            doc.text(27, 110,"Payment Date:");
            doc.setFontSize(12);
            doc.text(70, 110,newDate);
            
            doc.setFontSize(12);
            doc.text(27, 120,"Payment Method:");
            doc.setFontSize(12);
            doc.text(70, 120,obj.paymentMethod.toString());
            
            doc.setFontSize(12);
            doc.text(27, 130,"Amount Paid:");            
            doc.setFontType("bold");
            doc.setFontSize(12);
            doc.text(70, 130,'$'+obj.amountReceived.toString());

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(27, 140,"Comment"); 

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(70, 140,obj.comments); 

            //Address

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(145, 90,"To:"); 

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(145, 100,obj.customer); 

            if (obj.cusAddress != "") {

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(145, 110,obj.cusAddress.street +" "+ obj.cusAddress.city); 

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(145, 120,obj.cusAddress.state +" "+ obj.cusAddress.country);

            }

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(145, 130,obj.cusEmail); 

            //table headers 

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(35, 160,"Date"); 

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(65, 160,"Invoice No"); 

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(95, 160,"Amount"); 

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(125, 160,"Balance"); 

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(155, 160,"Paid"); 

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(27, 162,"___________________________________________________________________"); 

            // table records 
            var startHeight = 170;

            if (sampleObj.length >0) {
                for(o=0; o<=sampleObj.length-1; o++){
                    sampleObj[o].paidDate = $filter('date')(sampleObj[o].sdate);

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(35, startHeight,sampleObj[o].paidDate.toString()); 

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(65, startHeight,sampleObj[o].invono.toString()); 

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(95, startHeight,sampleObj[o].amount.toString()); 

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(125, startHeight,sampleObj[o].balance.toString()); 

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(155, startHeight,(parseFloat(sampleObj[o].amount) - parseFloat(sampleObj[o].balance)).toString()); 

                    doc.setFontSize(12);
                    doc.setFontType("normal");
                    doc.text(27, startHeight +  2 ,"___________________________________________________________________"); 

                    startHeight += 10;

                }
            }

            //total payments 


            doc.setFillColor(182, 182, 182);
            doc.rect(90, startHeight, 95, 25, 'F');

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(95, startHeight + 10,"Total payments Applied USD"); 

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text(95, startHeight + 20,"Excess Payment USD"); 

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(160, startHeight+ 10, '$'+obj.total.toString()); 


            var outStandingPayment = '0.00';

            var advanceClient = $objectstore.getClient("advancedPayments12thdoor");
            advanceClient.onGetMany(function(data){           

                if (data.length > 0)    outStandingPayment = data[0].uAmount;                 
                printDoc()
 
            });
            advanceClient.onError(function(data){
                console.log("error retriveing advance payment data");
                printDoc()
            });
            advanceClient.getByFiltering("select * from advancedPayments12thdoor where customerid = '"+obj.customerid+"' ");



            function printDoc(){

                doc.setFontSize(12);
                doc.setFontType("normal");
                doc.text(160, startHeight + 20,'$'+outStandingPayment.toString()); 

                if (type == 'print'){
                    doc.autoPrint();
                    doc.output('dataurlnewwindow'); 
                }
                else if (type == 'download') doc.save('' + obj.paymentid + '.pdf');
            }
        });
    }
});

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
 rasm.directive('fileUpLoaderInvoice', ['$uploader', "$rootScope", "$mdToast", 'UploaderService', function($uploader, $rootScope, $mdToast, UploaderService) {
    return {
        restrict: 'E',
        template: "<div class='content' ng-init='showUploadButton=false;showDeleteButton=false;showUploadTable=false;'><div id='drop-files' ondragover='return false' layout='column' layout-align='space-around center'><div id='uploaded-holder' flex ><div id='dropped-files' ng-show='showUploadTable'><table id='Tabulate' ></table></div></div><div flex ><md-button class='md-raised' id='deletebtn' ng-show='showDeleteButton' class='md-raised' style='color:rgb(244,67,54);margin-left:30px;'><md-icon md-svg-src='img/directive_library/ic_delete_24px.svg'></md-icon></md-button></div><div flex><md-icon md-svg-src='img/directive_library/ic_cloud_upload_24px.svg'></md-icon><label for='file-upload' style='font-size:12px;margin-left:10px' class='ng-binding'>{{label}}</label><input  id='file-upload' type='file' style='display: none;' multiple></div></div></div></div>",
        scope: {
            label: '@',
            uploadType: '@'
        },
        link: function(scope, element) {
                jQuery.event.props.push('dataTransfer');
                var files;
                var filesArray = [];
                var sampleArray = [];
                var fileType;
                scope.btnVisibility = false;

                // ng-model='uploadItems'
                element.find("#file-upload").bind('change',function(changeEvent){
                    scope.$apply(function () {
                        scope.fileread = changeEvent.target.files;
                        console.log(scope.fileread)
                    });

                    for(u=0; u<=scope.fileread.length-1; u++){    
                                        
                        var testMe = scope.fileread[u];
                        console.log(scope.fileread[u]);
                            
                        fileType = testMe.type.split("/")[0];

                        if (fileType == 'image') {
                            scope.btnVisibility = true;
                            filesArray.push(scope.fileread[u]);
                            UploaderService.setFile(scope.fileread[u]);
                            UploaderService.BasicArray(testMe.name, testMe.size);
                            sampleArray.push({
                                'name': testMe.name,
                                'size': testMe.size
                            });
                        }
                    }
                    bindNewFile()
                    
                })

                element.find("#drop-files").bind('drop', function(e) {

                    files = e.dataTransfer.files || e.dataTransfer.files;
                    for (indexx = 0; indexx < files.length; indexx++) {
                        
                        fileType = files[indexx].type.split("/")[0];
                        if (fileType == 'image') {
                            scope.btnVisibility = true;
                            filesArray.push(files[indexx]);
                            UploaderService.setFile(files[indexx]);
                            UploaderService.BasicArray(filesArray[indexx].name, filesArray[indexx].size);
                            sampleArray.push({
                                'name': filesArray[indexx].name,
                                'size': filesArray[indexx].size
                            });
                        }
                    }
                    bindNewFile()
                });

                function bindNewFile(){

                    if (scope.btnVisibility) {
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
                    }
                }

                function restartFiles() {
                    $rootScope.$apply(function() {
                        scope.showUploadButton = false;
                        scope.showDeleteButton = false;
                        scope.showUploadTable = false;
                        scope.btnVisibility = false;
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