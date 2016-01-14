angular.module('mainApp', ['ngMaterial', 'directivelibrary', 'uiMicrokernel','ngAnimate','ui.router'])
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
                controller: 'AppCtrlGet'
            }) 
            .state('addcontact', {
                url: '/Add_Contact',                
                templateUrl: 'contact_partial/contact_add.html',
                controller: 'AppCtrlAdd'
            }) 
            .state('addsupplier', {
                url: '/Add_Supplier',                
                templateUrl: 'contact_partial/supplier_add.html',
                controller: 'AppCtrlAdd'
            }) 
    })

    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('datePickerTheme')
            .primaryPalette('teal');
    })
//_______________________________________ADD CONTROLLER___________________________________________________
 .controller('AppCtrlAdd', function($scope, $state, $location,
  $mdDialog, $window, $objectstore, $auth, $q,  $http, $compile, $timeout, $mdToast) {
    
    $scope.contact = {};
    $scope.baddress = {};
    $scope.saddress = {};
    $scope.showShipping = $scope.showShipping;
    $scope.showBilling = !$scope.showBilling;
    
    $scope.submit = function() {
			var client = $objectstore.getClient("contact");
		client.onComplete(function(data) {
			$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.content('Customer Successfully Saved.')
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
    
     $scope.submitSupplier = function() {
			var client = $objectstore.getClient("supplier");
		client.onComplete(function(data) {
			$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.content('Supplier Successfully Saved.')
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
			$scope.supplier.favoritestar = false;
			$scope.supplier.supplierid = "-999";
			client.insert($scope.supplier, {
				KeyProperty: "supplierid"
			})
            
     }
    
     $scope.addressChange = function() {
			$scope.showShipping = !$scope.showShipping;
			$scope.showBilling = !$scope.showBilling;
     }
     
      $scope.savebtn = function() {
            $('#save')
                .animate({
                    width: "100%",
                    height: "100%",
                    borderRadius: "0px",
                    right: "0px",
                    bottom: "0px",
                    opacity: 0.25
                }, 400, function() {
                    $('#mySignup')
                        .click();
                });
        }
        
        $scope.save = function() {
             $timeout(function(){
            $('#mySignup')
                .click();
             })
        }
        
         $scope.Customerview = function() {
            location.href = '#/settings/contact';
        }
     
})
//______________________________________GET CONTROLLER_____________________________________________________
.controller('AppCtrlGet', function($scope, $state, $objectstore, $location,
$mdDialog, $window, $auth, $q,  $http, $compile, $timeout, $mdToast) {
    $scope.contacts=[];
    $scope.suppliers=[];
    $scope.showShipping = $scope.showShipping;
    $scope.showBilling = !$scope.showBilling;
     $scope.showContact=!$scope.showContact;
     $scope.showSupplier=$scope.showSupplier;
    
    if ($state.current.name == 'settings.contact') {
                $scope.selectedIndex = 0;
                $scope.showContact=!$scope.showContact;
                $scope.showSupplier=$scope.showSupplier;
            }
            else if ($state.current.name == 'settings.supplier') {
                $scope.selectedIndex = 1;
                $scope.showContact=$scope.showContact;
                $scope.showSupplier=!$scope.showSupplier;
         };
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
        
          $scope.addressChange = function() {
			$scope.showShipping = !$scope.showShipping;
			$scope.showBilling = !$scope.showBilling;
        }
   
        $scope.changeTab = function(ind){
           
             switch (ind) {
                case 0:
                    $location.url("/settings/contact");
                    $scope.showContact=!$scope.showContact;
                    $scope.showSupplier=$scope.showSupplier;
                    break;
                case 1:
                    $location.url("/settings/supplier");
                    $scope.showContact=$scope.showContact;
                    $scope.showSupplier=!$scope.showSupplier;
                    break;
            }
        };
         
        $scope.demo = {
            topDirections: ['left', 'up'],
            bottomDirections: ['down', 'right'],
            isOpen: false,
            availableModes: ['md-fling', 'md-scale'],
            selectedMode: 'md-fling',
            availableDirections: ['up', 'down', 'left', 'right'],
            selectedDirection: 'up'
        };
        
        $scope.addCustomer = function() {
            $('#add')
                .animate({
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
    
    
})