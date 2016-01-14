rasm.config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');
		$stateProvider
			.state('home', {
				url: '/home'
				, templateUrl: 'expenses_partial/expenses_card_partial.html'
				, controller: 'viewctrl'
			}).state('Add_Expenses', {
				url: '/Add_Expenses'
				, templateUrl: 'expenses_partial/expense_add_partial.html'
				, controller: 'AppCtrl'
			}).state('ViewScreen', {
				templateUrl: 'expenses_partial/expense_view_screen.html'
				, controller: 'ViewScreen'
				, url: '/ViewScreen/Eid=:expenseID'
					// params:['expenseID']
			}).state('Edit_Expense', {
				templateUrl: 'expenses_partial/expense_edit_partial.html'
				, controller: 'EditCtrl'
				, params: ['Eobject']
			});
});
rasm.config(function ($mdThemingProvider) {
	$mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');
});