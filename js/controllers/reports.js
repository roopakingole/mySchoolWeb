//reports.js
angular
.module('app')
.controller('studentInfoCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.method = 'GET';
    $scope.url = webapiUrl + '/ShowInfo';
    $http({method: $scope.method, url: $scope.url}).
        then(function(response) {
          $scope.status = response.status;
          $scope.data = response.data;
        }, function(response) {
          $scope.data = response.data || 'Request failed';
          $scope.status = response.status;
        });
}]);
    
//var webapiUrl = 'http://ec2-13-59-22-248.us-east-2.compute.amazonaws.com:1337/employees';
var webapiUrl = 'http://127.0.0.1:1337/employees';

