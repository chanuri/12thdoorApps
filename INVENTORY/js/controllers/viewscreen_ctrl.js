rasm.controller('ListBottomSheetCtrl',function($scope,$mdBottomSheet,$objectstore,$auth,$http,$mdDialog){
	
		$scope.CloseDialog = function(){
			$mdDialog.hide();
		}
		
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
			console.log($scope.ContactDetails);

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
						console.log(results);
					} else {
						console.log($scope.selectedItem);
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

		$scope.SendMail = function(obj){
			obj.To = [];
			obj.BCC = [];
			
			console.log($scope.To)
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

			console.log(obj)
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
				console.log(response)
			});
		}

});
rasm.controller('ViewScreen',function($scope, $stateParams, $state,$DownloadPdf, $objectstore,  $mdBottomSheet,$auth, $mdDialog){

	$scope.SendEmail = function(){
		 $mdBottomSheet.show({
		 	templateUrl : 'inventory_partials/inventory_email.html',
		 	controller: 'ListBottomSheetCtrl'
		 }).then(function(){

		 });
	}
	$scope.Iid = $stateParams.inventoryID;

	$scope.ConvertToPdf = function(obj){
		InventoryObject(function(InObj){
			$DownloadPdf.GetPdf(obj,InObj,'download');
		});		
	}
	$scope.print = function(obj){
		InventoryObject(function(InObj){
			$DownloadPdf.GetPdf(obj,InObj,'print');
		});
	}

	function InventoryObject(callback){
		$scope.InventoryObject = {
			NoteType : $scope.NoteType,
			InventoryType: $scope.InventoryType,
			InventoryTypeValue : $scope.InventoryTypeValue,
			AddressOne : $scope.AddressOne,
			AddressTwo : $scope.AddressTwo,
			AddressThree : $scope.AddressThree,
			AddressFour : $scope.AddressFour
		}

		callback($scope.InventoryObject);
	}

	$scope.deleteInventory = function(obj){

		var confirm = $mdDialog.confirm()
			.title('Are you sure you wish to proceed')
			.content('This process is not reversible')
			.targetEvent()
			.ok("OK")
			.cancel("Cancel")
			$mdDialog.show(confirm).then(function(){
				var client = $objectstore.getClient("inventory12thdoor");
				client.onComplete(function(data){
					$mdDialog.show(
						$mdDialog.alert()
						.parent(angular.element(document.body))
						.title("Success")
						.content("successfully deleted")
						.ariaLabel("Alert Dialog Demo")
						.ok("OK")
						.targetEvent()
						)
					if (obj.inventoryClass == "Receipt") {
					 	$state.go('home.receipt')
					}else if (obj.inventoryClass == "Issue") {
						$state.go('home.issue')
					};
				});
				client.onError(function(data){
					$mdDialog.show(
						$mdDialog.alert()
						.parent(angular.element(document.body))
						.title("error")
						.content("fail to delete record")
						.ariaLabel("Alert Dialog Demo")
						.ok("OK")
						.targetEvent()
						)
				});
				client.deleteSingle(obj.inventory_code,"inventory_code");
		},function(){})
	}

	$scope.CancelStatus = function(obj){
		var confirm = $mdDialog.confirm()
			.title('Are you sure you wish to proceed')
			.content('This process is not reversible')
			.targetEvent()
			.ok("OK")
			.cancel("Cancel")
				$mdDialog.show(confirm).then(function(){
					var client = $objectstore.getClient("inventory12thdoor");
					client.onComplete(function(data){
						$mdDialog.show(
			              $mdDialog.alert()
			              .parent(angular.element(document.body))
			              .title('Success')
			              .content('Successfully change the cancel the inventory')
			              .ariaLabel('Alert Dialog Demo')
			              .ok('OK')
			              .targetEvent()
			            );
			            if (obj.inventoryClass == "Receipt") {
						 	$state.go('home.receipt')
						}else if (obj.inventoryClass == "Issue") {
							$state.go('home.issue')
						};
					});
					client.onError(function(data){
						$mdDialog.show(
			              $mdDialog.alert()
			              .parent(angular.element(document.body))
			              .title('Failed')
			              .content('Failed to change the Status')
			              .ariaLabel('Alert Dialog Demo')
			              .ok('OK')
			              .targetEvent()
			            );
			            obj.Status = "";
					});
					obj.Status = "Cancelled";		
					client.insert(obj, {KeyProperty: "inventory_code"});
				},function(){});
		
	}

	var client = $objectstore.getClient("inventory12thdoor");
	client.onGetMany(function(data){
		$scope.ViewInventory = [];
		$scope.ViewInventory.push(data[0]);

		if (data[0].inventoryClass == "Receipt") {
			$scope.NoteType = "RECEIPT";
			$scope.InventoryType = "GRN NO.";
			$scope.InventoryTypeValue = data[0].GRNno;
		}else if (data[0].inventoryClass == "Issue") {
			$scope.NoteType = "ISSUED";
			$scope.InventoryType = "GIN NO.";
			$scope.InventoryTypeValue = data[0].GINno;
		};
		if (data[0].AddressName == "Address") {
			$scope.FullAddress = data[0].BillAddress;
		}else if (data[0].AddressName == "Shipping Address") {
			$scope.FullAddress = data[0].ShipAddress;
		};

		if ($scope.FullAddress) {
			SeparateAddress($scope.FullAddress);
		};

	});
	client.onError(function(data){
		console.log("error loading data");
	});
	client.getByFiltering("select * from inventory12thdoor where inventory_code = '"+$scope.Iid+"'");


	function SeparateAddress(Address){
		$scope.AddressArr = [];
		$scope.AddressArr = Address.split(",");
		$scope.AddressOne = $scope.AddressArr[0];
		$scope.AddressTwo = $scope.AddressArr[1];
		$scope.AddressThree = $scope.AddressArr[2];
		$scope.AddressFour = $scope.AddressArr[3];

	}
});