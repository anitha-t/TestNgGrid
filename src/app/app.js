angular.module( 'myAngularApp', [
  'templates-app',
  'templates-common',
  'myAngularApp.home',
  'myAngularApp.about',
  'myAngularApp.employee',
  'ui.router.state',
  'ui.router',
  'ngResource',
  'ngGrid'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | myAngularApp' ;
    }
  });
})

;

