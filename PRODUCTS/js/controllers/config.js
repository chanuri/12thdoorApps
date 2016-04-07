rasm.config(["$stateProvider", "$urlRouterProvider",function($stateProvider, $urlRouterProvider) {    
  $urlRouterProvider.otherwise('/home');    
  $stateProvider       
     	  .state('home', {
          url: '/home',
          templateUrl: 'product_partials/product_view_partial.html'
         ,controller: 'AppCtrl'
      }).state('View_Screen', {
          templateUrl: 'product_partials/product_view_screen.html'
          ,controller: 'ViewScreen'
          ,url: '/View_Screen/Pcode=:productID'
      }).state('Add_Product', {
          url: '/Add_Product',
          templateUrl: 'product_partials/Product_partial.html'
         ,controller: 'AppCtrl'
      }).state('Edit_Product', {
          templateUrl: 'product_partials/Product_edit.html'
          ,controller: 'EditCtrl'
          ,params: ['Eobject']
      }).state('Copy_Product', {
          url: '/Copy_Product/Pcode=:productID',
          templateUrl: 'product_partials/Product_Copy.html'
         ,controller: 'CopyCtrl'
      });
  }]);

rasm.config(function($mdThemingProvider){

  $mdThemingProvider.definePalette('12thDoorPrimary', {
    '50': '235B91',
    '100': '235B91',
    '200': '235B91',
    '300': '235B91',
    '400': '235B91',
    '500': '235B91',
    '600': '235B91',
    '700': '235B91',
    '800': '235B91',
    '900': '235B91',
    'A100': '235B91',
    'A200': '235B91',
    'A400': '235B91',
    'A700': '235B91',
    'contrastDefaultColor': 'light',          
    'contrastDarkColors': ['50', '100',
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined  

  });

    $mdThemingProvider.definePalette('12thDoorAccent', {
    '50': 'ffffff',
    '100': 'ffffff',
    '200': 'ffffff',
    '300': 'ffffff',
    '400': 'ffffff',
    '500': 'ffffff',
    '600': 'ffffff',
    '700': 'ffffff',
    '800': 'ffffff',
    '900': 'ffffff',
    'A100': 'ffffff',
    'A200': 'ffffff',
    'A400': 'ffffff',
    'A700': 'ffffff',
    'contrastDefaultColor': 'dark',
    'contrastDarkColors': ['50', '100',
     '200', '300', '400', 'A100'],
    'contrastLightColors': '7c7c7c'
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('12thDoorPrimary')
    .accentPalette('12thDoorAccent')
    .warnPalette('red');

    $mdThemingProvider.alwaysWatchTheme(true);
});
