// constants moved to constants.js

// Get from URL with body, expects a responseText from URL backend
function Get(URL, body) {
  console.log(body);
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("POST", URL, false);
  Httpreq.setRequestHeader("Content-Type", "application/json");
  Httpreq.send(JSON.stringify(body));
  console.log(Httpreq.responseText);
  return Httpreq.responseText;
}

// Sends POST to URL with content
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
  center: { lat: 43.26279090319564, lng: -79.9169064541978 },
  mapTypeId: "satellite",
  tilt: 0,
  styles: noPoi,
};
var mapBounds;

var clickChoice = 0;
var corners = []; // coordinates of corners of spot on Google Maps

var spaceData;
var numSpots = 0;
var nextID = 0; // ID of next spot that is added

var lotID = 1;
var owner;
var youtubeURL;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), defaultOptions);
  mapBounds = new google.maps.LatLngBounds();
}

function recenter() {
  map.setCenter(defaultOptions.center);
  map.setZoom(defaultOptions.zoom);
}

function resetData() {
  clickChoice = 0;
  corners = [];
  document.getElementById("ChangeSpotButton").textContent = "Change Spot Type";
}

function loadLot() {
  lotID = parseInt(document.getElementById("IDBox").value);
  owner = document.getElementById("OwnerBox").value;
  try {
    loadAllSpots(lotID, owner);
  } catch (e) {
    document.getElementById("LoadLotButton").textContent = "Load Failed!";
    setTimeout(() => {
      document.getElementById("LoadLotButton").textContent =
        "Load Existing Lot";
    }, 2000);
    console.log(e);
  }
}

function setUpButtons() {
  document.getElementById("LotButtons").style.display = "none";
  document.getElementById("SpaceButtons").style.display = "block";
}

function creatingLot() {
  // show necessary boxes
  document.getElementById("LotButtons").style.display = "none";
  document.getElementById("NewLotButtons").style.display = "block";
}

function loadingLot() {
  // show necessary boxes
  document.getElementById("LotButtons").style.display = "block";
  document.getElementById("NewLotButtons").style.display = "none";
}

function createLot() {
  // create a parking lot
  owner = document.getElementById("NewOwnerBox").value;
  youtubeURL = document.getElementById("URLBox").value;
  lots = JSON.parse(Get(allLotURL, {}))["parking_lots"];
  for (let i = 0; i < lots.length; i++) {
    if (lots[i].name == owner) {
      if (lots[i].id >= lotID) lotID = lots[i].id + 1; // determine highest ID
    }
  }
  payload = {};
  payload.id = lotID;
  payload.name = owner;
  payload.url = youtubeURL;

  spaceData = [];
  Post(createLotURL, payload);
  uploadSpots(); // to populate the database
  window.alert(
    "New parking lot created with ID " +
      lotID +
      ". Note this number for future access."
  );

  document.getElementById("NewLotButtons").style.display = "none";
  document.getElementById("SpaceButtons").style.display = "block";
}

// places new spot on Google Maps view
function putSpot(corners, camcorners) {
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
  addSpaceListener(nextID); // for clicking spot to change type

  let newSpot = {};
  newSpot.id = nextID;
  newSpot.status = true;
  newSpot.camcoords = camcorners;
  newSpot.type = colorToType[window["spot" + nextID].get("strokeColor")];
  spaceData[numSpots] = newSpot;
  console.log(spaceData);
  nextID++;
  numSpots++;
}

function changingSpot() {
  // changing spot
  if (clickChoice != 2) {
    resetData();
    clickChoice = 2;
    document.getElementById("ChangeSpotButton").textContent = "Done";
  } else {
    resetData();
  }
}

// loading all spots from remote
function loadAllSpots(ID, owner) {
  body = {};
  body.id = ID;
  body.name = owner;
  let lotData = JSON.parse(Get(prevLayoutURL, body))["result"]["parking_lots"];
  youtubeURL = lotData["url"];
  spaceData = lotData["parking_spaces"];
  console.log(spaceData);
  if (spaceData == undefined) {
    spaceData = [];
    setUpButtons();
    return;
  }
  if (spaceData[0].mapcoords != undefined) {
    defaultOptions.center = new google.maps.LatLng( // move map centre to the lot
      spaceData[0].mapcoords[0][0],
      spaceData[0].mapcoords[0][1]
    );
    recenter();
  }
  for (let i = 0; i < spaceData.length; i++) {
    let coords = spaceData[i].mapcoords;
    let type = spaceData[i].type;

    // spots are stored here, by ID
    window["spot" + spaceData[i].id] = new google.maps.Polygon({
      paths: [
        { lat: coords[0][0], lng: coords[0][1] },
        { lat: coords[1][0], lng: coords[1][1] },
        { lat: coords[2][0], lng: coords[2][1] },
        { lat: coords[3][0], lng: coords[3][1] },
      ],
      strokeColor: typeToColor[type],
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: newSpotColor,
      fillOpacity: 0.35,
      editable: true,
      draggable: true,
      geodesic: true,
    });
    window["spot" + spaceData[i].id].setMap(map);
    addSpaceListener(spaceData[i].id);
    if (spaceData[i].id > nextID) nextID = spaceData[i].id;
  }
  nextID++;
  numSpots = spaceData.length;

  setUpButtons();
}

// to listen for click events on a spot to change its type
function addSpaceListener(ID) {
  google.maps.event.addListener(window["spot" + ID], "click", function (event) {
    if (clickChoice == 2) {
      window["spot" + ID].setOptions({
        strokeColor: document.getElementById("TypeMenu").value,
      });
    }
  });
}

// upload spots to backend
function uploadSpots() {
  let body = {};
  body.id = lotID;
  body.owner = owner;
  body.url = youtubeURL;
  let spaces = [];
  for (let i = 0; i < spaceData.length; i++) {
    let spotID = spaceData[i].id;
    if (window["spot" + spotID] == undefined) continue; // ignore deleted spaces

    let coords = [];
    let path = window["spot" + spotID].getPath();
    for (let j = 0; j < 4; j++) {
      let coord = path.getAt(j);
      coords.push([coord.lat(), coord.lng()]);
    }
    spaceData[i].status = true;
    spaceData[i].mapcoords = coords;
    spaceData[i].camcoords = getUpdatedAnnotation(i);
    spaceData[i].type = colorToType[window["spot" + spotID].get("strokeColor")];

    spaces.push(spaceData[i]);
  }
  body.parking_spaces = spaces;
  body.w3c = activeAnnotations;
  let payload = {};
  payload.parking_lots = body;
  try {
    Post(postURL, payload);
    document.getElementById("SaveButton").textContent = "Save Successful";
    setTimeout(() => {
      document.getElementById("SaveButton").textContent = "Save Changes";
    }, 1000);
  } catch (e) {
    document.getElementById("SaveButton").textContent = "Save Failed!";
    setTimeout(() => {
      document.getElementById("SaveButton").textContent = "Save Changes";
    }, 2000);
  }
}

function refresh() {
  location.reload();
}
