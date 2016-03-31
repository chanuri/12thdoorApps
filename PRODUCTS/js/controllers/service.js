
rasm.directive('embedSrc', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var current = element;
      scope.$watch(function() { return attrs.embedSrc; }, function () {
        var clone = element
                      .clone()
                      .attr('src', attrs.embedSrc);
        current.replaceWith(clone);
        current = clone;
      });
    }
  };
})

rasm.service("$commentLog",function(){
	var commentObj = {};
	var index;

	this.addEditObject = function(obj,inx){
		commentObj = {};
		commentObj = obj;
		index = inx;
	}
	this.returnEditObject = function(){
		return {
			commentObj : commentObj,
			index : index
		}
	}
})

rasm.service("$activityLog",["$objectstore","$auth", function($objectstore,$auth){

	var userName = $auth.getUserName()
	this.newActivity = function(ActivityTxt,pCode,pNum,callback){
		var txt = ActivityTxt + userName;
		
		var activityObj = {
		 	UserName : userName,
		 	TodayDate : new Date(),
		 	Comment : txt,
		 	product_code :pCode,
		 	productNum : pNum,
		 	textareaHeight : '30px;',
		 	activity_code : "-999",
		 	type : "activity"
		};

		var activityClient = $objectstore.getClient("productActivity");
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

rasm.directive('fileUpLoadersNew',['$uploader',"$rootScope", "$mdToast",'ProductService', function($uploader,$rootScope, $mdToast, ProductService) {
  return {
	restrict: 'E',
	template: "<div class='content' ng-init='showUploadButton=false;showDeleteButton=false;showUploadTable=false;'><div id='drop-files' ondragover='return false' layout='column' layout-align='space-around center'><div id='uploaded-holder' flex ><div id='dropped-files' ng-show='showUploadTable'><table id='Tabulate' ></table></div></div><div flex ><md-button class='md-raised' id='deletebtn' ng-show='showDeleteButton' class='md-raised' style='color:rgb(244,67,54);margin-left:30px;'><md-icon md-svg-src='img/directive_library/ic_delete_24px.svg'></md-icon></md-button></div><div flex><md-icon md-svg-src='img/directive_library/ic_cloud_upload_24px.svg'></md-icon><label for='file-upload' style='font-size:12px;margin-left:10px' class='ng-binding'>{{label}}</label><input  id='file-upload' type='file' style='display: none;' multiple></div></div></div></div>",
    scope:{			 
		label:'@',
		uploadType:'@'
	},
	link: function(scope,element){
		// Makes sure the dataTransfer information is sent when we
		// Drop the item in the drop box.
		jQuery.event.props.push('dataTransfer');

		// file/s on a single drag and drop
		var files;			
		// total of all the files dragged and dropped
		var filesArray = [];
		
		var sampleArray = [];
		var sampleArraybrochure = [];
		var fileType;
		scope.btnVisibility = false;

		element.find("#file-upload").bind('change',function(changeEvent){
	        scope.$apply(function () {
	            scope.fileread = changeEvent.target.files;
	            console.log(scope.fileread)
	        }); 

	        if (scope.uploadType == "image") {
	        	for(u=0; u<=scope.fileread.length-1; u++){ 			  		  
			  		fileType = scope.fileread[u].type.split("/")[0];
			  		if (fileType == 'image') {
			  			scope.btnVisibility = true;
						filesArray.push(scope.fileread[u]);
						ProductService.setArray(scope.fileread[u]);
						ProductService.BasicArray(scope.fileread[u].name,scope.fileread[u].size);
						sampleArray.push({'name': scope.fileread[u].name, 'size': scope.fileread[u].size});
			  		}				 
				}

			}else if (scope.uploadType == "brochure") {

	        	for(u=0; u<=scope.fileread.length-1; u++){ 		  
			  		fileType = scope.fileread[u].type.split("/")[0];
			  		if (fileType == 'application') {
			  			scope.btnVisibility = true;
						filesArray.push(scope.fileread[u]);
						ProductService.setArraybrochure(scope.fileread[u]);
						ProductService.BasicArraybrochure(scope.fileread[u].name,scope.fileread[u].size);
						sampleArraybrochure.push({'name': scope.fileread[u].name, 'size': scope.fileread[u].size});	
					}					 
				}

			}
			bindNewFile();	        
	    })
		
		// Bind the drop event to the dropzone.
		element.find("#drop-files").bind('drop', function(e) {
				
			// Stop the default action, which is to redirect the page
			// To the dropped file
			
			files = e.dataTransfer.files || e.dataTransfer.files;

			
			if (scope.uploadType == "image") {

			  for(indexx = 0; indexx < files.length; indexx++) {			  		  
			  		fileType = files[indexx].type.split("/")[0];
			  		if (fileType == 'image') {
			  			scope.btnVisibility = true;
						filesArray.push(files[indexx]);
						ProductService.setArray(files[indexx]);
						ProductService.BasicArray(files[indexx].name,files[indexx].size);
						sampleArray.push({'name': files[indexx].name, 'size': files[indexx].size});
			  		}				 
				}

			}else if (scope.uploadType == "brochure") {

				 for(indexx = 0; indexx < files.length; indexx++) {
			  		fileType = files[indexx].type.split("/")[0];
			  		if (fileType == 'application') {
			  			scope.btnVisibility = true;
						filesArray.push(files[indexx]);
						ProductService.setArraybrochure(files[indexx]);
						ProductService.BasicArraybrochure(files[indexx].name,files[indexx].size);
						sampleArraybrochure.push({'name': files[indexx].name, 'size': files[indexx].size});	
					}					 
				}

			}
			bindNewFile();
		});	

		function bindNewFile(){

			if (scope.btnVisibility) {
			 	var newHtml = "<tr class='md-table-headers-row'><th class='md-table-header' style='Padding:0px 16px 10px 0'>Name</th><th class='md-table-header' style='Padding:0px 16px 10px 0'>Type</th><th class='md-table-header' style='Padding:0px 16px 10px 0'>Size</th></tr>";

			  	for (var i = 0; i < filesArray.length; i++) {
					var tableRow = "<tr><td class='upload-table' style='float:left'>" + filesArray[i].name + "</td><td class='upload-table'>" +
					filesArray[i].type+ "</td><td class='upload-table'>" +
					filesArray[i].size +" bytes"+ "</td></tr>";
					newHtml += tableRow;
				}

				element.find("#Tabulate").html(newHtml);
				 
				$rootScope.$apply(function(){
					scope.showUploadButton = true;
					scope.showDeleteButton = true;
					scope.showUploadTable = true;
				})
			}
		}	
		function restartFiles() {			
			// We need to remove all the images and li elements as
			// appropriate. We'll also make the upload button disappear
			 $rootScope.$apply(function(){
				scope.showUploadButton = false;
				scope.showDeleteButton = false;
				scope.showUploadTable = false;
				scope.btnVisibility = false;
			 })		
			// And finally, empty the array
			ProductService.removeArray(filesArray,scope.uploadType);
			ProductService.removebasicArray(sampleArray);
			ProductService.removebasicArraybrochure(sampleArraybrochure);
			filesArray = [];

			
			return false;
		}
		// Just some styling for the drop file container.
		element.find('#drop-files').bind('dragenter', function() {
			$(this).css({'box-shadow' : 'inset 0px 0px 20px rgba(0, 0, 0, 0.1)', 'border' : '2px dashed rgb(255,64,129)'});
			return false;
		});
		
		element.find('#drop-files').bind('drop', function() {
			$(this).css({'box-shadow' : 'none', 'border' : '2px dashed rgba(0,0,0,0.2)'});
			return false;
		});
		
	
		element.find('#deletebtn').click(restartFiles);
		
	
	} //end of link
  };
}]);
rasm.factory('ProductService',["$rootScope","$objectstore", function($rootScope,$objectstore){
    
    $rootScope.testArray = [];
    $rootScope.basicinfo = [];
    $rootScope.testArraybrochure = [];
    $rootScope.basicinfobrochure = [];

	  return {

	  	setArraysEmpty: function(){

	  		$rootScope.testArray = [];
		    $rootScope.basicinfo = [];
		    $rootScope.testArraybrochure = [];
		    $rootScope.basicinfobrochure = [];
	  	},
	    setArraybrochure: function(newVal) {
	        $rootScope.testArraybrochure.push(newVal);
	      	return $rootScope.testArraybrochure;
	    },
	  	loadArraybrochure: function() {    
	      	return $rootScope.testArraybrochure;
	   	},
	   	loadBasicArraybrochure: function() {    
	      	return $rootScope.basicinfobrochure;
	   	},
	  	BasicArraybrochure: function(name,size) {
	    	$rootScope.basicinfobrochure.push({'name': name , 'size': size});
	      	console.log($rootScope.basicinfobrochure);
	      	return $rootScope.basicinfobrochure;
	   	},  
	  	setArray: function(newVal) {
	        $rootScope.testArray.push(newVal);
	      	return $rootScope.testArray;
	    },
	  	loadArray: function() {    
	      	return $rootScope.testArray;
	   	},
	   	loadBasicArray: function() {    
	      	return $rootScope.basicinfo;
	   	},
	  	BasicArray: function(name,size) { 

	    	$rootScope.basicinfo.push({'name': name , 'size': size});
	      	console.log($rootScope.basicinfo);
	      	return $rootScope.basicinfo;
	   	},
	  	removeArray: function(arr,type){

	      	if(type == "image") {
		        for (var i = arr.length - 1; i >= 0; i--) {
			        $rootScope.testArray.splice(arr[i], 1);
			    }
		        console.log($rootScope.testArray);
		        return $rootScope.testArray;
	     	}
	     	else if(type == "brochure") {
		        for (var i = arr.length - 1; i >= 0; i--) {
		        	$rootScope.testArraybrochure.splice(arr[i], 1);
		        };
		        console.log($rootScope.testArraybrochure);
		        return $rootScope.testArraybrochure;
	     	}    
	   	},

	   	removebasicArraybrochure: function(arr){
	        for (var i = arr.length - 1; i >= 0; i--) {
	          	$rootScope.basicinfobrochure.splice(arr[i], 1);
	        };
	        console.log($rootScope.basicinfobrochure);
	        return $rootScope.basicinfobrochure;
	   	},
	   	removebasicArray: function(arr){	   
	        for (var i = arr.length - 1; i >= 0; i--) {
	          	$rootScope.basicinfo.splice(arr[i], 1);
	        };
	        console.log($rootScope.basicinfo);
	        return $rootScope.basicinfo;    
	   	}
	  }  
  
}]);

rasm.service('$DownloadPdf',function($objectstore){
	this.GetPdf = function(obj,type){

		obj = hasNull(obj); // remove all the null values inside array 		
		

		var doc = new jsPDF();
		doc.setFillColor(182, 182, 182);
		doc.rect(120, 13, 80, 10, 'F');
		doc.setFontSize(18);
		doc.text(160, 20, obj.Productname);

		doc.setFontSize(14);
		doc.text(120, 30, obj.description);

		doc.setFontSize(14);
		doc.text(120, 50, 'Product Code');
		doc.setFontSize(14);
		doc.text(160, 50, obj.ProductCode);
		doc.setFontSize(14);

		doc.text(120, 60, 'Default UOM');
		doc.setFontSize(14);
		doc.text(160, 60,obj.ProductUnit);
		doc.setFontSize(14);
		doc.text(120, 70, 'Price (with tax)');
		doc.setFontSize(14);
		doc.text(160, 70, obj.productprice.toString());
		doc.setFontSize(14);

		doc.text(120, 80, 'Tax');
		if (obj.producttax != 0) {
			doc.setFontSize(14);
			doc.text(160, 80, obj.producttax.taxname);			
		}
		doc.setFontSize(14);
		doc.text(120, 90, 'Cost');
		doc.setFontSize(14);
		doc.text(160, 90, obj.costprice.toString());
		doc.setFontSize(14);
		doc.text(120, 100, 'Brand');
		doc.setFontSize(14);
		doc.text(160, 100, obj.brand);
		doc.setFontSize(14);
		doc.text(120, 110, 'Category');
		doc.setFontSize(14);
		doc.text(160, 110, obj.ProductCategory);
		doc.setFontSize(14);
		doc.text(120, 120, 'Track');
		doc.setFontSize(14);
		doc.text(160, 120, obj.inventory);
		doc.setFontSize(14);
		doc.text(120, 130, 'Stock');
		doc.setFontSize(14);
		doc.text(160, 130, obj.stocklevel.toString());
		doc.setFontSize(14);
		doc.text(120, 150, 'Tags');
		doc.setFontSize(14);

		var tagLength = 150;

		if(obj.tags.length > 0){
			for (i = 0; i < obj.tags.length; i++) {
				doc.text(160, tagLength, obj.tags[i]);
				tagLength += 10
			}			
		}

		if (obj.UploadImages.val.length > 0) {
			var imageClient = $objectstore.getClient("productimagesNew");
				imageClient.onGetOne(function(data){
					if (!isEmpty(data)) {

							var fileExt = data.FileName.split('.').pop();
							var imagebody ="data:image/"+fileExt+";base64," +data.Body
							console.log(imagebody)		
            				doc.addImage(imagebody, fileExt.toUpperCase(), 20, 15, 80, 60);    
					}
					if (type == 'print') {
                    	doc.autoPrint();
				      	doc.output('dataurlnewwindow'); 
				    }else if (type == 'download') {
				      	doc.save('' + obj.product_code + '.pdf');
				    };
				})
				imageClient.onError(function(data){
					console.log("error loading brochure Data")
				})
				imageClient.getByKey(obj.UploadImages.val[0].name)
		}else{
			if (type == 'print') {
            	doc.autoPrint();
		      	doc.output('dataurlnewwindow'); 
		    }else if (type == 'download') {
		      	doc.save('' + obj.product_code + '.pdf');
		    };
		}
	}
});

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}
rasm.service('$objectstoreAccess', ['$objectstore', '$auth', '$mdDialog'
	, function ($objectstore, $auth, $mdDialog) {
		this.LoadAllDetails = function (namespace, callback) {
			var client = $objectstore.getClient(namespace);
			client.onGetMany(function (data) {
				// return data; //cannot return in asynchronous function 
				callback(data);
			});
			client.onError(function (data) {
				$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.title('This is embarracing')
					.content('There was error while retreving the data.')
					.ariaLabel('Alert Dialog Demo')
					.ok('OK')
					.targetEvent(data)
				);
			});
			client.getByFiltering("*");
		};
		this.LoadOneDetails = function (namespace, key, callback) {
			var client = $objectstore.getClient(namespace);
			client.onGetOne(function (data) {
				callback(data);
			});
			client.onError(function (data) {
				$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.title('This is embarracing')
					.content('There was error while retreving the record.')
					.ariaLabel('Alert Dialog Demo')
					.ok('OK')
					.targetEvent(data)
				);
			});
			client.getByKey(key);
		}
	}
]);

rasm.factory('$EditUploadData',["$rootScope", function($rootScope){
	$rootScope.UploadData = [];
	return{
		PutData:function(arr){
			$rootScope.UploadData = angular.copy(arr);
		},
		LoadData:function(){
			return $rootScope.UploadData;
		}
	}
}]);

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
rasm.filter('datetime',["$filter", function($filter)
{
 return function(input)
 {
  if(input == null){ return ""; } 
 
  var _date = $filter('date')(new Date(input),'dd/MM/yyyy H:MM');
 
  return _date.toUpperCase();

 };
}]);

// remove all the null values in an array 
// pass the array as a parameter and return not null element array 
function hasNull(target) {
    for (var member in target) {
        if (target[member] == null || angular.isUndefined(target[member]))
           target[member] = "";
    }
  return target;
}