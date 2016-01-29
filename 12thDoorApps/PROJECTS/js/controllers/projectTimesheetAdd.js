rasm.controller('AppCtrlAddTimesheet', function($scope, $state,$mdDialog, $objectstore) {
	$scope.timeSheet = {};

	var projectClient = $objectstore.getClient("project12thdoor");
	projectClient.onGetMany(function(data){
		$scope.projectArr = [];
		for(k=0; k <= data.length-1; k++){
			$scope.projectArr.push({
				proName : data[k].name,
				proId : data[k].projectid
			})			
		}
	});
	projectClient.onError(function(data){
		console.log("error loading project data")
	});
	projectClient.getByFiltering("*");

	$scope.projectSelect = function(item){
		var obj = JSON.parse(item)
		var timesheetClient = $objectstore.getClient("loggedHour12thdoor");
		timesheetClient.onGetMany(function(data){
			$scope.timeSheet.hours = data[0].Pending;
		});
		timesheetClient.onError(function(data){
			console.log("error loading logged data");
		});

		timesheetClient.getByFiltering("select * from loggedHour12thdoor where projectId = '"+obj.proId+"'");
	}

	$scope.submit = function() {
		reduceFromLogClass();
	}

	function reduceFromLogClass(){

		$scope.loggedArr = [];
		$scope.testObj = JSON.parse($scope.timeSheet.selectProject);

		var timesheetClient = $objectstore.getClient("loggedHour12thdoor");
		timesheetClient.onGetMany(function(data){

			var billedd = parseInt(data[0].Billed) + parseInt($scope.timeSheet.hours) 
			data[0].Billed = billedd.toString();

			var pend = parseInt(data[0].Billable) - parseInt(data[0].Billed)					
			data[0].Pending = pend.toString();
			$scope.loggedArr.push(data[0]);

			updateLogClass(function(callback){
				if (callback) {
					addToTimesheet();
				};
			});
		});
		timesheetClient.onError(function(data){
			console.log("error loading logged data");
		});
		timesheetClient.getByFiltering("select * from loggedHour12thdoor where projectId = '"+$scope.testObj.proId+"'");
	}

	function updateLogClass(callback){
		var logInsert = $objectstore.getClient("loggedHour12thdoor");
		logInsert.onComplete(function(data){
			console.log("sucessfully update the log hour class")
			callback(true)
		});
		logInsert.onError(function(data){
			console.log("error updating the logged hour class")
			callback(false)
		});
		logInsert.insert($scope.loggedArr[0], { KeyProperty : "logged_code"} );
	}

	function addToTimesheet(){
		var client = $objectstore.getClient("timeSheet12thdoor");
		client.onComplete(function(data) {
			$mdDialog.show($mdDialog.alert()
				.parent(angular.element(document.body))
				.content('Timesheet Added Successfully.')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data));
			$state.go("settings.timesheet")
		});
		client.onError(function(data) {
			$mdDialog.show($mdDialog.alert()
				.parent(angular.element(document.body))
				.content('There was an error saving the data.')
				.ariaLabel('Alert Dialog Demo')
				.ok('OK')
				.targetEvent(data));
		});
		console.log($scope.loggedArr[0])
		$scope.timeSheet.billed = $scope.loggedArr[0].Billed
		$scope.timeSheet.Pending = $scope.loggedArr[0].Pending

		$scope.timeSheet.favoritestar = false;
		$scope.timeSheet.timesheetid = "-999";
		$scope.timeSheet.selectProject = JSON.parse($scope.timeSheet.selectProject)
		$scope.timeSheet.proName = $scope.timeSheet.selectProject.proName;
		$scope.timeSheet.proId = $scope.timeSheet.selectProject.proId;


		client.insert($scope.timeSheet, {KeyProperty: "timesheetid"})
	}


	$scope.cancel = function(){ $state.go("settings.timesheet")}
	$scope.Customerview = function() {location.href = '#/home'}
}); //END OF AppCtrlAddTimesheet
