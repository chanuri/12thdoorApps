rasm.controller("viewScreen", function($scope,$state,$stateParams,$objectstore,$mdDialog){
	
	var projectClient = $objectstore.getClient("project12thdoor");
	projectClient.onGetOne(function(data){
		console.log(data)
		$scope.projectViewObject = data;
		getExpenseDetails(data);
		getAlltimesheetData(data);
	});
	projectClient.onError(function(data){
		console.log("error loading one project data")
	});
	projectClient.getByKey($stateParams.projectid)

	$scope.billCustomer = function(obj){
		$mdDialog.show({
			templateUrl: 'project_partial/projectBillCustomer.html',
			controller: billCustomerCtrl			
		});
	}

	function getAlltimesheetData(proObj){
		var timesheetClient = $objectstore.getClient("timeSheet12thdoor");
		timesheetClient.onGetMany(function(data){	
			$scope.timesheetArr = [];	 
			if (data.length > 0) {
			 	for(i=0; i<= data.length-1; i++){
					if (data[i].selectProject.proName == proObj.name &&  data[i].selectProject.proId == proObj.projectid) {
						$scope.timesheetArr.push({
							user : data[i].user,
							logged : data[i].hours,
							billed : data[i].billed,
							Pending : data[i].Pending,
							billable : proObj.bhours,
							proName : data[i].selectProject.proName						
						})
					}
				}
			};
		});
		timesheetClient.onError(function(data){
			console.log("Error loading timeSheet data")
		});
		console.log("select * from timeSheet12thdoor where proName = '"+ proObj.name+ "' and proId = '" +proObj.projectid+ "'")
		timesheetClient.getByFiltering("select * from timeSheet12thdoor where proName = '"+ proObj.name+ "' and proId = '" +proObj.projectid+ "'");
	}


	function getExpenseDetails(proObj){
		$scope.expenseArr = [];
		var expensClient = $objectstore.getClient("expense12th");
		expensClient.onGetMany(function(data){
			console.log(data)
			$scope.expenseArr = data;
		});
		expensClient.onError(function(data){
			console.log("Error loading expense data")
		});
		expensClient.getByFiltering("select * from expense12th where assignType = 'project' and assignId = '"+proObj.projectid+"'");
	}

	function billCustomerCtrl($scope){
		$scope.billObject = {};
		$scope.billObject.billingmethod = "";
		$scope.billCheckboxDisable = true;
		$scope.invoiceCheckboxDisable = false;

		$scope.billingCheckboxStatus = "Merge all as one single line item";
		$scope.invoiceCheckboxStatus = "Merge all as one single line item";

		loadAllsettingData($objectstore,function(data){
			if (data.length > 0) {
				$scope.billObject.billingmethod = data[0].preference.project.defaultbillingmethod;
				$scope.billingMethodStatus($scope.billObject.billingmethod)
			};
		})


		$scope.cancel = function(){$mdDialog.hide()}
		$scope.billingCheckboxFunc = function(status){
			if (status) {

			}else if(!status){

			}
		}


		$scope.billingMethodStatus = function(type){
			if (type == "Hourly Staff Rate" || type == "Hourly Task Rate") {
				$scope.billCheckboxDisable = false;
				$scope.billingCheckboxStatus = "Merge all as one single line item";
			}else{
				$scope.billCheckboxDisable = true;
				$scope.billingCheckboxStatus = "Aggregate of all users and or tasks will be merged and shown as a single line item";
			}
		}

		$scope.invoiceCheckboxFunc = function(status){
			if (status) {

			}else if(!status){

			}
		}

		$scope.invoiceMethodStatus = function(type){
			if (type == "Invoice unbilled expenses for project") {
				$scope.invoiceCheckboxStatus = "Merge all as one single line item";
				$scope.invoiceCheckboxDisable = false;

			}else{
				$scope.invoiceCheckboxStatus = "Aggregate of all users and or tasks will be merged and shown as a single line item";
				$scope.invoiceCheckboxDisable = true;
			}
		}
	}

	$scope.changeStatus = function(obj){
		if (obj.projectStatus == 'Active') {
			obj.projectStatus ='Inactive';
			objectstoreStatusChange(obj);

		}else if (obj.projectStatus == 'Inactive') {
			obj.projectStatus ='Active';
			objectstoreStatusChange(obj);
		};
	}

	function objectstoreStatusChange(obj){

		var statusClient =  $objectstore.getClient("project12thdoor");
		statusClient.onComplete(function(data){
			console.log("sucessfully updated ")
			$state.go("settings.project")
		});
		statusClient.onError(function(data){
			console.log("error updating oject")
		});
		statusClient.insert(obj,{ KeyProperty:"projectid"})
	}
});


function loadAllsettingData($objectstore,callback){

	var emptyArr = [];
	var settingClient = $objectstore.getClient("Settings12thdoor");
	settingClient.onGetMany(function(data){
		if (data.length > 0) callback(data); 
		else callback(emptyArr)
	});
	settingClient.onError(function(data){
		callback(emptyArr)
	});
	settingClient.getByFiltering("*")
}