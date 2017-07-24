//maps.js
angular
.module('app')
.controller('MapCtrl', function(NgMap) {
  var map;
  var vm = this;
  NgMap.getMap().then(function(evtMap) {
    map = evtMap;
    vm.map = map;
  });
  vm.latlng = [40.741, -74.181];
  vm.radius = 3500;
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
      var marker = new google.maps.Marker({position: e.latLng, map: vm.map});
      vm.map.panTo(e.latLng);
  };
  vm.wayPoints = [
    {location: {lat:44.32384807250689, lng: -78.079833984375}, stopover: true},
    {location: {lat:44.55916341529184, lng: -76.17919921875}, stopover: true},
  ];

});
