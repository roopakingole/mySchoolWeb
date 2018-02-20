//maps.js
var webapiUrl = 'http://127.0.0.1:1337';
angular
.module('app')
.controller('loginCtrl', ['$scope', '$http', '$state', '$firebaseAuth', function($scope, $http, $state, $firebaseAuth) {
    $scope.username = "";
    $scope.password = "";
    $scope.authObj = $firebaseAuth();
    $scope.submit = function(){
        var str = { 'username': $scope.username, 'password': $scope.password };
        console.log(str);
/*        var lStatus =  $http({
            method: "POST",
            url: 'http://localhost:1337/login',
            params: { "SS": JSON.stringify(str) }
        });*/
/*        $http({method: "POST", url: 'http://localhost:1337/login', params: { "SS": JSON.stringify(str) }}).
        then(function(response) {
            $scope.status = response.status;
            $scope.data = response.data;
            $state.go("app.main");
        }, function(response) {
            $scope.data = response.data || 'Request failed';
            $scope.status = response.status;
        });*/
        
        $scope.authObj.$signInWithEmailAndPassword($scope.username, $scope.password).then(function(firebaseUser) {
        	  console.log("Signed in as:", firebaseUser.uid);
        	  $state.go("app.main");
        	}).catch(function(error) {
        	  console.error("Authentication failed:", error);
        	});

    };
}]);

