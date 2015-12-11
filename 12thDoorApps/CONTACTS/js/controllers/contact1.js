angular.module('mainApp', ['ngMaterial', 'directivelibrary', 'uiMicrokernel', 'ngAnimate', 'ui.router'])

.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/settings/contact');
    $stateProvider
        .state('settings', {
            url: '/settings',
            templateUrl: 'contact_partial/settings.html',
            controller: 'AppCtrlGet'
        })
        .state('settings.contact', {
            url: '/contact',
            templateUrl: 'contact_partial/contact_view.html',
            controller: 'AppCtrlGet'

        })
        .state('settings.supplier', {
            url: '/supplier',
            templateUrl: 'contact_partial/supplier_view.html',
            controller: 'AppCtrlGetSuppliers'
        })
        .state('addcontact', {
            url: '/Add_Contact',
            templateUrl: 'contact_partial/contact_add.html',
            controller: 'AppCtrlAddCustomer'
        })
        .state('addsupplier', {
            url: '/Add_Supplier',
            templateUrl: 'contact_partial/supplier_add.html',
            controller: 'AppCtrlAddSuppliers'
        })
})

.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('datePickerTheme')
        .primaryPalette('teal');
})

/*_________________________START OF AppCtrlAddCustomer___________________________________________________*/

.controller('AppCtrlAddCustomer', function($scope, $state, $objectstore, $location,$mdDialog, $window,$objectstore, $auth, $q,$http, $compile, $timeout, $mdToast) {

        $scope.contact = {};
        $scope.contact["baddress"] = {};
        $scope.contact["saddress"] = {};
        $scope.showShipping = $scope.showShipping;
        $scope.showBilling = !$scope.showBilling;
        $scope.cb=false;
        /*__________________________onChange_______________________________________*/
        $scope.onChange = function(cb) {
                cb==true;
                $scope.contact.saddress["s_street"]=$scope.contact.baddress["street"];
                $scope.contact.saddress["s_city"] = $scope.contact.baddress["city"];
                $scope.contact.saddress["s_country"]=$scope.contact.baddress["country"];
                $scope.contact.saddress["s_zip"]= $scope.contact.baddress["zip"];
                $scope.contact.saddress["s_state"] =$scope.contact.baddress["state"];
                if(cb==false){   
                 $scope.contact.saddress["s_street"]="";
                 $scope.contact.saddress["s_city"] ="";
                 $scope.contact.saddress["s_country"]="";
                 $scope.contact.saddress["s_zip"]="";
                 $scope.contact.saddress["s_state"] ="";
                
                }
        }
       
        /*_________________________submit_____________________________________________*/
        $scope.submit = function() {
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
            })

        }
        /*____________________________addressChange_________________________________________*/
        $scope.addressChange = function() {
            $scope.showShipping = !$scope.showShipping;
            $scope.showBilling = !$scope.showBilling;
        }
        /*_____________________________save_________________________________________________*/
        $scope.save = function() {
            $timeout(function() {
                $('#mySignup')
                    .click();
            })
        }
        /*_________________________addCustomer_______________________________________________*/
        $scope.addCustomer = function() {
            $('#add').animate({
                width: "100%",
                height: "100%",
                borderRadius: "0px",
                right: "0px",
                bottom: "0px",
                opacity: 0.25
            }, 400, function() {
                location.href = '#/Add_Contact';
            });
        }
        /*_______________________Customerview________________________________________________________*/
        $scope.Customerview = function() {
                location.href = '#/home';
            
        }
        /*______________________savebtn_______________________________________________________________*/
        $scope.savebtn = function() {
            $('#save').animate({
                width: "100%",
                height: "100%",
                borderRadius: "0px",
                right: "0px",
                bottom: "0px",
                opacity: 0.25
            }, 400, function() {
                $('#mySignup').click();
            });
        }
    }) /*_______________________________END OF AppCtrlAddCustomer_____________________________________*/

/*______________________________START OF AppCtrlGet _____________________________________________*/
.controller('AppCtrlGet', function($scope, $rootScope, $state, $objectstore, $location, $mdDialog, $window, $objectstore, $auth, $q,$http, $compile, $timeout, $mdToast) {
        $scope.contacts = [];
        $scope.baddress = {};
        $scope.saddress = {};
        $scope.showShipping = $scope.showShipping;
        $scope.showBilling = !$scope.showBilling;
        $scope.checkAbilityBtn = true;
        $scope.checkAbilityEditing = true;
        $scope.prodSearch = "";
        $scope.sortName = "CustomerFname";
        $scope.sortEmail = "Email";
        $scope.sortMobile = "Mobile";
        $scope.sortCity = "city";
        $scope.sortCountry = "country";
        $scope.sortNameAsc = "customerFname";
        $scope.sortNameDes = "-customerFname";
        $scope.contactNameupArrow = false;
        $scope.contactNamedownArrow = false;
        $scope.sortEmailAsc = "Email";
        $scope.sortEmailDes = "-Email";
        $scope.contactEmailupArrow = false;
        $scope.contactEmaildownArrow = false;
        $rootScope.showsort = true;
        $rootScope.showaddProject = true;
        $rootScope.showsort = true;
        /*________________________________________changeTab______________________________________________*/
        $scope.changeTab = function(ind) {
            switch (ind) {
                case 0:
                    $location.url("/settings/contact");

                    $rootScope.showsort = true;
                    break;
                case 1:
                    $location.url("/settings/supplier");

                    $rootScope.showsort = false;
                    $rootScope.showaddProject = false;

                    break;
            }
        };       
       /*______________________________________addSupplier____________________________________*/
        $scope.addSupplier = function() {
            $('#add')
                .animate({
                    width: "100%",
                    height: "100%",
                    borderRadius: "0px",
                    right: "0px",
                    bottom: "0px",
                    opacity: 0.25
                }, 400, function() {
                    location.href = '#/Add_Supplier';
                });
        }
        /*____________________________loadAllcontact_________________________________________________*/
        $scope.loadAllcontact = function() {
        var client = $objectstore.getClient("contact");
        client.onGetMany(function(data) {
            if (data) {
                $scope.contacts = data;
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
        };
        /*__________________________updateCustomer___________________________________________________*/
        $scope.updateCustomer = function(updatedform, cid) {
            var client = $objectstore.getClient("contact");
            client.onComplete(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content('Customer details updated Successfully')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent(data)
                );
            });
            client.onError(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('This is embarracing')
                    .content('There was an error updating the customer details.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent(data)
                );
            });
            updatedform.customerid = cid;
            client.insert(updatedform, {
                KeyProperty: "customerid"
            });
        }
        /*_______________________________deleteCustomer_________________________________________*/
        $scope.deleteCustomer = function(deleteform, ev) {
            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.body))
                .title('')
                .content('Are You Sure You Want To Delete This Record?')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                    var client = $objectstore.getClient("contact");
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
                    client.deleteSingle(deleteform.customerid, "customerid");
                },
                function() {
                    $mdDialog.hide();
                });
        }
        /*__________________________________favouriteFunction________________________________________*/
        $scope.favouriteFunction = function(obj) {
            var client = $objectstore.getClient("contact");
            client.onComplete(function(data) {
                if (obj.favoritestar) {
                    var toast = $mdToast.simple()
                        .content('Add To Favourite')
                        .action('OK')
                        .highlightAction(false)
                        .position("bottom right");
                    $mdToast.show(toast).then(function() {});
                } else if (!(obj.favoritestar)) {
                    var toast = $mdToast.simple()
                        .content('Remove from Favourite')
                        .action('OK')
                        .highlightAction(false)
                        .position("bottom right");
                    $mdToast.show(toast).then(function() {});
                };
            });
            client.onError(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content('Error Occure while Adding to Favourite')
                    .ariaLabel('')
                    .ok('OK')
                    .targetEvent(data)
                );
            });
            obj.favoritestar = !obj.favoritestar;
            client.insert(obj, {
                KeyProperty: "customerid"
            });
        }
        /*_________________________________addressChange_____________________________________________*/
        $scope.addressChange = function() {
            $scope.showShipping = !$scope.showShipping;
            $scope.showBilling = !$scope.showBilling;
        }
        /*_____________________________demo____________________________________________________________*/
        $scope.demo = {
            topDirections: ['left', 'up'],
            bottomDirections: ['down', 'right'],
            isOpen: false,
            availableModes: ['md-fling', 'md-scale'],
            selectedMode: 'md-fling',
            availableDirections: ['up', 'down', 'left', 'right'],
            selectedDirection: 'up'
        };
        /*_____________________________viewpromotion____________________________________________________*/ 
        $scope.viewpromotion = function() {
            $('#view').animate({
                width: "100%",
                height: "100%",
                borderRadius: "0px",
                right: "0px",
                bottom: "0px",
                opacity: 0.25
            }, 400, function() {});
        }
        /*_____________________________addCustomer______________________________________________________*/
        $scope.addCustomer = function() {
            $('#add').animate({
                width: "100%",
                height: "100%",
                borderRadius: "0px",
                right: "0px",
                bottom: "0px",
                opacity: 0.25
            }, 400, function() {
                location.href = '#/Add_Contact';
            });
        }

    })/*___________________________________End of ApCtrlGet____________________________________________*/
/*________________________________________START OF AppCtrlAddSuppliers_________________________________*/
.controller('AppCtrlAddSuppliers', function($scope, $state, $objectstore, $location,$mdDialog, $window, $objectstore, $auth, $q,$http, $compile, $timeout, $mdToast, $rootScope) {
        $scope.supplier = {};
        $scope.supplier["baddress"] = {};
        $scope.supplier["saddress"] = {};
        $scope.showShipping = $scope.showShipping;
        $scope.showBilling = !$scope.showBilling;
        $scope.cb=false;
        /*__________________________onChange_______________________________________*/
        $scope.onChange = function(cb) {
                cb==true;
                $scope.supplier.saddress["s_street"]=$scope.supplier.baddress["street"];
                $scope.supplier.saddress["s_city"] = $scope.supplier.baddress["city"];
                $scope.supplier.saddress["s_country"]=$scope.supplier.baddress["country"];
                $scope.supplier.saddress["s_zip"]= $scope.supplier.baddress["zip"];
                $scope.supplier.saddress["s_state"] =$scope.supplier.baddress["state"];
                if(cb==false){   
                 $scope.supplier.saddress["s_street"]="";
                 $scope.supplier.saddress["s_city"] ="";
                 $scope.supplier.saddress["s_country"]="";
                 $scope.supplier.saddress["s_zip"]="";
                 $scope.supplier.saddress["s_state"] ="";
                
                }
        }
       /*__________________________________submit__________________________________________________*/
        $scope.submit = function() {
            var client = $objectstore.getClient("supplier");
            client.onComplete(function(data) {
                $mdDialog.show($mdDialog.alert()
                    .parent(angular
                        .element(document.body))
                    .content(
                        'Timesheet Added Successfully.')
                    .ariaLabel(
                        'Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent(
                        data));
            });
            client.onError(function(data) {
                $mdDialog.show($mdDialog.alert()
                    .parent(angular
                        .element(document.body))
                    .content(
                        'There was an error saving the data.'
                    )
                    .ariaLabel('Alert Dialog Demo')
                    .ok(
                        'OK')
                    .targetEvent(data));
            });
            $scope.supplier.favoritestar = false;
            $scope.supplier.supplierid = "-999";
            client.insert($scope.supplier, {
                KeyProperty: "supplierid"
            })
        }
        /*______________________________addressChange_____________________________________________*/
        $scope.addressChange = function() {
            $scope.showShipping = !$scope.showShipping;
            $scope.showBilling = !$scope.showBilling;
        }
        /*______________________________save__________________________________________________________*/
        $scope.save = function() {
            $('#mySignup').click();
        }
        /*________________________________savebtn_____________________________________________________*/
        $scope.savebtn = function() {
            $('#save').animate({
                width: "100%",
                height: "100%",
                borderRadius: "0px",
                right: "0px",
                bottom: "0px",
                opacity: 0.25
            }, 400, function() {
                $('#mySignup').click();
            });
        }
    })/*______________________________END OF AppCtrlAddSuppliers______________________________________*/
/*____________________________________START OF AppCtrlGetSuppliers____________________________________*/
.controller('AppCtrlGetSuppliers', function($scope, $rootScope, $state, $objectstore, $location,$mdDialog, $window, $objectstore, $auth, $q,$http, $compile, $timeout, $mdToast) {

        $scope.suppliers = [];
        $scope.baddress = {};
        $scope.saddress = {};
        $scope.showShipping = $scope.showShipping;
        $scope.showBilling = !$scope.showBilling;
       
        /*___________________________loadAllsupplier__________________________________________________*/
        $scope.loadAllsupplier = function() {
        var client = $objectstore.getClient("supplier");
        client.onGetMany(function(data) {
            if (data) {
                $scope.suppliers = data;
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
        };
        /*__________________________________updateSupplier____________________________________________*/
        $scope.updateSupplier = function(updatedform, sid) {
            var client = $objectstore.getClient("supplier");
            client.onComplete(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content('Supplier details updated Successfully')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent(data)
                );
            });
            client.onError(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('This is embarracing')
                    .content('There was an error updating the supplier details.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent(data)
                );
            });
            updatedform.supplierid = sid;
            client.insert(updatedform, {
                KeyProperty: "supplierid"
            });
        }
        /*____________________________________deleteSupplier_______________________________________*/
        $scope.deleteSupplier = function(deleteform, ev) {
            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.body))
                .title('')
                .content('Are You Sure You Want To Delete This Record?')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                    var client = $objectstore.getClient("supplier");
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
                    client.deleteSingle(deleteform.supplierid, "supplierid");
                },
                function() {
                    $mdDialog.hide();
                });
        }
        /*______________________________favouriteFunction____________________________________________*/
        $scope.favouriteFunction = function(obj) {
            var client = $objectstore.getClient("supplier");
            client.onComplete(function(data) {
                if (obj.favoritestar) {
                    var toast = $mdToast.simple()
                        .content('Add To Favourite')
                        .action('OK')
                        .highlightAction(false)
                        .position("bottom right");
                    $mdToast.show(toast).then(function() {});
                } else if (!(obj.favoritestar)) {
                    var toast = $mdToast.simple()
                        .content('Remove from Favourite')
                        .action('OK')
                        .highlightAction(false)
                        .position("bottom right");
                    $mdToast.show(toast).then(function() {});
                };
            });
            client.onError(function(data) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content('Error Occure while Adding to Favourite')
                    .ariaLabel('')
                    .ok('OK')
                    .targetEvent(data)
                );
            });
            obj.favoritestar = !obj.favoritestar;
            client.insert(obj, {
                KeyProperty: "supplierid"
            });
        }
        /*______________________addressChange_____________________________________________________*/
        $scope.addressChange = function() {
            $scope.showShipping = !$scope.showShipping;
            $scope.showBilling = !$scope.showBilling;
        }
        
             
    })/*________________________________End of ApCtrlGetSuppliers_____________________________________*/