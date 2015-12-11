rasm.controller('EditCtrl', function ($scope, $state, $stateParams,$rootScope, $objectstore, $auth, $EditUploadData, $uploader, $mdDialog, $objectstoreAccess, UploaderService) {
	console.log($stateParams.Eobject);

	$objectstoreAccess.LoadOneDetails("12thproduct", $stateParams.Eobject, function (data) {
		$scope.product_edit = [];
		$scope.product_edit.push(data);	 

	    if ($scope.product_edit[0].inventory == "No") {
        	$scope.stockdisabledproductview = true;
        } else if ($scope.product_edit[0].inventory  == "Yes") {
         	$scope.stockdisabledproductview = false;
        };
		
	});	

  $scope.edit = function(obj){

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
        obj.ProductCodeID = parseInt(obj.ProductCode.substring(4,8));
        console.log(obj.ProductCodeID)
        client.insert(obj,{KeyProperty:"product_code"});  
      
    }
  }      
   
  $scope.changeinventoryproductview = function (type, prod) {
    if (type == "No") {
      $scope.stockdisabledproductview = true;
      prod.stocklevel = "";
    }
    if (type == "Yes") {
      $scope.stockdisabledproductview = false;
    };
  }

  $scope.GenerateCode = function(obj){
    if (obj.Productname) {
      $scope.FirstLetters = obj.Productname.substring(0, 3).toUpperCase();
    };

    if ($rootScope.FullArray.length>0) {
        //if array is not empty
         $scope.PatternExsist = false; // use to check pattern match the object of a array 
         $scope.MaxID = 0;
          for(i=0; i<=$rootScope.FullArray.length-1; i++){
            if ($rootScope.FullArray[i].ProductCode.substring(0, 3) === $scope.FirstLetters) {
              $scope.CurrendID = $rootScope.FullArray[i].ProductCodeID;
              if ($scope.CurrendID > $scope.MaxID) {
                $scope.MaxID = $scope.CurrendID;
              };
               $scope.PatternExsist = true;
            };
          }
          if (!$scope.PatternExsist) {
            obj.ProductCode = $scope.FirstLetters + '-0001';
            obj.ProductCodeID = 1;
          }else if($scope.PatternExsist){
            $scope.GetMaxNumber(obj,$scope.FirstLetters,$scope.MaxID)
          }       
      }else{
        obj.ProductCode = $scope.FirstLetters + '-0001';
        obj.ProductCodeID = 1;
      }
  }

  $scope.GetMaxNumber = function(obj,name,MaxID){

    $scope.FinalNumber = MaxID +1;
    $scope.FinalNumberLength = $scope.FinalNumber.toString().length;
    $scope.Zerros="";
    for(i=0; i<4-$scope.FinalNumberLength; i++ ){
      var str = "0";
      $scope.Zerros = $scope.Zerros + str;
    }
    $scope.Zerros  = $scope.Zerros + $scope.FinalNumber.toString(); 
    obj.ProductCodeID = $scope.FinalNumber;
    obj.ProductCode = name +'-'+ $scope.Zerros;
   }

});