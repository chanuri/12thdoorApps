rasm.controller('timeTrack',function($scope,$state,$mdDialog,$projectEvent,$interval,$rootScope,$window,$filter,$timeout,$q,$timeout,$interpolate,MaterialCalendarData){


	$scope.catchName = 'sachilaRanawaka';

	$scope.catche = function(){
		var testObject = [{
			name : 'sachilaRanawaka',
			stopTime : $scope.stopTime 
		}];
		if(window.localStorage) {
  			// localStorage can be used
  			localStorage.setItem('sachilaRanawaka', JSON.stringify(testObject));
		} else {}
	}

	var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $rootScope.calendarArr = {}

    // To select a single date, make sure the ngModel is not an array.
    $scope.selectedDate = new Date();
    $scope.dayClick = function(date) {
    	var key = [date.getFullYear(), numFmt(date.getMonth() + 1), numFmt(date.getDate())].join("-");
    	if($rootScope.calendarArr.hasOwnProperty(key)){
		    loadEvent($rootScope.calendarArr[key]);
		}else{
    		newEventdialog(date);
		}  	
    };

    $scope.testDate = false;
    var numFmt = function(num) {
        num = num.toString();
        if (num.length < 2) {
            num = "0" + num;
        }
        return num;
    };

    var loadContentAsync = true;
    $scope.setDayContent = function(date){
   		var key = [date.getFullYear(), numFmt(date.getMonth() + 1), numFmt(date.getDate())].join("-");
        var data = ($rootScope.calendarArr[key] || [{
            name: ""
        }])[0].name;
        if (loadContentAsync) {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(data);
            });
            return deferred.promise;
        }
        return data;
    }


    // OLD CALANDER
    

	// $scope.uiConfig = {
 //      calendar:{
 //        height: 500,
 //        editable: true,
 //        header:{
 //          left: 'month basicWeek basicDay agendaWeek agendaDay',
 //          center: 'title',
 //          right: 'today prev,next'
 //        },
 //        dayClick:function(date, jsEvent, view){
 //        	newEventdialog(date._d);
 //        	// $rootScope.eventSources4[0].push({title: 'Sahila',start: date._d})
 //        },
 //        eventClick : function(calEvent, jsEvent, view){
 //        	loadEvent(calEvent);
 //        },
 //        eventDrop: $scope.alertOnDrop,
 //        eventResize: $scope.alertOnResize
 //      }
 //    };
 // 	$scope.events = [];


    // $rootScope.eventSources = [];
    // $rootScope.eventSources.push($projectEvent.returnAllEvents());

    function loadEvent(obj){
    	$mdDialog.show({
			templateUrl: 'project_partial/newEvent.html',
			controller: viewEventCtrl,
			locals : {
				eventObj : obj
			}
		})
    }

    function viewEventCtrl($scope,eventObj){
    	$scope.addButtonStatus = false;
    	$scope.project = eventObj[0].name;
    	$scope.task = eventObj[0].task;
    	$scope.time = eventObj[0].time;
    	$scope.bilableCheck = eventObj[0].billStatus;

    	$scope.closeDialog = function(){
    		$mdDialog.hide();
    	}

    }

    function newEventdialog(selectedDate){
    	$mdDialog.show({
			templateUrl: 'project_partial/newEvent.html',
			controller: newEventCtrl,
			locals : {
				selectedDate : selectedDate
			}
		}).then(function(obj){
			//$rootScope.eventSources.push(obj); //old one
			if (obj) {					
				$rootScope.calendarArr[obj.date] = [];
				$rootScope.calendarArr[obj.date].push(obj)
				$scope.eventTime = obj.time;
				$scope.eventName = obj.name;
				$scope.bil = obj.billStatus
				$scope.newObj = {};
				$scope.newObj = obj;
				MaterialCalendarData.setDayContent(obj.fullDate, $interpolate('<p> {{eventTime}}</p>	<div style="margin-top: -15px;"><md-checkbox ng-checked="{{newObj.billStatus}}" style="margin-left: 0px;" aria-label="Bilable"><span style="margin-left:10px;">Bilable</span> </md-checkbox></div>')($scope));
			};
		});
    }
    function newEventCtrl($scope,selectedDate,$projectEvent){

	    $scope.addButtonStatus = true; 
	    $scope.bilableCheck = false;

    	$scope.addNewEvent = function(){
    		$projectEvent.addEvent($scope.time,selectedDate,$scope.task,$scope.project,$scope.bilableCheck,"new");
    		$mdDialog.hide($projectEvent.returnAllEvents());
    	}
    	$scope.closeDialog = function(){
    		$mdDialog.hide();
    	}
    }
});

//OLD CALANDER

// rasm.factory('$projectEvent',function(){
// 	var eventArr = [];
// 	return  {
// 		addEvent : function(times,date,tasks,proName,type){
// 			eventArr = [];
// 			switch(type){
// 				case "new" : eventArr.push({time: times , start: date, task : tasks, title : proName });  break;
// 				case "return" : eventArr.push({time: times , start: date, task : tasks, title : proName }); return eventArr; break;
// 				default : console.log("type is invalid");
// 			}
// 		},
// 		returnAllEvents : function(){
// 			return eventArr;
// 		}
// 	}
// });

rasm.factory('$projectEvent',function(){
	var eventArr = {};
	var numFmt = function(num) {
        num = num.toString();
        if (num.length < 2) {
            num = "0" + num;
        }
        return num;
    };
	return  {
		addEvent : function(times,date,tasks,proName,bilable,type){
			eventArr = {};
			switch(type){
				case "new" :  var key = [date.getFullYear(), numFmt(date.getMonth() + 1), numFmt(date.getDate())].join("-");
							  eventArr = {time: times , date: key, task : tasks, name : proName,fullDate: date, billStatus: bilable };
							  break;

				case "return" : var key = [date.getFullYear(), numFmt(date.getMonth() + 1), numFmt(date.getDate())].join("-");
							  	eventArr = {time: times , date: key, task : tasks, name : proName,fullDate: date, billStatus: bilable };
							  	return eventArr;
							  	break;

				default : console.log("type is invalid");
			}				

		},
		returnAllEvents : function(){
			return eventArr;
		}
	}
});
