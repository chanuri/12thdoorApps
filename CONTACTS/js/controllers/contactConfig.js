var rasm = angular.module('mainApp', ['ngMaterial', 'directivelibrary', 'uiMicrokernel', 'ngAnimate', 'ui.router']);
rasm.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/settings/contact');
  $stateProvider
    .state('settings', {
      url: '/settings',
      templateUrl: 'contact_partial/settings.html',
      controller: 'settingCtrl'
    })
    .state('settings.contact', {
      url: '/contact',
      templateUrl: 'contact_partial/contact_view.html',
      controller: 'AppCtrlGet'

    })
    .state('settings.supplier', {
      url: '/supplier',
      templateUrl: 'contact_partial/supplier_view.html',
      controller: 'AppCtrlGetSuppliers'
    })
    .state('addcontact', {
      url: '/Add_Contact',
      templateUrl: 'contact_partial/contact_add.html',
      controller: 'AppCtrlAddCustomer'
    })
    .state('addsupplier', {
      url: '/Add_Supplier',
      templateUrl: 'contact_partial/supplier_add.html',
      controller: 'AppCtrlAddSuppliers'
    })
    .state('view', {
      url: '/statement',
      templateUrl: 'contact_partial/accountStatement.html',
      controller: 'AppCtrlGet'
    })
});

rasm.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('datePickerTheme')
    .primaryPalette('teal');
});