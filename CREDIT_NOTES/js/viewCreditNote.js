angular.module('mainApp')
.controller('viewCtrl', function($scope, $mdDialog,$state,$stateParams, $objectstore, $window, $rootScope, creditNoteService, $filter, $state, $location, UploaderService) {

    $scope.TDCreditNote = [];
    $scope.newItems = [];
    $scope.show = false;
    $scope.showTable = false;
    $scope.obtable = [];

    var client = $objectstore.getClient("CNote12thdoor");
    client.onGetMany(function(data) {
      if (data) {
        for (var i = data.length - 1; i >= 0; i--) {
              data[i].addView = "";
               data[i].invoiceNo = parseInt(data[i].invoiceNo);
               $scope.TDCreditNote.push(data[i]);

               if($stateParams.Cnno == data[i].creditNoteNo){
                 $rootScope.CNoteArray.splice(data[i],1);
                  creditNoteService.setCNArr(data[i]);
                  $scope.Address = data[i].billingAddress.split(',');
               $scope.street = $scope.Address[0];
               $scope.city = $scope.Address[1]+$scope.Address[3];
               $scope.country = $scope.Address[2]+$scope.Address[4];

               $scope.shippingAddress = data[i].shippingAddress.split(',');
               $scope.ShippingStreet = $scope.shippingAddress[0];
               $scope.ShippingCity = $scope.shippingAddress[1]+$scope.shippingAddress[3];
               $scope.ShippingCountry = $scope.shippingAddress[2]+$scope.shippingAddress[4];
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

     var client = $objectstore.getClient("CNote12thdoorDrafts");
    client.onGetMany(function(data) {
      if (data) {
        // $scope.TDCreditNote = data;
        for (var i = data.length - 1; i >= 0; i--) {
              // loading_spinner.remove();
              data[i].addView = "";
               data[i].invoiceNo = parseInt(data[i].invoiceNo);
               $scope.TDCreditNote.push(data[i]);

               if($stateParams.Cnno == data[i].creditNoteNo){
                 $rootScope.CNoteArray.splice(data[i],1);
                  creditNoteService.setCNArr(data[i]);
                  $scope.Address = data[i].billingAddress.split(',');
               $scope.street = $scope.Address[0];
               $scope.city = $scope.Address[1]+$scope.Address[3];
               $scope.country = $scope.Address[2]+$scope.Address[4];

               $scope.shippingAddress = data[i].shippingAddress.split(',');
               $scope.ShippingStreet = $scope.shippingAddress[0];
               $scope.ShippingCity = $scope.shippingAddress[1]+$scope.shippingAddress[3];
               $scope.ShippingCountry = $scope.shippingAddress[2]+$scope.shippingAddress[4];
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

    $scope.add = function() {
        location.href = '#/creditNoteApp';
    }

    $scope.gotoOpenMode = function(val){
      $rootScope.CNoteArray.splice(0,1);
        creditNoteService.setCNArr(val);
        $state.go('view', {'Cnno': val.creditNoteRefNo});
    }

     $scope.DemoCtrl1 = function($timeout, $q) {
      var self = this;
      self.readonly = false;
      self.TDCreditNote.roFruitNames = $scope.TDCreditNotes.roFruitNames;

      self.newVeg = function(chip) {
        return {
          name: chip,
          type: 'unknown'
        };
      };
    }

 $scope.applyInvoice = function(obj,ev){
    $mdDialog.show({
           templateUrl: 'creditNotePartial/applyInvoice.html',
            targetEvent: ev,
        controller: function applyinvoice($scope, $mdDialog) {
            $scope.invoArr = {val: []};

            $scope.invoArr.val=[{
              date: "",
              invoiceNo: "",
              dueDate: "",
              Amount:"",
              Balace:"",
              CreditAmount:""
            }]

            $scope.addItem = function(){
                $scope.invoArr.val.push({
                date: "",
                invoiceNo: "",
                dueDate: "",
                Amount:"",
                Balace:"",
                CreditAmount:""
              })
            }
          $scope.cancel = function() {
                 $mdDialog.cancel();
              }
           $scope.removeItem = function(index){
             $scope.invoArr.val.splice($scope.invoArr.val.indexOf(index), 1 );
          }
        }
      });
  }

    $scope.viewSavedProducts = function(obj) {
      console.log('hit');
      $mdDialog.show({
        templateUrl: 'creditNotePartial/editproduct.html',
        controller: 'testCtrl',
        locals: {
          item: obj
        }
      });
    }

     $scope.todos = [];
  $scope.markAll = false;

  $scope.addTodo = function(todoText) {
      if(event.keyCode == 13 ){
          $scope.todos.push({text:todoText.addView, done:false,  date:new Date()});

          console.log(todoText.addView)
          
         var client = $objectstore.getClient("CNote12thdoor");
         todoText.invoiceNo = todoText.invoiceNo.toString();

            for (var i =  $scope.todos.length - 1; i >= 0; i--) {
           todoText.commentsAndHistory.push($scope.todos[i]);
         };
            todoText.addView = "";
         client.onComplete(function(data) {
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .content('successfull')
               .ariaLabel('')
               .ok('OK')
               .targetEvent(data)
            );
         });
         client.onError(function(data) {
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .content('Error Occure while Adding the comment')
               .ariaLabel('')
               .ok('OK')
               .targetEvent(data)
            );
         });
        client.insert(todoText, {KeyProperty: "creditNoteNo"});
      }
  };

    $scope.systemMessage = [];
$scope.cancelStatus = function(obj, ev) {
  console.log("hit")
  var confirm = $mdDialog.confirm()
          .title('Do you wish to cancel this Credit Note'+ obj.creditNoteNo+'? This process is not reversible')
          .content('')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('No');
            $mdDialog.show(confirm).then(function() {
         var client = $objectstore.getClient("CNote12thdoor");
         obj.invoiceNo = obj.invoiceNo.toString();
          $scope.systemMessage.push({text:"The Credit Note was Cancelled by mr.Perera", done:false,  date:new Date()});
          for (var i = $scope.systemMessage.length - 1; i >= 0; i--) {
           obj.commentsAndHistory.push($scope.systemMessage[i]);
          };
           
          obj.status = "Cancelled";
         client.onComplete(function(data) {
             $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('')
               .content('Credit Note Successfully Cancelled')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
         });
         client.onError(function(data) {
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .content('Error Occure while cancelling Credit Note')
               .ariaLabel('')
               .ok('OK')
               .targetEvent(data)
            );
         });
        client.insert(obj, {KeyProperty: "creditNoteNo"});
      })
}
    $scope.calAMount = function(data) {
      $scope.Amount = 0;
      $scope.Amount = (((data.price * data.quantity) - ((data.price * data.quantity) * data.discount / 100)) + ((data.price * data.quantity)) * data.tax / 100);

      return $scope.Amount;
      console.log($scope.Amount);
    }

    $scope.calculatetotal = function(data) {
      $scope.total = 0;
      angular.forEach(data.table, function(tdIinvoice) {

        $scope.total += (((tdIinvoice.price * tdIinvoice.quantity) - ((tdIinvoice.price * tdIinvoice.quantity) * tdIinvoice.discount / 100)) + ((tdIinvoice.price * tdIinvoice.quantity)) * tdIinvoice.tax / 100);

      })
      return $scope.total;
      console.log($scope.total);
    };

    $scope.finaldiscount = function(data) {
      $scope.finalDisc = 0;
      $scope.finalDisc = $scope.total - ($scope.total * data.fdiscount / 100);
      return $scope.finalDisc;
    }

    $scope.CalculateTax = function(data) {
      $scope.salesTax = 0;
      $scope.salesTax = $scope.finalDisc + ($scope.total * data.salesTax / 100);
      return $scope.salesTax;
    }

    $scope.CalculateOtherTax = function(data) {
      $scope.otherTax = 0;
      $scope.otherTax = $scope.salesTax + ($scope.total * data.anotherTax / 100);
      return $scope.otherTax;
    }

    $scope.finalamount = function(data) {

      $scope.famount = 0;

      $scope.famount = parseInt($scope.otherTax) + parseInt(data.shipping);

      return $scope.famount;
    };

    $scope.EditCNnote = function(val){
        $rootScope.CNoteArray.splice(0,1);
        creditNoteService.setCNArr(val);
        $state.go('edit', {'Cnno': val.creditNoteRefNo});
    }

    $scope.deleteRecord = function(deleteform, ev) {

      var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('')
            .content('Are You Sure You Want To Delete This Record? This process is not reversible')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(ev);
         $mdDialog.show(confirm).then(function() {
            var client = $objectstore.getClient("CNote12thdoor");
          //   $scope.systemMessage.push({text:"The Invoice was Deleted by mr.Perera", done:false,  date:new Date()});
          // for (var i = $scope.systemMessage.length - 1; i >= 0; i--) {
          //  obj.commentsAndHistory.push($scope.systemMessage[i]);
          // };
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
            
            client.deleteSingle(deleteform.creditNoteNo.toString(), "creditNoteNo");
         }, function() {
            $mdDialog.hide();

         });
    }

  })