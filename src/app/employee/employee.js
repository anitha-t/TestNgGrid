angular.module( 'myAngularApp.employee', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'ngResource',
  'ngGrid'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'employees', {
    url: '/employees',
    views: {
      "main": {
        controller: 'EmployeesCtrl',
        templateUrl: 'employee/list.tpl.html'
      }
    },
    data:{ pageTitle: 'Employees' }
  });
})

.controller( 'EmployeesCtrl', function EmployeesCtrl( $scope, EmployeeResponse ) {
  $scope.employees = EmployeeResponse.query();
  $scope.gridOptions = {
    data: 'employees',
    columnDefs: [
      {field: 'id', displayName: 'Id'},
      {field: 'name', displayName: 'Name'},
      {field: 'age', displayName: 'Age'}
    ],
    multiSelect: false
  };
})
.factory('EmployeeResponse', function ( $resource ) {
  return $resource('../employees.json');
})
;
