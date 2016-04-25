
rasm.controller("EmailController", ["$scope","$objectstore","object","$sce","$mdDialog", function($scope,$objectstore,object,$sce,$mdDialog){

	$scope.emailTo = [];
    $scope.emailBcc = [];
    $scope.emailSubject ="";
    $scope.productid = object.product_code
    $scope.pdfChipArr = [];
    $scope.pdfChipArr.push(object.product_code+".pdf")

	$scope.ContactDetails = []

    var contactClient = $objectstore.getClient("contact12thdoor");
    contactClient.onGetMany(function(data){
        for(i=0; i<=data.length-1; i++){
            $scope.ContactDetails.push({
                email : data[i].Email,
                display : data[i].Name,
                value : (data[i].Name).toLowerCase()
            })
        }
    });
    contactClient.onError(function(data){
        console.log("error loading contact details")
    });
    contactClient.getByFiltering("select * from contact12thdoor where status = 'Active'")

    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.selectedItemTo = null;
    $scope.searchTextTo = null;

    $scope.querySearch = querySearch;

    function querySearch(query) {
        var results = [];
        for (i = 0, len = $scope.ContactDetails.length; i < len; ++i) {
            if ($scope.ContactDetails[i].value.indexOf(query.toLowerCase()) != -1) {
                results.push($scope.ContactDetails[i]);
            }
        }
        return results;
    }

	var emailBodyClient = $objectstore.getClient("t12thdoorSettingEmailBody")
    emailBodyClient.onGetMany(function(data){ 
        $scope.emailBody = data[0].emailBody; 
        var newOne = [];
        // newOne.push(data[0].emailBody.substring(data[0].emailBody.indexOf("{{")+2,data[0].emailBody.indexOf("}}")));
        $scope.emailBody = $scope.emailBody.replace("@@paymentNo@@", object.product_code);
        $scope.emailBody = $scope.emailBody.replace("@@accounturl@@", "<a style='color: blue;' href='http://12thdoor.com'>http://12thdoor.com</a>") 
        $scope.emailBody = $scope.emailBody.replace("@@companyName@@", object.product_code);
        $scope.emailBody = '<p style="font-size:15px;">' + $scope.emailBody + '</p>'
        $scope.emailBody = $sce.trustAsHtml($scope.emailBody);
        
 
    });
    emailBodyClient.onError(function(data){
        console.log("error loading email body")
    });
    emailBodyClient.getByFiltering("select * from t12thdoorSettingEmailBody where uniqueRecord ='2' ")

    $scope.closeEmail = function(){ 
        $mdDialog.hide()
    }

}])


rasm.controller("ViewScreen",["$scope", "$stateParams","$rootScope","$auth", "$state","$helpers", "$activityLog","$commentLog","$mdToast","$DownloadPdf","$objectstore", "$auth","$mdDialog", "$storage","$http", function($scope, $stateParams,$rootScope,$auth, $state,$helpers, $activityLog,$commentLog, $mdToast,$DownloadPdf, $objectstore, $auth, $mdDialog, $storage, $http){
	
	$auth.checkSession(); 
	$scope.UserName =  $auth.getSession().Name 
	$scope.hostUrl = $helpers.getHost()
	$scope.pdf = {
		file: null,
		thumbnail: ""
	};

	function loadThumnail(){
		if ($scope.ViewExpense[0].UploadBrochure.val.length > 0) {
			var url = $storage.getMediaUrl("productbrochureNew", $scope.ViewExpense[0].UploadBrochure.val[0].name);
			console.log(url);
		 

			toDataUrl(url, function(response){
				console.log(response)
			})

			function toDataUrl(url, callback){
			    var xhr = new XMLHttpRequest();
			    xhr.responseType = 'blob';
			    xhr.onload = function(e) {
				  if (this.status == 200) {
				    // Note: .response instead of .responseText
				    $scope.pdf.file = new Blob([this.response], {type: 'application/pdf'});
				    callback($scope.pdf);
				  }
				};
			    xhr.open('GET', url);
			    xhr.send();
			}
		}		
	}

	$scope.ConvertToPdf = function(obj){
		$DownloadPdf.GetPdf(obj,'download')
	}
	$scope.print = function(obj){
		$DownloadPdf.GetPdf(obj,'print')
	}
	function isEmpty(obj) {
	    for(var prop in obj) {
	        if(obj.hasOwnProperty(prop))
	            return false;
	    }
	    return true;
	}
	// check comment label 
	$scope.CheckText = function(obj,event){
		if (obj.Commentstxt) { 
			$scope.lblVisibility = 'Hidelabel';
		}else{
			$scope.lblVisibility = 'Showlabel';
		}
		event.preventDefault();
	}
	$scope.cancelEdit = function(pro){
		pro.Commentstxt = "";	
		$scope.editButtonVisible = false;	
	}
	$scope.CommentEdit = function(pro,obj,index){
		$scope.ProgressBar = false;
		$scope.editButtonVisible = true;
		pro.Commentstxt = obj.Comment;
		$scope.lblVisibility = 'Hidelabel';
		$commentLog.addEditObject(obj,index)
		//$scope.CommentDelete(obj,index,"edit")
	}

	// current comment delete 
	$scope.CurrentCommentDelete = function(obj){
		obj = {};
		$scope.ProgressBar = false;
	}
	// comment delete 
	$scope.CommentDelete = function(item,index,type){
		var client = $objectstore.getClient("productComment");
		client.onComplete(function(data){

			$scope.ViewExpense[0].Comments.splice(index,1); //remove from array
			if (type == "edit") {

			}else{
				var toast = $mdToast.simple()
			 	.content('Successfully Deleted!')
			 	.action('OK')
			 	.highlightAction(false)
			 	.position("bottom right");
			 	$mdToast.show(toast).then(function() {
			 	});
			}			
		});
		client.onError(function(data){
			var toast = $mdToast.simple()
		 	.content('Fail to Delete')
		 	.action('OK')
		 	.highlightAction(false)
		 	.position("bottom right");
		 	$mdToast.show(toast).then(function() {

		 	});
		});
		client.deleteSingle(item.comment_code,"comment_code");
	}
	// comment repost 
	$scope.Repost = function(obj){				
		$scope.ProgressBar = false;
		CommentToObjectstore(obj);
	}
	// comment submit
	$scope.CommentObj = {};
	$scope.ProgressBar = false;
	$scope.editButtonVisible = false;
	$scope.commentProgress = true;

	$scope.SaveComment = function(obj,event){
		var result = document.getElementById("CommentTxt").scrollHeight;
		$scope.Height = angular.element(result);
		
		if ((event.keyCode == 10 || event.keyCode == 13) && event.shiftKey){
			
		}else if ((event.keyCode == 10 || event.keyCode == 13) && !event.shiftKey) {
			 event.preventDefault(); //prevent actions
			 if (obj.Commentstxt) { // if comment is not null
				var TodayDate = new Date();
				if (!$scope.editButtonVisible) {
					$scope.CommentObj = {
					 	UserName : $scope.UserName,
					 	TodayDate : TodayDate,
					 	Comment : obj.Commentstxt,
					 	product_code : $scope.ViewExpense[0].product_code,
					 	productNum : $stateParams.productID.slice(-4),
					 	textareaHeight : $scope.Height[0] + 'px;',
					 	type : "comment",
					 	edited : false
					}				 	
				}
				else if ($scope.editButtonVisible) {
					var originalObj = $commentLog.returnEditObject()
					$scope.CommentDelete(originalObj.commentObj,originalObj.index,"edit")

				 	$scope.CommentObj = {
					 	UserName : $scope.UserName,
					 	TodayDate : TodayDate,
					 	Comment : obj.Commentstxt,
					 	product_code : $scope.ViewExpense[0].product_code,
					 	productNum : $stateParams.productID.slice(-4),
					 	textareaHeight : $scope.Height[0] + 'px;',
					 	type : "comment",
					 	edited : true
					}
				}

				obj.Commentstxt = ""; //make textare empty
				$scope.CommentObj.comment_code = "-999";
				$scope.ProgressBar = true; 
				CommentToObjectstore($scope.CommentObj);
				$scope.editButtonVisible = false;
			}
		}
	}

	//function to submit comment to objectstore
	function CommentToObjectstore(obj){
		 var client = $objectstore.getClient("productComment");
		 client.onComplete(function(data){
		 	//console.log(data.Data[0])
	 		 obj.comment_code = data.Data[0].ID;
	 		 //console.log(obj.TodayDate);
	 		 //obj.TodayDate = obj.TodayDate.replace(/^"(.*)"$/, '$1'); //remove double quates
	 		 //add new comment to array 
	 		 if (!$scope.ViewExpense[0].Comments) {
	 		 	$scope.ViewExpense[0].Comments = [];
	 		 	$scope.ViewExpense[0].Comments.unshift(obj);
	 		 }else{
	 		 	$scope.ViewExpense[0].Comments.unshift(obj);			 		 	
	 		 }
	 		 //console.log($scope.ViewExpense[0].Comments);
	 		 obj = {};
	 		 $scope.ProgressBar = false;

		 	var toast = $mdToast.simple()
		 	.content('Successfully Added!')
		 	.action('OK')
		 	.highlightAction(false)
		 	.position("bottom right");
		 	$mdToast.show(toast).then(function() {});

		 });
		 client.onError(function(data){
		 	var toast = $mdToast.simple()
		 	.content('Fail to add comment')
		 	.action('OK')
		 	.highlightAction(false)
		 	.position("bottom right");
		 	$mdToast.show(toast).then(function() {
		 		$scope.ProgressBar = true;
		 	});
		 });
		 client.insert(obj, {
		 	KeyProperty: "comment_code"
		 });

	}

	$scope.SendEmail = function(ev,obj){ // send email 
		$mdDialog.show({
	      controller: 'EmailController',
	      templateUrl: 'product_partials/product_email.html', 
	      clickOutsideToClose:true,
	      locals :{ object : obj}
	    });
	}

 
	//load all products 
	var client = $objectstore.getClient("product12thdoor");
	client.onGetMany(function(data){
		$scope.ViewExpense = data;
		$scope.ViewExpense[0].Commentstxt = ""; // ADD empty field to comment 
		$scope.ViewExpense[0].Comments = [];
		//console.log($scope.ViewExpense[0])
		if ($scope.ViewExpense[0].status == 'Active') { //check the status and deside the menu option active or inactive
			$scope.ProductStatus = "Inactive";
		}else if ($scope.ViewExpense[0].status == 'Inactive') {
			$scope.ProductStatus = "Active";
		};
		loadThumnail();

		LoadImageData(function(){
			LoadAllComments($scope.ViewExpense[0].product_code);
		});
	});
	client.onError(function(data){
		console.log("error Loading data")
	});
	client.getByFiltering("select * from product12thdoor where ProductCode = '"+$stateParams.productID+"'");

	$scope.EditProduct = function(obj){
		$state.go('Edit_Product', {
			'Eobject': obj.product_code
		});
	}

	$scope.ChangeStatus = function(obj){

		var client = $objectstore.getClient("product12thdoor");
		client.onComplete(function(data){
			var txtActivity = "Status Changed To " + obj.status + " By ";

			$activityLog.newActivity(txtActivity,obj.product_code,obj.ProductCode,function(status){
				if (status == "success") {
					var txt = txtActivity + $scope.UserName;
					
					$scope.ViewExpense[0].Comments.unshift({
					 	TodayDate : new Date(),
					 	Comment : txt,
					 	product_code :obj.product_code,
					 	productNum : obj.ProductCode,
					 	textareaHeight : '30px;',
					 	type : "activity"
					});

					$mdDialog.show(
		              $mdDialog.alert()
		              .parent(angular.element(document.body))
		              //.title('This is embarracing')
		              .content('Status Sucessfully Changed.')
		              .ariaLabel('Alert Dialog Demo')
		              .ok('OK')
		              .targetEvent(data)
		            );
				}
			})			
		});
		client.onError(function(data){
			$mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .content('Fail to Change Status.')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
              .targetEvent(data)
            );
            StatusChange(obj);
		});
		StatusChange(obj);  //function to check the status 
		client.insert(obj,{KeyProperty:"product_code"});
	}

	function StatusChange(obj){
		if (obj.status == 'Active') {
			obj.status = "Inactive";
			$scope.ProductStatus = "Active";
		}else if (obj.status == 'Inactive') {
			obj.status = "Active";
			$scope.ProductStatus = "Inactive";
		};
	}

	$scope.DeleteProduct = function(obj,ev){
	  	var confirm = $mdDialog.confirm()
          .title('Would you like to Delete your Product ?')
          .content('Your Product Will Be Delete Permanently')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');
	    $mdDialog.show(confirm).then(function() {
	    	obj.deleteStatus = true;
	    	var addClient = $objectstore.getClient("product12thdoor");
	    	addClient.onComplete(function(data){
	    		$mdDialog.show(
		          $mdDialog.alert()
		          .parent(angular.element(document.body))
		          .title('Success')
		          .content('Product Successfully Deleted')
		          .ariaLabel('')
		          .ok('OK')
		          .targetEvent(ev)
		        );
		       	$state.go("home");
	    	});
	    	addClient.onError(function(data){
	    		$mdDialog.show(
		          $mdDialog.alert()
		          .parent(angular.element(document.body))
		          .title('Error')
		          .content('Error Occur While Deleting The Product')
		          .ariaLabel('')
		          .ok('OK')
		          .targetEvent(ev)
		        );
		        obj.deleteStatus = false;
	    	});
	    	addClient.insert(obj,{KeyProperty : 'product_code'});
	    }, function() {});  
	} 

	//copy all object to new state 
	$scope.CopyProduct = function(obj){		
		$state.go('Copy_Product',{productID:obj.ProductCode})
	}
	function LoadImageData(callback){
      var client = $objectstore.getClient("productimagesNew");
      client.onGetMany(function(data){
        $scope.LoadImageArray = data;
        //console.log($scope.ViewExpense[0])
        if ($scope.ViewExpense[0].UploadImages.val.length > 0) {
        	for (var i = $scope.LoadImageArray.length - 1; i >= 0; i--) {
	            if ($scope.LoadImageArray[i].FileName == $scope.ViewExpense[0].UploadImages.val[0].name) {
	               $scope.ImageData =  $scope.LoadImageArray[i];
	            }      
	        };
        };        
        //console.log($scope.ImageData)
        if ($scope.ImageData) {
        	 $scope.FileType = $scope.ImageData.FileName.split('.').pop()
        };
        callback();
      });
      client.onError(function(data){
      	console.log("error ")
      	callback();
      });
      client.getByFiltering("*");
    }

    //load all comments
    function LoadAllComments(Pcode){
    	$scope.ViewExpense[0].Comments = [];
    	var client = $objectstore.getClient("productComment");
    	client.onGetMany(function(data){
    		if (data) {
    			loadAllActivities(Pcode,data);
    		};    		
    	});
    	client.onError(function(data){
    		console.log("error Loading comments");
    	});
    	client.getByFiltering("select * from productComment where product_code = '"+Pcode+"'")
    }

    function loadAllActivities(Pcode,commentArr){
    	var ActivityClient = $objectstore.getClient("productActivity");
    	ActivityClient.onGetMany(function(data){
    		var fullArr = [];
    		if (data.length > 0) {
    			fullArr = commentArr.concat(data)
    		}else{
    			fullArr = data;
    		}
    		
			$scope.ViewExpense[0].Comments = fullArr.sort(function(a,b){
			  return new Date(b.TodayDate) - new Date(a.TodayDate);
			});
			$scope.commentProgress = false;
    	});
    	ActivityClient.onError(function(data){
    		console.log("error loading data");
    	}); 
    	ActivityClient.getByFiltering("select * from productActivity where product_code = '"+Pcode+"'")

    }

    $scope.cancelBtn = function(){
    	$state.go("home")
    }

}]);