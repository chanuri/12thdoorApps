angular.module('mainApp').
controller('editRecurring', function($scope, $mdDialog, $objectstore, $window, $rootScope, recurringInvoiceService, $filter, $state, $location, invoiceDetails, InvoiceService) {

	 $scope.calAMount = function(data) {
         $scope.Amount = 0;
         $scope.Amount = (((data.price * data.quantity) - ((data.price * data.quantity) * data.discount / 100)) + ((data.price * data.quantity)) * data.tax / 100);
         return $scope.Amount;
      }

      $scope.calculatetotal = function(data) {
         $scope.total = 0;
         angular.forEach(data.recurringProducts, function(tdIinvoice) {
            $scope.total += (tdIinvoice.price * tdIinvoice.quantity) ;
         })
         return $scope.total;
      };
      $scope.finaldiscount = function(data) {
         $scope.finalDisc = 0;
         $scope.Discount = 0;
          angular.forEach(data.recurringProducts, function(tdIinvoice) {
            $scope.Discount +=   parseInt(tdIinvoice.discount);
            $scope.finalDisc = parseInt($scope.total*$scope.Discount/100);
         })
         return $scope.finalDisc;
      }
      $scope.CalculateTax = function(data) {
         $scope.salesTax = 0;

         angular.forEach(data.recurringProducts, function(tdIinvoice) {
            $scope.salesTax += parseInt($scope.total*tdIinvoice.tax/100);
         })
         return $scope.salesTax;
         
      }
      $scope.CalculateOtherTax = function(data) {
         $scope.otherTax = 0;
         $scope.otherTax = $scope.salesTax + ($scope.total * data.anotherTax / 100);
         return $scope.otherTax;
      }
      $scope.finalamount = function(data) {
        $rootScope.famount = 0;
         $rootScope.famount = parseInt($scope.total - $scope.finalDisc)+
          parseInt($scope.salesTax)+parseInt($scope.otherTax)+parseInt(data.shipping);
         return $rootScope.famount;
      };

      $scope.viewProfile = function(){
      	 $state.go('settings.AllRecurring_Invoices')
      }

       $scope.editRecurring = function(updatedForm) {
         var client = $objectstore.getClient("RecurringProfile");
         //updatedForm.invoiceProducts = $rootScope.showprodArray.val;
         updatedForm.total = $scope.total;
         updatedForm.finalamount = $scope.famount;
         client.onComplete(function(data) {
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('')
               .content('invoice Successfully Saved')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
         });
         client.onError(function(data) {});
         client.insert(updatedForm, {
            KeyProperty: "profileName"
         });
      }

      $scope.saveRecurring = function(updatedForm){
      	recurringInvoiceService.removeArray1(0, 1);
          recurringInvoiceService.setArray1($scope.TDinvoice);
          
         var client = $objectstore.getClient("RecurringProfile");
         $scope.TDinvoice.recurringProducts = updatedForm.recurringProducts;
         $scope.TDinvoice.total = $scope.total;
         $scope.TDinvoice.finalamount = $scope.famount;
         $scope.TDinvoice.discountAmount = $scope.finalDisc;
         $scope.TDinvoice.salesTaxAmount = $scope.salesTax;
          $scope.TDinvoice.otherTaxAmount = $scope.otherTax;
          $scope.TDinvoice.status = "Active";
         $scope.TDinvoice.favourite = false;
         $scope.TDinvoice.favouriteStarNo = 1;
         $scope.TDinvoice.Name = updatedForm.Name;
         // $scope.TDinvoice.Email = updatedForm.Email;
         $scope.TDinvoice.billingAddress = updatedForm.billingAddress;
         $scope.TDinvoice.shippingAddress = updatedForm.shippingAddress;
         // $scope.TDinvoice.UploadImages = {
         //    val: []
         // };

         //$scope.TDinvoice.UploadImages.val = UploaderService.loadBasicArray();
         client.onComplete(function(data) {
         $state.go('viewProfile', {'profileName': $scope.TDinvoice.profileRefName});
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('')
               .content('invoioce Successfully Saved')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
         });

         $scope.TDinvoice.profileName = "-999";
         client.insert([$scope.TDinvoice], {
            KeyProperty: "profileName"
         });

     
       client.onError(function(data) {
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('Sorry')
               .content('Error saving invoioce')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
         }); 
      }

})