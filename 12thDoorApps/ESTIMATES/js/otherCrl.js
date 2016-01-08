angular.module('mainApp')
.controller('UploadCtrl', function($scope, $mdDialog, $rootScope, $state, UploaderService) {

  $scope.uploadimages = {
    val: []
  };
  $scope.uploadimages.val = UploaderService.loadBasicArray();

  $scope.$on('viewRecord', function(event, args) {
    $scope.uploadimages.val.splice(args, 1);
  });
  $scope.toggleSearch = false;
  $scope.headers = [{
    name: 'Name',
    field: 'name'
  }, {
    name: 'Size',
    field: 'size'
  }];
  $scope.custom = {
    name: 'bold',
    size: 'grey'
  };
  $scope.sortable = ['name', 'size'];
  $scope.thumbs = 'thumb';
  $scope.count = 3;

  $scope.AddImage = function() {
    $scope.uploadimages.val = UploaderService.loadBasicArray();
  }

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
})

//-------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

.factory('InvoiceService', function($rootScope) {
    $rootScope.testArray = {val: []};
    $rootScope.editProdArray = {val: []};
    $rootScope.fullArr = {val:[]};
      $rootScope.taxArr = [];
      $rootScope.correctArr = [];
    return {
      setArray: function(newVal) {
        $rootScope.testArray.val.push(newVal);

        return $rootScope.testArray;
      },
      removeArray: function(newVals) {
        $rootScope.testArray.val.splice(newVals, 1);
        return $rootScope.testArray;
      },
       setArray2: function(newVal) {
            $rootScope.editProdArray.val.push(newVal);
            return $rootScope.showprodArray;
         },
         removeArray2: function(newVals) {
            $rootScope.editProdArray.val.splice(newVals, 1);
            return $rootScope.showprodArray;
         },
          setFullArr : function(obj){
          //console.log(obj.tax)
            this.setArray(obj);
            $rootScope.correctArr = [];
            $rootScope.multiTax = [];
               $rootScope.total = 0;
           // for(i=0; i<= $rootScope.fullArr.val.length-1; i++){
            if(obj.tax.type == "individualtaxes"){
               $rootScope.taxArr.push({
                 taxName: obj.tax.taxname,
                 rate: obj.tax.rate,
                 salesTax: parseInt(obj.amount*obj.tax.rate/100)
               })
               }else if(obj.tax.type == "multipletaxgroup"){
                  for (var i = obj.tax.individualtaxes.length - 1; i >= 0; i--) {
                     $rootScope.multiTax.push(obj.tax.individualtaxes[i].rate); 
                  }; 

                   angular.forEach($rootScope.multiTax, function(tdIinvoice) {
                     $rootScope.total += parseInt(obj.amount*tdIinvoice/100)

                     return $rootScope.total
                   })


                      console.log($rootScope.total)

                   $rootScope.taxArr.push({
                       taxName: obj.tax.taxname,
                       rate:$rootScope.multiTax ,
                       salesTax: $rootScope.total
                     })
                   console.log( $rootScope.taxArr)
               }
            
            $rootScope.taxArr = $rootScope.taxArr.sort(function(a,b){
                                     return a.taxName.toLowerCase() > b.taxName.toLowerCase() ? 1 : a.taxName.toLowerCase() < b.taxName.toLowerCase() ? -1 : 0;
                                 });
            if($rootScope.taxArr.length > 1){
            
               for(l=0; l<=$rootScope.taxArr.length-1; l++){
                  if ($rootScope.taxArr[l+1]) {

                     if ($rootScope.taxArr[l].taxName == $rootScope.taxArr[l+1].taxName) {
                        var sumSalesTax = 0;
                        var txtName = $rootScope.taxArr[l].taxName;
                        var rate = $rootScope.taxArr[l].rate;

                        sumSalesTax = $rootScope.taxArr[l].salesTax + $rootScope.taxArr[l+1].salesTax;
                        $rootScope.taxArr.splice(l,2);
                        //$rootScope.taxArr.splice(l+1,1);
                        $rootScope.taxArr.push({
                           taxName : txtName,
                           rate : rate,
                           salesTax : sumSalesTax
                        })
                        
                        $rootScope.taxArr.sort(function(a,b){
                            return a.taxName.toLowerCase() > b.taxName.toLowerCase() ? 1 : a.taxName.toLowerCase() < b.taxName.toLowerCase() ? -1 : 0;
                        });
                      
                     };
                  };                  
               }
               console.log($rootScope.taxArr)
            }

        }    

      }
   })
  //-----------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------
  .factory('UploaderService', function($rootScope) {
    $rootScope.uploadArray = [];
    $rootScope.basicinfo = [];
    return {

      setFile: function(val) {
        $rootScope.uploadArray.push(val);
        return $rootScope.uploadArray;
      },

      BasicArray: function(name, size) {
        $rootScope.basicinfo.push({
          'name': name,
          'size': size
        });
        console.log($rootScope.basicinfo);
        return $rootScope.basicinfo;
      },

      removebasicArray: function(arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
          $rootScope.basicinfo.splice(arr[i], 1);
        };
        console.log($rootScope.basicinfo);
        return $rootScope.basicinfo;
      },

      removefileArray: function(arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
          $rootScope.uploadArray.splice(arr[i], 1);
        };
        console.log($rootScope.uploadArray);
        return $rootScope.uploadArray;
      },

      loadArray: function() {
        return $rootScope.uploadArray;
      },

      loadBasicArray: function() {
        return $rootScope.basicinfo;
      },

    }
  })
  //-------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------
  
.factory('EstimateDetails', function($rootScope) {
      $rootScope.EstimateArray = [];
       $rootScope.EstimateArray1 = [];
      return {
         setArray: function(newVal) {
            $rootScope.EstimateArray.push(newVal);
            return $rootScope.EstimateArray;
         },
         removeArray: function(newVals) {
            $rootScope.EstimateArray.splice(newVals, 1);
            return $rootScope.EstimateArray;
         },
          setArray1: function(newVal) {
            $rootScope.EstimateArray1.push(newVal);
            return $$rootScope.EstimateArray1;
         },
         removeArray1: function(newVals) {
            $rootScope.EstimateArray1.splice(newVals, 1);
            return $rootScope.EstimateArray1;
         },
        
      }
   })