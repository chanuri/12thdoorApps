rasm.controller('AppCtrl', ["$scope", "$auth", "$http","ProductService", "$uploader", "$mdDialog", "$state","$activityLog", "$mdToast", "$objectstore", "$window", "$rootScope", "$interval", "$location", "$DownloadPdf", function ($scope, $auth, $http,ProductService, $uploader, $mdDialog, $state,$activityLog, $mdToast, $objectstore, $window, $rootScope, $interval, $location,$DownloadPdf) {
  

    $scope.currentPage = 1;

    $scope.testProducts = [];
    //test 

    $scope.testColumn = ['id','name','pcode','lname','company'];
    $scope.testArr = [{
      value:['12','samal','3221','rana','duo'],
      addition:true
    }]
    //end test
    //  get the settings json object 
    var SettingsApp  = $objectstore.getClient("Settings12thdoor");
    SettingsApp.onGetMany(function(data){
      //console.log(data)
      //console.log(data)
      GetProductCategory(data,function(){  // return one object of array 
        GetProductBrand(data,function(){
          GetCustFields(data,function(){
            GetProUnits(data,function(){
              GetProTaxes(data,function(){
                GetBaseCurrency(data)
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
      callback();
    }

    function GetProUnits(arr,callback){
      $scope.ProUnits = [];
      var ProductUnits = arr[0].preference.productpref.units;
      for(i=0; i<= ProductUnits.length -1; i++){
        if(ProductUnits[i].activate){
            $scope.ProUnits.push(ProductUnits[i].unitsOfMeasurement);      
        }
     }
     callback();
    }

    function GetCustFields(arr,callback){
      $scope.ProCustArr = [];
      var CustArr = arr[0].preference.productpref.CusFiel; 
      for(var i=0; i<= CustArr.length-1; i++){
        $scope.ProCustArr.push(CustArr[i]);
      } 
      callback();
    }

    $scope.downloadPdf = function(obj){
      $DownloadPdf.GetPdf(obj,'download')
    }
    $scope.printPdf = function(obj){
      $DownloadPdf.GetPdf(obj,'print')
    }

    function GetProductBrand(arr,callback){
      $scope.ProBrandArray = [];
      var BrandArray = arr[0].preference.productpref.Productbrands;      
      for (var i = BrandArray.length - 1; i >= 0; i--) {
         if (BrandArray[i].activate) {
            $scope.ProBrandArray.push(BrandArray[i].productbrand);
         }
      }
      callback();
    }

    function GetProductCategory(arr,callback){
      $scope.CategoryArray = [];
      var CatArray = arr[0].preference.productpref.Productcategories;      
      for (var i = CatArray.length - 1; i >= 0; i--) {
         if (CatArray[i].activate) {
            $scope.CategoryArray.push(CatArray[i].productcategory);
         }
      }
      callback();
    }
    //TAGS
    $scope.DemoCtrl = function ($timeout, $q) {
      $scope.readonly = false;
      // Lists of tags names and Vegetable objects
      $scope.fruitNames = [];
      $scope.product.tags = [];
      $scope.product.tags = angular.copy($scope.fruitNames);
      $scope.tags = [];
    }

    $scope.OpenViewScreen = function(obj){
      $state.go('View_Screen',{'productID':obj.ProductCode})
    }
   //product code auto genarate 
   $scope.GenerateCode = function(obj){
    //console.log(obj.Productname.substring(0, 3).toUpperCase());
    if (obj.Productname) {
      $scope.FirstLetters = obj.Productname.substring(0, 3).toUpperCase();
    };
        
    var client = $objectstore.getClient("product12thdoor");
    client.onGetMany(function(data){
      $rootScope.FullArray = data;
      if (data.length>0) {
        //if array is not empty
         $scope.PatternExsist = false; // use to check pattern match the object of a array 
         $scope.MaxID = 0;
          for(i=0; i<=data.length-1; i++){
            if (data[i].ProductCode.substring(0, 3) === $scope.FirstLetters) {
              $scope.CurrendID = data[i].ProductCodeID;
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
      
    });
    client.onError(function(data){
      console.log("error loading data")
    });
    client.getByFiltering("*");
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
    
    $scope.self = this;
    $scope.self.searchText = "";
    $scope.prodSearch = '-todayDate';
    $scope.indexno = 1;
    $scope.latest = '-todayDate';

    $scope.DefaultCancel = function(item){
      $scope.testarr[$scope.indexno].upstatus = false;
      $scope.testarr[$scope.indexno].downstatus = false;
      item.close = false;
      $scope.prodSearch = '-todayDate';
      $scope.indexno = 1;
      $scope.latest = '-todayDate';
    }
    $scope.CheckFullArrayStatus = function(type,id){  
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
        for (var i = $scope.products.length - 1; i >= 0; i--) {
            if ($scope.products[i].favouriteStarNo === 0) {
              $scope.BackUpArrayStar.push($scope.products[i]);            
              $scope.products.splice(i,1);           
            };
        };
        $scope.products = MergeArr($scope.BackUpArrayStar,$scope.products);        
    }

    $scope.starfunc = function(item,index) {

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
            item.upstatus == false;
            item.downstatus = false;
            $scope.testarr[$scope.indexno].downstatus = false;
            $scope.testarr[$scope.indexno].upstatus = false;
            $scope.testarr[$scope.indexno].close = false;
            item.close = true;
            $scope.indexno = index;
            $scope.CheckFullArrayStatus(item.name, item.id);

        }
        else{
          // scope.star = "";

              if (item.upstatus == false && item.downstatus == false) {
                  item.upstatus = !item.upstatus;
                  item.close = true;

                  if ($scope.indexno != index) {
                    $scope.testarr[$scope.indexno].upstatus = false;
                    $scope.testarr[$scope.indexno].downstatus = false;
                    $scope.testarr[$scope.indexno].close = false;
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
    $scope.brochureuploader = function () {
      $mdDialog.show({
        templateUrl: 'product_partials/brochure_dialog_partial.html'
        , controller: EyeController
      })
    }
    $scope.imageuploader = function () {
      $mdDialog.show({
        templateUrl: 'product_partials/image_dialog_partial.html'
        , controller: EyeController
      })
    }

    function EyeController($scope, $mdDialog, $rootScope, $state) {
      $scope.AddCus = function () {
        $mdDialog.hide();
      }
      $scope.closeDialog = function () {
        $mdDialog.hide();
      }
    }
    $scope.stockdisabled = true;
    $scope.stockdisabledview = false;
    $scope.progresshow = false;
    $scope.progressbrochure = false;
    $scope.progresshowfull = false;
    //  $scope.stockdisabledpackageview = false;	 
    $scope.securityKey = '';
    $scope.toggleSearch = false;
    $scope.checkAbility = true;
    $scope.checkAbilityproduct = true;
    $scope.products = [];

    // $scope.packages=[];
    $scope.loadallarray = [];
    
    $scope.testfunc = function () {
      self.searchText = "true"
    }
    //sort function variable end 
    var self = this;
    // list of `state` value/display objects
    self.tenants = loadAll();
    self.selectedItem = null;
    self.searchText = null;
    self.querySearch = querySearch;
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for tenants... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {
      $scope.enter = function (keyEvent) {
        if (keyEvent.which === 13) {
          if (self.selectedItem === null) {
            self.selectedItem = query;
            //console.log(results);
          } else {
            //console.log(self.selectedItem);
          }
        }
      }
    }

    function loadAll() {}

    function setroute(route) {
      $location.path(route);
    }
    $scope.favouriteFunction = function (obj) {
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
    $scope.onChangeproduct = function (cbState) {
      if (cbState == true) {
        $scope.checkAbilityproduct = false;
        $scope.checkAbility = true;
      } else {
        $scope.checkAbilityproduct = true;
        $scope.checkAbility = false;
      }
    };
    $scope.changeinventoryview = function (type) {
      if (type == "No") {
        $scope.stockdisabledview = true;
      } else if (type == "Yes") {
        $scope.stockdisabledview = false;
      };
    }
    $scope.changeinventory = function (type) {
      if (type == "No") {
        $scope.stockdisabled = true;
        $scope.product.stocklevel = null;
      } else if (type == "Yes") {
        $scope.stockdisabled = false;
      };
    }
    //The two buttons click events below are defined in the rejectContentTemplate
    $scope.hideReject = function () {
      $mdDialog.hide($scope.securityKey);
    };
    $scope.cancelReject = function () {
      $mdDialog.cancel();
    };
    $scope.statusIncludes = [];
    $scope.includeStatus = function (Status) {
      var i = $.inArray(Status, $scope.statusIncludes);
      if (i > -1) {
        $scope.statusIncludes.splice(i, 1);
      } else {
        $scope.statusIncludes.push(Status);
      }
    }
    $scope.statusFilter = function (userDetails) {
      if ($scope.statusIncludes.length > 0) {
        if ($.inArray(userDetails.Status, $scope.statusIncludes) < 0)
          return;
      }
      return userDetails;
    }
    $scope.scrollbarConfig = {
      autoHideScrollbar: false
      , theme: 'minimal-dark'
      , axis: 'y'
      , advanced: {
        updateOnContentResize: true
      }
      , scrollInertia: 300
    }
    $scope.hideProductDetails = function () {
      alert("what");
    }
    var len;
    $scope.loadAllProducts = function () {
      $scope.loadallarray = [];
      $scope.products = [];
      $scope.packages = [];
      var client = $objectstore.getClient("product12thdoor");
      client.onGetMany(function (data) {
        if (data) {
          $scope.loadallarray = data;
          $scope.products = data;
          $rootScope.FullArray = data;

          for (var i = $scope.products.length - 1; i >= 0; i--) {
            $scope.products[i].productprice = parseInt($scope.products[i].productprice);
          }
          //console.log($scope.products);
          LoadImageData();
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
    };

    function LoadImageData(){
      var client = $objectstore.getClient("productimagesNew");
      client.onGetMany(function(data){
        $scope.LoadImageArray = data;

        for (var i = $scope.LoadImageArray.length - 1; i >= 0; i--) {
          for (var j = $scope.products.length - 1; j>= 0; j--) {
            if ($scope.products[j].UploadImages.val.length > 0) {
              if ($scope.LoadImageArray[i].FileName == $scope.products[j].UploadImages.val[0].name) {
                $scope.products[j].FullImage =  $scope.LoadImageArray[i]
              };
            }else{
                $scope.products[j].FullImage = [];
            }           
          };
        };

        //console.log($scope.products);
      });
      client.onError(function(data){

      });
      client.getByFiltering("*");
    }


    $scope.content1 = {
      val: []
    };
    $scope.content2 = {
      val: []
    };
    $scope.getuploaddata = function (key, type, stock) {
      if (type == "No") {
        //$scope.stockdisabledpackageview = true;
        $scope.stockdisabledproductview = true;
      } else if (type == "Yes") {
        //$scope.stockdisabledpackageview = false;
        $scope.stockdisabledproductview = false;
      };
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

    function mainAction() {
    }

    function setMainAction() {
      if (vm.chosen.action === 'fire') {
        vm.mainAction = mainAction;
      } else {
        vm.mainAction = null;
      }
    }
    $scope.newItems = [];
    $scope.product = {};
    $scope.product.ProductUnit =""
    $scope.product.ProductCategory = ""
    $scope.product.brand = ""
    $scope.SubmitProgress = false;

    $scope.submit = function () {
      if (!$scope.product.productprice) {
        $scope.product.productprice = "0";
      }
      
      $scope.product.producttax = {};
      if ($scope.producttax) {
        $scope.product.producttax = JSON.parse($scope.producttax);
      }else{
         $scope.product.producttax = 0
      }
      //console.log($scope.product.producttax);

      if ($scope.product.ProductCode.indexOf('-') === -1) {
        //console.log("dash missing")
        $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .title('Invalid Product Code')
              .content('Product Code Format is not valid.. please follow this format "APP-0002".')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
              .targetEvent()
            );
      }else if(($scope.product.Productname.substring(0, 3).toUpperCase() != $scope.product.ProductCode.substring(0,3)) || ($scope.product.ProductCode.indexOf('-') != 3)){
        //console.log("first letters not match")
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
        //console.log("last numbers are invalid or length is not 4")
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
              //console.log("already exsist");
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
              $scope.AlreadyExsist = true;
              break;
            };
        }
        if (!$scope.AlreadyExsist) {

          $scope.SubmitProgress = true;

          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth() + 1; //January is 0!
          var yyyy = today.getFullYear();
          if (dd < 10) {
            dd = '0' + dd
          }
          if (mm < 10) {
            mm = '0' + mm
          }
          today = mm + '/' + dd + '/' + yyyy;
          $scope.imagearray = [];
          $scope.imagearray = ProductService.loadArray();
          $scope.brochurearray = ProductService.loadArraybrochure();
          if ($scope.imagearray.length > 0) {
            for (indexx = 0; indexx < $scope.imagearray.length; indexx++) {
              //console.log($scope.imagearray[indexx]);
              $uploader.upload("ignoreNamespace","productimagesNew", $scope.imagearray[indexx]);
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
              //console.log($scope.brochurearray[indexx].name);
              $uploader.upload("ignoreNamespace","productbrochureNew", $scope.brochurearray[indexx]);
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
           
            $scope.newItems.push($scope.product);
            saveToActivityClass(data.Data[0].ID,function(){
                saveToBalanceClass(data.Data[0].ID,function(status){
                    if (status == "success") {
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
                    }else{

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

          if (!$scope.product.tags) {
            $scope.product.tags = [];
          };
          $scope.product.UploadImages.val = ProductService.loadBasicArray();
          $scope.product.UploadBrochure.val = ProductService.loadBasicArraybrochure();
          //console.log($scope.product)
          client.insert($scope.product, {
            KeyProperty: "product_code"
          });

        }        
      }
    }

    function saveToActivityClass(pcode,callback){
        $scope.product.ProductCode
        var txt = "Product Added By ";
        $activityLog.newActivity(txt,pcode,$scope.product.ProductCode,function(status){
          if (status == "success") {
            callback()
          }
        });
    }


    function saveToBalanceClass(pID,callback){
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
        //console.log("Successfully inserted to balance class");
        callback("success");
      });
      balanceClient.onError(function(data){
        //console.log("error inserting to balance class")
        callback("fail")
      });
      balanceClient.insert($scope.balanceArr,{KeyProperty:"balance_code"})
    }
    $scope.demo = {
      topDirections: ['left', 'up']
      , bottomDirections: ['down', 'right']
      , isOpen: false
      , availableModes: ['md-fling', 'md-scale']
      , selectedMode: 'md-fling'
      , availableDirections: ['up', 'down', 'left', 'right']
      , selectedDirection: 'up'
    };
    $scope.save = function () {
      setTimeout(function () {
        $('#mySignup').click();
      }, 0)
    }
    $scope.viewProduct = function () { 
      location.href = '#/home';
    }
    $scope.addProduct = function () {
      location.href = '#/Add_Product';
    }

    $scope.TDinvoice = {};
    $rootScope.$on('viewRecord', function (event, args) {
      $scope.imageDetails = args;
      var fileExt = args.name.split('.').pop()
      //console.log(args.name);
      //console.log(fileExt);
      if (fileExt == "docx") {
        $scope.progressbrochure = true;
        var client = $objectstore.getClient("productbrochure");
        client.onGetMany(function (data) {
          if (data) {
            $scope.brochurebody = [];
            $scope.brochurebody = data;
            var pbody = data
            //console.log(pbody);
            for (var i = $scope.brochurebody.length - 1; i >= 0; i--) {
              var url = 'data:application/msword;base64,' + $scope.brochurebody[i].Body;
              window.location.href = url;
            };
            $scope.progressbrochure = false;
          }
        });
        client.onError(function (data) {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .title('This is embarracing')
            .content('There was an error Downloading the Document.')
            .ariaLabel('Alert Dialog Demo')
            .ok('OK')
            .targetEvent(data)
          );
          $scope.progressbrochure = false;
        });
        client.getByFiltering("select Body from productbrochureNew where FileName like '%" + args.name + "'%");
      } else if (fileExt == "pdf") {
        $scope.progressbrochure = true;
        var client = $objectstore.getClient("productbrochure");
        client.onGetMany(function (data) {
          if (data) {
            $scope.brochurebodypdf = [];
            $scope.brochurebodypdf = data;
            //console.log($scope.brochurebodypdf);
            for (var i = $scope.brochurebodypdf.length - 1; i >= 0; i--) {
              var url = 'data:application/pdf;base64,' + $scope.brochurebodypdf[i].Body;
              window.location.href = url;
            };
            $scope.progressbrochure = false;
          }
        });
        client.onError(function (data) {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .title('This is embarracing')
            .content('There was an error Loading the PDF file .')
            .ariaLabel('Alert Dialog Demo')
            .ok('OK')
            .targetEvent(data)
          );
          $scope.progressbrochure = false;
        });
        client.getByFiltering("select Body from productbrochureNew where FileName like '%" + args.name + "'%");
      } else if (fileExt == "png" || fileExt == "jpg") {
        $scope.progresshow = true;
        var client = $objectstore.getClient("productimages");
        client.onGetMany(function (data) {
          if (data) {
            $scope.imageload = [];
            $scope.imageload = data;
            //console.log($scope.imageload);
            for (var i = $scope.imageload.length - 1; i >= 0; i--) {
              var url = 'data:image/png;base64,' + $scope.imageload[i].Body;
              window.location.href = url;
            };

            $scope.progresshow = false;
          }
        });
        client.onError(function (data) {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .title('This is embarracing')
            .content('There was an error Loading the image file .')
            .ariaLabel('Alert Dialog Demo')
            .ok('OK')
            .targetEvent(data)
          );
          $scope.progresshow = false;
        });
        client.getByFiltering("select Body from productimagesNew where FileName like '%" + args.name + "'%");
        // $mdDialog.show({
        //      template:acceptContentTemplate,
        //      controller: 'testCtrl',
        //      locals: { employee: $scope.imageDetails }
        //    });
      } else {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('Invalid File Format')
          .content('This is a invalid file format, please upload only png,docx,jpg and pdf file types')
          .ariaLabel()
          .ok('Ok')
          .targetEvent(event)
        );
      }
    });
    $scope.toggleSearch = false;
    $scope.headers = [{
      name: 'Name'
      , field: 'name'
    }, {
      name: 'Size'
      , field: 'size'
    }];
    $scope.custom = {
      name: 'bold'
      , size: 'grey'
    };
    $scope.sortable = ['name', 'size'];
    $scope.thumbs = 'thumb';
    $scope.count = 3;
    var acceptContentTemplate = '\
          <md-dialog>\
          <md-dialog-content style="padding:24px;">\
          <div layout layout-sm="column" layout-margin>\
           <div flex="5">\
            <img src="img/material alperbert/avatar_tile_f_28.png" style="margin-top:22px;border-radius:20px"/>\
            </div>\
            <div flex="30" style="margin-top:35px;">\
             <label style="font-weight:700"></label>\
              </div>\
              	 <img data-ng-src="data:image/png;base64,{{test.Body}}" data-err-src="img/avatar.png" style="width:200px; height:100px;/>\
             </div>\
         <div style="margin-left:120px;">\
        </div></br><br>\
      <md-divider></md-divider>\
      <div class="md-actions"> \
              <md-button class="md-primary md-button md-default-theme" ng-click="cancelAccept()"></md-button> \
            <md-button class="md-primary md-button md-default-theme" ng-click="hideAccept()">OK</md-button> \
          </div> \
          </md-content> \
        </md-dialog> ';
  }]) //END OF AppCtrl
rasm.controller('testCtrl',["$scope", "employee", "$mdDialog", function ($scope, employee, $mdDialog) {
  $scope.test = employee;
  $scope.hideAccept = function () {
    $mdDialog.hide();
  };
  $scope.cancelAccept = function () {
    $mdDialog.cancel();
  };
}])

function containsObject(obj, list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].Id == obj.Id) {
      return true;
    }
  }
  return false;
}
function isNormalInteger(str) {
    return /^\d+$/.test(str);
}
