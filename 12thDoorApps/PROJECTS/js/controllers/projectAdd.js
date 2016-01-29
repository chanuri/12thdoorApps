rasm.controller('AppCtrlAdd', function ($scope, $state, $objectstore, $location, $mdDialog, $window, $auth, $q, $http, $compile, $timeout, $mdToast, $rootScope, UploaderService) {
	/*_______________________Initilization________________*/
	$scope.customerNames = [];
	$scope.contacts = [];
	$scope.flatProjectVisible = false;
	$scope.hourlyRateVisible = false;
	$scope.staffHourRateDisable = false;
	$scope.taskHourRateDisable = false;
	$scope.showbilMethodDiv = true;
	$rootScope.results = [];
	var self = this;
	self.tenants = loadAll();
	self.selectedItem = null;
	self.searchText = null;
	self.querySearch = querySearch;
	self.querySearchView = querySearchView;
	/*_______________________querySearch__________________*/
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
		for (i = 0, len = $scope.customerNames.length; i < len; ++i) {
			if ($scope.customerNames[i].display.indexOf(query) != -1) {
				results.push($scope.customerNames[i]);
			}
		}
		return results;
	}
	/*_______________________querySearchView________________*/
	function querySearchView(query) {
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
	}
	/*_____________________loadAll___________________________*/
	function loadAll() {
		var client = $objectstore.getClient("contact");
		client.onGetMany(function (data) {
			if (data) {
				for (i = 0, len = data.length; i < len; ++i) {
					$scope.customerNames.push({
						display: data[i].CustomerFname + ' ' + data[i].CustomerLname
						, BillAddress: data[i].baddress.street + ', ' + data[i].baddress.city + ', ' + data[i].baddress.zip + ', ' +
							data[i].baddress.country
						, ShipAddress: data[i].saddress.s_city + ', ' + data[i].saddress.s_country + ', ' + data[i].saddress.s_zip + ', ' +
							data[i].saddress.s_country
					});
				}
			}
		});
		client.onError(function (data) {
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.body))
				.title('Sorry')
				.content('There is no products available')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data)
			);
		});
		client.getByFiltering("*");
		// load setting date 
		var settingClient = $objectstore.getClient("Settings12thdoor");
		settingClient.onGetMany(function (data) {
			var settingTask = [];
			settingTask = data[0].preference.project.task;
			$scope.project.billingmethod = data[0].preference.project.defaultbillingmethod;
			$scope.onChange($scope.project.billingmethod);

			if(settingTask.length > 0){
				for(i=0; i<=settingTask.length-1; i++){
					$scope.addtasks.push({
						tno: $scope.addtasks.length + 1,
						thr: settingTask[i].rate,
						taskName : settingTask[i].task
					})
				}				
			}else{
				$scope.addstaff();
			}
			console.log(data[0].preference.project.task);
		});
		settingClient.onError(function (data) {
			console.log("error loading settings data")
		});
		settingClient.getByFiltering("*")
	}
	/*__________________________SUBMIT PROJECTS________________*/
	$scope.project = {};
	$scope.project.hpRate = "";
	$scope.project.fpAmount = "";

	$scope.submit = function () {

		var client = $objectstore.getClient("project12thdoor");
		client.onComplete(function (data) {
			saveToLoggedClass(data.Data[0].ID);

			$mdDialog.show($mdDialog.alert()
				.parent(angular.element(document.body))
				.content('Project Added Successfully.')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data));
		});
		client.onError(function (data) {
			$mdDialog.show($mdDialog.alert()
				.parent(angular.element(document.body))
				.content('There was an error saving the data.')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data));
		});
		$scope.project.favoritestar = false;
    	$scope.project.favouriteStarNo = 1;
		$scope.project.projectid = "-999";
		$scope.project.projectStatus = "Active";
		$scope.project.staffs = [];
		$scope.project.staffs = $scope.addstaffs;
		$scope.project.tasks = [];
		$scope.project.tasks = $scope.addtasks;
		$scope.project.todayDate = new Date();
	    $scope.project.customerNames = self.selectedItem.display;
		client.insert($scope.project, {
			KeyProperty: "projectid"
		})

	}

	function saveToLoggedClass(proId){		 

		$scope.logArr = {};
		$scope.logArr.projectId = proId;
		$scope.logArr.projectName = $scope.project.name;
		$scope.logArr.Billable = $scope.project.bhours;
		$scope.logArr.Billed = '0';
		$scope.logArr.Pending = $scope.project.bhours;
		$scope.logArr.logged_code = '-999';


		var loggedClient = $objectstore.getClient("loggedHour12thdoor");
		loggedClient.onComplete(function(data){
			console.log("inserted to logged hour class")
		});
		loggedClient.onError(function(data){
			console.log("error saving to logged hour class")
		});
		loggedClient.insert($scope.logArr, {KeyProperty:'logged_code'});
	}
	$scope.onChange = function (type) {

			if (type == "Hourly Staff Rate") {
				$scope.staffHourRateDisable = true;
				$scope.showbilMethodDiv = true;
				$scope.hourlyRateVisible = false;
				$scope.flatProjectVisible = false;
				$scope.taskHourRateDisable = false;
			} else if (type == "Hourly Task Rate") {
				$scope.taskHourRateDisable = true;
				$scope.showbilMethodDiv = true;
				$scope.staffHourRateDisable = false;
				$scope.hourlyRateVisible = false;
				$scope.flatProjectVisible = false;
			} else if (type == "Hourly Project Rate") {
				$scope.hourlyRateVisible = true;
				$scope.flatProjectVisible = false;
				$scope.staffHourRateDisable = false;
				$scope.taskHourRateDisable = false;
				$scope.showbilMethodDiv = false;
			} else if (type == "Flat Project Amount") {
				$scope.flatProjectVisible = true;
				$scope.hourlyRateVisible = false;
				$scope.staffHourRateDisable = false;
				$scope.taskHourRateDisable = false;
				$scope.showbilMethodDiv = false;
			};
		}


	$scope.addstaffs = [];
	$scope.addstaff = function () {
		$scope.addstaffs.push({
			sno: $scope.addstaffs.length + 1,
			staffname: "",
			shr: ""
		})
	}
	$scope.addstaff();

	$scope.removeStaff = function (index) {
		$scope.addstaffs.splice(index, 1);
	};

	$scope.addtasks = [];
	$scope.addtask = function () {
		$scope.addtasks.push({
			tno: $scope.addtasks.length + 1,
			thr: "",
			taskName : ""
		})
	}
	
	$scope.removeTask = function (index) {
		$scope.addtasks.splice(index, 1);
	};	
	
	$scope.demo = {
		topDirections: ['left', 'up']
		, bottomDirections: ['down', 'right']
		, isOpen: false
		, availableModes: ['md-fling', 'md-scale']
		, selectedMode: 'md-fling'
		, availableDirections: ['up', 'down', 'left', 'right']
		, selectedDirection: 'up'
	};


	$scope.$watch('selectedIndex', function (current, old) {
		switch (current) {
		case 0:
			$location.url("/settings/project_view");
			break;
		case 1:
			$location.url("/settings/project_add");
			break;
		}
	});


	$scope.Customerview = function () {location.href = '#/settings/project';}

	$scope.save = function () {
		$timeout(function() {
            $('#mySignup').click();
        })
	}

	$scope.upload = function (ev) {
		$mdDialog.show({
			templateUrl: 'project_partial/showUploader.html'
			, targetEvent: ev
			, controller: 'UploadCtrl'
			, locals: {
				dating: ev
			}
		})
	}
}) //END OF AppCtrlAdd
