rasm.controller('viewctrl', function ($scope, $mdToast, $interval,$state, $DownloadPdf,$userDetails, $rootScope, $objectstore, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $timeout) {
  $rootScope.prodSearch = "";
  $scope.self = this;
  $scope.self.searchText = "";

  // call for 12th config js
  $userDetails.GetUserDetails("invoice",function(data){
      console.log(data);
  });



  //progress bar start 
  var loading_spinner = angular.element('#loader');
  var self = this,  j= 0, counter = 0;

  self.modes = [ ];
  self.activated = true;
  self.determinateValue = 30;
  
  $interval(function() {

    if ( (j < 5) && !self.modes[j] && self.activated ) {
      self.modes[j] = 'indeterminate';
    }
    if ( counter++ % 4 == 0 ) j++;

  }, 100, 0, true);

  //progress bar ends 

  $scope.DownloadPDF = function(obj){
    var client = $objectstore.getClient("expenseimagesNew");
    client.onGetOne(function(data){
      console.log(data);
      // if (isEmpty(data)) {
      //   console.log(data)
      //  // $DownloadPdf.GetPdfWithAttachment(obj,data);

      // }else{
      //   data = false;
      //   $DownloadPdf.GetPdfWithAttachment(obj,data);        
      // }
    });
    client.onError(function(data){
      console.log("error Loading image data");
    });
    client.getByKey(obj.expense_code);
    //$DownloadPdf.GetPdf(obj);
  }

  $scope.ChangeState = function (obj) {
    $state.go('ViewScreen', {
      'expenseID': obj.expense_code
    })
  }
  $scope.testarr = [{
    name: "Starred"
    , id: "favouriteStarNo"
    , src: "img/ic_grade_48px.svg"
    , divider: true
  }, {
    name: "Date"
    , id: "date"
    , src: "img/ic_add_shopping_cart_48px.svg"
    , divider: false
  }, {
    name: "Category"
    , id: "Category"
    , src: "img/ic_add_shopping_cart_48px.svg"
    , divider: false
  }, {
    name: "Amount"
    , id: "Amount"
    , src: "img/ic_add_shopping_cart_48px.svg"
    , divider: false
  }, {
    name: "Expense No"
    , id: "expense_code"
    , src: "img/ic_add_shopping_cart_48px.svg"
    , divider: true
  }, {
    name: "Non-Billable"
    , id: "Billable"
    , src: "img/ic_add_shopping_cart_48px.svg"
    , divider: false
  }, {
    name: "Billable"
    , id: "Billable"
    , src: "img/ic_add_shopping_cart_48px.svg"
    , divider: false
  }, {
    name: "Billed"
    , id: "Billable"
    , src: "img/ic_add_shopping_cart_48px.svg"
    , divider: false
  }, {
    name: "Paid"
    , id: "Status"
    , src: "img/ic_add_shopping_cart_48px.svg"
    , divider: false
  }, {
    name: "Unpaid"
    , id: "Status"
    , src: "img/ic_add_shopping_cart_48px.svg"
    , divider: false
  }, {
    name: "Cancelled"
    , id: "Status"
    , src: "img/ic_add_shopping_cart_48px.svg"
    , divider: false
  }];
  //calander function start
  $scope.caldisfun = function (obj) {
      if (obj.Status == "Paid") {
        $scope.Duedate = undefined;
      }
      // else if (obj.Status == "Unpaid") {
      // };
    }
    //calander function end 
    //fab button functions
  $scope.demo = {
    topDirections: ['left', 'up']
    , bottomDirections: ['down', 'right']
    , isOpen: false
    , availableModes: ['md-fling', 'md-scale']
    , selectedMode: 'md-fling'
    , availableDirections: ['up', 'down', 'left', 'right']
    , selectedDirection: 'up'
  };
  $scope.addexpense = function () {
      location.href = '#/Add_Expenses';
    }
    //end of fab button functions	
  $scope.expenses = [];
  //load all expenses function start
    var client = $objectstore.getClient("expense12th");
    client.onGetMany(function (data) {
      if (data) {
        loading_spinner.remove(); // remove the progress bar 
        for (var i = data.length - 1; i >= 0; i--) {
          data[i].Amount = parseInt(data[i].Amount);
          data[i].expense_code = parseInt(data[i].expense_code);
        }

        $scope.expenses = data;      
      }
    });
    client.onError(function (data) {
      $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('This is embarracing').content('There was an error retreving the data.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent(data));
    });
    client.getByFiltering("*");


  $scope.testExpenses = [];
  
  //load all expenses function end
  //table click function start
  $scope.tableclickfunc = function (obj) {
      if ($scope.tableclickArr != null) {
        for (i = 0; i < obj.UploadImages.val.length; i++) {
          if (obj.UploadImages.val[i].name === $scope.tableclickArr.name) obj.UploadImages.val.splice(i, 1);
        }
      }
      $scope.tableclickArr = null;
    }
    //table click function end 
  $scope.tableclickArr = {};
  $scope.$on('viewRecord', function (event, args) {
    $scope.tableclickArr = args;
  });
  //directive table content start
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
  //directive table conten end.
  //favourite button function start
  $scope.favouriteFunction = function (obj) {

    obj.expense_code = obj.expense_code.toString();

      var client = $objectstore.getClient("expense12th");
      client.onComplete(function (data) {
        if (obj.favouriteStar) {
          var toast = $mdToast.simple().content('Add To Favourite').action('OK').highlightAction(false).position("bottom right");
          $mdToast.show(toast).then(function () {
            //whatever
          });
        } else if (!(obj.favouriteStar)) {
          var toast = $mdToast.simple().content('Remove from Favourite').action('OK').highlightAction(false).position("bottom right");
          $mdToast.show(toast).then(function () {
            //whatever
          });
        };
      });
      client.onError(function (data) {
        var toast = $mdToast.simple().content('Error Occure while Adding to Favourite').action('OK').highlightAction(false).position("bottom right");
        $mdToast.show(toast).then(function () {
          //whatever
        });
      });
      if (obj.favouriteStarNo == 1) {
        obj.favouriteStarNo = 0;
      } else if (obj.favouriteStarNo == 0) {
        obj.favouriteStarNo = 1;
      };
      obj.favouriteStar = !obj.favouriteStar;
      client.insert(obj, {
        KeyProperty: "expense_code"
      });
    }
    //favourite button function end
    //full amount function start
  $scope.fullamount = function (obj, event) {
      if ((obj.Amount != "" && obj.Amount != null && obj.Tax != "" && obj.Tax != null) || (event.keyCode === 80)) {
        obj.totalUSD = parseInt(obj.Amount) + parseInt(obj.Tax);
      };
    }
    //full amount function end
});


function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}