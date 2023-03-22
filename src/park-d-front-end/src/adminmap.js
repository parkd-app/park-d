// json parsing
const backendURL = "http://localhost:8000/";
const jsonURL = backendURL + "parking_lots";
const postURL = backendURL + "parking_lots";

// green:regular, blue:accessible, red:reserved
const colorToType = { "#00FF00": 0, "#0000FF": 1, "#FF0000": 2 };
const typeToColor = { 0: "#00FF00", 1: "#0000FF", 2: "#FF0000" };
const newSpotColor = "#888888";

const updateInterval = 5000;

function Get(URL) {
  var body = {};
  body.parking_lot_id = 1;
  body.owner = "gary_hand_drawn_1_parking_lot";

  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", URL, false);
  Httpreq.send(JSON.stringify(body));
  console.log(Httpreq.responseText);
  return Httpreq.responseText;
}

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

var pointsClicked = 0;
var corners = [];

var spotData;
var numSpots;
var nextID = -1;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), defaultOptions);
  mapBounds = new google.maps.LatLngBounds();

  // load and put spots
  loadAllSpots();

  google.maps.event.addListener(map, "click", function (event) {
    if (clickChoice == 1) {
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
    } else if (clickChoice == 2) {
    } else if (clickChoice == 3) {
    }
  });
}

function recenter() {
  map.setCenter(defaultOptions.center);
  map.setZoom(defaultOptions.zoom);
}

function resetData() {
  clickChoice = 0;
  corners = [];
  pointsClicked = 0;
  document.getElementById("PickLabel").textContent = "Admin View";
}

function creatingLot() {
  // create a parking lot
  clickChoice = 2;
}

function createLot() {
  // create a parking lot
}

// initiating placing spot from ui
function addingSpot() {
  if (clickChoice != 1) {
    clickChoice = 1;
    document.getElementById("PickLabel").textContent = "Click to add a spot";
    document.getElementById("AddSpotButton").textContent = "Done";
  } else {
    resetData();
  }
}

// admin placing spot
function putSpot(corners) {
  window["spot" + nextID] = new google.maps.Polygon({
    paths: corners,
    strokeColor: document.getElementById("TypeMenu").value,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: newSpotColor,
    fillOpacity: 0.35,
    editable: true,
    draggable: true,
    geodesic: true,
  });
  window["spot" + nextID].setMap(map);
  let newSpot = {};
  newSpot.id = nextID;
  newSpot.status = true;
  newSpot.camcoords = [];
  newSpot.type = colorToType[window["spot" + nextID].get("strokeColor")];
  spotData[numSpots] = newSpot;
  nextID++;
  numSpots++;
}

function removingSpot() {
  // remove the spot
  clickChoice = 3;
}

function removeSpot() {
  // remove the spot
}

// loading all spots from remote
function loadAllSpots() {
  spotData = JSON.parse(Get(jsonURL))["parking_spaces"];
  console.log(spotData);

  for (let i = 0; i < spotData.length; i++) {
    let coords = spotData[i].mapcoords;
    let open = spotData[i].status;
    let type = spotData[i].type;

    // spots are stored here, by ID
    window["spot" + spotData[i].id] = new google.maps.Polygon({
      paths: [
        { lat: coords[0][0], lng: coords[0][1] },
        { lat: coords[1][0], lng: coords[1][1] },
        { lat: coords[2][0], lng: coords[2][1] },
        { lat: coords[3][0], lng: coords[3][1] },
      ],
      strokeColor: typeToColor[type],
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: open ? "#00FF00" : "#FF0000",
      fillOpacity: 0.35,
      editable: true,
      draggable: true,
      geodesic: true,
    });
    window["spot" + spotData[i].id].setMap(map);
    if (spotData[i].id > nextID) nextID = spotData[i].id;
  }
  nextID++;
  numSpots = spotData.length;
}

function uploadSpots() {
  let payload = {};
  payload.id = 1;
  payload.owner = "5dert6";
  let spaces = [];
  for (let i = 0; i < spotData.length; i++) {
    if (window["spot" + spotData[i].id] == undefined) continue;

    let coords = [];
    let path = window["spot" + spotData[i].id].getPath();
    for (let j = 0; j < 4; j++) {
      let coord = path.getAt(j);
      coords.push([coord.lat(), coord.lng()]);
    }
    spotData[i].status = true;
    spotData[i].mapcoords = coords;

    spaces.push(spotData[i]);
  }
  payload.parking_spaces = spaces;
  Post(postURL, payload);
  document.getElementById("SaveButton").textContent = "Save Successful";
  setTimeout(() => {
    document.getElementById("SaveButton").textContent = "Save Changes";
  }, 1000);
}
