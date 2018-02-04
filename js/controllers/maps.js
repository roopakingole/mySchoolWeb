//maps.js
var webapiUrl = 'http://127.0.0.1:1337';
angular
.module('app')
.controller('MapCtrl', ['$scope', '$http', 'NgMap', '$state', function($scope, $http, NgMap, $state) {
  var map;
  var vm = this;
  vm.startStop = new google.maps.LatLng(39.1935971, -85.998385);
  vm.endStop = new google.maps.LatLng(39.171437,-85.937484);
  vm.directionsService = new google.maps.DirectionsService();
  vm.geocoder = new google.maps.Geocoder();
  vm.markerMap = new Map();
  vm.latlng = [40.741, -74.181];
  vm.radius = 3500;
  vm.infowindow;
  vm.markerList = [];
  vm.markerMap;
  vm.isEditRoute = false;
  vm.isNewRoute = false;
  vm.currentMarker;
  vm.routeName = "";
  vm.routeDescription = "";
  vm.wayPoints = [
      {location: {lat:39.1886273, lng: -85.9919847}, stopover: true},
      {location: {lat:39.1851623, lng: -85.9807374}, stopover: true},
  ];
  NgMap.getMap().then(function(evtMap) {
    map = evtMap;
    vm.map = map;
    vm.infowindow = new google.maps.InfoWindow({
          content: document.getElementById('form')
      });

  vm.getDirections();
  });

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
  vm.getRadius = function(event) {
    alert('this circle has radius ' + this.getRadius());
  }
  vm.setCenter = function(event) {
    console.log('event', event);
    map.setCenter(event.latLng);
  }
  vm.foo = function(event, arg1, arg2) {
    alert('this is at '+ this.getPosition());
    alert(arg1+arg2);
  }
  vm.dragStart = function(event) {
    console.log("drag started");
  }
  vm.drag = function(event) {
    console.log("dragging");
  }
  vm.dragEnd = function(event) {
    console.log("drag ended");
  }
  vm.logLatLng = function(e) {
    console.log('loc', e.latLng);
  }
  vm.placeMarker = function(e) {
      if(vm.isEditRoute || vm.isNewRoute) {
          var marker = new google.maps.Marker({position: e.latLng, map: vm.map, draggable: true});
          vm.markerList.push(marker);

          google.maps.event.addListener(marker, 'click', function () {
              document.getElementById('form').style.cssText = "display:block";
              if(vm.markerMap.has(marker)) {
                  var t = vm.markerMap.get(marker);
                  console.log('marker',t.name);
                  document.getElementById('stopName').value = t.name;
                  document.getElementById('stopSchedTime').value = t.scheduledTime;
              }
              vm.infowindow.open(vm.map, marker);
              vm.currentMarker = marker;
              document.getElementById('saveData').addEventListener('click', vm.onSaveDataClickHandler);
          });
      }
      //vm.map.panTo(e.latLng);
/*      vm.wayPoints.push({location: e.latLng, stopover:true});
      vm.getDirections();*/
      //var markers = vm.map.getMarkers();
      // for(var i = 0; i < markers.length; i++) {
      //     google.maps.event.addListener(markers[i], 'click', function () {
      //         vm.infowindow.open(vm.map, markers[i]);
      //     });
      // }
      //$scope.waypoints.push({ location: $scope.directions.origin });
  };


  vm.onClickSelectedRoute = function() {

      var obj = { "routeId": $scope.selectedRoute};
      if($scope.selectedRoute) {
          vm.routeName = $scope.routeList[$scope.selectedRoute - 1].route_name;
          vm.routeDescription = $scope.routeList[$scope.selectedRoute - 1].route_description;
      }
      $http({method: 'GET', url: webapiUrl + '/bus/getRoute', params:{ "SS": JSON.stringify(obj)}}).
      then(function(response) {
          $scope.status = response.status;
          $scope.data = response.data;
          var len = $scope.data.length;
          var i = 2;
          console.log($scope.data);
          if(len > 1) {
              vm.wayPoints = [];
              vm.startStop = new google.maps.LatLng($scope.data[1].Latitude, $scope.data[1].Longitude);
              vm.endStop = new google.maps.LatLng($scope.data[len-1].Latitude, $scope.data[len-1].Longitude);
              for (i = 2; i < len - 1; i++)
                  vm.wayPoints.push({
                      'location': new google.maps.LatLng($scope.data[i].Latitude, $scope.data[i].Longitude),
                      stopover: true
                  });
                  vm.getDirections();
              vm.isNewRoute = false;
          }
      }, function(response) {
          $scope.data = response.data || 'Request failed';
          $scope.status = response.status;
      });
  };

vm.onClickNewRoute = function() {
            vm.wayPoints = [];
            vm.startStop = "1260 N Marr Rd, Columbus, IN 47201, USA";
            vm.endStop = "1320 W 200 S, Columbus, IN 47201, USA";
            vm.getDirections();
    vm.isNewRoute = true;
    vm.routeName = "";
    vm.routeDescription = "";
    vm.deleteMarkers();

};

vm.onClickSaveRoute = function() {
    var data = {};
    var w = [], wp;
    var cnt = directionsDisplay.directions.routes[0].legs.length - 1;
    var rleg = directionsDisplay.directions.routes[0].legs[0];
    var destleg = directionsDisplay.directions.routes[0].legs[cnt];

    $scope.route.name = vm.routeName;
    $scope.route.description = vm.routeDescription;
    $scope.route.start = { 'lat': rleg.start_location.lat(), 'lng': rleg.start_location.lng() };
    $scope.route.end = { 'lat': destleg.end_location.lat(), 'lng': destleg.end_location.lng() };

    var wp = directionsDisplay.directions.routes[0].legs;
    //debugger;

    var j = 0;
    var item = 0;
    var itr = vm.markerMap.values();
    var item = itr.next();

    for (var i = 0; i < wp.length - 1; i++) {
        //var t = vm.markerMap.get(wp[i].end_location);
        w[i] = {'latStart':wp[i].start_location.lat(), 'lngStart':wp[i].start_location.lng(), 'latEnd':wp[i].end_location.lat(), 'lngEnd':wp[i].end_location.lng(), 'legDist':wp[i].distance.text, 'legDur':wp[i].duration.text, 'stopName':item.value.name, 'schedTime':item.value.scheduledTime};
        item = itr.next();
    }
    $scope.route.waypoints = w;
    //console.log('waypoints',w);
    //$scope.data.directions = directionsDisplay.directions;
    var lStatus =  $http({
        method: "POST",
        url: 'http://localhost:1337/bus/saveRoute',
        params: {
            "SS": JSON.stringify($scope.route)
        }
    });
    vm.clearMarkers();
    vm.isNewRoute = false;
    $state.go("app.route");
    $http.get(webapiUrl + '/bus/getRouteList').
    then(function(response) {
        $scope.status = response.status;
        $scope.routeList = response.data;
    });
};
var directionsDisplay = new google.maps.DirectionsRenderer({ draggable: true });

/*directionsDisplay.addListener('directions_changed', function () {
    //alert("Changed");
    //vm.getDirections();
});*/

function hasMarkerLocation(location) {
    var itr = vm.markerMap.values();
    var item = itr.next();

    while(!item.done) {
        if(item.value.marker.getPosition().equals(location)) {
            return item.value;
        }
        else
            item = itr.next();
    }
    return null;
}

function geocodeLatLng(geo, lat,lng) {
    var latlng = {lat: lat, lng: lng};
    fmtAddr = "No results found";
    geo.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                fmtAddr = results[0].formatted_address;
            } else {
                fmtAddr = "No results found";
            }
        } else {
            console.log('Geocoder failed due to: ' + status);
        }
    });
    return fmtAddr;
}

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

    vm.onSaveDataClickHandler = function() {
        var latlng = vm.currentMarker.getPosition();
        var stopName = document.getElementById('stopName').value;
        var stopSchedTime = document.getElementById('stopSchedTime').value;
        console.log('loc',latlng.lat());
        console.log('loc',latlng.lng());
        vm.markerMap.set(vm.currentMarker,{'marker':vm.currentMarker, 'name':stopName, 'scheduledTime':stopSchedTime});
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

