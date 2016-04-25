rasm.controller("CopyCtrl",["$scope","$rootScope","$uploader", "$stateParams", "$state", "$DownloadPdf", "$objectstore", "$auth", "$mdDialog", "$mdToast", "$activityLog","ProductService", function($scope,$rootScope,$uploader, $stateParams, $state, $DownloadPdf, $objectstore, $auth, $mdDialog, $mdToast, $activityLog,ProductService){
	console.log($stateParams.productID);

	ProductService.setArraysEmpty();

	var client = $objectstore.getClient("product12thdoor");
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
	client.getByFiltering("select * from product12thdoor where ProductCode = '"+$stateParams.productID+"'");	 

	function ChangeProductCode(obj){ // call to prouce new product code

		var Pname = obj[0].ProductCode.substring(0,3);
		var sortArr = [];
		var proClient = $objectstore.getClient("product12thdoor");
		proClient.onGetMany(function(data){
		 	console.log(data)
		 	sortArr = data.sort(function(a,b){
		 		return new Date(b.todayDate) - new Date(a.todayDate);
		 	})

			var Pnumbers = sortArr[0].ProductCode.substring(4,8);
			var NewPnumber = parseInt(Pnumbers) + 1;
			$scope.NumberString = "";

			for(i=0; i < 4-NewPnumber.toString().length; i++){
				$scope.NumberString = $scope.NumberString + "0";
			}

			var FinalNumber = $scope.NumberString + NewPnumber.toString();
			obj[0].ProductCode = sortArr[0].ProductCode.replaceAt(4,FinalNumber);
			obj.ProductCodeID = FinalNumber;
		});
		proClient.onError(function(data){
			console.log("error Loading data")
		});
		proClient.getByFiltering("select * from product12thdoor where ProductCode like '%"+Pname+"%'");	

	}

	$scope.GenerateCode = function(obj){
    
	    if (obj.Productname) {
	        $scope.FirstLetters = obj.Productname.substring(0, 3).toUpperCase();    
	        if ($rootScope.FullArray.length>0) {
	        //if array is not empty
	         $scope.PatternExsist = false; // use to check pattern match the object of a array 
	         $scope.MaxID = 0;
	          for(i=0; i<=$rootScope.FullArray.length-1; i++){
	            if ($rootScope.FullArray[i].ProductCode.substring(0, 3) === $scope.FirstLetters) {
	              $scope.CurrendID = $rootScope.FullArray[i].ProductCodeID;
	              if (parseInt($scope.CurrendID) > $scope.MaxID) {
	                $scope.MaxID = parseInt($scope.CurrendID);
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
	}

 

	$scope.GetMaxNumber = function(obj,name,MaxID){

	    $scope.FinalNumber = parseInt(MaxID) +1;
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


	$scope.submit = function(obj){


	    if (obj.ProductCode == "" || !obj.ProductCode)  
	        $scope.GenerateCode(obj)
	    else if((obj.ProductCode.slice(4).toString().length == 4) || (isNormalInteger(obj.ProductCode.slice(4).toString()))) 
        	obj.ProductCodeID = parseInt(obj.ProductCode.slice(4) )

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
      }else if( (obj.ProductCode.indexOf('-') != 3)){
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
        if ($rootScope.FullArray) {
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
        };
        

	        if (!$scope.AlreadyExsist){

	          	$scope.imagearray = [];
	          	$scope.brochurearray = [];

	          	$scope.imagearray = ProductService.loadArray();
	          	$scope.brochurearray = ProductService.loadArraybrochure();

			  	if ($scope.imagearray.length > 0) {
			        for (indexx = 0; indexx < $scope.imagearray.length; indexx++) {
			          $uploader.upload("nameSpace","productimagesNew", $scope.imagearray[indexx]);
			          $uploader.onSuccess(function (e, data) {
			            var toast = $mdToast.simple()
			              .content('Image Successfully uploaded!')
			              .action('OK')
			              .highlightAction(false)
			              .position("bottom right");
			            $mdToast.show(toast).then(function () {
			              //whatever
			            });
			          });
			          $uploader.onError(function (e, data) {
			            var toast = $mdToast.simple()
			              .content('There was an error, please upload!')
			              .action('OK')
			              .highlightAction(false)
			              .position("bottom right");
			            $mdToast.show(toast).then(function () {
			              //whatever
			            });
			          });
			        }
			        obj.UploadImages = {val:[]}
         			obj.UploadImages.val = ProductService.loadBasicArray();
			    }
		        if($scope.brochurearray.length > 0) {
		            for (indexx = 0; indexx < $scope.brochurearray.length; indexx++) {

		              	$uploader.upload("ignoreNamespace","productbrochureNew", $scope.brochurearray[indexx]);
		              	$uploader.onSuccess(function (e, data) {
			                var toast = $mdToast.simple()
			                  .content('Brochure Successfully uploaded !')
			                  .action('OK')
			                  .highlightAction(false)
			                  .position("bottom right");
			                $mdToast.show(toast).then(function () {

			                });
		              	});
		              	$uploader.onError(function (e, data) {
			                var toast = $mdToast.simple()
			                  .content('There was an error, please upload!')
			                  .action('OK')
			                  .highlightAction(false)
			                  .position("bottom right");
			                $mdToast.show(toast).then(function () {});
		              	});
		            }
		            obj.UploadBrochure = {val:[]}
          			obj.UploadBrochure.val = ProductService.loadBasicArraybrochure();
		        }

				var client = $objectstore.getClient("product12thdoor");
				client.onComplete(function(data){
					var txtActivity = "Product Added By ";
			        $activityLog.newActivity(txtActivity,data.Data[0].ID,obj.ProductCode,function(status){
				        if (status == "success") {            
				            $state.go('home');
				            $mdDialog.show(
				                $mdDialog.alert()
				                .parent(angular.element(document.body))
				                .content('Product Successfully Saved.')
				                .ariaLabel('Alert Dialog Demo')
				                .ok('OK')
				                .targetEvent(data)
				            );
				        }
				    });
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
				obj.todayDate = new Date();
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

	var settingClient = $objectstore.getClient("Settings12thdoor");
	settingClient.onGetMany(function(data){
		getProductBrand(data,function(){
		  getProductCategory(data,function(){
		    getAllUnits(data,function(){
		      getProTaxes(data);
		    });        
		  })
		})
	});
	settingClient.onError(function(data){
		console.log("error loading seetting data")
	});
	settingClient.getByFiltering("*");

	function getProductBrand(arr,callback){
	  $scope.ProBrandArray = [];
	  var BrandArray = arr[0].preference.productpref.Productbrands;      
	  for (var i = BrandArray.length - 1; i >= 0; i--) {
	     if (BrandArray[i].activate) {
	        $scope.ProBrandArray.push(BrandArray[i].productbrand);
	     }
	  }
	  callback();
	}
	
	function getProductCategory(arr,callback){
	  $scope.CategoryArray = [];
	  var CatArray = arr[0].preference.productpref.Productcategories;      
	  for (var i = CatArray.length - 1; i >= 0; i--) {
	     if (CatArray[i].activate) {
	        $scope.CategoryArray.push(CatArray[i].productcategory);
	     }
	  }
	  callback();
	}

	function getProTaxes(arr){
	  $scope.taxesArr = [];      
	  var individualTaxes = arr[0].taxes.individualtaxes; 
	  var multiplelTaxes = arr[0].taxes.multipletaxgroup; 

	  for(i=0; i<=individualTaxes.length-1; i++){
	    if(individualTaxes[i].activate){
	      $scope.taxesArr.push(individualTaxes[i]);
	    }
	  }
	  for(j=0; j<=multiplelTaxes.length-1; j++){
	    if(multiplelTaxes[j].activate){
	      $scope.taxesArr.push(multiplelTaxes[j]);
	    }
	  }

	}

	function getAllUnits(arr,callback){
	  $scope.ProUnits = [];
	    var ProductUnits = arr[0].preference.productpref.units;
	    for(i=0; i<= ProductUnits.length -1; i++){
	      if(ProductUnits[i].activate){
	          $scope.ProUnits.push(ProductUnits[i].unitsOfMeasurement);      
	      }
	  }
	  callback();
	}
}]);


String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function isNormalInteger(str) {
    return /^\d+$/.test(str);
}