angular.module('mainApp', ['ngMaterial', 'directivelibrary', 'uiMicrokernel',
		'ngAnimate', 'ui.router', '12thdirective'
	])
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/settings/project');
		$stateProvider
			.state('settings', {
				url: '/settings',
				templateUrl: 'project_partial/settings.html',
				controller: 'AppCtrlGet'
			})
			.state('settings.project', {
				url: '/project',
				templateUrl: 'project_partial/project_view.html',
				controller: 'AppCtrlGet'
			})
			.state('settings.timesheet', {
				url: '/timesheet',
				templateUrl: 'project_partial/timesheet_view.html',
				controller: 'AppCtrlGetTimesheet'
			})
			.state('addproject', {
				url: '/Add_Project',
				templateUrl: 'project_partial/project_add.html',
				controller: 'AppCtrlAdd'
			})
			.state('addtimesheet', {
				url: '/Add_Timesheet',
				templateUrl: 'project_partial/timesheet_add.html',
				controller: 'AppCtrlAddTimesheet'
			})
			.state('addweeklytimesheet', {
				url: '/Add_weeklyTimesheet',
				templateUrl: 'project_partial/timesheetWeekly_add.html',
				controller: 'AppCtrlGet'
			})
	})
	.config(function($mdThemingProvider) {
		$mdThemingProvider.theme('datePickerTheme')
			.primaryPalette('teal');
	})

/*______________________________START OF AppCtrlAdd______________________________________________________*/

	.controller('AppCtrlAdd', function($scope, $state, $objectstore, $location,$mdDialog, $window, $auth, $q,$http, $compile, $timeout, $mdToast, $rootScope, UploaderService) {
        /*_______________________Initilization________________*/
		$scope.project = {};
		$scope.addtasks = [];
		$scope.addstaffs = [];
		$scope.staffs = [];
		$scope.tasks = [];
		$scope.customerNames = [];
		$scope.contacts = [];
		$scope.checkAbilityprate = false;
		$scope.checkAbilitypamount = false;
		$scope.checkAbilityshr = false;
		$scope.checkAbilitythr = false;
		$scope.checkAvailabilty = false;
		$rootScope.results = [];
		var self = this;
		self.tenants = loadAll();
		self.selectedItem = null;
		self.searchText = null;
		self.querySearch = querySearch;
		self.querySearchView = querySearchView;
        /*_______________________querySearch__________________*/
		function querySearch(query) {
			$scope.enter = function(keyEvent) {
					if (keyEvent.which === 13) {
						if (self.selectedItem === null) {
							self.selectedItem = query;
							console.log(results);
						} else {
							console.log(self.selectedItem);
						}
					}
				}
			var results = [];
			for (i = 0, len = $scope.customerNames.length; i < len; ++i) {
				if ($scope.customerNames[i].display.indexOf(query) != -1) {
					results.push($scope.customerNames[i]);
				}
			}
			return results;
		}
        /*_______________________querySearchView________________*/
		function querySearchView(query) {
			$scope.enter = function(keyEvent) {
				if (keyEvent.which === 13) {
					if (self.selectedItem === null) {
						self.selectedItem = query;
						console.log(results);
					} else {
						console.log(self.selectedItem);
					}
				}
			}
		}
        /*_____________________loadAll___________________________*/
		function loadAll() {
			var client = $objectstore.getClient("contact");
			client.onGetMany(function(data) {
				if (data) {
					for (i = 0, len = data.length; i < len; ++i) {
						$scope.customerNames.push({
							display: data[i].CustomerFname + ' ' + data[i].CustomerLname,
							BillAddress: data[i].baddress.street + ', ' + data[i].baddress.city + ', ' + data[i].baddress.zip + ', ' +
								data[i].baddress.country,
							ShipAddress: data[i].saddress.s_city + ', ' + data[i].saddress.s_country + ', ' + data[i].saddress.s_zip + ', ' +
								data[i].saddress.s_country
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
        /*__________________________SUBMIT PROJECTS________________*/
		$scope.submit = function() {
			var client = $objectstore.getClient("project");
			client.onComplete(function(data) {
				$mdDialog.show($mdDialog.alert()
					.parent(angular
						.element(document.body))
					.content(
						'Project Added Successfully.')
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
			$scope.project.favoritestar = false;
			$scope.project.projectid = "-999";
			$scope.project.staffs = $scope.addstaffs;
			$scope.project.tasks = $scope.addtasks;
			$scope.project.customerNames = self.selectedItem.display;
			client.insert($scope.project, {
				KeyProperty: "projectid"
			})
		}
        /*_______________________________onChange Function__________________*/
		$scope.onChange = function(type) {
			if (type == "hsr") {
				$scope.checkAbilityprate = true;
				$scope.checkAbilitypamount = true;
				$scope.checkAbilitythr = true;
				$scope.checkAbilityshr = false;
				$scope.checkAvailabilty = false;
			} else if (type == "htr") {
				$scope.checkAbilityprate = true;
				$scope.checkAbilitypamount = true;
				$scope.checkAbilityshr = true;
				$scope.checkAbilitythr = false;
				$scope.checkAvailabilty = false;
			} else if (type == "hpr") {
				$scope.checkAbilitypamount = true;
				$scope.checkAbilityshr = true;
				$scope.checkAbilitythr = true;
				$scope.checkAbilityprate = false;
				$scope.checkAvailabilty = true;
			} else if (type = "fpa") {
				$scope.checkAbilityprate = true;
				$scope.checkAbilityshr = true;
				$scope.checkAbilitythr = true;
				$scope.checkAbilitypamount = false;
				$scope.checkAvailabilty = true;
			}
		}
        /*___________________________addstaff__________________*/
		$scope.addstaff = function() {
			$scope.addstaffs.push({
				sno: $scope.addstaffs.length + 1,
				staffname: "",
				shr: "",
				removebtnDisable: false
			})
		}
        /*__________________________removeStaff________________*/
		$scope.removeStaff = function(index) {
			$scope.addstaffs.splice(index, 1);
		};
        /*________________________addtask______________________*/
		$scope.addtask = function() {
			$scope.addtasks.push({
				tno: $scope.addtasks.length + 1,
				task: "",
				thr: "",
				removebtnDisable: false
			})
		}
        /*_____________________removeTask______________________*/
		$scope.removeTask = function(index) {
			$scope.addtasks.splice(index, 1);
		};
        /*_____________________init_____________________________*/
		function init() {
			$scope.addstaff();
			$scope.addtask();
		}
		init();
        /*_____________________demo______________________________*/
		$scope.demo = {
			topDirections: ['left', 'up'],
			bottomDirections: ['down', 'right'],
			isOpen: false,
			availableModes: ['md-fling', 'md-scale'],
			selectedMode: 'md-fling',
			availableDirections: ['up', 'down', 'left', 'right'],
			selectedDirection: 'up'
		};
        /*___________________$watch_____________________________*/
		$scope.$watch('selectedIndex', function(current, old) {
			switch (current) {
				case 0:
					$location.url("/settings/project_view");
					break;
				case 1:
					$location.url("/settings/project_add");
					break;
			}
		});
        /*________________________addCustomer____________________*/
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
					location.href = '#/Add_Project';
				});
		}
        /*_______________________addTimesheet_____________________*/
		$scope.addTimesheet = function() {
			$('#add')
				.animate({
					width: "100%",
					height: "100%",
					borderRadius: "0px",
					right: "0px",
					bottom: "0px",
					opacity: 0.25
				}, 400, function() {
					location.href = '#/Add_Timesheet';
				});
		}
        /*____________________Customerview________________________*/
		$scope.Customerview = function() {
			location.href = '#/home';
		}
        /*___________________savebtn________________________________*/
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
        /*________________save_________________________________*/
		$scope.save = function() {
			$('#mySignup')
				.click();
		}
        /*________________viewpromotion_______________________*/
		$scope.viewpromotion = function() {
			$('#view')
				.animate({
					width: "100%",
					height: "100%",
					borderRadius: "0px",
					right: "0px",
					bottom: "0px",
					opacity: 0.25
				}, 400, function() {});
		}
        /*______________upload_____________________________*/
		$scope.upload = function(ev) {
			$mdDialog.show({
				templateUrl: 'project_partial/showUploader.html',
				targetEvent: ev,
				controller: 'UploadCtrl',
				locals: {
					dating: ev
				}
			})
		}
	}) //END OF AppCtrlAdd

/*____________________________________START OF AppCtrlGet________________________________________________*/
	.controller('AppCtrlGet', function($scope, $rootScope, $state, $objectstore, $location,
$mdDialog, $window, $objectstore, $auth, $q,$http, $compile, $timeout, $mdToast) {
		// sort function variable start
		$scope.sortarr = [{
			name: "Starred",
			id: "Starred",
			src: "img/ic_grade_48px.svg",
			upstatus: false,
			downstatus: false
		}, {
			name: "Date",
			id: "date",
			src: "img/ic_add_shopping_cart_48px.svg",
			upstatus: true,
			downstatus: false
		}, {
			name: "Name",
			id: "name",
			src: "img/ic_add_shopping_cart_48px.svg",
			upstatus: false,
			downstatus: false
		}]
		$rootScope.prodSearch = "date";
		$scope.self = this;
		$scope.indexno = 1;
		$scope.starfunc = function(item, index) {
				if (item.id === "Starred") {
					$scope.self.searchText = "true";
					console.log(JSON.stringify($scope.self))
				} else {
					if (item.upstatus == false && item.downstatus == false) {
						item.upstatus = !item.upstatus;
						$scope.sortarr[$scope.indexno].upstatus = false;
						$scope.sortarr[$scope.indexno].downstatus = false;
						$scope.indexno = index;
					} else {
						item.upstatus = !item.upstatus;
						item.downstatus = !item.downstatus;
					}
					self.searchText = null;
					if (item.upstatus) {
						$rootScope.prodSearch = item.id;
					}
					if (item.downstatus) {
						$rootScope.prodSearch = '-' + item.id;
					}
				}
			}
			//sort function variable end 
		$scope.projects = [];
		$scope.checkAbilityBtn = true;
		$scope.checkAbilityEditing = true;
		$scope.proSearch = "";
		if ($state.current.name == 'settings.project') {
			$scope.selectedIndex = 0;
		} else if ($state.current.name == 'settings.timesheet') {
			$scope.selectedIndex = 1;
		};
		$scope.loadAllprojects = function() {
			var client = $objectstore.getClient("project");
			client.onGetMany(function(data) {
				if (data) {
					$scope.projects = data;
				}
			});
			client.onError(function(data) {
				$mdDialog.show($mdDialog.alert()
					.parent(angular
						.element(document.body))
					.title(
						'This is embarracing')
					.content(
						'There was an error retreving the data.'
					)
					.ariaLabel('Alert Dialog Demo')
					.ok(
						'OK')
					.targetEvent(data));
			});
			client.getByFiltering("*");
		};
		$scope.updateProject = function(updatedform, pid) {
			var client = $objectstore.getClient("project");
			client.onComplete(function(data) {
				$mdDialog.show($mdDialog.alert()
					.parent(angular
						.element(document.body))
					.content(
						'Project details updated Successfully'
					)
					.ariaLabel('Alert Dialog Demo')
					.ok(
						'OK')
					.targetEvent(data));
			});
			client.onError(function(data) {
				$mdDialog.show($mdDialog.alert()
					.parent(angular
						.element(document.body))
					.title(
						'This is embarracing')
					.content(
						'There was an error updating the project details.'
					)
					.ariaLabel('Alert Dialog Demo')
					.ok(
						'OK')
					.targetEvent(data));
			});
			updatedform.projectid = pid;
			client.insert(updatedform, {
				KeyProperty: "projectid"
			});
		}
		$scope.deleteProject = function(deleteform, ev) {
			var confirm = $mdDialog.confirm()
				.parent(angular.element(
					document.body))
				.title('')
				.content(
					'Are You Sure You Want To Delete This Record?')
				.ok(
					'Delete')
				.cancel('Cancel')
				.targetEvent(ev);
			$mdDialog.show(confirm)
				.then(function() {
					var client = $objectstore.getClient("project");
					client.onComplete(function(data) {
						$mdDialog.show($mdDialog.alert()
							.parent(
								angular.element(
									document.body))
							.content(
								'Record Successfully Deleted'
							)
							.ariaLabel('')
							.ok('OK')
							.targetEvent(
								data));
						$state.go($state.current, {}, {
							reload: true
						});
					});
					client.onError(function(data) {
						$mdDialog.show($mdDialog.alert()
							.parent(
								angular.element(
									document.body))
							.content(
								'Error Deleting Record'
							)
							.ariaLabel('')
							.ok('OK')
							.targetEvent(
								data));
					});
					client.deleteSingle(deleteform.projectid,
						"projectid");
				}, function() {
					$mdDialog.hide();
				});
		}
		$scope.favouriteFunction = function(obj) {
			var client = $objectstore.getClient("project");
			client.onComplete(function(data) {
				if (obj.favoritestar) {
					var toast = $mdToast.simple()
						.content(
							'Add To Favourite')
						.action('OK')
						.highlightAction(
							false)
						.position("bottom right");
					$mdToast.show(toast)
						.then(function() {});
				} else if (!(obj.favoritestar)) {
					var toast = $mdToast.simple()
						.content(
							'Remove from Favourite')
						.action(
							'OK')
						.highlightAction(false)
						.position(
							"bottom right");
					$mdToast.show(toast)
						.then(function() {});
				};
			});
			client.onError(function(data) {
				$mdDialog.show($mdDialog.alert()
					.parent(angular
						.element(document.body))
					.content(
						'Error Occure while Adding to Favourite'
					)
					.ariaLabel('')
					.ok('OK')
					.targetEvent(
						data));
			});
			obj.favoritestar = !obj.favoritestar;
			client.insert(obj, {
				KeyProperty: "projectid"
			});
		}
		$scope.sortFunciton = function(name) {
			$scope.projectSearch = name;
			self.searchText = null;
		}
		$scope.testfunc = function() {
			self.searchText = "true"
		}
		$scope.addStaffupdate = function(add) {
			add.push({
				sno: add.length + 1,
				staffname: "",
				shr: "",
				removebtnDisable: true
			})
		}
		$scope.removeStaffupdate = function(index, proj) {
			$scope.projects[index].staffs.splice(proj, 1);
		}
		$scope.addTaskupdate = function(add) {
			add.push({
				tno: add.length + 1,
				taskName: "",
				thr: "",
				removebtnDisable: true
			})
		}
		$scope.removeTaskupdate = function(index, proj) {
			$scope.projects[index].tasks.splice(proj, 1);
		}
		$scope.onChangeEditing = function(cbState, state) {
			if (cbState == true) {
				$scope.checkAbilityEditing = false;
				$scope.checkAbilityBtn = false;
			} else {
				$scope.checkAbilityEditing = true;
				$scope.checkAbilityBtn = true;
			}
			for (var i = state.length - 1; i >= 0; i--) {
				state[i].removebtnDisable = true;
			};
		}
		$scope.chekAblityRemovebtn = function(state) {
			for (var i = state.length - 1; i >= 0; i--) {
				state[i].removebtnDisable = true;
			};
		}
		$rootScope.showsort = true;
		$rootScope.showaddProject = true;
		$rootScope.showsort = true;
		$scope.changeTab = function(ind) {
			switch (ind) {
				case 0:
					$location.url("/settings/project");
					$rootScope.showsort = true;
					break;
				case 1:
					$location.url("/settings/timesheet");
					$rootScope.showsort = false;
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
					location.href = '#/Add_Project';
				});
		}
		$scope.addweeklyTimesheet = function() {
			$('#add')
				.animate({
					width: "100%",
					height: "100%",
					borderRadius: "0px",
					right: "0px",
					bottom: "0px",
					opacity: 0.25
				}, 400, function() {
					location.href = '#/Add_weeklyTimesheet';
				});
		}
		$scope.addTimesheet = function() {
			$('#add')
				.animate({
					width: "100%",
					height: "100%",
					borderRadius: "0px",
					right: "0px",
					bottom: "0px",
					opacity: 0.25
				}, 400, function() {
					location.href = '#/Add_Timesheet';
				});
		}
		$scope.Customerview = function() {
			
			location.href = '#/home';
		
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
			$('#mySignup')
				.click();
		}
		$scope.viewpromotion = function() {
			$('#view')
				.animate({
					width: "100%",
					height: "100%",
					borderRadius: "0px",
					right: "0px",
					bottom: "0px",
					opacity: 0.25
				}, 400, function() {});
		}
		$scope.upload = function(ev) {
			$mdDialog.show({
				templateUrl: 'project_partial/showUploader.html',
				targetEvent: ev,
				controller: 'UploadCtrl',
				locals: {
					dating: ev
				}
			})
		}
        var date = new Date();
        startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
        endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 6);
        monDate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() + 1);
        tueDate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() + 2);
        wedDate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() + 3);
        thuDate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() + 4);
        friDate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() + 5);
        satDate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() + 6);
        sunDate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay());
         $scope.ssdate=startDate;
         $scope.eedate=endDate;
         $scope.startDate=moment(startDate).format('MMM Do YYYY');
         $scope.endDate=moment(endDate).format('MMM Do YYYY');
         $scope.monDate=moment(monDate).format('MMM DD');
         $scope.tueDate=moment(tueDate).format('MMM DD');
         $scope.wedDate=moment(wedDate).format('MMM DD');
         $scope.thuDate=moment(thuDate).format('MMM DD');
         $scope.friDate=moment(friDate).format('MMM DD');
         $scope.satDate=moment(satDate).format('MMM DD');
         $scope.sunDate=moment(sunDate).format('MMM DD');  
         
       
        $scope.changeDateFront=function(wtime){
            
           
            var date=new Date(wtime.ssdate);
            
            wtime.ssdate = new Date(date.getFullYear(), date.getMonth(), date.getDate()- date.getDay()+7); 
            wtime.eedate= new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 13);
           
            wtime.sdate=moment(wtime.ssdate).format('MMM Do YYYY');
            wtime.edate=moment(wtime.eedate).format('MMM Do YYYY'); 
            wtime.sundate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() +7 );
            wtime.mondate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() + 8);
            wtime.tuedate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() + 9);
            wtime.weddate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() + 10);
            wtime.thudate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() + 11);
            wtime.fridate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() + 12);
            wtime.satdate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay()+13);
            
            wtime.sundate=moment(wtime.sundate).format('MMM DD'); 
            wtime.mondate=moment(wtime.mondate).format('MMM DD');
            wtime.tuedate=moment(wtime.tuedate).format('MMM DD');
            wtime.weddate=moment(wtime.weddate).format('MMM DD');
            wtime.thudate=moment(wtime.thudate).format('MMM DD');
            wtime.fridate=moment(wtime.fridate).format('MMM DD');
            wtime.satdate=moment(wtime.satdate).format('MMM DD');
           
            
            
                    
        }
        $scope.changeDateBack=function(wtime){
             var date=new Date(wtime.ssdate);
             wtime.ssdate = new Date(date.getFullYear(), date.getMonth(), date.getDate()- date.getDay()-7);
             wtime.eedate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay()-1);
             wtime.sdate=moment(wtime.ssdate).format('MMM Do YYYY');
             wtime.edate=moment(wtime.eedate).format('MMM Do YYYY');
            
             wtime.sundate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay()-7);
             wtime.mondate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() -6 );
             wtime.tuedate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() - 5);
             wtime.weddate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() - 4);
             wtime.thudate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() - 3);
             wtime.fridate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() - 2);
             wtime.satdate = new Date(date.getFullYear(),date.getMonth(), date.getDate() - date.getDay() - 1);
            
             
             wtime.mondate=moment(wtime.mondate).format('MMM DD');
             wtime.tuedate=moment(wtime.tuedate).format('MMM DD');
             wtime.weddate=moment(wtime.weddate).format('MMM DD');
             wtime.thudate=moment(wtime.thudate).format('MMM DD');
             wtime.fridate=moment(wtime.fridate).format('MMM DD');
             wtime.satdate=moment(wtime.satdate).format('MMM DD');
             wtime.sundate=moment(wtime.sundate).format('MMM DD');
            
        }
        $scope.trackTime=[];
    
        function init(){
            $scope.addTime();
            
        }
    
        $scope.addTime=function(){
            $scope.trackTime.push({
                trackID:$scope.trackTime.push+1,
                project:"",
                task:"",
                sun:"",
                mon:"",
                tue:"",
                wed:"",
                thu:"",
                fri:"",
                sat:"",
                sun:"",
                sdate:$scope.startDate,
                edate:$scope.endDate,
                ssdate:startDate,
                eedate:endDate,
                sundate:$scope.sunDate,
                mondate:$scope.monDate,
                tuedate:$scope.tueDate,
                weddate:$scope.wedDate,
                thudate:$scope.thuDate,
                fridate:$scope.friDate,
                satdate:$scope.satDate
                
                
                
                     
            })
            
        }
        
        init();
          
        
	}) /*_______________________________End of ApCtrlGet_______________________________________________*/

/*_______________________________________START OFAppCtrlAddTimesheet___________________________________*/
	.controller('AppCtrlAddTimesheet', function($scope, $state, $location,
		$mdDialog, $window, $objectstore, $auth, $q,
		$http, $compile, $timeout, $mdToast, $rootScope) {
		$scope.project = {};
		$scope.customerNames = [];
		$scope.contacts = [];
		$rootScope.results = [];
		//Autocomplete stuff
		$rootScope.self = this;
		$rootScope.self.tenants = loadAll();
		$rootScope.selectedItem1 = null;
		$rootScope.self.searchText = null;
		$rootScope.self.querySearch = querySearch;

		function querySearch(query) {
			$scope.enter = function(keyEvent) {
					if (keyEvent.which === 13) {
						if ($rootScope.selectedItem1 === null) {
							$rootScope.selectedItem1 = query;
							console.log($rootScope.results);
						} else {
							console.log($rootScope.selectedItem1);
						}
					}
				}
				//Custom Filter
			for (i = 0, len = $scope.customerNames.length; i < len; ++i) {
				if ($scope.customerNames[i].display.indexOf(query) != -1) {
					$rootScope.results.push($scope.customerNames[i]);
				}
			}
			console.log($rootScope.results);
			return $rootScope.results;
		}

		function loadAll() {
			var client = $objectstore.getClient("contact");
			client.onGetMany(function(data) {
				if (data) {
					// $scope.contact =data;
					for (i = 0, len = data.length; i < len; ++i) {
						$scope.customerNames.push({
							display: data[i].CustomerFname.toLowerCase(),
							value: data[i]
						});
					}
					console.log($scope.customerNames);
				}
			});
			client.onError(function(data) {
				$mdDialog.show();
			});
			client.getByFiltering("*");
		}
		$scope.submit = function() {
			var client = $objectstore.getClient("time");
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
			$scope.time.favoritestar = false;
			$scope.time.timesheetid = "-999";
			client.insert($scope.time, {
				KeyProperty: "timesheetid"
			})
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
		$scope.$watch('selectedIndex', function(current, old) {
			switch (current) {
				case 0:
					$location.url("/settings/project_view");
					break;
				case 1:
					$location.url("/settings/project_add");
					break;
			}
		});
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
					location.href = '#/Add_Project';
				});
		}
		$scope.addTimesheet = function() {
			$('#add')
				.animate({
					width: "100%",
					height: "100%",
					borderRadius: "0px",
					right: "0px",
					bottom: "0px",
					opacity: 0.25
				}, 400, function() {
					location.href = '#/Add_Timesheet';
				});
		}
		$scope.Customerview = function() {
			location.href = '#/home';
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
			$('#mySignup')
				.click();
		}
		$scope.viewpromotion = function() {
			$('#view')
				.animate({
					width: "100%",
					height: "100%",
					borderRadius: "0px",
					right: "0px",
					bottom: "0px",
					opacity: 0.25
				}, 400, function() {});
		}
	}) //END OF AppCtrlAddTimesheet

/*___________________________________________START OF AppCtrlGetTimesheet________________________________*/
	.controller('AppCtrlGetTimesheet', function($scope, $rootScope, $state, $objectstore, $location,
		$mdDialog, $window, $objectstore, $auth, $q,
		$http, $compile, $timeout, $mdToast) {
		$rootScope.prodSearch = "date";
		$scope.self = this;
		$scope.indexnosort = 1;
		$scope.sortarrtimesheet = [{
			name: "Starred",
			id: "Starred",
			src: "img/ic_grade_48px.svg",
			upstatus: false,
			downstatus: false
		}, {
			name: "Date",
			id: "date",
			src: "img/ic_add_shopping_cart_48px.svg",
			upstatus: true,
			downstatus: false
		}, {
			name: "Time",
			id: "hours",
			src: "img/ic_add_shopping_cart_48px.svg",
			upstatus: false,
			downstatus: false
		}, {
			name: " Task Name",
			id: "task",
			src: "img/ic_add_shopping_cart_48px.svg",
			upstatus: false,
			downstatus: false
		}]
		$scope.starfunc = function(item, index) {
				if (item.id === "Starred") {
					$scope.self.searchText = "true";
					console.log(JSON.stringify($scope.self))
				} else {
					if (item.upstatus == false && item.downstatus == false) {
						item.upstatus = !item.upstatus;
						$scope.sortarrtimesheet[$scope.indexnosort].upstatus = false;
						$scope.sortarrtimesheet[$scope.indexnosort].downstatus = false;
						$scope.indexnosort = index;
					} else {
						item.upstatus = !item.upstatus;
						item.downstatus = !item.downstatus;
					}
					self.searchText = null;
					if (item.upstatus) {
						$rootScope.prodSearch = item.id;
					}
					if (item.downstatus) {
						$rootScope.prodSearch = '-' + item.id;
					}
				}
			}
			//sort function variable end 
		$rootScope.showaddProject = false;
		$scope.Timesheets = [];
		$scope.checkAbilityBtn = true;
		$scope.checkAbilityEditing = true;
		$scope.proSearch = "";
		$scope.loadAllTimesheets = function() {
			var client = $objectstore.getClient("time");
			client.onGetMany(function(data) {
				if (data) {
					$scope.Timesheets = data;
				}
			});
			client.onError(function(data) {
				$mdDialog.show($mdDialog.alert()
					.parent(angular
						.element(document.body))
					.title(
						'This is embarracing')
					.content(
						'There was an error retreving the data.'
					)
					.ariaLabel('Alert Dialog Demo')
					.ok(
						'OK')
					.targetEvent(data));
			});
			client.getByFiltering("*");
		};
		$scope.updateTimesheet = function(updatedform, pid) {
			var client = $objectstore.getClient("time");
			client.onComplete(function(data) {
				$mdDialog.show($mdDialog.alert()
					.parent(angular
						.element(document.body))
					.content(
						'Timesheet updated Successfully'
					)
					.ariaLabel('Alert Dialog Demo')
					.ok(
						'OK')
					.targetEvent(data));
			});
			client.onError(function(data) {
				$mdDialog.show($mdDialog.alert()
					.parent(angular
						.element(document.body))
					.title(
						'This is embarracing')
					.content(
						'There was an error updating the Timesheet.'
					)
					.ariaLabel('Alert Dialog Demo')
					.ok(
						'OK')
					.targetEvent(data));
			});
			updatedform.projectid = pid;
			client.insert(updatedform, {
				KeyProperty: "timesheetid"
			});
		}
		$scope.deleteTimesheet = function(deleteform, ev) {
			var confirm = $mdDialog.confirm()
				.parent(angular.element(
					document.body))
				.title('')
				.content(
					'Are You Sure You Want To Delete This Record?')
				.ok(
					'Delete')
				.cancel('Cancel')
				.targetEvent(ev);
			$mdDialog.show(confirm)
				.then(function() {
					var client = $objectstore.getClient("time");
					client.onComplete(function(data) {
						$mdDialog.show($mdDialog.alert()
							.parent(
								angular.element(
									document.body))
							.content(
								'Record Successfully Deleted'
							)
							.ariaLabel('')
							.ok('OK')
							.targetEvent(
								data));
						$state.go($state.current, {}, {
							reload: true
						});
					});
					client.onError(function(data) {
						$mdDialog.show($mdDialog.alert()
							.parent(
								angular.element(
									document.body))
							.content(
								'Error Deleting Record'
							)
							.ariaLabel('')
							.ok('OK')
							.targetEvent(
								data));
					});
					client.deleteSingle(deleteform.projectid,
						"timesheetid");
				}, function() {
					$mdDialog.hide();
				});
		}
		$scope.favouriteFunction = function(obj) {
			var client = $objectstore.getClient("time");
			client.onComplete(function(data) {
				if (obj.favoritestar) {
					var toast = $mdToast.simple()
						.content(
							'Add To Favourite')
						.action('OK')
						.highlightAction(
							false)
						.position("bottom right");
					$mdToast.show(toast)
						.then(function() {});
				} else if (!(obj.favoritestar)) {
					var toast = $mdToast.simple()
						.content(
							'Remove from Favourite')
						.action(
							'OK')
						.highlightAction(false)
						.position(
							"bottom right");
					$mdToast.show(toast)
						.then(function() {});
				};
			});
			client.onError(function(data) {
				$mdDialog.show($mdDialog.alert()
					.parent(angular
						.element(document.body))
					.content(
						'Error Occure while Adding to Favourite'
					)
					.ariaLabel('')
					.ok('OK')
					.targetEvent(
						data));
			});
			obj.favoritestar = !obj.favoritestar;
			client.insert(obj, {
				KeyProperty: "timesheetid"
			});
		}
		$scope.sortFunciton = function(name) {
			$scope.projectSearch = name;
			self.searchText = null;
		}
		$scope.testfunc = function() {
			self.searchText = "true"
		}
		$scope.addStaffupdate = function(add) {
			add.push({
				sno: add.length + 1,
				staffname: "",
				shr: "",
				removebtnDisable: true
			})
		}
		$scope.removeStaffupdate = function(index, proj) {
			$scope.projects[index].staffs.splice(proj, 1);
		}
		$scope.addTaskupdate = function(add) {
			add.push({
				tno: add.length + 1,
				taskName: "",
				thr: "",
				removebtnDisable: true
			})
		}
		$scope.removeTaskupdate = function(index, proj) {
			$scope.projects[index].tasks.splice(proj, 1);
		}
		$scope.onChangeEditing = function(cbState, state) {
			if (cbState == true) {
				$scope.checkAbilityEditing = false;
				$scope.checkAbilityBtn = false;
			} else {
				$scope.checkAbilityEditing = true;
				$scope.checkAbilityBtn = true;
			}
			for (var i = state.length - 1; i >= 0; i--) {
				state[i].removebtnDisable = true;
			};
		}
		$scope.chekAblityRemovebtn = function(state) {
			for (var i = state.length - 1; i >= 0; i--) {
				state[i].removebtnDisable = true;
			};
		}
		$scope.showProjectMenu = true;
		$rootScope.showsort = false;
		$scope.changeTab = function(ind) {
			switch (ind) {
				case 0:
					$location.url("/settings/project");
					$scope.showProjectMenu = true;
					break;
				case 1:
					$location.url("/settings/timesheet");
					$scope.showProjectMenu = false;
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
					location.href = '#/Add_Project';
				});
		}
		$scope.addTimesheet = function() {
			$('#add')
				.animate({
					width: "100%",
					height: "100%",
					borderRadius: "0px",
					right: "0px",
					bottom: "0px",
					opacity: 0.25
				}, 400, function() {
					location.href = '#/Add_Timesheet';
				});
		}
		$scope.Customerview = function() {
			$('#view')
				.animate({
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
			$('#mySignup')
				.click();
		}
		$scope.viewpromotion = function() {
			$('#view')
				.animate({
					width: "100%",
					height: "100%",
					borderRadius: "0px",
					right: "0px",
					bottom: "0px",
					opacity: 0.25
				}, 400, function() {});
		}
	}) //End of AppCtrlGetTimesheet

/*________________________________________START   OFUploadCtrl___________________________________________*/
	.controller('UploadCtrl', function($scope, $mdDialog, $rootScope, $state, UploaderService) {
		$scope.uploadimages = {
			val: []
		};
		$scope.uploadimages.val = UploaderService.loadBasicArray();
		//directive table content start
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
	})//END OF UploadCtrl

/*____________________________________START OF UploaderService___________________________________________*/
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
				return $rootScope.basicinfo;
			},
			removebasicArray: function(arr) {
				for (var i = arr.length - 1; i >= 0; i--) {
					$rootScope.basicinfo.splice(arr[i], 1);
				};
				return $rootScope.basicinfo;
			},
			removefileArray: function(arr) {
				for (var i = arr.length - 1; i >= 0; i--) {
					$rootScope.uploadArray.splice(arr[i], 1);
				};
				return $rootScope.uploadArray;
			},
			loadArray: function() {
				return $rootScope.uploadArray;
			},
			loadBasicArray: function() {
				return $rootScope.basicinfo;
			},
		}
	})// END OF UploaderService

/*________________________________START OF fileUpLoaderInvoice___________________________________________*/
	.directive('fileUpLoaderInvoice', ['$uploader', "$rootScope", "$mdToast", 'UploaderService', function($uploader, $rootScope, $mdToast, UploaderService) {
		return {
			restrict: 'E',
			template: "<div class='content' ng-init='showUploadButton=false;showDeleteButton=false;showUploadTable=false;'><div id='drop-files' ondragover='return false' layout='column' layout-align='space-around center'><div id='uploaded-holder' flex ><div id='dropped-files' ng-show='showUploadTable'><table id='Tabulate' ></table></div></div><div flex ><md-button class='md-raised' id='deletebtn' ng-show='showDeleteButton' class='md-raised' style='color:rgb(244,67,54);margin-left:30px;'><md-icon md-svg-src='img/directive_library/ic_delete_24px.svg'></md-icon></md-button></div><div flex><md-icon md-svg-src='img/directive_library/ic_cloud_upload_24px.svg'></md-icon><text style='font-size:12px;margin-left:10px'>{{label}}<text></div></div></div>",
			scope: {
				label: '@',
				uploadType: '@'
			},
			link: function(scope, element) {
					jQuery.event.props.push('dataTransfer');
					var files;
					var filesArray = [];
					var sampleArray = [];
					element.find("#drop-files").bind('drop', function(e) {
						files = e.dataTransfer.files || e.dataTransfer.files;
						for (indexx = 0; indexx < files.length; indexx++) {
							filesArray.push(files[indexx]);
							UploaderService.setFile(files[indexx]);
							UploaderService.BasicArray(filesArray[indexx].name, filesArray[indexx].size);
							sampleArray.push({
								'name': filesArray[indexx].name,
								'size': filesArray[indexx].size
							});
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
						$rootScope.$apply(function() {
							scope.showUploadButton = false;
							scope.showDeleteButton = false;
							scope.showUploadTable = false;
						})
						UploaderService.removefileArray(filesArray);
						UploaderService.removebasicArray(sampleArray);
						filesArray = [];
						return false;
					}
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
	}]) //END OF fileUpLoaderInvoice