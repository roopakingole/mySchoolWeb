// Default colors
var brandPrimary =  '#20a8d8';
var brandSuccess =  '#4dbd74';
var brandInfo =     '#63c2de';
var brandWarning =  '#f8cb00';
var brandDanger =   '#f86c6b';

var grayDark =      '#2a2c36';
var gray =          '#55595c';
var grayLight =     '#818a91';
var grayLighter =   '#d1d4d7';
var grayLightest =  '#f8f9fa';

angular
.module('app', [
  'ui.router',
  'oc.lazyLoad',
  'ncy-angular-breadcrumb',
  'angular-loading-bar',
  'ngMap',
  'ngMaterial',
  'firebase'
])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
  cfpLoadingBarProvider.latencyThreshold = 1;
}])
.config(function() {
	  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBQBYwkR5TIAkl8Cjrwmqx4xF4Ob-QZteM",
    authDomain: "myschoolweb-1508112511694.firebaseapp.com",
    databaseURL: "https://myschoolweb-1508112511694.firebaseio.com",
    projectId: "myschoolweb-1508112511694",
    storageBucket: "myschoolweb-1508112511694.appspot.com",
    messagingSenderId: "999860827149"
  };
  firebase.initializeApp(config);
})
.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
  $rootScope.$on('$stateChangeSuccess',function(){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  });
  $rootScope.$state = $state;
  return $rootScope.$stateParams = $stateParams;
}]);
