var pos = [];
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    const UID = user.uid;
    const snapshot = await firebase.database().ref(`carOwners/${UID}`).once('value');
    let data = snapshot.val();
    idNumber = Object.keys(data.allCars ? data.allCars : 0).length;
    var area = [];
    await firebase.database().ref(`carOwners/${UID}/allCars`).on('child_changed',snapshot2 => {
      getLocation(); //calling map
      console.log(snapshot2.val())
      let data2 = snapshot2.val();
      area = data2;
      console.log(Object.values(area))
      for(const element of Object.values(area)){
        // console.log(element.Position)
        if(element.Position && element.Position.Latitude){
          pos.push(element.Position.Latitude);
          pos.push(element.Position.Longitude);
        }
      }
    })
  }
})

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, positionError);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

var latlong = [
  [19.21432146390941, 73.08750846302414],
  [19.20649741964745, 73.09833956506196],
  [19.254007028700055, 72.98234939618598],
  [19.210939089302137, 72.9785299292424],
  [19.23434092356303, 72.97634124821178],
  [19.19626818902762, 72.94934749603685],
  [19.19570077968023, 72.94471263918884],
  [19.166517100710962, 72.96471118948273],
  [19.15930144970961, 72.94016361305849],
  [19.071228891428213, 72.90771961258892],
  [19.105295664785384, 72.88926601373167],
  [19.098239551746115, 72.89218425699796],
  [19.121596567909418, 72.86935329497348],
  [19.12062342501713, 72.89055347494791],
  [19.160841895680974, 72.93132304957416],
  [19.165219928014768, 72.88162708274945],
  [19.17381350483684, 72.85905361170929],
  [19.17683331099044, 72.87580132438104],
  [19.171807025829715, 72.84224152681875],
  [19.178778928863952, 72.81597733382837],
  [19.18883092083584, 72.83692002274745],
  [19.237602731844344, 72.97553657789604],
  [19.195781838297524, 72.9573404728239],
  [19.227067463264014, 73.10668587291016],
  [19.214748445950313, 73.0977594817427],
  [19.221232253629363, 73.19526315493833],
  [19.099942778214654, 73.96636604151209],
  [18.88243734230753, 73.89701486081717],
  [16.247499380083056, 74.34608098652896],
  [15.409855839546637, 73.8489496630487],
  [16.700516858155773, 74.26093694770084],
  [16.176429387973553, 74.84592393583878],
  [16.174450997810943, 74.8088450802201],
  [16.679937265554077, 74.81914475422205],
  [16.86139080373269, 74.56233932862347],
  [17.40601120773297, 74.10503341794934],
  [18.013930900845782, 74.43599378778484],
  [18.741733129310933, 73.68119960398276],
  [19.257226038826605, 73.15110928156842],
  [19.24944714337845, 73.10991055310319],
  [19.48993531034907, 73.02476650469156],
  [19.21719320887389, 73.09034115579679],
  [19.241505810581174, 72.96914822113007],
  [19.003151428060693, 73.12786532607201],
  [19.19083312616885, 73.16700412001731],
  [19.09288237095582, 73.37883425522047],
  [19.13505372705601, 73.25935794176974],
  [18.971598623047722, 73.12833425884301],
  [18.962507521585312, 73.17365287401246],
  [18.87741677983666, 73.89806387233278],
  [19.269381129128845, 73.39131949083959],
  [19.097524212314024, 73.3817064541977],
  [19.061671109674688, 73.07031271824128],
  [18.984422731540825, 73.02774069882723],
  [19.050637826455134, 73.01126120744114],
  [18.953172389821315, 73.0342638305671],
  [18.86466567817443, 73.1528818370913],
  [18.880259247550843, 72.98465369186793],
  [18.688000053990272, 72.99787161457078],
  [18.715479072985566, 72.8931581772256],
  [18.33379106434871, 72.9678308758497],
  [18.141569118057635, 73.12189695808392],
]

function showPosition(position) {
  // Success, can use position.
  let lat= position.coords.latitude;
  let long = position.coords.longitude;

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
  var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [18, 26],
    iconAnchor: [12, 20],
    popupAnchor: [1, -30],
    shadowSize: [20,20]
  });

  // let lat= pos[0];
  // let long = pos[1];

  // var element = document.getElementById('osm-map');
  // // Height has to be set. You can do this in CSS too.
  // element.style = 'height:300px;';
  // // Create Leaflet map on map element.
  // var map = L.map(element);
  // // Add OSM tile layer to the Leaflet map.
  // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  // }).addTo(map);
  // // Target's GPS coordinates.
  // var target = L.latLng(lat,long);
  // // Set map's center to target with zoom 14.
  // map.setView(target, 12);
  // // Place a marker on the same location.
  // L.marker(target).addTo(map);
  // var greenIcon = new L.Icon({
  //   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  //   iconSize: [18, 26],
  //   iconAnchor: [12, 20],
  //   popupAnchor: [1, -30],
  //   shadowSize: [20,20]
  // });
  
  // let lat2 = pos[0];
  // let long2 = pos[1];
  // // Target's GPS coordinates.
  // var target2 = L.latLng(lat2,long2);
  // // Set map's center to target with zoom 14.
  // map.setView(target2, 12);
  // // Place a marker on the same location.
  // L.marker(target2).addTo(map);
  // var greenIcon = new L.Icon({
  //   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  //   iconSize: [21, 29],
  //   iconAnchor: [12, 20],
  //   popupAnchor: [1, -30],
  //   shadowSize: [20,20]
  // });

  // // console.log(latlong[0][0],latlong[0][1])
  
  for (let i = 0; i < latlong.length; i++) {
    if(pos){
      console.log(pos)
      const marker2 = L.marker([pos[0],pos[1]]);
      marker2.addTo(map);
    }
      const marker = L.marker([latlong[i][0],latlong[i][1]],{icon: greenIcon});
      console.log(pos)
      marker.addTo(map);
    
    // marker.myData = { id: latlong[i.toString()] };
    // marker.on('click', function(e) {
    //   alert(marker.myData.id);
    // });
  }
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
  var element = document.getElementById('map');
  element.innerHTML = message;
}
