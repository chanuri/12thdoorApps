angular
  .module('mainApp', ['ngMaterial', 'directivelibrary', 'uiMicrokernel', 'ui.router', 'ui.sortable'])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');
})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/AllcreditNotes');
  $stateProvider

    .state('creditNote', {
    url: '/creditNoteApp',
    templateUrl: 'creditNotePartial/NewCreditNote.html',
    controller: 'AppCtrl'
  })

  .state('app', {
    url: '/AllcreditNotes',
    templateUrl: 'creditNotePartial/AllCreditNotes.html',
    controller: 'viewCtrl'
  })

})

.controller('AppCtrl', function($scope, $objectstore, $uploader, $mdDialog, $window, $objectstore, $auth, $timeout, $q, $http, $mdToast, $rootScope, creditNoteService, $filter, $location, UploaderService, MultipleDudtesService) {

    $scope.list = [];
    $scope.TDCreditNote = {};
    $scope.total = 0;
    $scope.product = {};
    $scope.TDCreditNote.creditNoteNo = 'N/A'
    $scope.Showdate = false;
    $scope.TDCreditNote.date = $filter("date")(Date.now(), 'yyyy-MM-dd');
    $scope.showEditCustomer = false;
    $scope.dueDtaesShow = false;
    $scope.Billingaddress = true;
    $scope.Shippingaddress = false;

    //checks whether the use has selected a name or not. if the name is selecter the it enebles the user to edit the customer details
    $scope.selectedItemChange = function(c) {
      $scope.showEditCustomer = true;
    };

    $scope.sortableOptions = {
      containment: '#sortable-container'
    };

    $scope.changeAddress = function() {
      $scope.Billingaddress = !$scope.Billingaddress;
      $scope.Shippingaddress = !$scope.Shippingaddress;
    }

    //Autocomplete to get client details
      $rootScope.self = this;
      $rootScope.self.tenants = loadAll();
      $rootScope.selectedItem1 = null;      
      $rootScope.self.querySearch = querySearch; 
      $rootScope.searchText = null;

      $scope.enter = function(keyEvent) {
               if (keyEvent.which == 40) {
                  if ($rootScope.selectedItem1 === null) {
                     $rootScope.selectedItem1 = query;
                  } else {}
               }
            }
      function querySearch(query) {
         $scope.enter = function(keyEvent) {
               if (keyEvent.which == 40) {
               }
            }
            //Custom Filter
         $rootScope.results = [];
         for (i = 0, len = $rootScope.customerNames.length; i < len; ++i) {
            if ($rootScope.customerNames[i].display.indexOf(query) != -1) {
               $rootScope.results.push($rootScope.customerNames[i]);
            }
         }
         return $rootScope.results;
      }
      function loadAll() {
         var client = $objectstore.getClient("contact");
         client.onGetMany(function(data) {
            if (data) {
                $rootScope.customerNames = [];
               for (i = 0, len = data.length; i < len; ++i) {
                  $rootScope.customerNames.push({
                     display: data[i].Name.toLowerCase(),
                     value: data[i],
                     BillingAddress: data[i].baddress.street + ', ' + data[i].baddress.city + ', ' + data[i].baddress.zip + ', ' + data[i].baddress.state + ', ' + data[i].baddress.country,
                     ShippingAddress: data[i].saddress.s_street + ', ' + data[i].saddress.s_city + ', ' + data[i].saddress.s_zip + ', ' + data[i].saddress.s_state + ', ' +
                        data[i].saddress.s_country
                  });
               }
            }
         });
         client.onError(function(data) {});
         client.getByFiltering("*");
      }
    //dialog box pop up to add product
    $scope.addproduct = function(ev) {
      $mdDialog.show({

        templateUrl: 'creditNotePartial/addproduct.html',
        targetEvent: ev,
        controller: function addProductController($scope, $mdDialog) {
          //add product to the invoice
          $scope.addproductToarray = function() {
              creditNoteService.setArray({

                Productname: $rootScope.selectedProduct.valuep.Productname,
                price: $rootScope.selectedProduct.valuep.costprice,
                quantity: $scope.tdIinvoice.qty,
                ProductUnit: $rootScope.selectedProduct.valuep.ProductUnit,
                discount: $scope.tdIinvoice.MaxDiscount,
                tax: $rootScope.selectedProduct.valuep.producttax,
                olp: $scope.tdIinvoice.olp,
                amount: $scope.Amount
              });
              console.log($rootScope.testArray);
              $mdDialog.hide();
            }
            //close dialog box
          $scope.cancel = function() {
            $mdDialog.cancel();
          }

          //Uses auto complete to get the product details 
          $rootScope.proload = loadpro();
          $rootScope.selectedProduct = null;
          $rootScope.searchTextt = null;
          $rootScope.querySearchh = querySearchh;

          function querySearchh(query) {
            $scope.enter = function(keyEvent) {
              if (keyEvent.which === 13) {
                if ($rootScope.selectedProduct === null) {
                  $rootScope.selectedProduct = query;
                  console.log($rootScope.results);
                } else {
                  console.log($rootScope.selectedProduct);
                }
              }
            }
            $rootScope.results = [];
            for (i = 0, len = $rootScope.proName.length; i < len; ++i) {
              if ($rootScope.proName[i].dis.indexOf(query) != -1) {
                $rootScope.results.push($rootScope.proName[i]);
              }
            }
            return $rootScope.results;
          }
          $rootScope.proName = [];

          function loadpro() {
            var client = $objectstore.getClient("12thproduct");
            client.onGetMany(function(data) {
              if (data) {
                // $scope.contact =data;
                for (i = 0, len = data.length; i < len; ++i) {
                  $rootScope.proName.push({
                    dis: data[i].Productname.toLowerCase(),
                    valuep: data[i]
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

          //calculate the invoice amount for each product
          $scope.calAMount = function() {
            $scope.Amount = 0;
            $scope.Amount = ((($rootScope.selectedProduct.valuep.costprice * $scope.tdIinvoice.qty) - (($rootScope.selectedProduct.valuep.costprice * $scope.tdIinvoice.qty) * $scope.tdIinvoice.MaxDiscount / 100)) + (($rootScope.selectedProduct.valuep.costprice * $scope.tdIinvoice.qty)) * $rootScope.selectedProduct.valuep.producttax / 100);

            return $scope.Amount;
          }
        }
      })
    }

    //Delete added products
    $scope.deleteproduct = function(name) {
      creditNoteService.removeArray(name);
    }

    //dialog box pop up to add customer through invoice
    $scope.addCustomer = function() {
        $mdDialog.show({

          templateUrl: 'creditNotePartial/addCustomer.html',
             controller: function DialogController($scope, $mdDialog) {
                  $scope.addTask = "";
                  $scope.email = "";
                  $scope.contact={};
                  $scope.baddress = {};
                  $scope.saddress = {};
                  $scope.showShipping = $scope.showShipping;
                  $scope.showBilling = !$scope.showBilling;

                  $scope.closeDialog = function() {
                     $mdDialog.hide();
                  }
                  $scope.addressChange = function() {
                     $scope.showShipping = !$scope.showShipping;
                     $scope.showBilling = !$scope.showBilling;
                  }
                 $scope.AddCus = function() {
              var client = $objectstore.getClient("contact");
                       client.onComplete(function(data) {
                        $mdDialog.show(
                          $mdDialog.alert()
                          .parent(angular.element(document.body))
                          .content('Customer Registed Successfully Saved.')
                          .ariaLabel('Alert Dialog Demo')
                          .ok('OK')
                          .targetEvent(data)
                         );
                        });
                        client.onError(function(data) {
                         $mdDialog.show(
                          $mdDialog.alert()
                          .parent(angular.element(document.body))
                          .content('There was an error saving the data.')
                          .ariaLabel('Alert Dialog Demo')
                          .ok('OK')
                          .targetEvent(data)
                         );
                        });

                           $scope.contact.favoritestar = false;
                           $scope.contact.customerid = "-999";
                           client.insert($scope.contact, {
                            KeyProperty: "customerid"
                     });

                           $rootScope.customerNames.push({
                              display: $scope.contact.Name.toLowerCase(),
                              value: $scope.contact,
                              BillingAddress: $scope.contact.baddress.street + ', ' + $scope.contact.baddress.city + ', ' + $scope.contact.baddress.zip + ', ' + $scope.contact.baddress.state + ', ' + $scope.contact.baddress.country,
                              ShippingAddress: $scope.contact.saddress.s_street + ', ' + $scope.contact.saddress.s_city + ', ' + $scope.contact.saddress.s_zip + ', ' + $scope.contact.saddress.s_state + ', ' +
                              $scope.contact.saddress.s_country
                           });
                           
                              var self = this;
                             for (var i = $rootScope.customerNames.length - 1; i >= 0; i--) {
                               if ($rootScope.customerNames[i].display == $scope.contact.Name ) {
                                 $rootScope.selectedItem1 = $rootScope.customerNames[i];
                               }; 
                             };
                     $mdDialog.hide();
                  }
               }
            })
         }
    $scope.editContact = function() {
      $mdDialog.show({
        templateUrl: 'creditNotePartial/editCustomer.html',
        controller: function DialogController($scope, $mdDialog) {

          $scope.addTask = "";
          $scope.email = "";
          $scope.baddress = {};
          $scope.saddress = {};
          $scope.showShipping = $scope.showShipping;
          $scope.showBilling = !$scope.showBilling;

          $scope.addressChange = function() {
            $scope.showShipping = !$scope.showShipping;
            $scope.showBilling = !$scope.showBilling;
          }
          $scope.closeDialog = function() {
            $mdDialog.hide();
          }

          $scope.editCus = function(cusform) {
            var client = $objectstore.getClient("contact");

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
            client.insert(cusform, {
              KeyProperty: "customerid"
            });
          }
        }
      })
    }

    //save invoice details
    $scope.submit = function() {
      $scope.imagearray = UploaderService.loadArray();
      console.log($scope.imagearray);
      if ($scope.imagearray.length > 0) {

        for (indexx = 0; indexx < $scope.imagearray.length; indexx++) {
          console.log($scope.imagearray[indexx].name);


          $uploader.upload("45.55.83.253", "creditNoteUploades", $scope.imagearray[indexx]);
          $uploader.onSuccess(function(e, data) {

            var toast = $mdToast.simple()
              .content('Successfully uploaded!')
              .action('OK')
              .highlightAction(false)
              .position("bottom right");
            $mdToast.show(toast).then(function() {
              //whatever
            });
          });

          $uploader.onError(function(e, data) {

            var toast = $mdToast.simple()
              .content('There was an error, please upload!')
              .action('OK')
              .highlightAction(false)
              .position("bottom right");
            $mdToast.show(toast).then(function() {});
          });

        }
      };
      var client = $objectstore.getClient("twethdoorCreditNote");

      $scope.TDCreditNote.table = $rootScope.testArray.val;
      $scope.TDCreditNote.total = $scope.total;
      $scope.TDCreditNote.finalamount = $scope.famount;
      $scope.TDCreditNote.status = "N";
      $scope.TDCreditNote.Name = $rootScope.selctedName.display;
      $scope.TDCreditNote.billingAddress = $rootScope.selctedName.BillingAddress;
      $scope.TDCreditNote.shippingAddress = $rootScope.selctedName.ShippingAddress;
      // $scope.TDCreditNote.MultiDueDAtesArr = $scope.dateArray.value;
      $scope.TDCreditNote.UploadImages = {
        val: []
      };
      $scope.TDCreditNote.UploadImages.val = UploaderService.loadBasicArray();

      client.onComplete(function(data) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('')
          .content('credit Note Successfully Saved')
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
          .content('Error saving credit Note ')
          .ariaLabel('Alert Dialog Demo')
          .ok('OK')
          .targetEvent(data)
        );

      });
      $scope.TDCreditNote.creditNoteNo = "-999";
      client.insert([$scope.TDCreditNote], {
        KeyProperty: "creditNoteNo"
      });
    }

    //pops a dialog box to edit or view product
    $scope.viewProduct = function(obj) {
      $mdDialog.show({
        templateUrl: 'creditNotePartial/editproduct.html',
        controller: 'testCtrl',
        locals: {
          item: obj
        }
      });
    }

    //pops a dialog box which enble the user to upload the files
    $scope.upload = function(ev) {
      $mdDialog.show({
        templateUrl: 'creditNotePartial/showUploader.html',
        targetEvent: ev,
        controller: 'UploadCtrl',
        locals: {
          dating: ev
        }
      })
    }

    //pops a dialog box which enble the user to change currency
    $scope.acceptAccount = function(ev, user) {
      $mdDialog.show({
        templateUrl: 'creditNotePartial/changeCurrency.html',
        targetEvent: ev,
        controller: 'AppCtrl'
      })
    }

    $scope.cancel = function() {
      $mdDialog.cancel();
    }

    $scope.calculatetotal = function() {
      $scope.total = 0;
      angular.forEach($rootScope.testArray.val, function(TdiCreditNote) {

        $scope.total += (((TdiCreditNote.price * TdiCreditNote.quantity) - ((TdiCreditNote.price * TdiCreditNote.quantity) * TdiCreditNote.discount / 100)) + ((TdiCreditNote.price * TdiCreditNote.quantity)) * TdiCreditNote.tax / 100);
      })

      return $scope.total;
      console.log($scope.total);
    };

    $scope.finaldiscount = function() {
      $scope.finalDisc = 0;
      $scope.finalDisc = $scope.total - ($scope.total * $scope.TDCreditNote.fdiscount / 100);
      return $scope.finalDisc;
    }

    $scope.CalculateTax = function() {
      $scope.salesTax = 0;
      $scope.salesTax = $scope.finalDisc + ($scope.total * $scope.TDCreditNote.salesTax / 100);
      return $scope.salesTax;
    }

    $scope.CalculateOtherTax = function() {
      $scope.otherTax = 0;
      $scope.otherTax = $scope.salesTax + ($scope.total * $scope.TDCreditNote.anotherTax / 100);
      return $scope.otherTax;
    }

    $scope.finalamount = function() {
      $scope.famount = 0;
      $scope.famount = parseInt($scope.otherTax) + parseInt($scope.TDCreditNote.shipping);
      return $scope.famount;
    };

    $scope.view = function() {
        location.href = '#/AllcreditNotes';
    }

     $scope.DemoCtrl = function($timeout, $q) {
      var self = this;
      self.readonly = false;
      // Lists of tags names and Vegetable objects
      self.fruitNames = [];
      self.TDCreditNote.roFruitNames = angular.copy(self.fruitNames);
      self.tags = [];

      self.newVeg = function(chip) {
        return {
          name: chip,
          type: 'unknown'
        };
      };
    }
  })
  //-------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------


  //-------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------
  .controller('testCtrl', function($scope, $mdDialog, $rootScope, creditNoteService, item) {

    $scope.test = item;

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.edit = function() {
      $mdDialog.cancel();
    };

    $scope.calAMount = function() {
      $scope.Amount = 0;
      $scope.Amount = (((item.price * item.quantity) - ((item.price * item.quantity) * item.discount / 100)) + ((item.price * item.quantity)) * item.tax / 100);

      return $scope.Amount;
    }

  })

//-------------------------------------------------------------------------------------------------------  
//------------------------------------------------------------------------------------------------------
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

.factory('creditNoteService', function($rootScope) {
    $rootScope.testArray = {
      val: []
    };

    return {

      setArray: function(newVal) {
        $rootScope.testArray.val.push(newVal);

        return $rootScope.testArray;
      },
      removeArray: function(newVals) {

        $rootScope.testArray.val.splice(newVals, 1);
        return $rootScope.testArray;
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
  .factory('MultipleDudtesService', function($rootScope) {
    $rootScope.dateArray = {
      value: []
    };
    return {

      setDateArray: function(newVal) {
        $rootScope.dateArray.value.push(newVal);

        return $rootScope.dateArray;
      },
      removeDateArray: function(newVals) {

        $rootScope.dateArray.value.splice(newVals, 1);
        return $rootScope.dateArray;
      }

    }
  })
  //-----------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------

.directive('fileUpLoaderInvoice', ['$uploader', "$rootScope", "$mdToast", 'UploaderService', function($uploader, $rootScope, $mdToast, UploaderService) {
  return {
    restrict: 'E',
    template: "<div class='content' ng-init='showUploadButton=false;showDeleteButton=false;showUploadTable=false;'><div id='drop-files' ondragover='return false' layout='column' layout-align='space-around center'><div id='uploaded-holder' flex ><div id='dropped-files' ng-show='showUploadTable'><table id='Tabulate' ></table></div></div><div flex ><md-button class='md-raised' id='deletebtn' ng-show='showDeleteButton' class='md-raised' style='color:rgb(244,67,54);margin-left:30px;'><md-icon md-svg-src='img/directive_library/ic_delete_24px.svg'></md-icon></md-button></div><div flex><md-icon md-svg-src='img/directive_library/ic_cloud_upload_24px.svg'></md-icon><text style='font-size:12px;margin-left:10px'>{{label}}<text></div></div></div>",
    scope: {
      label: '@',
      uploadType: '@'
    },
    link: function(scope, element) {

        // Makes sure the dataTransfer information is sent when we
        // Drop the item in the drop box.
        jQuery.event.props.push('dataTransfer');


        // file/s on a single drag and drop
        var files;

        // total of all the files dragged and dropped
        var filesArray = [];
        var sampleArray = [];

        // Bind the drop event to the dropzone.
        element.find("#drop-files").bind('drop', function(e) {

          // Stop the default action, which is to redirect the page
          // To the dropped file
          files = e.dataTransfer.files || e.dataTransfer.files;

          for (indexx = 0; indexx < files.length; indexx++) {

            filesArray.push(files[indexx]);
            UploaderService.setFile(files[indexx]);
            UploaderService.BasicArray(filesArray[indexx].name, filesArray[indexx].size);
            sampleArray.push({
              'name': filesArray[indexx].name,
              'size': filesArray[indexx].size
            });
            console.log(filesArray);
          }


          var newHtml = "<tr class='md-table-headers-row'><th class='md-table-header' style='Padding:0px 16px 10px 0'>Name</th><th class='md-table-header' style='Padding:0px 16px 10px 0'>Type</th><th class='md-table-header' style='Padding:0px 16px 10px 0'>Size</th></tr>";

          for (var i = 0; i < filesArray.length; i++) {
            var tableRow = "<tr><td class='upload-table' style='float:left'>" + filesArray[i].name + "</td><td class='upload-table'>" +
              filesArray[i].type + "</td><td class='upload-table'>" +
              filesArray[i].size + " bytes" + "</td></tr>";
            newHtml += tableRow;
          }

          element.find("#Tabulate").html(newHtml);

          $rootScope.$apply(function() {
            scope.showUploadButton = true;
            scope.showDeleteButton = true;
            scope.showUploadTable = true;
          })

        });

        function restartFiles() {

          // We need to remove all the images and li elements as
          // appropriate. We'll also make the upload button disappear
          $rootScope.$apply(function() {
            scope.showUploadButton = false;
            scope.showDeleteButton = false;
            scope.showUploadTable = false;
          })
          UploaderService.removefileArray(filesArray);
          UploaderService.removebasicArray(sampleArray);
          // And finally, empty the array
          filesArray = [];

          return false;
        }

        // Just some styling for the drop file container.
        element.find('#drop-files').bind('dragenter', function() {
          $(this).css({
            'box-shadow': 'inset 0px 0px 20px rgba(0, 0, 0, 0.1)',
            'border': '2px dashed rgb(255,64,129)'
          });
          return false;
        });

        element.find('#drop-files').bind('drop', function() {
          $(this).css({
            'box-shadow': 'none',
            'border': '2px dashed rgba(0,0,0,0.2)'
          });
          return false;
        });
        element.find('#deletebtn').click(restartFiles);

      } //end of link
  };
}])