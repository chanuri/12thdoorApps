angular.module('mainApp')
.controller('viewCtrl', function($scope, $mdDialog, $objectstore, $window, $rootScope, creditNoteService, $filter, $state, $location, UploaderService) {

    $scope.TDCreditNote = {};
    $scope.newItems = [];
    $scope.show = false;
    $scope.showTable = false;
    $scope.obtable = [];

    var client = $objectstore.getClient("twethdoorCreditNote");
    client.onGetMany(function(data) {
      if (data) {
        $scope.TDCreditNote = data;
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

    $scope.edit = function(updatedForm) {
      var client = $objectstore.getClient("twethdoorCreditNote");

      $scope.TDCreditNote.table = $rootScope.testArray.val;
      $scope.TDCreditNote.total = $scope.total;
      $scope.TDCreditNote.finalamount = $scope.famount;
      $scope.TDCreditNote.status = "N";


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
      client.onError(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('Sorry')
          .content('Error Saving invoice')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );
      });
      client.insert(updatedForm, {
        KeyProperty: "creditNoteNo"
      });
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
        var client = $objectstore.getClient("twethdoorCreditNote");

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
            //.title('This is embarracing')
            .content('Error Deleting Record')
            .ariaLabel('')
            .ok('OK')
            .targetEvent(data)
          );
        });

        client.deleteSingle(deleteform.creditNoteNo, "creditNoteNo");
      }, function() {

        $mdDialog.hide();

      });
    }

  })