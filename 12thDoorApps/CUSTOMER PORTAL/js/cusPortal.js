angular
   .module('mainApp', ['ngMaterial', 'directivelibrary','12thdirective', 'uiMicrokernel', 'ui.router', 'ui.sortable'])
   .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');
   })
   .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/customer_Portal');
      $stateProvider
          .state('app', {
            url: '/customer_Portal/INo=:invoiceno',
            templateUrl: 'customerPortal/CustomerView.html',
            controller: 'AppCtrl'
         })
})
.controller('AppCtrl', function($scope, $objectstore, $uploader,$state, $mdDialog ,invoiceDetails, $window, $objectstore, $auth, $timeout, $q, $http, $mdToast, $rootScope, $stateParams, $filter, $location ) {
    $scope.TDinvoice =[];
      // $scope.Makepayment = false;

     var client = $objectstore.getClient("twethdoorInvoice");
      client.onGetMany(function(data) {
         if (data) {
           // $scope.TDinvoice = data;
            for (var i = data.length - 1; i >= 0; i--) {
               data[i].addView = "";
               data[i].invoiceNo = parseInt(data[i].invoiceNo);
               $scope.TDinvoice.push(data[i]);

               if($stateParams.invoiceno == data[i].invoiceNo){
                invoiceDetails.removeArray(data[i], 1);
                  invoiceDetails.setArray(data[i]);
               }
               $scope.Address = data[0].billingAddress.split(',');
               $scope.street = $scope.Address[0];
               $scope.city = $scope.Address[1]+$scope.Address[3]+$scope.Address[2]+$scope.Address[4];
            };
         }
      });
      client.onError(function(data) {
         $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .content('There was an error retreving the data.')
            .ariaLabel('Alert Dialog Demo')
            .ok('OK')
            .targetEvent(data)
         );
      });
      client.getByFiltering("*");

       $scope.showPaymentScheme = function(ev){
        // console.log("ddd");
        // $scope.Makepayment = true;

         $mdDialog.show({
               templateUrl: 'customerPortal/addPayment.html',
               targetEvent: ev,
               controller: 'AppCtrl',
               locals: {
                  dating: ev
               }
            })
      }

      $scope.cancel = function() {
         $mdDialog.cancel();
      }
})

//--------------------------------------------------------------------------------------
 .factory('invoiceDetails', function($rootScope) {
      $rootScope.invoiceArray = [];
      $rootScope.invoiceArray2 = [];
      return {
         setArray: function(newVal) {
            $rootScope.invoiceArray.push(newVal);
            return $rootScope.invoiceArray;
         },
         removeArray: function(newVals) {
            $rootScope.invoiceArray.splice(newVals, 1);
            return $rootScope.invoiceArray;
         },
         setArray1: function(newVal) {
            $rootScope.invoiceArray2.push(newVal);
            return $rootScope.invoiceArray;
         },
         removeArray1: function(newVals) {
            $rootScope.invoiceArray2.splice(newVals, 1);
            return $rootScope.invoiceArray;
         }
      }
   })