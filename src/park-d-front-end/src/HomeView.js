// constants moved to constants.js

function Get(URL, body) {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("POST", URL, false);
  Httpreq.setRequestHeader("Content-Type", "application/json");
  Httpreq.send(JSON.stringify(body));
  return Httpreq.responseText;
}

var map;
var noPoi = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
];
var defaultOptions = {
  zoom: 17,
  center: { lat: 43.89043899872149, lng: -79.3134901958874 },
  disableDefaultUI: true,
  styles: noPoi,
};

var userMode = false;

var directionsRenderer;
var directionsService;
var clickOrigin;
var clickDestination;
var clickChoice = 0;
var routeMarkers = [];

var lotData;
var spotData = [];
var numSpots;

var lotID;
var lotOwner;

var intervalID;
var initialized = false;

var selectionToggle = false;
class ParkingSpot {
  constructor(id, open, coords) {
    this.id = id;
    this.open = open;
    this.coords = coords;
    this.handicapped = false;
    this.reserved = false;
  }
}

var parkingLayout = [
  new ParkingSpot(0, false, {
    lat: 43.890253243996334,
    lng: -79.31222457771726,
  }),
  new ParkingSpot(1, false, {
    lat: 43.890185447737366,
    lng: -79.31219053549394,
  }),
  new ParkingSpot(2, true, {
    lat: 43.890117651478391,
    lng: -79.312156493270621,
  }),
  new ParkingSpot(3, false, {
    lat: 43.890049855219424,
    lng: -79.312122451047301,
  }),
  new ParkingSpot(4, true, {
    lat: 43.889982058960449,
    lng: -79.312088408823996,
  }),
  new ParkingSpot(5, false, {
    lat: 43.889914262701481,
    lng: -79.312054366600677,
  }),
  new ParkingSpot(6, true, {
    lat: 43.889846466442506,
    lng: -79.312020324377357,
  }),
  new ParkingSpot(7, true, { lat: 43.88977867018354, lng: -79.31198628215404 }),
  new ParkingSpot(8, false, { lat: 43.89030310172601, lng: -79.3119914067898 }),
  new ParkingSpot(9, true, {
    lat: 43.890237943518422,
    lng: -79.311958462702719,
  }),
  new ParkingSpot(10, false, {
    lat: 43.890172785310824,
    lng: -79.311925518615638,
  }),
  new ParkingSpot(11, false, {
    lat: 43.890107627103234,
    lng: -79.311892574528557,
  }),
  new ParkingSpot(12, false, {
    lat: 43.890042468895643,
    lng: -79.311859630441461,
  }),
  new ParkingSpot(13, true, {
    lat: 43.889977310688053,
    lng: -79.311826686354379,
  }),
  new ParkingSpot(14, true, {
    lat: 43.889912152480456,
    lng: -79.311793742267298,
  }),
  new ParkingSpot(15, true, {
    lat: 43.889846994272865,
    lng: -79.31176079818022,
  }),
];

var analyticsData = [
  { name: "12am", occupancy: 0 },
  { name: "1am", occupancy: 0 },
  { name: "2am", occupancy: 0 },
  { name: "3am", occupancy: 0 },
  { name: "4am", occupancy: 0 },
  { name: "5am", occupancy: 5 },
  { name: "6am", occupancy: 15 },
  { name: "7am", occupancy: 35 },
  { name: "8am", occupancy: 40 },
  { name: "9am", occupancy: 50 },
  { name: "10am", occupancy: 80 },
  { name: "11am", occupancy: 90 },
  { name: "12pm", occupancy: 100 },
  { name: "1pm", occupancy: 100 },
  { name: "2pm", occupancy: 95 },
  { name: "3pm", occupancy: 80 },
  { name: "4pm", occupancy: 30 },
  { name: "5pm", occupancy: 35 },
  { name: "6pm", occupancy: 40 },
  { name: "7pm", occupancy: 40 },
  { name: "8pm", occupancy: 35 },
  { name: "9pm", occupancy: 20 },
  { name: "10pm", occupancy: 10 },
  { name: "11pm", occupancy: 0 },
];

function initMap() {
  initPage();

  directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
  });
  directionsService = new google.maps.DirectionsService();

  map = new google.maps.Map(document.getElementById("map"), defaultOptions);

  try {
    loadAllLots();
  } catch (e) {
    console.log(e);
    window.alert("Couldn't load parking lot locations.");
  }

  google.maps.event.addListener(map, "click", function (event) {
    if (clickChoice == 0) {
      clickOrigin = { coords: event.latLng };
      routeMarkers.push(
        placeMarker(clickOrigin.coords, "./Images/CarMarker.png")
      );
      pickDestination();
    } else if (clickChoice == 1) {
      // check clickDestination to be within bounds of parking lot
      clickDestination = { coords: event.latLng };
      directionsRenderer.setMap(map);
      getRoute();
      pickDone();
    }
  });
}

function initPage() {
  getDocEle("annotate_bg1").style.display = userMode ? "none" : "block";
  getDocEle("chevron_bg1").style.display = userMode ? "none" : "block";
  getDocEle("analytics_bg1").style.display = "none";
  getDocEle("spot_selection").style.display = "none";
  getDocEle("search_bar_bg1").style.display = userMode ? "block" : "none";

  updateSelection();
  updateAnalytics();
}

function pickDone() {
  clickChoice = -1;
  getDocEle("direction_guide").textContent = "Route Calculated";
}

function pickDestination() {
  clickChoice = 1;
  getDocEle("direction_guide").textContent = "Select Parking Lot";
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
  getDocEle("direction_guide").textContent = "Select your location";
  clearMarkers(routeMarkers);
  routeMarkers = [];
  directionsRenderer.setMap(null);
  recenter();
  if (selectionToggle) {
    toggleSelection();
  }
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

function getRoute() {
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
          "./Images/CarMarker.png"
        )
      );
      routeMarkers.push(
        placeMarker(
          response.routes[0].legs[0].end_location,
          "./Images/ParkingMarker.png"
        )
      );
    })
    .catch((e) => window.alert("Direction request failed."));
}

function toggleSelection() {
  selectionToggle = !selectionToggle;
  if (userMode) {
    getDocEle("spot_selection").style.display = selectionToggle
      ? "block"
      : "none";
    getDocEle("chevron_bg1").style.left = selectionToggle ? "405px" : "0px";
  } else {
    getDocEle("analytics_bg1").style.display = selectionToggle
      ? "block"
      : "none";
    getDocEle("chevron_bg1").style.left = selectionToggle ? "565px" : "0px";
  }
  getDocEle("chevron").style.transform = selectionToggle
    ? "scaleX(1)"
    : "scaleX(-1)";
}

function selectionSelect(id) {
  if (
    clickChoice != 2 ||
    id > parkingLayout.length ||
    !parkingLayout[id].open
  ) {
    return;
  }

  clickDestination = { coords: parkingLayout[id].coords };
  directionsRenderer.setMap(map);
  getRoute();
  pickDone();
  toggleSelection();
  parkingLayout[id].open = false;
  updateSelection();
}

function updateSelection() {
  var available = 0;
  for (let index = 0; index < parkingLayout.length; index++) {
    document.getElementById("parked_car" + index).style.background =
      parkingLayout[index].open ? "none" : "url(Images/parked_car.png)";
    if (parkingLayout[index].open) {
      available += 1;
    }
  }
  getDocEle("spot_selection_stats").textContent =
    available + " Spots Available";
  getDocEle("spot_availability_text").textContent =
    available + " Spots Available";
}

function updateAnalytics() {
  h = 0;
  maxH = 300;
  red = 0;
  green = 0;
  occupancyRate = 0;
  for (let index = 0; index < analyticsData.length; index++) {
    occupancyRate = analyticsData[index].occupancy / 100;
    h = occupancyRate * maxH;
    if (occupancyRate <= 0.5) {
      red = 2 * occupancyRate * 255;
      green = 255;
    } else {
      red = 255;
      green = (1 - 2 * occupancyRate) * 255;
    }
    document.getElementById("graph_bar" + index).style.height = h + "px";
    document.getElementById("graph_bar" + index).style.top = maxH - h + "px";
    document.getElementById("graph_bar" + index).style.background =
      "rgba(" + red + "," + green + "0,1)";
  }

  availability = [
    { number: 0, total: 0 },
    { number: 0, total: 0 },
    { number: 0, total: 0 },
  ];
  type = 0;
  for (let index = 0; index < parkingLayout.length; index++) {
    if (parkingLayout[index].handicapped) {
      type = 1;
    } else if (parkingLayout[index].reserved) {
      type = 2;
    } else {
      type = 0;
    }
    availability[type].total += 1;
    availability[type].number += parkingLayout[index].open ? 1 : 0;
  }
  totalSpots = 0;
  totalAvailable = 0;
  for (let index = 0; index < availability.length; index++) {
    document.getElementById("analytics_card" + index + "_total").textContent =
      "out of " + availability[index].total;
    document.getElementById("analytics_card" + index + "_number").textContent =
      availability[index].number;
    totalSpots += availability[index].total;
    totalAvailable += availability[index].number;
  }
  getDocEle("total_text").textContent =
    "TOTAL AVAILABLE - " + totalAvailable + "/" + totalSpots;
}

function getDocEle(className) {
  return document.getElementsByClassName(className)[0];
}

function loadAllLots() {
  lotData = JSON.parse(Get(allLotURL, {}))["parking_lots"];
  for (let i = 3; i < 5; i++) {
    body = {};
    body.parking_lot_id = lotData[i].id;
    body.owner = lotData[i].name;
    let spots = JSON.parse(Get(jsonURL, body))["parking_lots"]["parking_spaces"];
    window["lot" + lotData[i].name + lotData[i].id] = new google.maps.Circle({
      strokeColor: "#0000FF",
      fillColor: "#0000FF",
      map,
      center: {
        lat: spots[0].mapcoords[0][0],
        lng: spots[0].mapcoords[0][1],
      },
      radius: 10,
    });
    addLotListener(lotData[i].name, lotData[i].id);
  }
  body = {};
  body.parking_lot_id = lotData[46].id;
  body.owner = lotData[46].name;
  console.log(body)
  let spots = JSON.parse(Get(jsonURL, body))["parking_lots"]["parking_spaces"];
  window["lot" + lotData[46].name + lotData[46].id] = new google.maps.Circle({
    strokeColor: "#0000FF",
    fillColor: "#0000FF",
    map,
    center: {
      lat: spots[0].mapcoords[0][0],
      lng: spots[0].mapcoords[0][1],
    },
    radius: 10,
  });
  addLotListener(lotData[46].name, lotData[46].id);
}

function addLotListener(name, ID) {
  google.maps.event.addListener(
    window["lot" + name + ID],
    "click",
    function (event) {
      try {
        loadAllSpots(ID, name);
        window["lot" + name + ID].setMap(null);
      } catch (e) {
        window.alert("Couldn't load parking lot.");
      }
    }
  );
}

// loading all spots from remote
function loadAllSpots(ID, owner) {
  if (!initialized) {
    initialized = true;
  } else {
    window["lot" + lotOwner + lotID].setMap(map);
  }
  // remove old spaces and restore circle
  for (let i = 0; i < spotData.length; i++) {
    window["spot" + spotData[i].id].setMap(null);
  }

  lotID = ID;
  lotOwner = owner;
  body = {};
  body.parking_lot_id = ID;
  body.owner = owner;

  spotData = JSON.parse(Get(jsonURL, body))["parking_lots"]["parking_spaces"];
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
      geodesic: true,
    });
    window["spot" + spotData[i].id].status = true;
    window["spot" + spotData[i].id].setMap(map);
  }
  numSpots = spotData.length;
  clearInterval(intervalID);
  intervalID = setInterval(updateSpots, updateInterval);
}

function updateSpots() {
  body = {};
  body.parking_lot_id = lotID;
  body.owner = lotOwner;
  console.log(body);
  var spots = JSON.parse(Get(jsonURL, body))["parking_lots"]["parking_spaces"];
  for (let i = 0; i < spots.length; i++) {
    let spot = spots[i];
    if (!(spot.status === window["spot" + spot.id].status)) {
      window["spot" + spot.id].setOptions({
        fillColor: spot.status ? "#00FF00" : "#FF0000",
      });
      window["spot" + spot.id].status = spot.status;
    }
  }
}
