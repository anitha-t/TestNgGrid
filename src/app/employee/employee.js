angular.module( 'myAngularApp.employee', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'ngResource',
  'ngGrid',
  'restangular'
])

.config(function config( $stateProvider, RestangularProvider ) {
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
  RestangularProvider.setRequestSuffix('.json');
  RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
    var extractedData;
    // .. to look for getList operations
    if (operation === "getList") {
      // .. and handle the data and meta data
      extractedData = data.employees;
      extractedData.currentPage = data.currentPage;
      extractedData.pageSize = data.pageSize;
      extractedData.totalRecords = data.totalRecords;
    } else {
      extractedData = data.data;
    }
    return extractedData;
  });

})

.controller( 'EmployeesCtrl', function EmployeesCtrl( $scope, Restangular ) {
  //$scope.employees = EmployeeResponse.query();
  //these are the filter options which includes options for filtering the data
  $scope.filterOptions = {
    //text you want to search will be put inside the filterText
    filterText: ""
  };
   //variable define for getting the total no of items to be displayed
  $scope.totalServerItems = 10;
   //these are the paging(pagination) options
  $scope.pagingOptions = {
    //no of records that need to be displayed per page will be depend on pagesizes
    pageSizes: [2,5,10],
    pageSize: 10,
    //this is for the page no that is selected
    currentPage: 1
  };

  $scope.getDataFromServer = function (params) {
    Restangular.all("employees").getList(params).then(function(responseData){
      $scope.totalServerItems=responseData.totalRecords;
      page = responseData.currentPage;
      pageSize = responseData.pageSize;
      $scope.setPagingData(responseData,page,pageSize);
    });
  };

  //this is the method that is used to call the server and bring back the data in nggrid
  $scope.getPagedDataAsync = function (pageSize, page, searchText) {
      var page = $scope.pagingOptions.currentPage;
      var pageSize = $scope.pagingOptions.pageSize;

       //if filter text is there then this condition will execute
      if (searchText) {
        var ft = searchText.toLowerCase();
        params = { currentPage: page, pageSize: pageSize, term: ft };
        $scope.getDataFromServer(params);
      }
      else
      {
        params = { currentPage: page, pageSize: pageSize };
        $scope.getDataFromServer(params);
      }
  };

  //according to the data coming from server side,pagination will be set accordingly
  $scope.setPagingData = function(data, page, pageSize){
    $scope.myData = data;
    $scope.pagingOptions.pageSize = pageSize;
    $scope.pagingOptions.currentPage = page;
    if (!$scope.$$phase) {
      $scope.$apply();
    }
  };

  //watch for pagination option.here pagingOptions will be watched each time value changes and then set the data accordingly   
  $scope.$watch('pagingOptions', function (newVal, oldVal) {
    if (newVal !== oldVal || newVal.currentPage !== oldVal.currentPage || newVal.pageSize !== oldVal.currentPage) {
      $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    }
  }, true);

  $scope.$watch('filterOptions', function (newVal, oldVal) {
    if (newVal !== oldVal) {
      $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
    }
  }, true);

  // here the grid will be set , data will be stored in myData
  $scope.gridOptions = {
    data: 'myData',
    enablePaging: true,
    showFooter: true,
    totalServerItems: 'totalServerItems',
    pagingOptions: $scope.pagingOptions,
    columnDefs:[
      {field: 'id', displayName: 'Id'},
      {field: 'name', displayName: 'Name'},
      {field: 'surname', displayName: 'SurName'},
      {field: 'age', displayName: 'Age'}
                     ]
  };
  $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
})
;
