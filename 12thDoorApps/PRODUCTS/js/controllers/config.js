rasm.config(function($stateProvider, $urlRouterProvider) {    
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
    });