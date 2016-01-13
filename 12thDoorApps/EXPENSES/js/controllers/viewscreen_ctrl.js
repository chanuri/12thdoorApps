rasm.controller('ViewScreen', function ($scope, $stateParams, $state,$DownloadPdf, $objectstore, $auth, $mdDialog) {
	$scope.eid = $stateParams.expenseID;

	$scope.BillCustomer = function(obj){
		//window.location.replace("/admin/products/view.php?id='"+obj.expense_code+"'");
		window.location.href = window.location.protocol + "//" + window.location.host + "/fullapps/12thdoorApps/INVOICES/INVOICES.html#/estimateInvoice/IName=:"+obj.expense_code+"";
	}
	//cancell function 
	$scope.viewExpense = function(){
		$state.go('home');
	}
	$scope.EditExpense = function (obj) {
		$state.go('Edit_Expense', {
			'Eobject': obj.expense_code
		});
	}
	$scope.ViewExpense = function () {
		$state.go('home');
	}
	$scope.ChangeStatus = function (obj) {
		
		var client = $objectstore.getClient("expense12th");
		client.onComplete(function(data){
			$mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              //.title('This is embarracing')
              .content('Status Sucessfully Changed.')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
              .targetEvent(data)
            );
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
		client.insert(obj,{KeyProperty:"expense_code"});
	};

	function StatusChange(obj){
		if (obj.Status == 'Paid') {
			obj.Status = "Unpaid";
			$scope.ExpenseStatus = "Paid";
		}else if (obj.Status == 'Unpaid') {
			obj.Status = "Paid";
			$scope.ExpenseStatus = "Unpaid";
		};
	}

	$scope.CancelStatus = function (obj) {
		console.log(obj);
		obj.Status = "Cancelled";
			var client = $objectstore.getClient("expense12th");
			client.onComplete(function (data) {
				$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.title('Successful')
					.content('Successfully change the status to Cancelled')
					.ariaLabel('Alert Dialog Demo')
					.ok('OK')
					.targetEvent(data)
				);

			});
			client.onError(function (data) {
				 $mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.title('This is embarracing')
					.content('There was error while changing the status.')
					.ariaLabel('Alert Dialog Demo')
					.ok('OK')
					.targetEvent(data)
				);
			});
			client.insert(obj, {
				KeyProperty: "expense_code"
			});
	};
	//pdf function 
	var specialElementHandlers = {
		'#editor': function (element, renderer) {
			return true;
		}
	}
	$scope.ConvertToPdf = function (obj) {
		  $DownloadPdf.GetPdf(obj);
	}
	$scope.ConvertToPdfAttachment = function (obj) {
		  $DownloadPdf.GetPdfWithAttachment(obj,$scope.ImageData);
	}

	$scope.ViewExpense = [];
	var client = $objectstore.getClient("expense12th");
	client.onGetOne(function (data) {
		console.log(data);
		if (isEmpty(data)) {
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.body))
				.title('This is embarracing')
				.content('There was no record available for this Id .')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data)
			);
		} else if (!isEmpty(data)) {
			$scope.ViewExpense.push(data);
			if ($scope.ViewExpense[0].UploadImages.val.length > 0) {
				$scope.ImageName = $scope.ViewExpense[0].UploadImages.val[0].name; //get first image name
				$scope.LoadImageData($scope.ImageName);			
			};

			if ($scope.ViewExpense[0].Status == 'Unpaid') { //check the status and deside the menu option active or inactive
				$scope.ExpenseStatus = "Paid";
			}else if ($scope.ViewExpense[0].Status == 'Paid') {
				$scope.ExpenseStatus = "Unpaid";
			};		
		};
	});
	client.onError(function (data) {
		$mdDialog.show(
			$mdDialog.alert()
			.parent(angular.element(document.body))
			.title('This is embarracing')
			.content('There was an error retreving the Expense Data.')
			.ariaLabel('Alert Dialog Demo')
			.ok('OK')
			.targetEvent(data)
		);
	});
	client.getByKey($scope.eid);

	$scope.LoadImageData = function(ImgName){
		var client = $objectstore.getClient("expenseimagesNew");
		client.onGetOne(function(data){
			$scope.ImageData = data; //get image data 
			$scope.FileType = $scope.ImageData.FileName.split('.').pop(); //get file type like .png or .jpg			
		});
		client.onError(function(data){
			console.log("error Loading image data")
		});
		client.getByKey(ImgName);
	}

	function isEmpty(obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop))
				return false;
		}
		return true;
	}
	$scope.ExpensesDelete = function (deleteform) {
	    var client = $objectstore.getClient("expense12th");
	    client.onComplete(function (data) {
	      $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Expense Successfully Deleted').ariaLabel('').ok('OK').targetEvent(data));
	      $state.go('home');
	    });
	    client.onError(function (data) {
	      $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Error Deleting Expense').ariaLabel('').ok('OK').targetEvent(data));
	    });
	    client.deleteSingle(deleteform.expense_code, "expense_code");
	}
})