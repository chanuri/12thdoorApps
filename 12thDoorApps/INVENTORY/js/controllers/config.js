rasm.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home/receipt');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'inventory_partials/Inventory_view_partial.html',
            controller: 'viewctrl'

        }).state('home.issue', {
            url: '/issue',
            templateUrl: 'inventory_partials/issue_view_partial_child.html'

        }).state('home.receipt', {
            url: '/receipt',
            templateUrl: 'inventory_partials/receipt_view_partial_child.html'
            
        }).state('Add_Inventory', {
            url: '/Add_Inventory',
            templateUrl: 'inventory_partials/Inventory_new_receipt.html',
            controller: 'AppCtrl'

        }).state('ViewScreen', {
                templateUrl: 'inventory_partials/inventory_view_screen.html'
                , controller: 'ViewScreen'
                , url: '/ViewScreen/Iid=:inventoryID&status=:status'
                // params:['expenseID']
        })
        .state('Add_Inventory_Issue', {
            url: '/Add_Inventory_Issue',
            templateUrl: 'inventory_partials/Inventory_new_issue.html',
            controller: 'AppCtrl'

        })
})
    //ui route config end
rasm.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');
})