angular.module('mainApp').controller('ViewRecurring', function($scope, $mdDialog, $objectstore,$stateParams, $window, $rootScope, recurringInvoiceService, $filter, $state, $location, invoiceDetails, InvoiceService) {
      $scope.TDinvoice = [];
      $scope.newItems = [];
      $scope.show = false;
      $scope.showTable = false;
      $scope.obtable = [];
      $scope.invoiceArray.shipping = 0;
      var vm = this;
      $scope.announceClick = function(index) {
         $mdDialog.show(
            $mdDialog.alert()
            .title('You clicked!')
            .content('You clicked the menu item at index ' + index)
            .ok('ok')
         );
      };
      $scope.sortableOptions = {
         containment: '#sortable-container'
      };
      $rootScope.tenants = loadAll();
      $rootScope.selectedItem2 = null;
      $rootScope.searchText1 = null;
      $rootScope.querySearch1 = querySearch1;

      function querySearch1(query) {
         $scope.enter = function(keyEvent) {
               if (keyEvent.which === 13) {
                  if ($rootScope.selectedItem2 === null) {
                     $rootScope.selectedItem2 = query;
                  } else {}
               }
            }
            //Custom Filter
         $rootScope.results = [];
         for (i = 0, len = $scope.customerNames.length; i < len; ++i) {
            if ($scope.customerNames[i].display.indexOf(query) != -1) {
               $rootScope.results.push($scope.customerNames[i]);
            }
         }
         return $rootScope.results;
      }
      $scope.customerNames = [];

      function loadAll() {
         var client = $objectstore.getClient("RecurringProfile");
         client.onGetMany(function(data) {
            if (data) {
               for (i = 0, len = data.length; i < len; ++i) {
                  $scope.customerNames.push({
                     display: data[i].Name,
                     value: data[i]
                  });
               }
            }
         });
         client.onError(function(data) {
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('Sorry')
               .content('There is no products available')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
         });
         client.getByFiltering("*");
      }
      $scope.viewSavedProducts = function(obj) {
         $mdDialog.show({
            templateUrl: 'Invoicepartials/showproduct.html',
            controller: 'productCtrl',
            locals: {
               item: obj
            }
         });
      }
      $scope.onChangeinventory = function(cbState) {
         if (cbState == true) {
            $scope.checkAbility = false;
         } else {
            $scope.checkAbility = true;
         }
      };
      $scope.Billingaddress = true;
      $scope.Shippingaddress = false;
      $scope.changeAddress = function() {
         $scope.Billingaddress = !$scope.Billingaddress;
         $scope.Shippingaddress = !$scope.Shippingaddress;
      }
      $scope.checkAbility = true;
      $scope.onChange = function(cbState) {
         if (cbState == true) {
            $scope.checkAbility = false;
         } else {
            $scope.checkAbility = true;
         }
      };
     
      $scope.deleteRecurringInvoice = function(deleteform, ev) {
         if(deleteform.invoiceNo == "-999"){
          deleteform.invoiceNo = angular.copy(deleteform.profileRefName);
        }
         var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('')
            .content('Are You Sure You Want To Delete This Record? This process is not reversible')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(ev);
         $mdDialog.show(confirm).then(function() {
            var client = $objectstore.getClient("RecurringProfile");
            client.onComplete(function(data) {
               $mdDialog.show(
                  $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .content('Record Successfully Deleted')
                  .ariaLabel('')
                  .ok('OK')
                  .targetEvent(data)
               );
               $state.go($state.current, {}, {
                  reload: true
               });
            });
            client.onError(function(data) {
               $mdDialog.show(
                  $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .content('Error Deleting Record')
                  .ariaLabel('')
                  .ok('OK')
                  .targetEvent(data)
               );
            });
            
            client.deleteSingle(deleteform.profileName.toString(), "profileName");
         }, function() {
            $mdDialog.hide();

         });
  
        $state.go('settings.AllRecurring_Invoices')
      }

      $scope.EditRecurringInvoice = function(InvoItem){
        recurringInvoiceService.removeArray1(InvoItem, 1);
        recurringInvoiceService.setArray1(InvoItem);
        //location.href = '#/editInvoiceDetails/'+InvoItem.invoiceNo;
        //$state.go('#/editInvoiceDetails/',{'invoiceno':InvoItem.invoiceNo});
        $state.go('ediTRec', {'profilename': InvoItem.profileName})
      }

      $scope.copyRecurringInvoice = function(InvoItem){
          recurringInvoiceService.removeArray1(InvoItem, 1);
         recurringInvoiceService.setArray1(InvoItem);
        $state.go('CopyRec')
      }

      $scope.calAMount = function(data) {
         $scope.Amount = 0;
         $scope.Amount = (((data.price * data.quantity) - ((data.price * data.quantity) * data.discount / 100)) + ((data.price * data.quantity)) * data.tax / 100);
         return $scope.Amount;
      }
      $scope.calculatetotal = function(data) {
         $scope.total = 0;
         angular.forEach(data.recurringProducts, function(tdIinvoice) {
            $scope.total += (tdIinvoice.price * tdIinvoice.quantity);
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
         $scope.otherTax = ($scope.total * data.anotherTax / 100);
         return $scope.otherTax;
      }
      $scope.finalamount = function(data) {
        $rootScope.famount = 0;
         $rootScope.famount = parseInt($scope.total - $scope.finalDisc)+
          parseInt($scope.salesTax)+parseInt($scope.otherTax)+parseInt(data.shipping);
         return $rootScope.famount;
      };
      $scope.addProfile = function() {
            location.href = '#/NewRecurring_profile';
      }


      $scope.cancelProfile = function(obj){
         var client = $objectstore.getClient("RecurringProfile");
         obj.profileName = obj.profileName.toString();
         // if(obj.status != "Draft"){
         client.onComplete(function(data) {
            obj.status = "Cancelled"
         });
         client.onError(function(data) {
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .content('Error Occure while Adding cancelling Invoice')
               .ariaLabel('')
               .ok('OK')
               .targetEvent(data)
            );
         });
        client.insert(obj, {
            KeyProperty: "profileName"
         });
      }

       $scope.OpenProfile = function(InvoItem){
        $rootScope.invoiceArray.splice(InvoItem, 1);
        recurringInvoiceService.setArray1(InvoItem);
        //location.href = '#/viewInvoice';
        $state.go('viewProfile', {'profileName': InvoItem.profileName});
      }
      $scope.viewProfile = function(){
         $state.go('settings.AllRecurring_Invoices');
         
      }
      $scope.DemoCtrl1 = function($timeout, $q) {
         var self = this;
         self.readonly = false;
         self.invoice.roFruitNames = $scope.invoices.roFruitNames;
         self.newVeg = function(chip) {
            return {
               name: chip,
               type: 'unknown'
            };
         };
      }

      var client = $objectstore.getClient("RecurringProfile");
      client.onGetMany(function(data) {
         if (data) {
           for (var i = data.length - 1; i >= 0; i--) {
               data[i].invoiceNo = parseInt(data[i].invoiceNo);
               $scope.TDinvoice.push(data[i]);

               if($stateParams.profileName == data[i].profileName){
                recurringInvoiceService.removeArray1(data[i], 1);
                  recurringInvoiceService.setArray1(data[i]);
               }
            };
         }
      });
      client.onError(function(data) {
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
      $scope.getSelected = function(inv) {
         $scope.obtable = inv.table;
      }

      $scope.invoiceDetails = [];

      var client = $objectstore.getClient("twelfthdoorInvoice");
      client.onGetMany(function(data) {
         if (data) {
           // $scope.TDinvoice = data;
            for (var i = data.length - 1; i >= 0; i--) {
               //data[i].invoiceNo = parseInt(data[i].invoiceNo);
               $scope.invoiceDetails.push(data[i]);

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
     
   }) //END OF viewCtrl
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
 .factory('recurringInvoiceService', function($rootScope) {
      $rootScope.prodArray = {
         val: []
      };
      $rootScope.invoiceArray = [];
      return {
         setArray: function(newVal) {
            $rootScope.prodArray.val.push(newVal);
            return $rootScope.prodArray;
         },
         removeArray: function(newVals) {
            $rootScope.prodArray.val.splice(newVals, 1);
            return $rootScope.prodArray;
         },
         setArray1: function(newVal) {
            $rootScope.invoiceArray.push(newVal);
            return $rootScope.prodArray;
         },
         removeArray1: function(newVals) {
            $rootScope.invoiceArray.splice(newVals, 1);
            return $rootScope.prodArray;
         }

      }
   })