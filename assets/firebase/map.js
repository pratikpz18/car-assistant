function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, positionError);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  // Success, can use position.
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  console.log("Your position is: " + lat + " " + long);
  var element = document.getElementById('osm-map');
  // Height has to be set. You can do this in CSS too.
  element.style = 'height:300px;';
  // Create Leaflet map on map element.
  var map = L.map(element);
  // Add OSM tile layer to the Leaflet map.
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  // Target's GPS coordinates.
  var target = L.latLng(lat,long);
  // Set map's center to target with zoom 14.
  map.setView(target, 12);
  // Place a marker on the same location.
  L.marker(target).addTo(map);
}

function positionError(error) {
  if (error.PERMISSION_DENIED) {
    console.log("Error: permission denied");
    // Your custom modal here.
    showError('Geolocation is not enabled. Please enable to use this feature.');
  } else {
    // Handle other kinds of errors.
    console.log("Other kind of error: " + error);
  }
}

function showError(message) {
  // TODO
  console.log(message);
  var element = document.getElementById('osm-map');
  element.innerHTML = message;
}

getLocation();