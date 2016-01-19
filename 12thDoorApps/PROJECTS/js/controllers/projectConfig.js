rasm.config(function($stateProvider, $urlRouterProvider) {
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
		.state('TimeTrack', {
			url: '/TimeTrack',
			templateUrl: 'project_partial/projectTimelog.html',
			controller: 'timeTrack'
		})
});
rasm.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('datePickerTheme')
		.primaryPalette('teal');
});