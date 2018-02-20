//maps.js
var webapiUrl = 'http://127.0.0.1:1337';
angular
.module('app')
.controller('busTraceRouteCtrl', ['$scope', '$http', 'NgMap', '$state','$interval', function($scope, $http, NgMap, $state,$interval) {
  var map;
  var vm = this;
  vm.startStop = new google.maps.LatLng(39.1935971, -85.998385);
  vm.endStop = new google.maps.LatLng(39.171437,-85.937484);
  vm.directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer({ draggable: true });
  vm.geocoder = new google.maps.Geocoder();
  vm.markerMap = new Map();
  vm.latlng = [40.741, -74.181];
  vm.radius = 3500;
  vm.infowindow;
  vm.markerList = [];
  vm.markerMap;
  vm.isEditRoute = false;
  vm.isNewRoute = true;
  vm.currentMarker;
  vm.routeName = "";
  vm.routeDescription = "";
  vm.wayPoints = [
      {location: {lat:39.1886273, lng: -85.9919847}, stopover: true},
      {location: {lat:39.1851623, lng: -85.9807374}, stopover: true},
  ];
  
  vm.firestore = firebase.firestore();
  vm.colRef = vm.firestore.collection("buses");

  NgMap.getMap().then(function(evtMap) {
    map = evtMap;
    vm.map = map;
    vm.infowindow = new google.maps.InfoWindow({
          content: document.getElementById('form')
      });

  vm.getDirections();
  });
//  url: 'http://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
  vm.image = {
	      url: 'http://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
	      size: new google.maps.Size(20, 32),
	      origin: new google.maps.Point(0,0),
	      anchor: new google.maps.Point(0,32)
	    };
vm.shape = {
  coords: [1, 1, 1, 20, 18, 20, 18 , 1],
  type: 'poly'
};
  $scope.routeList = {};
  $scope.status = 0;
  $scope.selectedRoute = "";
  $scope.data = {};
  $scope.route = {};

  $http.get(webapiUrl + '/bus/getRouteList').
  then(function(response) {
      $scope.status = response.status;
      $scope.routeList = response.data;
  });
  var vm = this;
  vm.positions =[
    [39.1935971, -85.998385], [39.1886273, -85.9919847],
    [39.171437, -85.937484], [39.1851623, -85.9807374]
  ];

  $interval(function() {
	  if(vm.isNewRoute === true)
		  {
		  var numMarkers = vm.positions.length; //between 4 to 8 markers
		  for(var i = 0; i < numMarkers; i++) {
		        var lat = vm.positions[i][0];
		        var lng = vm.positions[i][1];
		        
		        var latLng  = new google.maps.LatLng(lat, lng);
          var marker = new google.maps.Marker({position: latLng, map: vm.map, draggable: false, icon: vm.image, shape: vm.shape});
          //vm.markerList.push(marker);
          vm.markerMap.set(marker,{'marker':marker, 'name':'asd', 'scheduledTime':'7:00'});
		  }
		  	vm.isNewRoute = false;
		  	
		  }
    //vm.positions = [];
    vm.clearMarkers();
/*    for (i = 0; i < numMarkers; i++) {
      var lat = 40.71 + (Math.random() / 100);
      var lng = -74.21 + (Math.random() / 100);
      vm.positions.push([lat, lng]);
      vm.placeMarker(new google.maps.LatLng(lat, lng));
    }
*/
    var itr = vm.markerMap.values();
    var item = itr.next();
    //debugger;
    //console.log(itr.size());
    while(!item.done) {
        //debugger;
        //console.log(item.value.marker);
        //item.value.marker.setMap(map);
        var lat = item.value.marker.getPosition().lat();
        var lng = item.value.marker.getPosition().lng();
        
        item.value.marker.setPosition(new google.maps.LatLng(lat+(Math.random()/10000), lng+(Math.random()/10000)));
        item = itr.next();
    }
    vm.showMarkers();
  }, 10000);
  
  vm.placeMarker = function(ev) {
/*          var marker = new google.maps.Marker({position: latLng, map: vm.map, draggable: false});
          //vm.markerList.push(marker);
          vm.markerMap.set(marker,{'marker':marker, 'name':'asd', 'scheduledTime':'7:00'});*/
	  console.log(ev);
	  var busColRef = vm.colRef.doc('1').collection('traceroute');
	  busColRef.add({
		  timestamp: Date.now(), 
		  location: new firebase.firestore.GeoPoint(ev.latLng.lat(), ev.latLng.lng())
		  })
		  .then(function() {
	      console.log("Record saved!");
	    }).catch(function(error) {
	      console.log("Got an error: ", error);
	    });
  };

  vm.getRealTimeUpdates = function() {
	    vm.colRef.onSnapshot(function(snapshot) {
	        snapshot.docChanges.forEach(function(change) {
	            if (change.type === "added") {
	                console.log("New data: ", change.doc.data());
	                //outputTextField.value = change.doc.data().hotDogStatus;
	            }
//	            if (change.type === "modified") {
//	                console.log("Modified city: ", change.doc.data());
//	            }
//	            if (change.type === "removed") {
//	                console.log("Removed city: ", change.doc.data());
//	            }
	        });
	        })
	  }
  vm.getRealTimeUpdates();
  vm.onClickSelectedRoute = function() {


      if($scope.selectedRoute) {

          vm.routeName = $scope.routeList[$scope.selectedRoute - 1].route_name;
          vm.routeDescription = $scope.routeList[$scope.selectedRoute - 1].route_description;
          var routeId = $scope.routeList[$scope.selectedRoute - 1].bus_route_id;

          var obj = { "routeId": routeId};
          $http({
              method: 'GET',
              url: webapiUrl + '/bus/getRoute',
              params: {"SS": JSON.stringify(obj)}
          }).then(function (response) {
              $scope.status = response.status;
              $scope.data = response.data;
              var len = $scope.data.length;
              var i = 2;
              //console.log($scope.data);
              if (len > 1) {
                  vm.wayPoints = [];
                  vm.startStop = new google.maps.LatLng($scope.data[1].Latitude, $scope.data[1].Longitude);
                  vm.endStop = new google.maps.LatLng($scope.data[len - 1].Latitude, $scope.data[len - 1].Longitude);
                  for (i = 2; i < len - 1; i++)
                      vm.wayPoints.push({
                          'location': new google.maps.LatLng($scope.data[i].Latitude, $scope.data[i].Longitude),
                          stopover: true
                      });
                  vm.getDirections();
                  vm.isNewRoute = false;
              }
          }, function (response) {
              $scope.data = response.data || 'Request failed';
              $scope.status = response.status;
          });
      }
  };

  


    // get directions using google maps api
    vm.getDirections = function () {
        var request = {
            origin: vm.startStop,
            destination: vm.endStop,
            waypoints: vm.wayPoints,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        vm.directionsService.route(request, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(vm.map);
                directionsDisplay.setPanel(null);
                //$scope.directions.showList = true;
                //console.log(directionsDisplay);
            } else {
                console.log('Google route unsuccesfull!'+status);
            }
        });
    }


    vm.onClickGetDirection = function() {
        // for(var i=0; i < vm.markerList.length; i++)
        // {
        //     vm.wayPoints.push({location: vm.markerList[i].getPosition(), stopover:true});
        // }
        var itr = vm.markerMap.values();
        var item = itr.next();
        //debugger;
        //console.log(itr.size());
        vm.wayPoints = [];
        while(!item.done) {
            //debugger;
            //console.log(item.value.marker);
            //item.value.marker.setMap(map);
            vm.wayPoints.push({location: item.value.marker.getPosition(), stopover:true});
            item = itr.next();
        }
        vm.getDirections();
        vm.showMarkers();
    }
// Sets the map on all markers in the array.
    vm.setMapOnAll = function (map) {
        /*for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }*/
        var itr = vm.markerMap.values();
        var item = itr.next();
        //debugger;
        //console.log(itr.size());
        while(!item.done) {
            //debugger;
            //console.log(item.value.marker);
            item.value.marker.setMap(map);
            item = itr.next();
        }

    }

    // Removes the markers from the map, but keeps them in the array.
    vm.clearMarkers = function () {
        vm.setMapOnAll(null);
    }

    // Shows any markers currently in the array.
    vm.showMarkers = function() {
        vm.setMapOnAll(map);
    }

    // Deletes all markers in the array by removing references to them.
    vm.deleteMarkers = function() {
        vm.clearMarkers();
        vm.markerMap.clear();
    }
}]);

