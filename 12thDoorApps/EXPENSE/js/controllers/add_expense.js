rasm.controller('AppCtrl', function ($scope, $mdToast, $uploader, $rootScope, UploaderService, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $timeout, $objectstoreAccess) {
	

	var Settings  =  $objectstore.getClient("Settings12thdoor");
	Settings.onGetMany(function(data){
		console.log(data)
		GetCategory(data,function(){
			getCustFiled(data);
		});
	});
	Settings.onError(function(data){
		console.log("error loading settings")
	});
	Settings.getByFiltering("*");

	function GetCategory(arr,callback){
		$scope.CategoryArray = [];
		var CatArr = arr[0].preference.expensepref.expensecategories;
		for (var i = CatArr.length - 1; i >= 0; i--) {
        	if (CatArr[i].activate) {
            	$scope.CategoryArray.push(CatArr[i].category);
       		}
      	}
        callback();
	}

	function getCustFiled(arr){
		$scope.custArr = [];
		var fieldArr = arr[0].preference.expensepref.CusFiel;
		for(var l=0; l<= fieldArr.length -1; l++){
			$scope.custArr.push(fieldArr[l].name);
		}
	}


	$scope.CurrentDate = moment().format("LL");
	console.log($scope.CurrentDate)
	$scope.EmptyDuedate =undefined;
	
	$scope.selectedItemSupplier = null;
	$scope.searchTextSupplier = null;
	$scope.querySearchSupplier = querySearchSupplier;

	function querySearchSupplier(query) {
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
		for (i = 0, len = $scope.customerarr.length; i < len; ++i) {
			if ($scope.customerarr[i].value.indexOf(query.toLowerCase()) != -1) {
				results.push($scope.customerarr[i]);
			}
		}
		return results;
	}
	//auto complete for customer and projects start
	var self = this;
	// list of `state` value/display objects
	self.tenants = loadAll();
	self.selectedItem = null;
	self.searchText = null;
	self.querySearch = querySearch;
	$scope.calanderdisable = true;
	$scope.ShowDate = true;

	$scope.calanderfun = function (obj) {
		if (obj.Status == "Paid") {
			$scope.ShowDate = true;
			$scope.calanderdisable = true;
		} else if (obj.Status == "Unpaid") {
			$scope.ShowDate = false;
			$scope.calanderdisable = false;
		};
	}

	function querySearch(query) {
		$scope.enter = function (keyEvent) {
			if (keyEvent.which === 13) {
				if (self.selectedItem === null) {
					self.selectedItem = query;
					console.log(results);
				} else {
					console.log(self.selectedItem);
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
	$scope.customerarr = [];
	$scope.fullarr = [];

	function loadAll() {
		$objectstoreAccess.LoadAllDetails("project12thdoor", function (data) {
			$scope.projectarr = [];
			for (var i = data.length - 1; i >= 0; i--) {
				$scope.projectarr.push({
					display: data[i].name
					, value: data[i].name.toLowerCase()
					, id : data[i].projectid
					, type : 'project'
					, image: "img/ic_shopping_cart_24px.svg"
				});
			};
			$scope.loadcontactFunc();
		});
	}
	$scope.loadcontactFunc = function () {
			$objectstoreAccess.LoadAllDetails("contact", function (data) {
				$scope.customerarr = [];
				for (var i = data.length - 1; i >= 0; i--) {
					$scope.customerarr.push({
						display: data[i].CustomerFname + ' ' + data[i].CustomerLname
						, value: data[i].CustomerFname.toLowerCase() + ' ' + data[i].CustomerLname.toLowerCase()
						, id : data[i].customerid
						, type : 'contact'
						, image: "img/ic_supervisor_account_24px.svg"
					});
				};
				$scope.fullarr = $scope.customerarr.concat($scope.projectarr);
			})
		}
		//auto complete for customer and projects end 
		//save functon start

	angular.isUndefinedOrNull = function(val) {
	    return angular.isUndefined(val) || val === null || val === ""
	}
	$scope.submit = function () {
		if (angular.isUndefinedOrNull($scope.selectedItemSupplier)) {
			$scope.expense.Vendor = "";			
		}else{
			if (angular.isUndefinedOrNull($scope.selectedItemSupplier.display)) {
				$scope.expense.Vendor = $scope.selectedItemSupplier;
			}else{
				$scope.expense.Vendor = $scope.selectedItemSupplier.display;
			}	
		}

		if ($scope.expense.Status == 'Paid') {
			$scope.expense.Duedate = null;
		}else if ($scope.expense.Status == 'Unpaid') {
			$scope.expense.Duedate = $scope.EmptyDuedate;
		}

		console.log($scope.expense.Duedate);

		$scope.imagearray = [];
		$scope.imagearray = UploaderService.loadArray();
		if ($scope.imagearray.length > 0) {
			for (indexx = 0; indexx < $scope.imagearray.length; indexx++) {
				$uploader.upload("45.55.83.253", "expenseimagesNew", $scope.imagearray[indexx]);
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
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.body))
				//.title('This is embarracing')
				.content('Expense Successfully Saved.')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data)
			);
		});
		client.onError(function (data) {
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.body))
				.content('There was an error saving the data.')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data)
			);
		});
		$scope.expense.totalUSDLabel = $scope.TotalText;
		$scope.expense.totalUSD = $scope.totalUSD;
		$scope.expense.date = $scope.CurrentDate;
		$scope.expense.disableForm = false;
		$scope.expense.favouriteStar = false;
		$scope.expense.favouriteStarNo = 1;
		$scope.expense.expense_code = "-999";
		$scope.expense.UploadImages = {
			val: []
		};
		$scope.expense.UploadImages.val = UploaderService.loadBasicArray();
		$scope.expense.Assigncustomer = self.selectedItem.display;
		$scope.expense.assignType = self.selectedItem.type;
		$scope.expense.assignId = self.selectedItem.id;

		client.insert($scope.expense, {
			KeyProperty: "expense_code"
		});
	}
		//save function end
		//fab button functions
	$scope.demo = {
		topDirections: ['left', 'up']
		, bottomDirections: ['down', 'right']
		, isOpen: false
		, availableModes: ['md-fling', 'md-scale']
		, selectedMode: 'md-fling'
		, availableDirections: ['up', 'down', 'left', 'right']
		, selectedDirection: 'up'
	};
	$scope.save = function () {
		$('#mySignup').click();
	}
	$scope.viewExpense = function () {
			location.href = '#/home';
		}
		//end of fab button functions
	$scope.AmountToggle = 1;
	$scope.AmountToggleFunc = function (amount, tax) {
			if ($scope.AmountToggle == 1) {
				$scope.totalUSD = parseInt(amount) + parseInt(tax);
				$scope.AmountToggle = 2;
			} else if ($scope.AmountToggle == 2) {
				$scope.totalUSD = parseInt(amount);
				$scope.AmountToggle = 1;
			};
		}
		//final value function strat 
	$scope.expense = {};
	$scope.DemoCtrl = function ($timeout, $q) {
		$scope.readonly = false;
		// Lists of tags names and Vegetable objects
		$scope.fruitNames = [];
		$scope.expense.tags = [];
		$scope.expense.tags = angular.copy($scope.fruitNames);
		$scope.tags = [];
	}
	$scope.InitialAmount = "Onlyamount";
	$scope.TotalText = "Total USD (Without Tax)";
	$scope.ChangeAmount = function (obj) {
		if (obj.Tax == "" || obj.Tax == null) {
			$scope.Onlyamount = parseInt(obj.Amount);
			$scope.totalUSD = $scope.Onlyamount;
			$scope.InitialAmount = "Onlyamount";
			$scope.TotalText = "Total USD (Without Tax)";
		} else if ($scope.InitialAmount == "Fullamount") {
			$scope.totalUSD = $scope.Onlyamount;
			$scope.InitialAmount = "Onlyamount";
			$scope.TotalText = "Total USD (Without Tax)";
		} else if ($scope.InitialAmount == "Onlyamount") {
			$scope.totalUSD = $scope.Fullamount;
			$scope.InitialAmount = "Fullamount";
			$scope.TotalText = "Total USD (With Tax)";
		};
	}
	$scope.finalamount = function (obj) {
			if (obj.Amount != "" && obj.Amount != null && obj.Tax != "" && obj.Tax != null) {
				$scope.Fullamount = parseInt(obj.Amount) + parseInt(obj.Tax);
				$scope.Onlyamount = parseInt(obj.Amount);
				$scope.InitialAmount = "Fullamount";
				$scope.totalUSD = $scope.Fullamount;
				$scope.TotalText = "Total USD (With Tax)";
			} else if (obj.Tax == "" || obj.Tax == null) {
				$scope.Onlyamount = parseInt(obj.Amount);
				$scope.totalUSD = $scope.Onlyamount;
				$scope.InitialAmount = "Onlyamount";
				$scope.TotalText = "Total USD (Without Tax)";
			}
		}
		//final value function end
		//file uploader function start
	$scope.uploader = function () {
		$mdDialog.show({
			templateUrl: 'expenses_partial/expenses_dialog_partial.html'
			, controller: EyeController
		})
	}

	function EyeController($scope, $mdDialog, $rootScope, $state) {
		$scope.uploadimages = {
			val: []
		};
		$scope.uploadimages.val = UploaderService.loadBasicArray();
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
			$scope.uploadimages.val = UploaderService.loadBasicArray();
		}
	}
	//file uploader function end
});
