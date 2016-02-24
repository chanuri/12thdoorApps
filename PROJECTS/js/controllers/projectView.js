rasm.controller('AppCtrlGet', function($scope, $rootScope, $state, $objectstore, $location, $mdDialog, $window, $objectstore, $auth, $q,$http, $compile, $timeout, $mdToast) {
	// sort function variable start



	$scope.openProject = function(proId){
		$state.go("viewScreen", {'projectid' : proId});
	}

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
		var client = $objectstore.getClient("project12thdoor");
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
		location.href = '#/Add_Project';
	}
	$scope.addweeklyTimesheet = function() {
		location.href = '#/Add_weeklyTimesheet';
	}
	$scope.addTimesheet = function() {
		location.href = '#/Add_Timesheet';
	}
	$scope.Customerview = function() {		
		location.href = '#/home';
	}

	$scope.addTimeTrack = function(){
		location.href = "#/TimeTrack";
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
      
    
})