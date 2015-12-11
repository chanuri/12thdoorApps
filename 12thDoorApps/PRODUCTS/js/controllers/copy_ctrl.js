rasm.controller("CopyCtrl",function($scope,$rootScope, $stateParams, $state, $DownloadPdf, $objectstore, $auth, $mdDialog){
	console.log($stateParams.productID);

	var client = $objectstore.getClient("12thproduct");
	client.onGetMany(function(data){
		if (data.length > 0) {
			$scope.product_copy = data;
			ChangeProductCode($scope.product_copy);	
			$scope.changeinventoryview($scope.product_copy[0].inventory); // check stock level in disable or not from inventory 	
		}else{
			console.log("no object for this product code")
		}
	});
	client.onError(function(data){
		console.log("error Loading data")
	});
	client.getByFiltering("select * from 12thproduct where ProductCode = "+$stateParams.productID+"");	 

	function ChangeProductCode(obj){ // call to prouce new product code
		var Pnumbers = obj[0].ProductCode.substring(4,8);
		var NewPnumber = parseInt(Pnumbers) + 1;
		$scope.NumberString = "";

		for(i=0; i < 4-NewPnumber.toString().length; i++){
			$scope.NumberString = $scope.NumberString + "0";
		}

		var FinalNumber = $scope.NumberString + NewPnumber.toString();
		obj[0].ProductCode = obj[0].ProductCode.replaceAt(4,FinalNumber);
		obj.ProductCodeID = FinalNumber;
	}

	$scope.submit = function(obj){

		if (obj.ProductCode.indexOf('-') === -1) {
        console.log("dash missing")
        $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .title('Invalid Product Code')
              .content('Product Code Format is not valid.. please follow this format "APP-0002".')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
              .targetEvent()
            );
      }else if((obj.Productname.substring(0, 3).toUpperCase() != obj.ProductCode.substring(0,3)) || (obj.ProductCode.indexOf('-') != 3)){
        console.log("first letters not match")
        $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .title('Invalid Product Code')
              .content('Product Code Format is not valid.. please follow this format "APP-0002".')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
              .targetEvent()
            );
      }else if((obj.ProductCode.slice(4).toString().length != 4) || (!isNormalInteger(obj.ProductCode.slice(4).toString()))){
        console.log("last numbers are invalid or length is not 4")
        $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .title('Invalid Product Code')
              .content('Product Code Format is not valid.. please follow this format "APP-0002".')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
              .targetEvent()
            );
      }else{

        $scope.AlreadyExsist = false;
        for(i=0; i<=$rootScope.FullArray.length-1; i++){
            if ($rootScope.FullArray[i].ProductCode === obj.ProductCode) {
              $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .title('Product Code Already Exsist')
              .content('Please Enter Different Product Code')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
              .targetEvent()
            );
              $scope.AlreadyExsist = true;
              break;
            };
        }

	        if (!$scope.AlreadyExsist){

				var client = $objectstore.getClient("12thproduct");
				client.onComplete(function(data){
					$state.go('home');
					$mdDialog.show(
		              $mdDialog.alert()
		              .parent(angular.element(document.body))
		              //.title('This is embarracing')
		              .content('Product Successfully Saved.')
		              .ariaLabel('Alert Dialog Demo')
		              .ok('OK')
		              .targetEvent(data)
		            );
				});
				client.onError(function(data){
					$mdDialog.show(
		              $mdDialog.alert()
		              .parent(angular.element(document.body))
		              .content('There was an error saving the data.')
		              .ariaLabel('Alert Dialog Demo')
		              .ok('OK')
		              .targetEvent(data)
		            );
				});
				obj.product_code = "-999";
				client.insert(obj,{KeyProperty:"product_code"});	
			}	
		}
	}
	$scope.changeinventoryview = function (type) {
      if (type == "No") {
        $scope.stockdisabledview = true;
      } else if (type == "Yes") {
        $scope.stockdisabledview = false;
      };
    }
});


String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function isNormalInteger(str) {
    return /^\d+$/.test(str);
}