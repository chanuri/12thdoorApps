rasm.controller('AppCtrlAdd', function($scope, $state, $objectstore, $location,$mdDialog, $window, $auth, $q,$http, $compile, $timeout, $mdToast, $rootScope, UploaderService) {
    /*_______________________Initilization________________*/
	$scope.project = {};
	$scope.addtasks = [];
	$scope.addstaffs = [];
	$scope.staffs = [];
	$scope.tasks = [];
	$scope.customerNames = [];
	$scope.contacts = [];
	$scope.checkAbilityprate = false;
	$scope.checkAbilitypamount = false;
	$scope.checkAbilityshr = false;
	$scope.checkAbilitythr = false;
	$scope.checkAvailabilty = false;
	$rootScope.results = [];
	var self = this;
	self.tenants = loadAll();
	self.selectedItem = null;
	self.searchText = null;
	self.querySearch = querySearch;
	self.querySearchView = querySearchView;
    /*_______________________querySearch__________________*/
	function querySearch(query) {
		$scope.enter = function(keyEvent) {
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
		$scope.enter = function(keyEvent) {
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
		client.onGetMany(function(data) {
			if (data) {
				for (i = 0, len = data.length; i < len; ++i) {
					$scope.customerNames.push({
						display: data[i].CustomerFname + ' ' + data[i].CustomerLname,
						BillAddress: data[i].baddress.street + ', ' + data[i].baddress.city + ', ' + data[i].baddress.zip + ', ' +
							data[i].baddress.country,
						ShipAddress: data[i].saddress.s_city + ', ' + data[i].saddress.s_country + ', ' + data[i].saddress.s_zip + ', ' +
							data[i].saddress.s_country
					});
				}
			}
		});
		client.onError(function(data) {
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
	}
    /*__________________________SUBMIT PROJECTS________________*/
	$scope.submit = function() {
		var client = $objectstore.getClient("project");
		client.onComplete(function(data) {
			$mdDialog.show($mdDialog.alert()
				.parent(angular
					.element(document.body))
				.content(
					'Project Added Successfully.')
				.ariaLabel(
					'Alert Dialog Demo')
				.ok('OK')
				.targetEvent(
					data));
		});
		client.onError(function(data) {
			$mdDialog.show($mdDialog.alert()
				.parent(angular
					.element(document.body))
				.content(
					'There was an error saving the data.'
				)
				.ariaLabel('Alert Dialog Demo')
				.ok(
					'OK')
				.targetEvent(data));
		});
		$scope.project.favoritestar = false;
		$scope.project.projectid = "-999";
		$scope.project.staffs = $scope.addstaffs;
		$scope.project.tasks = $scope.addtasks;
		$scope.project.customerNames = self.selectedItem.display;
		client.insert($scope.project, {
			KeyProperty: "projectid"
		})
	}
    /*_______________________________onChange Function__________________*/
	$scope.onChange = function(type) {
		if (type == "hsr") {
			$scope.checkAbilityprate = true;
			$scope.checkAbilitypamount = true;
			$scope.checkAbilitythr = true;
			$scope.checkAbilityshr = false;
			$scope.checkAvailabilty = false;
		} else if (type == "htr") {
			$scope.checkAbilityprate = true;
			$scope.checkAbilitypamount = true;
			$scope.checkAbilityshr = true;
			$scope.checkAbilitythr = false;
			$scope.checkAvailabilty = false;
		} else if (type == "hpr") {
			$scope.checkAbilitypamount = true;
			$scope.checkAbilityshr = true;
			$scope.checkAbilitythr = true;
			$scope.checkAbilityprate = false;
			$scope.checkAvailabilty = true;
		} else if (type = "fpa") {
			$scope.checkAbilityprate = true;
			$scope.checkAbilityshr = true;
			$scope.checkAbilitythr = true;
			$scope.checkAbilitypamount = false;
			$scope.checkAvailabilty = true;
		}
	}
    /*___________________________addstaff__________________*/
	$scope.addstaff = function() {
		$scope.addstaffs.push({
			sno: $scope.addstaffs.length + 1,
			staffname: "",
			shr: "",
			removebtnDisable: false
		})
	}
    /*__________________________removeStaff________________*/
	$scope.removeStaff = function(index) {
		$scope.addstaffs.splice(index, 1);
	};
    /*________________________addtask______________________*/
	$scope.addtask = function() {
		$scope.addtasks.push({
			tno: $scope.addtasks.length + 1,
			task: "",
			thr: "",
			removebtnDisable: false
		})
	}
    /*_____________________removeTask______________________*/
	$scope.removeTask = function(index) {
		$scope.addtasks.splice(index, 1);
	};
    /*_____________________init_____________________________*/
	function init() {
		$scope.addstaff();
		$scope.addtask();
	}
	init();
    /*_____________________demo______________________________*/
	$scope.demo = {
		topDirections: ['left', 'up'],
		bottomDirections: ['down', 'right'],
		isOpen: false,
		availableModes: ['md-fling', 'md-scale'],
		selectedMode: 'md-fling',
		availableDirections: ['up', 'down', 'left', 'right'],
		selectedDirection: 'up'
	};
    /*___________________$watch_____________________________*/
	$scope.$watch('selectedIndex', function(current, old) {
		switch (current) {
			case 0:
				$location.url("/settings/project_view");
				break;
			case 1:
				$location.url("/settings/project_add");
				break;
		}
	});
    /*____________________Customerview________________________*/
	$scope.Customerview = function() {
		location.href = '#/home';
	}
    /*________________save_________________________________*/
	$scope.save = function() {
		$('#mySignup')
			.click();
	}
    /*______________upload_____________________________*/
	$scope.upload = function(ev) {
		$mdDialog.show({
			templateUrl: 'project_partial/showUploader.html',
			targetEvent: ev,
			controller: 'UploadCtrl',
			locals: {
				dating: ev
			}
		})
	}
}) //END OF AppCtrlAdd