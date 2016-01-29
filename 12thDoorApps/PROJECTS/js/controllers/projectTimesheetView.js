rasm.controller('AppCtrlGetTimesheet', function($scope, $rootScope, $state, $objectstore, $location, $mdDialog, $window, $objectstore, $auth, $q,
	$http, $compile, $timeout, $mdToast) { 

	$scope.Timesheets = [];
	$scope.loadAllTimesheets = function() {
		var client = $objectstore.getClient("timeSheet12thdoor");
		client.onGetMany(function(data) {
			if (data) {				 
				$scope.Timesheets = data;
				loadAllProject();
			}
		});
		client.onError(function(data) {
			$mdDialog.show($mdDialog.alert().parent(angular
				.element(document.body)).title('This is embarracing')
				.content('There was an error retreving the data.')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data));
		});
		client.getByFiltering("*");
	};

	function loadAllProject(){
		var projectClient = $objectstore.getClient("project12thdoor");
		projectClient.onGetMany(function(data){
			$scope.projectArr = [];
			for(k=0; k <= data.length-1; k++){
				$scope.projectArr.push({
					proName : data[k].name,
					proId : data[k].projectid
				})			
			}
			for(p=0; p <= $scope.Timesheets.length-1; p++){
				$scope.Timesheets[p].allProject = [];
				$scope.Timesheets[p].allProject = $scope.projectArr;
			}
			
		});
		projectClient.onError(function(data){
			console.log("error loading project data")
		});
		projectClient.getByFiltering("*");
	}
 
		//sort function variable end 
	$rootScope.showaddProject = false;
	$scope.Timesheets = [];
	$scope.checkAbilityBtn = true;
	$scope.checkAbilityEditing = true;
	$scope.proSearch = "";
 
	$scope.onChangeEditing = function(cbState, state) {
		if (cbState == true) {
			$scope.checkAbilityEditing = false;
			$scope.checkAbilityBtn = false;
		} else {
			$scope.checkAbilityEditing = true;
			$scope.checkAbilityBtn = true;
		}
		for (var i = state.length - 1; i >= 0; i--) {
			state[i].removebtnDisable = true;
		};
	}
	$scope.chekAblityRemovebtn = function(state) {
		for (var i = state.length - 1; i >= 0; i--) {
			state[i].removebtnDisable = true;
		};
	}
	$scope.showProjectMenu = true;
	$rootScope.showsort = false;
	$scope.changeTab = function(ind) {
		switch (ind) {
			case 0:
				$location.url("/settings/project");
				$scope.showProjectMenu = true;
				break;
			case 1:
				$location.url("/settings/timesheet");
				$scope.showProjectMenu = false;
				break;
		}
	};
	$scope.demo = {
		topDirections: ['left', 'up'],
		bottomDirections: ['down', 'right'],
		isOpen: false,
		availableModes: ['md-fling', 'md-scale'],
		selectedMode: 'md-fling',
		availableDirections: ['up', 'down', 'left', 'right'],
		selectedDirection: 'up'
	};
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
		$('#view')
			.animate({
				width: "100%",
				height: "100%",
				borderRadius: "0px",
				right: "0px",
				bottom: "0px",
				opacity: 0.25
			}, 400, function() {
				location.href = '#/home';
			});
	}
	
}); //End of AppCtrlGetTimesheet