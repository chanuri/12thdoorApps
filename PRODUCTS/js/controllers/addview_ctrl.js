rasm.controller('AppCtrl', ["$scope", "$auth", "$http","ProductService", "$uploader", "$mdDialog", "$state","$activityLog", "$mdToast", "$objectstore", "$window", "$rootScope", "$interval", "$location", "$DownloadPdf", "$helpers", function ($scope, $auth, $http,ProductService, $uploader, $mdDialog, $state,$activityLog, $mdToast, $objectstore, $window, $rootScope, $interval, $location,$DownloadPdf,$helpers) {

    // initialize the project object and 
    // define the elements of that object 

    $scope.product = {};  
    $scope.product.ProductUnit ="";
    $scope.product.ProductCategory = "";
    $scope.product.brand = "";
    $scope.product.tags = []; 
    $scope.product.stocklevel = "";
    $scope.stockdisabled = true; // enable the stock input  
    $scope.checkAbilityproduct = true; // disable or enable all inputs in aproduct all view
    $scope.products = [];  // all product array    
    $scope.SubmitProgress = false; // submit button progress bar

    //  get the settings json object 
    //  use callback functions to filter the setting app data 

    var SettingsApp  = $objectstore.getClient("Settings12thdoor");

    SettingsApp.onGetMany(function(data){
      GetProductCategory(data,function(){   // get product category from settings 
        GetProductBrand(data,function(){    // get product brands from settings 
          GetCustFields(data,function(){    // get product customer fields from settings 
            GetProUnits(data,function(){    // get product units from settings 
              GetProTaxes(data,function(){  // get product taxes from settings 
                GetBaseCurrency(data)       // get product base currency from settings 
              });
            });
          });
        });
      });
    });
    SettingsApp.onError(function(data){
      console.log("error loading settings")
    });
    SettingsApp.getByFiltering("*");


    function GetBaseCurrency(arr){
      $scope.product.baseCurrency = arr[0].profile.baseCurrency; 
    }

    function GetProTaxes(arr,callback){
      $scope.taxesArr = [];      
      var individualTaxes = arr[0].taxes.individualtaxes; 
      var multiplelTaxes = arr[0].taxes.multipletaxgroup; 
      if (individualTaxes.length > 0) {
        for(i=0; i<=individualTaxes.length-1; i++){
          if(individualTaxes[i].activate){            // only dispaly activate = true individual taxes
            $scope.taxesArr.push(individualTaxes[i]);
          }
        }
      }
      if (multiplelTaxes.length > 0) {
        for(j=0; j<=multiplelTaxes.length-1; j++){
          if(multiplelTaxes[j].activate){             // only dispaly activate = true multiple taxes
            $scope.taxesArr.push(multiplelTaxes[j]);
          }
        }
      } 
      callback();
    }

    function GetProUnits(arr,callback){
      $scope.ProUnits = [];
      var ProductUnits = arr[0].preference.productpref.units;
      if (ProductUnits.length > 0) {
        for(i=0; i<= ProductUnits.length -1; i++){
          if(ProductUnits[i].activate){  // only dispaly activate = true Units
            $scope.ProUnits.push(ProductUnits[i].unitsOfMeasurement);
            if (ProductUnits[i].unitsOfMeasurement == "each") {  // if unit name "each" is exist in the settings app then it should be pre selected in the form 
              $scope.product.ProductUnit = ProductUnits[i].unitsOfMeasurement;
            }  
          }
        }
      }      
     callback();
    }

    function GetCustFields(arr,callback){
      $scope.ProCustArr = [];
      var CustArr = arr[0].preference.productpref.CusFiel; 
      if (CustArr.length > 0) {
        for(var i=0; i<= CustArr.length-1; i++){
          $scope.ProCustArr.push(CustArr[i]);
        }
      }       
      callback();
    }

    $scope.downloadPdf = function(obj){    // product object
      $DownloadPdf.GetPdf(obj,'download')  // call the 'GetPdf' service located in service.js to render and download the pdf
    }
    $scope.printPdf = function(obj){    // product object
      $DownloadPdf.GetPdf(obj,'print')  // call the 'GetPdf' service located in service.js to render and print the pdf
    }

    function GetProductBrand(arr,callback){
      $scope.ProBrandArray = [];
      var BrandArray = arr[0].preference.productpref.Productbrands; 
      if (BrandArray.length > 0) {
        for (var i = BrandArray.length - 1; i >= 0; i--) {
          if (BrandArray[i].activate) {  // only dispaly activate = true Brand
            $scope.ProBrandArray.push(BrandArray[i].productbrand);
          }
        }
      }      
      callback();
    }

    function GetProductCategory(arr,callback){
      $scope.CategoryArray = [];
      var CatArray = arr[0].preference.productpref.Productcategories; 
      if (CatArray.length > 0) {
        for (var i = CatArray.length - 1; i >= 0; i--) {
          if (CatArray[i].activate) {  // only dispaly activate = true categories
              $scope.CategoryArray.push(CatArray[i].productcategory);
          }
        }
      }      
      callback();
    }
    $scope.OpenViewScreen = function(obj){
      $state.go('View_Screen',{'productID':obj.ProductCode}) //  go to the view screen state
    }

    // product code auto generate
    // this function will execute when the form submit 
    // this will generate unique product code for each product if the product code not manually added
    // as example for product 'apple' product code should be 'APP-0001'

    $scope.GenerateCode = function(obj){ // pass the product object 
      
      if (obj.Productname) {
          $scope.FirstLetters = obj.Productname.substring(0, 3).toUpperCase();    // get first 3 letters from roduct name
          if ($rootScope.FullArray.length>0) {    //if array is not empty        
           $scope.PatternExsist = false; // use to check pattern match the object of a array 
           $scope.MaxID = 0; 
            for(i=0; i<=$rootScope.FullArray.length-1; i++){
              if ($rootScope.FullArray[i].ProductCode.substring(0, 3) === $scope.FirstLetters) { // if first 3 letter patterns already existing 
                $scope.CurrendID = $rootScope.FullArray[i].ProductCodeID;
                if (parseInt($scope.CurrendID) > $scope.MaxID) {
                  $scope.MaxID = parseInt($scope.CurrendID); // change the MaxID to ProductCodeID
                };
                 $scope.PatternExsist = true;
              };
            }
            if (!$scope.PatternExsist) {      // if first 3 letter patterns not existing 
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

  var client = $objectstore.getClient("product12thdoor");
  client.onGetMany(function(data){
    $rootScope.FullArray = data; // get all existing product data
  });
  client.onError(function(data){
    console.log("error loading data")
  });
  client.getByFiltering("*");

  $scope.GetMaxNumber = function(obj,name,MaxID){ // pass product object, first 3 letters , max productCodeId

    $scope.FinalNumber = parseInt(MaxID) +1; // increase +1
    $scope.FinalNumberLength = $scope.FinalNumber.toString().length;
    $scope.Zerros="";

    // generate 4 index for the number for support the code format 
    // eg FinalNumber = 4 then format should be 0004
    // eg FinalNumber = 14 then format should be 0014

    for(i=0; i<4-$scope.FinalNumberLength; i++ ){
      var str = "0";
      $scope.Zerros = $scope.Zerros + str;
    }
    $scope.Zerros  = $scope.Zerros + $scope.FinalNumber.toString(); 
    obj.ProductCodeID = $scope.FinalNumber;
    obj.ProductCode = name +'-'+ $scope.Zerros; // final product code 
  }

    // sort function variable start
    $scope.testarr = [{
      name: "Starred"
      , id: "favouriteStarNo"
      , src: "img/ic_grade_48px.svg"
      , upstatus : false
      , downstatus : false
      , divider: true,
      close: false
    },{
      name: "Product Name"
      , id: "Productname"
      , src: "img/ic_add_shopping_cart_48px.svg"
      , upstatus : false
      , downstatus : false
      , divider: false,
      close: false
    }, {
      name: "Product Code"
      , id: "ProductCode"
      , src: "img/ic_add_shopping_cart_48px.svg"
      , upstatus : false
      , downstatus : false
      , divider: false,
      close: false
    }, {
      name: "Price"
      , id: "productprice"
      , src: "img/ic_add_shopping_cart_48px.svg"
      , upstatus : false
      , downstatus : false
      , divider: true,
      close: false
    }, {
      name: "Active"
      , id: "status"
      , src: "img/ic_add_shopping_cart_48px.svg"
      , upstatus : false
      , downstatus : false
      , divider: false,
      close: false
    }, {
      name: "Inactive"
      , id: "status"
      , src: "img/ic_add_shopping_cart_48px.svg"
      , upstatus : false
      , downstatus : false
      , divider: false,
      close: false
    }];  


    // variable for auto complete in all product view 
    $scope.self = this;
    $scope.self.searchText = "";
    $scope.prodSearch = '-todayDate'; // by default it should be filter by date in descending order
    $scope.indexno = 1;
    $scope.latest = '-todayDate';// by default it should be order by date in descending order

    $scope.DefaultCancel = function(item){ // pass sort array object when cancel icon click
      $scope.testarr[$scope.indexno].upstatus = false;
      $scope.testarr[$scope.indexno].downstatus = false;
      item.close = false;
      $scope.prodSearch = '-todayDate';
      $scope.indexno = 1;
      $scope.latest = '-todayDate';
    }

    $scope.CheckFullArrayStatus = function(type,id){  // pass item name and item id 
        $scope.BackUpArray = [];
        //remove all all object that status = paid and put them into backup array
          for (var i = $scope.products.length - 1; i >= 0; i--) {
              if ($scope.products[i].status === type) {
                 $scope.BackUpArray.push($scope.products[i]);            
                 $scope.products.splice(i,1);           
              };
          };
        $scope.products = MergeArr($scope.BackUpArray,$scope.products);         
    }

    function MergeArr(backup,arr){
        //sort back up array by date in accending order       
        backup.sort(function(a,b){
            return new Date(b.todayDate) - new Date(a.todayDate);
        });      

        arr.sort(function(a,b){
         return new Date(b.todayDate) - new Date(a.todayDate);
        });
        //prepend backup array to fullarray 
        for (var i = backup.length - 1; i >= 0; i--) {
            arr.unshift(backup[i]);        
        }; 
        return arr;
      }

    function SortStarFunc(){
        $scope.BackUpArrayStar = [];
        //remove all all object that status = paid and put them into backup array
        for (var i = $scope.products.length - 1; i >= 0; i--) {
            if ($scope.products[i].favouriteStarNo === 0) {
              $scope.BackUpArrayStar.push($scope.products[i]);            
              $scope.products.splice(i,1);           
            };
        };
        $scope.products = MergeArr($scope.BackUpArrayStar,$scope.products);        
    }

    $scope.starfunc = function(item,index) { // pass sort object and index number 

      if (item.id === "favouriteStarNo") {            
        $scope.latest = '-todayDate'
        $scope.prodSearch = null;
        item.upstatus == false;
        item.downstatus = false;
        $scope.testarr[$scope.indexno].upstatus = false;
        $scope.testarr[$scope.indexno].downstatus = false;
        $scope.testarr[$scope.indexno].close = false;
        item.close = true;
        $scope.indexno = index;
        SortStarFunc();

      }else if(item.id === "status"){

        $scope.latest = null
        $scope.prodSearch = null;
        item.upstatus == false;     // hide current up icon
        item.downstatus = false;    // hide current down icon
        $scope.testarr[$scope.indexno].downstatus = false;  // hide previous down icon
        $scope.testarr[$scope.indexno].upstatus = false;    // hide previous up icon
        $scope.testarr[$scope.indexno].close = false;       // hide previous close icon
        item.close = true;
        $scope.indexno = index;
        $scope.CheckFullArrayStatus(item.name, item.id);

      }else{
        if (item.upstatus == false && item.downstatus == false) {
          item.upstatus = !item.upstatus;
          item.close = true;

          if ($scope.indexno != index) {
            $scope.testarr[$scope.indexno].upstatus = false; // hide previous up icon
            $scope.testarr[$scope.indexno].downstatus = false; // hide previous down icon
            $scope.testarr[$scope.indexno].close = false; // hide previous close icon
            $scope.indexno = index;                    
          }
        } else {
          item.upstatus = !item.upstatus;
          item.downstatus = !item.downstatus;
          item.close = true;
        }
        $scope.self.searchText = "";

        if (item.upstatus) {
          $scope.prodSearch = item.id;
          $scope.latest = '-todayDate';
        }
        if (item.downstatus) {
          $scope.prodSearch = '-' + item.id;
          $scope.latest = '-todayDate';
        }
      }
    }
    //sort function variable end 


    $scope.brochureuploader = function () { // uploader md dialog box
      $mdDialog.show({
        templateUrl: 'product_partials/brochure_dialog_partial.html'
        , controller: EyeController
      })
    }
    $scope.imageuploader = function () { // uploader md dialog box
      $mdDialog.show({
        templateUrl: 'product_partials/image_dialog_partial.html'
        , controller: EyeController
      })
    }

    // image and brochure uploader controller 
    function EyeController($scope, $mdDialog, $rootScope, $state) {
      $scope.AddCus = function () {
        $mdDialog.hide();
      }
      $scope.closeDialog = function () {
        $mdDialog.hide();
      }
    }
 
    // execute when the star is click 
    // send http request to objectstore to update the current object 

    $scope.favouriteFunction = function (obj) { // pass the product object 
      var client = $objectstore.getClient("product12thdoor");
      client.onComplete(function (data) {
        if (obj.favouriteStar) {
          var toast = $mdToast.simple()
            .content('Add To Favourite')
            .action('OK')
            .highlightAction(false)
            .position("bottom right");
          obj.favouriteStarNo = 0;
          $mdToast.show(toast).then(function () {
            //whatever
          });
        } else if (!(obj.favouriteStar)) {
          var toast = $mdToast.simple()
            .content('Remove from Favourite')
            .action('OK')
            .highlightAction(false)
            .position("bottom right");
          obj.favouriteStarNo = 1;
          $mdToast.show(toast).then(function () {
            //whatever
          });
        };
      });
      client.onError(function (data) {
        var toast = $mdToast.simple()
          .content('Error Occure while Adding to Favourite')
          .action('OK')
          .highlightAction(false)
          .position("bottom right");
        $mdToast.show(toast).then(function () {
          //whatever
        });
      });

      // change the favouriteStar to  opposite boolean value 
      // change the favouriteStarNo 1 or 0 

      if (obj.favouriteStarNo == 1 ) {
      	obj.favouriteStarNo = 0;
      }
      else if (obj.favouriteStarNo == 0){
      	obj.favouriteStarNo = 1;
      };
      obj.favouriteStar = !obj.favouriteStar;
      client.insert(obj, {
        KeyProperty: "product_code"
      });
    } 
     
    $scope.changeinventory = function (type) { // inventory tracking yes or no 
      if (type == "No") {
        $scope.stockdisabled = true; // disable stock level
        $scope.product.stocklevel = "";
      } else if (type == "Yes") {
        $scope.stockdisabled = false; // enable stock level
      };
    }

    $scope.loadAllProducts = function () { 
      $scope.products = []; // empty the all product array
      $scope.hostUrl = $helpers.getHost() // get the current host 
      
      var client = $objectstore.getClient("product12thdoor");
      client.onGetMany(function (data) {
        if (data) { 
          $scope.products = data; 

          for (var i = $scope.products.length - 1; i >= 0; i--) {
            $scope.products[i].productprice = parseInt($scope.products[i].productprice);
          }  
        }
      });
      client.onError(function (data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('This is embarracing')
          .content('There was an error retreving the data.')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
      });
      client.getByFiltering("*");
    }
  
    

    $scope.submit = function () {

      if ($scope.product.ProductCode == "" || !$scope.product.ProductCode)  // if product code manualy not enterd then generate one
        $scope.GenerateCode($scope.product)
      else if(($scope.product.ProductCode.slice(4).toString().length == 4) || (isNormalInteger($scope.product.ProductCode.slice(4).toString()))) // if product code entered
        $scope.product.ProductCodeID = parseInt($scope.product.ProductCode.slice(4) ) // then generate the product code id
 
      if (!$scope.product.productprice) 
        $scope.product.productprice = "0";     
      
      $scope.product.producttax = {};

      if($scope.producttax) 
        $scope.product.producttax = JSON.parse($scope.producttax);
      else
        $scope.product.producttax = 0 

      // validate the product code format 

      if($scope.product.ProductCode.indexOf('-') === -1) {
        $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .title('Invalid Product Code')
              .content('Product Code Format is not valid.. please follow this format "APP-0002".')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
              .targetEvent()
            );
      }else if(($scope.product.ProductCode.indexOf('-') != 3)){
        $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .title('Invalid Product Code')
              .content('Product Code Format is not valid.. please follow this format "APP-0002".')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
              .targetEvent()
            );
      }else if(($scope.product.ProductCode.slice(4).toString().length != 4) || (!isNormalInteger($scope.product.ProductCode.slice(4).toString()))){
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
        $scope.SubmitProgress = true;
        $scope.AlreadyExsist = false;
        for(i=0; i<=$rootScope.FullArray.length-1; i++){
            if ($rootScope.FullArray[i].ProductCode === $scope.product.ProductCode) {
              $scope.SubmitProgress = false;
              $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('Product Code Already Exsist')
                .content('Please Enter Different Product Code')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent()
              );
              $scope.AlreadyExsist = true; // check productt code is already exisist
              break;
            };
        }
        if (!$scope.AlreadyExsist) {

          $scope.SubmitProgress = true; // show the progress bar

          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth() + 1; 
          var yyyy = today.getFullYear();
          if (dd < 10) {
            dd = '0' + dd
          }
          if (mm < 10) {
            mm = '0' + mm
          }
          today = mm + '/' + dd + '/' + yyyy; // get current date

          $scope.imagearray = []; // upload image data array initialize
          $scope.brochurearray = []; // upload brochure data array initialize

          $scope.imagearray = ProductService.loadArray(); // get image data from the factory 
          $scope.brochurearray = ProductService.loadArraybrochure(); // get brochure data from the factory 
          if ($scope.imagearray.length > 0) {
            for (indexx = 0; indexx < $scope.imagearray.length; indexx++) {
              // http call for image upload 
              $uploader.uploadMedia("productimagesNew",$scope.imagearray[indexx],$scope.imagearray[indexx].name); 
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
          };
          if ($scope.brochurearray.length > 0) {
            for (indexx = 0; indexx < $scope.brochurearray.length; indexx++) {
              // http call for brochure upload  
              $uploader.uploadMedia("productbrochureNew",$scope.brochurearray[indexx],$scope.brochurearray[indexx].name);
              $uploader.onSuccess(function (e, data) {
                var toast = $mdToast.simple()
                  .content('Brochure Successfully uploaded !')
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
                $mdToast.show(toast).then(function () {});
              });
            }
          };
          var client = $objectstore.getClient("product12thdoor");
          client.onComplete(function (data) {
            
            saveToActivityClass(data.Data[0].ID,function(){  // create activity object and save it to different class
                saveToBalanceClass(data.Data[0].ID,function(status){ // create balance object and save it to different class
                    if (status == "success") { // if return callback is success
                        $mdDialog.show(
                          $mdDialog.alert()
                          .parent(angular.element(document.body))
                          .content('Product Successfully Saved.')
                          .ariaLabel('Alert Dialog Demo')
                          .ok('OK')
                          .targetEvent(data)
                        );
                      $scope.SubmitProgress = true;
                      $state.go("home");
                    } 
                })              
            })
          });
          client.onError(function (data) {
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .content('There was an error saving the data.')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
              .targetEvent(data)
            );
          });
          $scope.product.progressshow = "false"
          $scope.product.deleteStatus = false
          $scope.product.product_code = "-999"
          $scope.product.favouriteStar = false;
          $scope.product.favouriteStarNo = 1;
          $scope.product.date = today;
          $scope.product.todayDate = new Date()
          $scope.product.UploadImages = {
            val: []
          };
          $scope.product.UploadBrochure = {
            val: []
          };
          $scope.product.customFields = $scope.ProCustArr;

          if (!$scope.product.tags)  
            $scope.product.tags = [];           

          $scope.product.UploadImages.val = ProductService.loadBasicArray();
          $scope.product.UploadBrochure.val = ProductService.loadBasicArraybrochure(); 
          client.insert($scope.product, {
            KeyProperty: "product_code"
          });
        }        
      }
    }
    function saveToActivityClass(pcode,callback){ // pass product code and return the callback
        var txt = "Product Added By ";
        $activityLog.newActivity(txt,pcode,$scope.product.ProductCode,function(status){ // call activityLog servic to save the activity data
          if (status == "success") {
            callback()
          }
        });
    }
    function saveToBalanceClass(pID,callback){ // pass product id and return the callback
      $scope.balanceArr = {
        productId : pID,
        startValue : "0",
        GRNvalue : "0",
        GINvalue : "0",
        closeValue : "0",
        startDate : new Date(),
        balance_code : "-999"
      }
      var balanceClient = $objectstore.getClient("productBalance");
      balanceClient.onComplete(function(data){ 
        callback("success");
      });
      balanceClient.onError(function(data){ 
        callback("fail")
      });
      balanceClient.insert($scope.balanceArr,{KeyProperty:"balance_code"})
    }
    // floating button initialization
    $scope.demo = {
      topDirections: ['left', 'up']
      , bottomDirections: ['down', 'right']
      , isOpen: false
      , availableModes: ['md-fling', 'md-scale']
      , selectedMode: 'md-fling'
      , availableDirections: ['up', 'down', 'left', 'right']
      , selectedDirection: 'up'
    };
    $scope.viewProduct = function () { // redirect to all products 
      location.href = '#/home';
    }
    $scope.addProduct = function () { // redirect to new  products 
      location.href = '#/Add_Product';
    }  
 
}]) //END OF AppCtrl
 
function isNormalInteger(str) { // check weather string is integer
    return /^\d+$/.test(str);
}
