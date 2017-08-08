//reports.js
angular
.module('app')
.controller('studentInfoCtrl', studentInfoCtrl)
.factory('GetStudentData', function ($http) {
        return $http({
            method: "GET",
            url: webapiUrl + '/ShowInfo',
        });
});

var webapiUrl = 'http://ec2-13-59-246-185.us-east-2.compute.amazonaws.com:1337/employees';

//convert Hex to RGBA
function convertHex(hex,opacity){
  hex = hex.replace('#','');
  r = parseInt(hex.substring(0,2), 16);
  g = parseInt(hex.substring(2,4), 16);
  b = parseInt(hex.substring(4,6), 16);

  result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
  return result;
}

studentInfoCtrl.$inject = ['$scope'];
studentInfoCtrl.$inject = ['$http'];
studentInfoCtrl.$inject = ['GetStudentData'];
function studentInfoCtrl($scope, $http, GetStudentData) {
    $scope.productsStudData = null;

        $scope.productsStudData = GetStudentData; // Success
    
}

