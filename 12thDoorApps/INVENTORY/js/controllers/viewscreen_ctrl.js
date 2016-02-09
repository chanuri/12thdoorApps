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
	console.log($stateParams.status)

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
				if (obj.inventoryClass == "Receipt") {
					ObjectStoreFunction("Delete",obj,"GRN12thdoor","inventory_code",function(status){
						if (status == "success") {
							updateBalance(obj,function(data){
								if (data == "success") {
						 			$state.go('home.receipt')
						 			obj.deleteStatus = true;											
								}
							})
						}else{
							obj.deleteStatus = false;
						}
					})
				}else if (obj.inventoryClass == "Issue") {
					ObjectStoreFunction("Delete",obj,"GIN12thdoor","inventory_code",function(status){
						if (status == "success") {							
							updateBalance(obj,function(data){
								if (data == "success") {
						 			$state.go('home.issue')
						 			obj.deleteStatus = true;											
								}
							})
						}else{
							obj.deleteStatus = false;
						}
					})
				} 
			},function(){})
	}

	function updateBalance(obj,callback){
		if (obj.itemdetails.length > 0) {
			for(k=0; k<=obj.itemdetails.length-1; k++){
				getBalance(obj,k,function(data){
					callback("success")
					console.log(data)
				});
			}
		}
	}

	function getBalance(obj,k,callback){
		var balanceClient = $objectstore.getClient("productBalance");
		balanceClient.onGetMany(function(data){
			if (data) {
				var sortArr = data.sort(function(a,b){
					return b.balance_code - a.balance_code;
				})
				var latestObject = {};
				if (obj.inventoryClass == "Receipt") { 
					var grnDiff = parseInt(sortArr[0].GRNvalue) - parseInt(obj.itemdetails[k].Quantity);
					latestObject = {
						GINvalue : obj.itemdetails[k].Quantity,
						GRNvalue : "0",
						balance_code : "-999",
						productId : obj.itemdetails[k].proId,
						startDate : new Date(),
						startValue : sortArr[0].closeValue,
						closeValue : grnDiff.toString()
					}

				}else if (obj.inventoryClass == "Issue") {
					var ginDiff = parseInt(sortArr[0].GINvalue) - parseInt(obj.itemdetails[k].Quantity);
					latestObject = {
						GINvalue : "0",
						GRNvalue : obj.itemdetails[k].Quantity,
						balance_code : "-999",
						productId : obj.itemdetails[k].proId,
						startDate : new Date(),
						startValue : sortArr[0].closeValue,
						closeValue : grnDiff.toString()
					}
				}
				insertToBalance(latestObject,function(data){
					if (data == "success") {
						callback("success")
					}
				})
			}
		});
		balanceClient.onError(function(data){
			console.log("error loading balance data")
			callback("error")
		});
		balanceClient.getByFiltering("select * from productBalance where productId = '"+obj.itemdetails[k].proId+"'")
	}

	function insertToBalance(obj,callback){
		var addClient = $objectstore.getClient("productBalance");
		addClient.onComplete(function(data){
			console.log("successfully insert to balance class");
			callback("success")
		});
		addClient.onError(function(data){
			console.log("error inserting to product class");
			callback("error")
		});
		addClient.insert(obj,{KeyProperty : 'balance_code'})
	}

	$scope.CancelStatus = function(obj){
		var confirm = $mdDialog.confirm()
			.title('Are you sure you wish to proceed')
			.content('This process is not reversible')
			.targetEvent()
			.ok("OK")
			.cancel("Cancel")
				$mdDialog.show(confirm).then(function(){
					if (obj.inventoryClass == "Receipt") {
						obj.Status = "Cancelled";
						ObjectStoreFunction("Cancel",obj,"GRN12thdoor","inventory_code",function(status){
							if (status == "success") {
								updateBalance(obj,function(data){
									if (data == "success") {
					 					$state.go('home.receipt')											
									}
								});
							}else{
								obj.Status = ""
							}
						})
					}else if (obj.inventoryClass == "Issue") {
						ObjectStoreFunction("Cancel",obj,"GIN12thdoor","inventory_code",function(status){
							if (status == "success") {
								updateBalance(obj,function(data){
									if (data == "success") {
					 					$state.go('home.issue')										
									}
								});
							}else{
								obj.Status = ""
							}
						})
					} 

				},function(){});
		
	}

	function ObjectStoreFunction(type,obj,className,key,callback){
		var objectstoreClient;

		if (type == "Delete") {
			objectstoreClient = $objectstore.getClient(className);
			objectstoreClient.onComplete(function(data){
				$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.title("Success")
					.content("successfully deleted")
					.ariaLabel("Alert Dialog Demo")
					.ok("OK")
					.targetEvent()
				)
				callback("success")
			});
			objectstoreClient.onError(function(data){
				$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.title("error")
					.content("fail to delete record")
					.ariaLabel("Alert Dialog Demo")
					.ok("OK")
					.targetEvent()
				)
				callback("error")
			});
			objectstoreClient.deleteSingle(obj.inventory_code,key);

		}else if (type == "Cancel") {

			objectstoreClient = $objectstore.getClient(className);
			objectstoreClient.onComplete(function(data){
				$mdDialog.show(
	              $mdDialog.alert()
	              .parent(angular.element(document.body))
	              .title('Success')
	              .content('Successfully change the cancel the '+className+'')
	              .ariaLabel('Alert Dialog Demo')
	              .ok('OK')
	              .targetEvent()
	            );
	            callback("success")
			});
			objectstoreClient.onError(function(data){
				$mdDialog.show(
	              $mdDialog.alert()
	              .parent(angular.element(document.body))
	              .title('Failed')
	              .content('Failed to change the Status')
	              .ariaLabel('Alert Dialog Demo')
	              .ok('OK')
	              .targetEvent()
	            );
	            callback("error")
			});
			objectstoreClient.insert(obj, {KeyProperty : key})
		};
	}

	var client;
	var clientClass;

	if ($stateParams.status == "GRN") {
		client = $objectstore.getClient("GRN12thdoor");
		clientClass = "GRN12thdoor";
	}else if ($stateParams.status == "GIN") {
		client = $objectstore.getClient("GIN12thdoor");
		clientClass = "GIN12thdoor";
	}
	
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
	client.getByFiltering("select * from "+clientClass+" where inventory_code = '"+$scope.Iid+"'");


	function SeparateAddress(Address){
		$scope.AddressArr = [];
		$scope.AddressArr = Address.split(",");
		$scope.AddressOne = $scope.AddressArr[0];
		$scope.AddressTwo = $scope.AddressArr[1];
		$scope.AddressThree = $scope.AddressArr[2];
		$scope.AddressFour = $scope.AddressArr[3];

	}
});