
rasm.controller("ViewScreen",["$scope", "$stateParams","$rootScope","$auth", "$state", "$activityLog","$commentLog","$mdToast","$DownloadPdf","$objectstore", "$auth","$mdDialog", function($scope, $stateParams,$rootScope,$auth, $state, $activityLog,$commentLog, $mdToast,$DownloadPdf, $objectstore, $auth, $mdDialog){
	$scope.UserName = $auth.getSession()

	$scope.ConvertToPdf = function(obj){
		
		if (obj.UploadBrochure.val.length == 0) {
			$mdDialog.show(
              $mdDialog.alert()
              .title("Error Loading Brochures")
              .content("Brochures Are Not Available")
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
            );
		}else{
			for(i=0; i<=obj.UploadBrochure.val.length -1; i++){
				var brochureClient = $objectstore.getClient("productbrochureNew");
				brochureClient.onGetOne(function(data){
					if (!isEmpty(data)) {
						var fileExt = data.FileName.split('.').pop();
			 			var link = document.createElement("a"); // set up <a> tag
						var url;

						if (fileExt  == "pdf" ) {
							url = 'data:application/pdf;base64,' + data.Body;
				        }
						if (fileExt == "docx") {
							url = 'data:application/msword;base64,' + data.Body;
						}

						link.download = data.FileName;					
			            link.href = url;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						delete link;			
					}
				})
				brochureClient.onError(function(data){
					console.log("error loading brochure Data")
				})
				brochureClient.getByKey(obj.UploadBrochure.val[i].name)
			}
		} 
	}
	$scope.print = function(obj){

		if (obj.UploadBrochure.val.length == 0) {
			$mdDialog.show(
              $mdDialog.alert()
              .title("Error Loading Brochures")
              .content("Brochures Are Not Available")
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
            );
		}else{

			for(i=0; i<=obj.UploadBrochure.val.length -1; i++){
				var brochureClient = $objectstore.getClient("productbrochureNew");
				brochureClient.onGetOne(function(data){
					if (!isEmpty(data)) {
						var fileExt = data.FileName.split('.').pop()
						if (fileExt  == "pdf" ) {
							var myWindow = window.open("data:application/pdf;base64," + data.Body)
							myWindow.print(); 
							myWindow.focus();
						};
						if (fileExt == "docx") {window.open("data:application/msword;base64," + data.Body)};					
					}
				})
				brochureClient.onError(function(data){
					console.log("error loading brochure Data")
				})
				brochureClient.getByKey(obj.UploadBrochure.val[i].name)
			}			
		}
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
	      controller: EmailController,
	      templateUrl: 'product_partials/product_email.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      locals :{ object : obj}
	    });
	}

	function EmailController($scope,$mdDialog,$http,object,$objectstore,$auth){
		$scope.email = {};
		$scope.email.Brochure = [];
		$scope.To = [];
		$scope.BCC = [];

		//load all contact details 
		var client = $objectstore.getClient("contact");
		client.onGetMany(function(data){

			for (var i = data.length - 1; i >= 0; i--) { // add new field call full name 
				data[i].FullName = data[i].CustomerFname + ' ' + data[i].CustomerLname;
			};
			$scope.ContactDetails = [];
			for (var i = data.length - 1; i >= 0; i--) {
				$scope.ContactDetails.push({
					display: data[i].FullName
					, value: data[i].FullName.toLowerCase()
					, email: data[i].Email
				});
			};			 
			//console.log($scope.ContactDetails);

		});
		client.onError(function(data){
			console.log("error Loading Contact Details")
		});
		client.getByFiltering("*");
		
		// auto complete chips 
		$scope.selectedItem = null;
		$scope.searchText = null;
		$scope.querySearch = querySearch;

		function querySearch(query) {
			$scope.enter = function (keyEvent) {
				if (keyEvent.which === 13) {
					if ($scope.selectedItem === null) {
						$scope.selectedItem = query;
						//console.log(results);
					} else {
						//console.log($scope.selectedItem);
					}
				}
			}
			var results = [];
			for (i = 0, len = $scope.ContactDetails.length; i < len; ++i) {
				if ($scope.ContactDetails[i].value.indexOf(query.toLowerCase()) != -1) {
					results.push($scope.ContactDetails[i]);
				}
			}
			return results;
		}

		//get brochure name
		if (object.UploadBrochure.val.length > 0) {
			$scope.email.Brochure.push(object.UploadBrochure.val[0].name);
		};

		// if brochure exsisit get all brochure details 
		if ($scope.email.Brochure.length > 0) {
			var client = $objectstore.getClient("productbrochureNew");
			client.onGetOne(function(data){
				$scope.BrochureDetails = data;
				//console.log($scope.email.Brochure)
			});
			client.onError(function(data){
			});
			client.getByKey($scope.email.Brochure)
		};

		$scope.SendMail = function(obj){
			obj.To = [];
			obj.BCC = [];
			
			//console.log($scope.To)
			if ($scope.To.length > 0) {
				for (var i = $scope.To.length - 1; i >= 0; i--) {
					obj.To.push($scope.To[i].email);
				};
			};

			if ($scope.BCC.length > 0) {
				for (var i = $scope.BCC.length - 1; i >= 0; i--) {
					obj.BCC.push($scope.BCC[i].email);
				};
			};

			if ($scope.BrochureDetails) {
				obj.Brochure = $scope.BrochureDetails
			};
			//console.log(obj)
			$http({
				url : "service/email.php",
				method : "POST",
				data : obj,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

			}).then(function(response){
				//console.log(response)
				$mdDialog.show(
	              $mdDialog.alert()
	              .parent(angular.element(document.body))
	              .content(response.data.toString())
	              .ariaLabel('Alert Dialog Demo')
	              .ok('OK')
	              .targetEvent(response)
	            );
			},function(response){
				//console.log(response)
			});
		}
		$scope.closeDialog = function(){
			$mdDialog.hide();
		}
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