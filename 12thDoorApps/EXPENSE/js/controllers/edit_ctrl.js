rasm.controller('EditCtrl', function ($scope, $state, $stateParams, $objectstore, $auth, $EditUploadData, $uploader, $mdDialog, $objectstoreAccess, UploaderService) {
	console.log($stateParams.Eobject);

	//cancel button 
	$scope.viewExpense = function(){
		$state.go('ViewScreen',{'expenseID':$stateParams.Eobject});
	}

	$objectstoreAccess.LoadOneDetails("expense12th", $stateParams.Eobject, function (data) {
		$scope.Edit_Expense = [];
		$scope.Edit_Expense.push(data);
		 
		$scope.selectedItemSup = $scope.Edit_Expense[0].Vendor;
		$scope.totalUSD = $scope.Edit_Expense[0].totalUSD;
		$scope.TotalText = $scope.Edit_Expense[0].totalUSDLabel;
		$scope.selectedItem = $scope.Edit_Expense[0].Assigncustomer;

		$EditUploadData.PutData($scope.Edit_Expense[0].UploadImages.val); // add exsisting image data to factory array
		
		//$scope.searchTextSup = $scope.Edit_Expense.Vendor;
		if ($scope.Edit_Expense[0].Status == "Paid") {
			$scope.calanderdisable = true;
		} else if ($scope.Edit_Expense[0].Status == "Unpaid") {
			$scope.calanderdisable = false;
		}else{
			$scope.calanderdisable = true;
			$scope.Edit_Expense[0].Duedate = undefined;
		}
	});
	$objectstoreAccess.LoadAllDetails("contact", function (data) {
		$scope.AllContacts = [];
		for (var i = data.length - 1; i >= 0; i--) {
			$scope.AllContacts.push({
				display: data[i].CustomerFname + ' ' + data[i].CustomerLname
				, value: data[i].CustomerFname.toLowerCase() + ' ' + data[i].CustomerLname.toLowerCase()
			});
		};
	});
	// supplier autocpmplete
	$scope.selectedItemSup = null;
	$scope.searchTextNewSup = null;
	$scope.QuerySearchSup = QuerySearchSup;

	function QuerySearchSup(query) {
		$scope.enter = function (keyEvent) {
			if (keyEvent.which === 13) {
				if ($scope.selectedItemSupplier === null) {
					$scope.selectedItemSupplier = query;
					console.log(results);
				} else {
					console.log($scope.selectedItemSupplier);
				}
			}
		}
		var results = [];
		for (i = 0, len = $scope.AllContacts.length; i < len; ++i) {
			if ($scope.AllContacts[i].value.indexOf(query.toLowerCase()) != -1) {
				results.push($scope.AllContacts[i]);
			}
		}
		return results;
	}
	//project and contact autocomplete
	$scope.selectedItem = null;
	$scope.searchText = null;
	$scope.querySearch = querySearch;

	function querySearch(query) {
		$scope.enter = function (keyEvent) {
			if (keyEvent.which === 13) {
				if ($scope.selectedItemSupplier === null) {
					$scope.selectedItemSupplier = query;
					console.log(results);
				} else {
					console.log($scope.selectedItemSupplier);
				}
			}
		}
		var results = [];
		for (i = 0, len = $scope.fullarr.length; i < len; ++i) {
			if ($scope.fullarr[i].value.indexOf(query.toLowerCase()) != -1) {
				results.push($scope.fullarr[i]);
			}
		}
		return results;
	}
	$scope.projectarr = [];
	$objectstoreAccess.LoadAllDetails("project", function (data) {
		$scope.projectarr = [];
		for (var i = data.length - 1; i >= 0; i--) {
			$scope.projectarr.push({
				display: data[i].name
				, value: data[i].name.toLowerCase()
				, image: "img/ic_shopping_cart_24px.svg"
			});
		};
		$scope.loadcontactFunc();
	});
	$scope.loadcontactFunc = function () {
		$objectstoreAccess.LoadAllDetails("contact", function (data) {
			$scope.customerarr = [];
			for (var i = data.length - 1; i >= 0; i--) {
				$scope.customerarr.push({
					display: data[i].CustomerFname + ' ' + data[i].CustomerLname
					, value: data[i].CustomerFname.toLowerCase() + ' ' + data[i].CustomerLname.toLowerCase()
					, image: "img/ic_supervisor_account_24px.svg"
				});
			};
			$scope.fullarr = $scope.customerarr.concat($scope.projectarr);
		});
	}
	$scope.ChangeAmount = function (obj) {
		if (obj.Tax == "" || obj.Tax == null) {
			$scope.totalUSD = parseInt(obj.Amount);
			$scope.TotalText = "Total USD (Without Tax)";
		} else if ($scope.TotalText == "Total USD (With Tax)") {
			$scope.totalUSD = parseInt(obj.Amount);
			$scope.TotalText = "Total USD (Without Tax)";
		} else if ($scope.TotalText == "Total USD (Without Tax)") {
			$scope.totalUSD = parseInt(obj.Amount) + parseInt(obj.Tax);
			$scope.TotalText = "Total USD (With Tax)";
		};
	}
	$scope.finalamount = function (obj) {
		if (obj.Amount != "" && obj.Amount != null && obj.Tax != "" && obj.Tax != null) {
			$scope.totalUSD = parseInt(obj.Amount) + parseInt(obj.Tax);
			$scope.TotalText = "Total USD (With Tax)";
		} else if (obj.Tax == "" || obj.Tax == null) {
			$scope.totalUSD = parseInt(obj.Amount);
			$scope.TotalText = "Total USD (Without Tax)";
		}
	}

	
	$scope.calanderfun = function (obj) {
		console.log(obj)
		if (obj.Status == "Paid") {
			$scope.calanderdisable = true;
			obj.Duedate = undefined;
		} else if (obj.Status == "Unpaid") {
			$scope.calanderdisable = false;
		};
	}
	$scope.uploader = function (obj) {
		$mdDialog.show({
			templateUrl: 'expenses_partial/expenses_dialog_partial.html'
			, controller: EyeController
			, locals: {
				item: obj
			}
		});
	}

	function EyeController($scope, $mdDialog, $rootScope, $state, item) {
		$scope.uploadimages = {
			val: []
		};
		if (item.UploadImages.val.length > 0) {
			$scope.uploadimages.val = angular.copy(item.UploadImages.val)
		};
		console.log($scope.uploadimages.val)
		//$scope.uploadimages.val = UploaderService.loadBasicArray(); 
		//directive table content start
		$scope.$on('viewRecord', function (event, args) {
			$scope.uploadimages.val.splice(args, 1);
		});
		$scope.toggleSearch = false;
		$scope.headers = [{
			name: 'Name'
			, field: 'name'
		}, {
			name: 'Size'
			, field: 'size'
		}];
		$scope.custom = {
			name: 'bold'
			, size: 'grey'
		};
		$scope.sortable = ['name', 'size'];
		$scope.thumbs = 'thumb';
		$scope.count = 3;
		//directive table conten end.
		$scope.closeDialog = function () {
			$mdDialog.hide();
		}
		$scope.AddCus = function () {

			$scope.test = {
				val: []
			};
			$scope.test.val = UploaderService.loadBasicArray();
			for (var i = $scope.test.val.length - 1; i >= 0; i--) {
				$scope.uploadimages.val.push($scope.test.val[i]);
			};
			remove_duplicates($scope.uploadimages.val,function(arr){
				$EditUploadData.PutData(arr);
				console.log(arr)
			})
			 //add new images to factory array 
		}
	}
	angular.isUndefinedOrNull = function(val) {
	    return angular.isUndefined(val) || val === null || val === ""
	}
	$scope.updateexpenses = function (updatedForm) {

		if (angular.isUndefinedOrNull($scope.selectedItem)) {
			updatedForm.Assigncustomer = "";			
		}else{
			if (angular.isUndefinedOrNull($scope.selectedItem.display)) {
				updatedForm.Assigncustomer = $scope.selectedItem;
			}else{
				updatedForm.Assigncustomer = $scope.selectedItem.display;
			}	
		}

		if (angular.isUndefinedOrNull($scope.selectedItemSup)) {
			updatedForm.Vendor = "";
		}else{
			if (angular.isUndefinedOrNull($scope.selectedItemSup.display)) {
				updatedForm.Vendor = $scope.selectedItemSup;
			}else{
				updatedForm.Vendor = $scope.selectedItemSup.display;
			}		
		}
		updatedForm.UploadImages = {val:[]};
		updatedForm.UploadImages.val = $EditUploadData.LoadData()
		console.log(updatedForm.UploadImages.val)

		$scope.imagearray = [];
		$scope.imagearray = UploaderService.loadArray();
		if ($scope.imagearray.length > 0) {
			for (indexx = 0; indexx < $scope.imagearray.length; indexx++) {
				$uploader.upload("expenseimagesNew", $scope.imagearray[indexx]);
				$uploader.onSuccess(function (e, data) {});
				$uploader.onError(function (e, data) {
					var toast = $mdToast.simple()
						.content('There was an error, please upload!')
						.action('OK')
						.highlightAction(false)
						.position("bottom right");
					$mdToast.show(toast).then(function () {
						//whatever
					});
				});
			}
		};
		var client = $objectstore.getClient("expense12th");
	    client.onComplete(function (data) {
	      $mdDialog.show($mdDialog.alert().parent(angular.element(document.body))
	        //.title('This is embarracing')
	        .content('Expense Successfully Updated').ariaLabel('').ok('OK').targetEvent(data));
	    });
	    client.onError(function (data) {
	      $mdDialog.show($mdDialog.alert().parent(angular.element(document.body))
	        //.title('This is embarracing')
	        .content('Error Updating Expense').ariaLabel('').ok('OK').targetEvent(data));
	    });
	    client.insert(updatedForm, {
	      KeyProperty: "expense_code"
	    });
	}
});

//remove duplicate objects 
function remove_duplicates(objectsArray,callback) {
    var usedObjects = {};

    for (var i=objectsArray.length - 1;i>=0;i--) {
        var so = JSON.stringify(objectsArray[i]);

        if (usedObjects[so]) {
            objectsArray.splice(i, 1);

        } else {
            usedObjects[so] = true;          
        }
    }
    callback(objectsArray);
}