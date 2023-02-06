// json parsing
const jsonURL = "http://127.0.0.1:5000/rt_parking_info";
const postURL = "http://127.0.0.1:5000/post_coord";
const setUpURL = "http://127.0.0.1:5000/set_up";

function Get(URL) {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", URL, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}

function setUpModel(URL) {
  fetch(URL + "?angle=bird", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  fetch(URL + "?angle=side", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

function Put(URL, content) {
  fetch(URL, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
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

// update status every 2 seconds
setInterval(updateSpots, 2000);

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

var directionsRenderer;
var directionsService;

var clickOrigin;
var clickDestination;
var clickChoice = 0;
var routeMarkers = [];

var adding = false;
var pointsClicked = 0;
var corners = [];

var birdSpotData;
var sideSpotData;
var numBirdSpots;
var numSideSpots;
var initialSpots = 0;

function initMap() {
  directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
  });
  directionsService = new google.maps.DirectionsService();

  map = new google.maps.Map(document.getElementById("map"), defaultOptions);
  mapBounds = new google.maps.LatLngBounds();

  // load and put spots
  loadAllSpots();

  google.maps.event.addListener(map, "click", function (event) {
    if (clickChoice == 0) {
      clickOrigin = { coords: event.latLng };
      routeMarkers.push(placeMarker(clickOrigin.coords, "./CarMarker.png"));
      pickDestination();
    } else if (clickChoice == 1) {
      clickDestination = { coords: event.latLng };
      directionsRenderer.setMap(map);
      getRoute(directionsRenderer, directionsService);
      pickDone();
    } else if (clickChoice == 2) {
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

function pickDone() {
  clickChoice = -1;
  document.getElementById("PickLabel").textContent = "Route Calculated";
  document.getElementById("ResetRouteButton").disabled = false;
}

function pickDestination() {
  clickChoice = 1;
  document.getElementById("PickLabel").textContent = "Choose Destination";
}

function placeMarker(position, icon) {
  marker = new google.maps.Marker({
    position: position,
    map: map,
    icon: icon,
  });
  return marker;
}

function resetData() {
  clickChoice = 0;
  document.getElementById("PickLabel").textContent = "Choose Origin";
  document.getElementById("ResetRouteButton").disabled = true;
  clearMarkers(routeMarkers);
  routeMarkers = [];
  directionsRenderer.setMap(null);
}

function recenter() {
  map.setCenter(defaultOptions.center);
  map.setZoom(defaultOptions.zoom);
}

function clearMarkers(markers) {
  for (let index = 0; index < markers.length; index++) {
    markers[index].setMap(null);
    markers[index] = null;
  }
}

function getRoute(directionsRenderer, directionsService) {
  directionsService
    .route({
      origin: clickOrigin.coords,
      destination: clickDestination.coords,
      travelMode: google.maps.TravelMode["DRIVING"],
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
      clearMarkers(routeMarkers);
      routeMarkers = [];
      routeMarkers.push(
        placeMarker(
          response.routes[0].legs[0].start_location,
          "./CarMarker.png"
        )
      );
      routeMarkers.push(
        placeMarker(
          response.routes[0].legs[0].end_location,
          "./ParkingMarker.png"
        )
      );
    })
    .catch((e) => window.alert("Direction request failed."));
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
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    editable: true,
    draggable: true,
    geodesic: true,
  });
  window["spot" + numSpots].setMap(map);
  numSpots++;
}

// loading all spots from remote
function loadAllSpots() {
  birdSpotData = JSON.parse(Get(jsonURL + "?angle=bird"))["parking_spaces"];
  sideSpotData = JSON.parse(Get(jsonURL + "?angle=side"))["parking_spaces"];
  numBirdSpots = birdSpotData.length;
  numSideSpots = sideSpotData.length;

  for (let i = 0; i < numBirdSpots; i++) {
    let coords = birdSpotData[i].corners;
    let open = birdSpotData[i].open;

    // spots are stored here, by ID
    window["bspot" + birdSpotData[i].id] = new google.maps.Polygon({
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
      clickable: false,
      geodesic: true,
    });
    window["bspot" + birdSpotData[i].id].setMap(map);
  }
  for (let i = 0; i < numSideSpots; i++) {
    let coords = sideSpotData[i].corners;
    let open = sideSpotData[i].open;

    // spots are stored here, by ID
    window["sspot" + sideSpotData[i].id] = new google.maps.Polygon({
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
      clickable: false,
      geodesic: true,
    });
    window["sspot" + sideSpotData[i].id].setMap(map);
  }
}

function uploadSpots() {
  for (let i = 0; i < numBirdSpots; i++) {
    let coords = [];
    let path = window["bspot" + birdSpotData[i].id].getPath();
    for (let j = 0; j < 4; j++) {
      let coord = path.getAt(j);
      coords.push([coord.lat(), coord.lng()]);
    }
    birdSpotData[i].corners = coords;
    Post(postURL + "?angle=bird");
  }
  for (let i = 0; i < numSideSpots; i++) {
    let coords = [];
    let path = window["sspot" + sideSpotData[i].id].getPath();
    for (let j = 0; j < 4; j++) {
      let coord = path.getAt(j);
      coords.push([coord.lat(), coord.lng()]);
    }
    sideSpotData[i].corners = coords;
    Post(postURL + "?angle=side");
  }
  // for (let i = initialSpots; i < numSpots; i++) {
  //   let coords = [];
  //   let path = window["spot" + i].getPath();
  //   for (let j = 0; j < 4; j++) {
  //     let coord = path.getAt(j);
  //     coords.push([coord.lat(), coord.lng()]);
  //   }
  //   spotData[i] = {};
  //   spotData[i].id = i;
  //   spotData[i].coordinates = [];
  //   spotData[i].corners = coords;
  //   spotData[i].open = false;
  //   Post(jsonURL, spotData[i]);
  // }
  document.getElementById("SaveButton").textContent = "Save Successful";
  setTimeout(() => {
    document.getElementById("SaveButton").textContent = "Save Changes";
  }, 1000);
}

// check json for changes in occupancy
// a refresh is needed for new spots or changed coordinates
function updateSpots() {
  let json_obj = JSON.parse(Get(jsonURL));
  for (let i = 0; i < json_obj.length; i++) {
    let spot = json_obj[i];
    if (!(spot.open === window["spot" + spot.id].open)) {
      window["spot" + spot.id].setOptions({
        strokeColor: spot.open ? "#00FF00" : "#FF0000",
        fillColor: spot.open ? "#00FF00" : "#FF0000",
      });
      window["spot" + spot.id].open = spot.open;
    }
  }
}
