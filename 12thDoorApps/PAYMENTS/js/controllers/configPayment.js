rasm.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider.state('home', {
        url: '/home',
        controller: 'AppCtrlGet',
        templateUrl: 'payment_partial/payment_view.html'
    }).state('Add_Payment', {
        url: '/Add_Payment',
        controller: 'AppCtrlAdd',
        templateUrl: 'payment_partial/payment_add.html'
    }).state('View_Payment', {
        url: '/View_Payment/payID=:paymentid',
        controller: 'View_Payment',
        templateUrl: 'payment_partial/viewPaymentRec.html'
    })
});
rasm.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');
})