// json parsing
const backendURL = "https://back-end-new-api.azurewebsites.net/";
const jsonURL = backendURL + "rt_parking_info";
const postURL = backendURL + "save_coord";
const setUpURL = backendURL + "set_up";

const colorToType = {"#00FF00":0, "#0000FF":1, "#FF0000":2};

function Get(URL) {
  var body = new Object();
  body.parking_lot_id = 1;
  body.owner = "5dert6";

  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", URL, false);
  Httpreq.send(JSON.stringify(body));
  return Httpreq.responseText;
}

// function setupBird() {
//   setUpModel(setUpURL, "bird");
// }

// function setupSide() {
//   setUpModel(setUpURL, "side");
// }

// function setUpModel(URL, angle) {
//   fetch(URL + "?angle=" + angle, {
//     method: "POST",
//     headers: {
//       Accept: "text/plain",
//       "Content-Type": "text/plain",
//     },
//     body: "set me up",
//   });
// }

// function Put(URL, content) {
//   fetch(URL, {
//     method: "PUT",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(content),
//   });
// }

function Post(URL, content) {
  fetch(URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
}

// update status every 2 seconds
setInterval(updateSpots, 5000);

var map;
var noPoi = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
];
var defaultOptions = {
  zoom: 19,
  center: { lat: 43.8899806, lng: -79.3120005 },
  mapTypeId: "satellite",
  tilt: 0,
  styles: noPoi,
};
var mapBounds;

var clickChoice = 0;

var adding = false;
var pointsClicked = 0;
var corners = [];

var spotData;
var numSpots;
var initialSpots = 0;
var changedSpots = [];

function initMap() {

  map = new google.maps.Map(document.getElementById("map"), defaultOptions);
  mapBounds = new google.maps.LatLngBounds();

  // load and put spots
  loadAllSpots();

  google.maps.event.addListener(map, "click", function (event) {
    if (clickChoice == 2) {
      pointsClicked++;
      document.getElementById("PickLabel").textContent =
        "Select " + (4 - pointsClicked) + " more points";
      corners.push(event.latLng);

      if (pointsClicked == 4) {
        pointsClicked = 0;
        putSpot(corners);
        corners = [];
        document.getElementById("PickLabel").textContent =
          "Spot added. Keep clicking to add more";
      }
    }
  });
}

function recenter() {
  map.setCenter(defaultOptions.center);
  map.setZoom(defaultOptions.zoom);
}

function resetData() {
  clickChoice = 0;
  document.getElementById("PickLabel").textContent = "Admin View";
  directionsRenderer.setMap(null);
}

function resetAdding() {
  document.getElementById("AddSpotButton").textContent = "Add Parking Spot";
  adding = false;
  corners = [];
  pointsClicked = 0;
  resetData();
}

// initiating placing spot from ui
function addingSpot() {
  if (!adding) {
    adding = true;
    clickChoice = 2;
    document.getElementById("PickLabel").textContent = "Click to add a spot";
    document.getElementById("AddSpotButton").textContent = "Done";
  } else {
    resetAdding();
  }
}

// admin placing spot
function putSpot(corners) {
  window["spot" + numSpots] = new google.maps.Polygon({
    paths: corners,
    strokeColor: document.getElementById("TypeMenu").value,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#888888",
    fillOpacity: 0.35,
    editable: true,
    draggable: true,
    geodesic: true,
  });
  window["spot" + numSpots].setMap(map);
  numSpots++;
}

function removingSpot() {

}

// loading all spots from remote
function loadAllSpots() {
  spotData = JSON.parse(Get(jsonURL))["parking_lots"]["parking_spaces"];
  numSpots = spotData.length;

  for (let i = 0; i < numSpots; i++) {
    let coords = spotData[i].mapcoords;
    let open = spotData[i].status;

    // spots are stored here, by ID
    window["spot" + spotData[i].id] = new google.maps.Polygon({
      paths: [
        { lat: coords[0][0], lng: coords[0][1] },
        { lat: coords[1][0], lng: coords[1][1] },
        { lat: coords[2][0], lng: coords[2][1] },
        { lat: coords[3][0], lng: coords[3][1] },
      ],
      strokeColor: open ? "#00FF00" : "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: open ? "#00FF00" : "#FF0000",
      fillOpacity: 0.35,
      editable: true,
      draggable: true,
      geodesic: true,
    });
    window["spot" + spotData[i].id].setMap(map);
  }
}

function uploadSpots() {
  payload = [];
  for (let i = 0; i < numSpots; i++) {
    if (window["spot" + i].get('fillColor') != "888888") {
      let coords = [];
      let path = window["spot" + spotData[i].id].getPath();
      for (let j = 0; j < 4; j++) {
        let coord = path.getAt(j);
        coords.push([coord.lat(), coord.lng()]);
      }
      spotData[i].mapcoords = coords;
    }
    else {
      let coords = [];
      let path = window["spot" + i].getPath();
      for (let j = 0; j < 4; j++) {
        let coord = path.getAt(j);
        coords.push([coord.lat(), coord.lng()]);
      }
      spotData[i] = {};
      spotData[i].id = i;
      spotData[i].status = false;
      spotData[i].camcoords = [];
      spotData[i].mapcoords = coords;
      spotData[i].type = colorToType[window["spot" + i].get('strokeColor')];
    }
  }
  Post(postURL, payload);
  document.getElementById("SaveButton").textContent = "Save Successful";
  setTimeout(() => {
    document.getElementById("SaveButton").textContent = "Save Changes";
  }, 1000);
}

// check json for changes in occupancy
// a refresh is needed for new spots or changed coordinates
function updateSpots() {
  var json_obj = JSON.parse(Get(jsonURL))["parking_lots"]["parking_spaces"];
  for (let i = 0; i < json_obj.length; i++) {
    let spot = json_obj[i];
    if (!(spot.status === window["spot" + spot.id].status)) {
      window["spot" + spot.id].setOptions({
        strokeColor: spot.status ? "#00FF00" : "#FF0000",
        fillColor: spot.status ? "#00FF00" : "#FF0000",
      });
      window["spot" + spot.id].status = spot.status;
    }
  }
}
