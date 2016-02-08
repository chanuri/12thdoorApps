angular.module('mainApp')
.controller('viewCtrl', function($scope, $mdDialog, $objectstore, $stateParams, $window, $rootScope, InvoiceService ,EstimateDetails, $filter, $state, $location, UploaderService) {

    $scope.TDEstimate = [];
    $scope.newItems = [];
    $scope.show = false;
    $scope.showTable = false;
    $scope.obtable = [];

     $scope.sendMail = function(item) {
   $mdDialog.show({
               templateUrl: 'estimatePartial/email.html',
               controller: 'emailCtrl',
               locals: {
                 invo: item
               }
            });
  };

  $scope.printDetails = function(){
        window.print();
      }

      $scope.systemMessage = [];

$scope.cancelStatus = function(obj, ev) {
  var confirm = $mdDialog.confirm()
          .title('Do you wish to cancel this Estimate'+ obj.estimateNo+'? This process is not reversible')
          .content('')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('No');
            $mdDialog.show(confirm).then(function() {
         var client = $objectstore.getClient("Estimate12thdoor");
         obj.estimateNo = obj.estimateNo.toString();
         // if(obj.status != "Draft"){
          $scope.systemMessage.push({text:"The Estimate was Cancelled by mr.Perera", done:false,  date:new Date()});
          for (var i = $scope.systemMessage.length - 1; i >= 0; i--) {
           obj.commentsAndHistory.push($scope.systemMessage[i]);
          };
           
          obj.status = "Cancelled";
         client.onComplete(function(data) {
             $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('')
               .content('Estimate Successfully Cancelled')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
         });
         client.onError(function(data) {
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .content('Error Occure while Adding cancelling Estimate')
               .ariaLabel('')
               .ok('OK')
               .targetEvent(data)
            );
         });
        client.insert(obj, {KeyProperty: "estimateNo"});
       // }
      })
}

$scope.RejectedEstimate = function(obj, ev) {
  var confirm = $mdDialog.confirm()
          .title('Do you wish to Reject this Estimate'+ obj.estimateNo+'? This process is not reversible')
          .content('')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('No');
            $mdDialog.show(confirm).then(function() {
         var client = $objectstore.getClient("Estimate12thdoor");
         obj.estimateNo = obj.estimateNo.toString();
         // if(obj.status != "Draft"){
          $scope.systemMessage.push({text:"The Estimate was Rejected by mr.Perera", done:false,  date:new Date()});
          for (var i = $scope.systemMessage.length - 1; i >= 0; i--) {
           obj.commentsAndHistory.push($scope.systemMessage[i]);
          };
           
          obj.status = "Rejected";
         client.onComplete(function(data) {
             $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('')
               .content('Estimate Successfully Rejected')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
         });
         client.onError(function(data) {
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .content('Error Occure while Adding cancelling Estimate')
               .ariaLabel('')
               .ok('OK')
               .targetEvent(data)
            );
         });
        client.insert(obj, {KeyProperty: "estimateNo"});
       // }
      })
}

$scope.AcceptStatus = function(obj, ev) {
  var confirm = $mdDialog.confirm()
          .title('Do you wish to Accepted this Estimate'+ obj.estimateNo+'?')
          .content('')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('No');
            $mdDialog.show(confirm).then(function() {
         var client = $objectstore.getClient("Estimate12thdoor");
         obj.estimateNo = obj.estimateNo.toString();
         // if(obj.status != "Draft"){
          $scope.systemMessage.push({text:"The Estimate was Accepted by mr.Perera", done:false,  date:new Date()});
          for (var i = $scope.systemMessage.length - 1; i >= 0; i--) {
           obj.commentsAndHistory.push($scope.systemMessage[i]);
          };
           
          obj.status = "Accepted";
         client.onComplete(function(data) {
             $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .title('')
               .content('Estimate Successfully Accepted')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')
               .targetEvent(data)
            );
         });
         client.onError(function(data) {
            $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.body))
               .content('Error Occure while Adding cancelling Estimate')
               .ariaLabel('')
               .ok('OK')
               .targetEvent(data)
            );
         });
        client.insert(obj, {KeyProperty: "estimateNo"});
       // }
      })
}

$scope.todos = [];
  $scope.markAll = false;
$scope.addTodo = function(todoText) {
      if(event.keyCode == 13 ){
          $scope.todos.push({text:todoText.addView, done:false,  date:new Date()});
          
         var client = $objectstore.getClient("Estimate12thdoor");
         todoText.estimateNo = todoText.estimateNo.toString();

             for (var i =  $scope.todos.length - 1; i >= 0; i--) {
           todoText.commentsAndHistory.push($scope.todos[i]);
         };
         client.onComplete(function(data) {

            todoText.addView = "";
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
               .content('Error Occure while Adding comments')
               .ariaLabel('')
               .ok('OK')
               .targetEvent(data)
            );
         });
        client.insert(todoText, {KeyProperty: "estimateNo"});
      }
  };
  
      var client = $objectstore.getClient("Estimate12thdoorDraft");
    client.onGetMany(function(data) {
      if (data) {
        // $scope.TDEstimate = data;
        for (var i = data.length - 1; i >= 0; i--) {
              data[i].addView = "";
               data[i].estimateNo = parseInt(data[i].estimateNo);
               $scope.TDEstimate.push(data[i]);

               if($stateParams.estimateNo == data[i].estimateNo){
                  EstimateDetails.removeArray(data[i], 1);
                   EstimateDetails.setArray(data[i]);

                   console.log(data[i])
               $scope.Address = data[i].billingAddress.split(',');
               $scope.street = $scope.Address[0];
               $scope.city = $scope.Address[1]+$scope.Address[3];
               $scope.country = $scope.Address[2]+$scope.Address[4];

               $scope.shippingAddress = data[i].shippingAddress.split(',');
               $scope.ShippingStreet  = $scope.shippingAddress[0];
               $scope.ShippingCity    = $scope.shippingAddress[1]+$scope.shippingAddress[3];
               $scope.ShippingCountry = $scope.shippingAddress[2]+$scope.shippingAddress[4];
               }
             }
      }
    });

    client.onError(function(data) {
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.body))
        .title('')
        .content('There was an error retreving the data.')
        .ariaLabel('Alert Dialog Demo')
        .ok('OK')
        .targetEvent(data)
      );
    });
    client.getByFiltering("*");


      var client = $objectstore.getClient("Estimate12thdoor");
    client.onGetMany(function(data) {
      if (data) {
        // $scope.TDEstimate = data;
        for (var i = data.length - 1; i >= 0; i--) {
              data[i].addView = "";
               data[i].estimateNo = parseInt(data[i].estimateNo);
               $scope.TDEstimate.push(data[i]);

               if($stateParams.estimateNo == data[i].estimateNo){
                  EstimateDetails.removeArray(data[i], 1);
                   EstimateDetails.setArray(data[i]);

               $scope.Address = data[i].billingAddress.split(',');
               $scope.street = $scope.Address[0];
               $scope.city = $scope.Address[1]+$scope.Address[3];
               $scope.country = $scope.Address[2]+$scope.Address[4];

               $scope.shippingAddress = data[i].shippingAddress.split(',');
               $scope.ShippingStreet  = $scope.shippingAddress[0];
               $scope.ShippingCity    = $scope.shippingAddress[1]+$scope.shippingAddress[3];
               $scope.ShippingCountry = $scope.shippingAddress[2]+$scope.shippingAddress[4];
               }
             }
      }
    });

    client.onError(function(data) {
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.body))
        .title('')
        .content('There was an error retreving the data.')
        .ariaLabel('Alert Dialog Demo')
        .ok('OK')
        .targetEvent(data)
      );
    });
    client.getByFiltering("*");

    
    $scope.openOtherView = function(prn){
       EstimateDetails.removeArray(0, 1);
        EstimateDetails.setArray(prn);
        $state.go('viewEst', {'estimateNo': prn.estimateRefNo});
    }

    $scope.editestimate = function(est){
      EstimateDetails.removeArray(est, 1);
      EstimateDetails.setArray(est);
       $state.go('editEst', {'estimateNo': est.estimateRefNo});
       console.log(est);
       console.log($rootScope.EstimateArray);
    } 

   
    $scope.copyEstimate = function(InvoItem){
        EstimateDetails.removeArray(InvoItem, 1);
         $scope.InvoiceDetails = [];
       var client = $objectstore.getClient("domainClassAttributes");
              client.onGetMany(function(data) {
                 if (data) {
                  $scope.EstimateDetails = data;

                for (var i = $scope.EstimateDetails.length - 1; i >= 0; i--) {
                  $scope.ID = $scope.EstimateDetails[i].maxCount;            
            };
            $scope.maxID = parseInt($scope.ID)+1;
            InvoItem.estimateRefNo = $scope.maxID.toString();
                 }
              });
              client.getByFiltering("select maxCount from domainClassAttributes where class='Estimate12thdoor'");

      
        EstimateDetails.setArray(InvoItem);
        location.href = '#/copyEstimateDetails';
      }
    
    $scope.deleteRecord = function(deleteform, ev) {
      var confirm = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title('')
        .content('Are You Sure You Want To Delete This Record?')
        .ok('Delete')
        .cancel('Cancel')
        .targetEvent(ev);

      $mdDialog.show(confirm).then(function() {
        var client = $objectstore.getClient("Estimate12thdoor");

        client.onComplete(function(data) {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .content('Record Successfully Deleted')
            .ariaLabel('')
            .ok('OK')
            .targetEvent(data)
          );

          $state.go($state.current, {}, {reload: true});
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

        client.deleteSingle(deleteform.estimateNo.toString(), "estimateNo");
      }, function() {

        $mdDialog.hide();

      });
    }

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
        location.href = '#/estimate';
    }

    $scope.viewSavedProducts = function(obj) {
      console.log('hit');
      $mdDialog.show({
        templateUrl: 'estimatePartial/editproduct.html',
        controller: 'testCtrl',
        locals: {
          item: obj
        }
      });
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
      //console.log($scope.total);
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

  })

//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------
 //--------------------------------------------------------------------------------------------------------------
   //--------------------------------------------------------------------------------------------------------------
  .controller('emailCtrl', function($scope,$mdDialog, $rootScope, invo, $mdToast, $document) {
    $scope.test = invo;
    //console.log($scope.test)
      $scope.subject = "invoice No."+ $scope.test.invoiceNo + " " +$scope.test.Name;

  $scope.cancel = function() {
         $mdDialog.cancel();
      };

       $scope.recipientCtrl = function($timeout, $q) {
         var self = this;
         $scope.Emailerror=false;
         self.readonly = false;
         // self.emailrecipient = [$scope.test.Email];
         // $scope.emailrec = angular.copy(self.emailrecipient);
         $scope.emailrec = [$scope.test.Email];
         self.tags = [];
         self.newVeg = function(chip) {
            return {
               name: chip,
               type: 'unknown'
            };
         };
       }

        $scope.$watchCollection("emailrec", function() {
         var re = /\S+@\S+\.\S+/;
         $scope.Emailerror=false;
         for (var i = $scope.emailrec.length - 1; i >= 0; i--) {

          if(re.test($scope.emailrec[i]) == false){
            $scope.show = $scope.emailrec[i];
            $scope.Emailerror=true; 
            $scope.emailrec.splice(i, 1);        
            
            $scope.showActionToast();
          }    
         };  
     });

      var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

  $scope.toastPosition = angular.extend({},last);
  $scope.getToastPosition = function() {
    sanitizePosition();
    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };
  
  function sanitizePosition() {
    var current = $scope.toastPosition;
    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;
    last = angular.extend({},current);
  }

        $scope.showActionToast = function() {
            $mdToast.show({
          controller: 'ToastCtrl',
          template: 'invalid',
          parent : $document[0].querySelector('#toastBounds'),
          hideDelay: 6000,
          position: $scope.getToastPosition()
        });
      };
      
       $scope.bccCtrl = function($timeout, $q) {
         var self = this;
         self.readonly = false;
         self.emailBCCrecipient = [$scope.test.adminEmail];
         self.emailBCCrec = angular.copy(self.emailBCCrecipient);
         self.tags = [];
         self.newVeg = function(chip) {
            return {
               name: chip,
               type: 'unknown'
            };
         };
      }

  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
})