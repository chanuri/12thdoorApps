angular
	.module('mainApp', ['ngMaterial', 'directivelibrary', 'uiMicrokernel','ngAnimate', 'ui.router'])
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/settings/contact');
		$stateProvider
			.state('settings', {
            url: '/settings',
            templateUrl: 'contact_partial/settings.html',
            controller: 'AppCtrlget'
            })
            .state('settings.contact', {
                url: '/contact',                
                templateUrl: 'contact_partial/contact_view.html',
                controller: 'AppCtrlget'
            
            })
            .state('settings.supplier', {
                url: '/supplier',                
                templateUrl: 'contact_partial/supplier_view.html',
                controller: 'AppCtrlget'
            }) 
            .state('addcontact', {
                url: '/Add_Contact',                
                templateUrl: 'contact_partial/contact_add.html',
                controller: 'AppCtrladd'
            }) 
            .state('addsupplier', {
                url: '/Add_Supplier',                
                templateUrl: 'contact_partial/supplier_add.html',
                controller: 'AppCtrladd'
            }) 
	})

	.config(function($mdThemingProvider) {
		$mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');
	})

	.controller('AppCtrladd', function($scope, $state, $objectstore, $location, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $mdToast) {
    
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
        
		$scope.addressChange = function() {
			$scope.showShipping = !$scope.showShipping;
			$scope.showBilling = !$scope.showBilling;
		}
        
		$scope.demo = {
			topDirections: ['left', 'up'],
			bottomDirections: ['down', 'right'],
			isOpen: false,
			availableModes: ['md-fling', 'md-scale'],
			selectedMode: 'md-fling',
			availableDirections: ['up', 'down', 'left', 'right'],
			selectedDirection: 'up'
		};
    
		$scope.save = function() {
			$('#mySignup').click();
		}
        
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
        
		$scope.Customerview = function() {
			$('#view').animate({
				width: "100%",
				height: "100%",
				borderRadius: "0px",
				right: "0px",
				bottom: "0px",
				opacity: 0.25
			}, 400, function() {
				location.href = '#/home';
			});
		}
        
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
        
	}) //END OF AppCtrladd

	.controller('AppCtrlget', function($scope, $state, $objectstore, $location, $mdDialog, $window, $objectstore, $auth, $q, $http, $compile, $mdToast) {
    
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
		$scope.showaddProject = true;
		$scope.changeTab = function(ind){
             switch (ind) {
                case 0:
                    $location.url("/settings/contact");
                    
                    
                    break;
                case 1:
                    $location.url("/settings/supplier");
                   $scope.showaddProject = false;
                   
                     
                    break;
            }
        };

    
		$scope.loadAllcontact = function() {
			$scope.projects = [];
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
        
		$scope.deleteContact = function(deleteform, ev) {
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
        
		$scope.addressChange = function() {
			$scope.showShipping = !$scope.showShipping;
			$scope.showBilling = !$scope.showBilling;
		}
        
		$scope.sortAll = function(name) {
			$scope.ContactSearch = name;
            if(name == $scope.sortName){
                  self.searchText = null; 

                  $scope.contactNamedownArrow = true; 
                  $scope.contactNameupArrow = false;

           }
           else if(name == $scope.sortEmail){
               self.searchText = null;
               
               $scope.contactEmaildownArrow=true;
               $scope.contactEmailupArrow=false;
               
               $scope.contactNamedownArrow=false;
               $scope.contactNameupArrow=false;
           }
			
		}
        
        $scope.sortFunction=function(name){
            $scope.ContactSearch = name;
            if (name == "-customerFname") {
                $scope.contactNameupArrow = true;
                $scope.contactNamedownArrow = false;
            }
            else if (name == "customerFname") {
                $scope.contactNameupArrow = false;
                $scope.contactNamedownArrow = true;
            }   
        }
        
        $scope.sortEmail = function(name){
    
                       $scope.contactSearch = name;
                      $scope.searchText1 = null;

                      if (name == "-Email") {
                      $scope.contactEmailupArrow = true;
                      $scope.contactEmaildownArrow = false;
                  }
                  else if (name == "Email") {
                       $scope.contactEmailupArrow = false;
                      $scope.contactEmaildownArrow = true;

                     };
                  
                }
        
		$scope.testfunc = function() {
			self.searchText = "true"
		}
        
		$scope.onChangeEditing = function(cbState) {
			if (cbState == true) {
				$scope.checkAbilityEditing = false;
				$scope.checkAbilityBtn = false;
			} else {
				$scope.checkAbilityEditing = true;
				$scope.checkAbilityBtn = true;
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
        
		$scope.Customerview = function() {
			$('#view').animate({
				width: "100%",
				height: "100%",
				borderRadius: "0px",
				right: "0px",
				bottom: "0px",
				opacity: 0.25
			}, 400, function() {
				location.href = '#/home';
			});
		}
        
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
        
	}) //END OF AppCtrlget