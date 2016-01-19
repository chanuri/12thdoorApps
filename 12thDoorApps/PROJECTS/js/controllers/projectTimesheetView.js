rasm.controller('AppCtrlGetTimesheet', function($scope, $rootScope, $state, $objectstore, $location, $mdDialog, $window, $objectstore, $auth, $q,
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
	
}); //End of AppCtrlGetTimesheet