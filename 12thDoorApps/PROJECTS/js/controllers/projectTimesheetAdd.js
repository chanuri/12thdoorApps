rasm.controller('AppCtrlAddTimesheet', function($scope, $state, $location,
	$mdDialog, $window, $objectstore, $auth, $q,
	$http, $compile, $timeout, $mdToast, $rootScope) {
	$scope.project = {};
	$scope.customerNames = [];
	$scope.contacts = [];
	$rootScope.results = [];
	//Autocomplete stuff
	$rootScope.self = this;
	$rootScope.self.tenants = loadAll();
	$rootScope.selectedItem1 = null;
	$rootScope.self.searchText = null;
	$rootScope.self.querySearch = querySearch;

	function querySearch(query) {
		$scope.enter = function(keyEvent) {
				if (keyEvent.which === 13) {
					if ($rootScope.selectedItem1 === null) {
						$rootScope.selectedItem1 = query;
						console.log($rootScope.results);
					} else {
						console.log($rootScope.selectedItem1);
					}
				}
			}
			//Custom Filter
		for (i = 0, len = $scope.customerNames.length; i < len; ++i) {
			if ($scope.customerNames[i].display.indexOf(query) != -1) {
				$rootScope.results.push($scope.customerNames[i]);
			}
		}
		console.log($rootScope.results);
		return $rootScope.results;
	}

	function loadAll() {
		var client = $objectstore.getClient("contact");
		client.onGetMany(function(data) {
			if (data) {
				// $scope.contact =data;
				for (i = 0, len = data.length; i < len; ++i) {
					$scope.customerNames.push({
						display: data[i].CustomerFname.toLowerCase(),
						value: data[i]
					});
				}
				console.log($scope.customerNames);
			}
		});
		client.onError(function(data) {
			$mdDialog.show();
		});
		client.getByFiltering("*");
	}
	$scope.submit = function() {
		var client = $objectstore.getClient("time");
		client.onComplete(function(data) {
			$mdDialog.show($mdDialog.alert()
				.parent(angular
					.element(document.body))
				.content(
					'Timesheet Added Successfully.')
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
		$scope.time.favoritestar = false;
		$scope.time.timesheetid = "-999";
		client.insert($scope.time, {
			KeyProperty: "timesheetid"
		})
	}
	$scope.demo = {
		topDirections: ['left', 'up'],
		bottomDirections: ['down', 'right'],
		isOpen: false,
		availableModes: ['md-fling', 'md-scale'],
		selectedMode: 'md-fling',
		availableDirections: ['up', 'down', 'left', 'right'],
		selectedDirection: 'up'
	};
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
	$scope.addCustomer = function() {
		$('#add')
			.animate({
				width: "100%",
				height: "100%",
				borderRadius: "0px",
				right: "0px",
				bottom: "0px",
				opacity: 0.25
			}, 400, function() {
				location.href = '#/Add_Project';
			});
	}
	$scope.addTimesheet = function() {
		$('#add')
			.animate({
				width: "100%",
				height: "100%",
				borderRadius: "0px",
				right: "0px",
				bottom: "0px",
				opacity: 0.25
			}, 400, function() {
				location.href = '#/Add_Timesheet';
			});
	}
	$scope.Customerview = function() {
		location.href = '#/home';
	}
	$scope.savebtn = function() {
		$('#save')
			.animate({
				width: "100%",
				height: "100%",
				borderRadius: "0px",
				right: "0px",
				bottom: "0px",
				opacity: 0.25
			}, 400, function() {
				$('#mySignup')
					.click();
			});
	}
	$scope.save = function() {
		$('#mySignup')
			.click();
	}
	$scope.viewpromotion = function() {
		$('#view')
			.animate({
				width: "100%",
				height: "100%",
				borderRadius: "0px",
				right: "0px",
				bottom: "0px",
				opacity: 0.25
			}, 400, function() {});
	}
}); //END OF AppCtrlAddTimesheet
