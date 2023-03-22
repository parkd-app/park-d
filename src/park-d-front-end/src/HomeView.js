const jsonURL = "http://127.0.0.1:5000/rt_parking_info";
const setUpURL = "http://127.0.0.1:5000/set_up";

function Get(URL) {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", URL, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}

function setupBird() {
  setUpModel(setUpURL, "bird");
}

function setupSide() {
  setUpModel(setUpURL, "side");
}

function setUpModel(URL, angle) {
  fetch(URL + "?angle=" + angle, {
    method: "POST",
    headers: {
      Accept: "text/plain",
      "Content-Type": "text/plain",
    },
    body: "set me up",
  });
}

setInterval(updateSpots, 2000);

var map;
var noPoi = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
];
var defaultOptions = {
  zoom: 15,
  // center: { lat: 43.89043899872149, lng: -79.3134901958874 },
  center: { lat: 43.2617, lng: -79.9228 },

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
var locationNavigator;
var hasRoute = false;
const distanceTol = 5;
var targetSpot = -1;
var distMatrixservice;
const timeoutTol = 60;
var timeoutTime = -1;
const positionUpdateTime = 100;
var routeSteps = null;
const autoRouteDist = 0.00001; //Might need to tweek numbers to prevent skipping around, but it can't be perfect
var autoNavMode = true;
var autoNavComplete = false;

var birdSpotData;
var sideSpotData;
var numBirdSpots;
var numSideSpots;

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

const locationOptions = {
  maximumAge: Infinity,
  timeout: 5000,
  enableHighAccuracy: true,
};

function initMap() {
  initPage();

  directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
  });
  directionsService = new google.maps.DirectionsService();

  map = new google.maps.Map(document.getElementById("map"), defaultOptions);
  loadAllSpots();

  locationNavigator = navigator.geolocation;
  getDocEle("direction_guide").textContent = "Finding location";
  updatePosition();
  distMatrixservice = new google.maps.DistanceMatrixService();

  google.maps.event.addListener(map, "click", function (event) {
    if (clickChoice == 1) {
      // check clickDestination to be within bounds of parking lot
      clickDestination = { coords: event.latLng };
      directionsRenderer.setMap(map);
      hasRoute = true;
      // determine spot based on coords, check if click is within bounding box?
      targetSpot = 2;
      getDocEle("direction_guide").textContent = "Calculating Route";
      getRoute();
      pickDone();
    } else if (clickChoice == 2) {
      // parkingLayout[targetSpot].open = false;
      followPositionSuccess(event.latLng, 1);
    }
  });
}

function setTimeoutTime(response, status) {
  getDocEle("direction_guide").textContent =
    Math.floor(response.rows[0].elements[0].duration.value / 60) +
    "m " +
    (response.rows[0].elements[0].duration.value % 60) +
    "s Remaining";
  const d = new Date();
  timeoutTime =
    d.getTime() / 1000 +
    response.rows[0].elements[0].duration.value +
    timeoutTol;
  // timeoutTime = 1;
}

function initPage() {
  getDocEle("annotate_bg1").style.display = userMode ? "none" : "block";
  getDocEle("chevron_bg1").style.display = "block";
  getDocEle("analytics_bg1").style.display = "none";
  getDocEle("spot_selection").style.display = "none";
  getDocEle("search_bar_bg").style.display = userMode ? "block" : "none";

  updateSelection();
}

function pickDone() {
  clickChoice = 2;
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
  resetRoute(0);
  recenter();
  if (selectionToggle) {
    toggleSelection();
  }
}

function updateRoute() {
  directionsRenderer.setMap(null);
  directionsRenderer.setMap(map);
  const d = new Date();
  if (
    google.maps.geometry.spherical.computeDistanceBetween(
      clickOrigin.coords,
      clickDestination.coords
    ) < distanceTol
  ) {
    resetRoute(1);
  } else if (!parkingLayout[targetSpot].open) {
    resetRoute(2);
  } else if (timeoutTime != -1 && d.getTime() / 1000 > timeoutTime) {
    resetRoute(3);
  } else {
    getRoute();
  }
}

function resetRoute(resetReason) {
  clickChoice = 0;
  targetSpot = -1;
  hasRoute = false;
  timeoutTime = -1;
  autoNavComplete = false;
  clearMarkers(routeMarkers);
  routeMarkers = [];
  directionsRenderer.setMap(null);
  clickDestination = null;

  if (resetReason == 0) {
    reason = "Finding location";
  } else if (resetReason == 1) {
    reason = "Destination Reached";
    if (autoNavMode) {
      autoNavComplete = true;
    }
  } else if (resetReason == 2) {
    reason = "Selected Spot Taken";
  } else if (resetReason == 3) {
    reason = "Timeout";
  }

  getDocEle("direction_guide").textContent = reason;
  clickChoice = 1;
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

      routeSteps = response.routes[0].legs[0].steps;
      if (!autoNavMode || routeSteps.length == 1) {
        routeSteps = clickDestination;
      } else {
        routeSteps = {
          coords: new google.maps.LatLng(
            routeSteps[1].start_point.lat(),
            routeSteps[1].start_point.lng()
          ),
        };
      }

      if (routeMarkers.length == 0) {
        routeMarkers.push(
          placeMarker(
            response.routes[0].legs[0].start_location,
            "./Images/CarMarker.png"
          )
        );
      } else {
        routeMarkers[0].setPosition(response.routes[0].legs[0].start_location);
      }

      if (routeMarkers.length == 1) {
        routeMarkers.push(
          placeMarker(
            response.routes[0].legs[0].end_location,
            "./Images/ParkingMarker.png"
          )
        );
      }

      distMatrixservice.getDistanceMatrix(
        {
          origins: [response.routes[0].legs[0].start_location],
          destinations: [response.routes[0].legs[0].end_location],
          travelMode: "DRIVING",
        },
        setTimeoutTime
      );
    });
}

function currentPositionSuccess(position) {
  if (!autoNavMode && !autoNavComplete) {
    clickOrigin = {
      coords: new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      ),
    };
  }
  if (routeMarkers.length == 0) {
    routeMarkers.push(
      placeMarker(clickOrigin.coords, "./Images/CarMarker.png")
    );
  } else {
    routeMarkers[0].setPosition(clickOrigin.coords);
  }
  pickDestination();
}

function currentPositionFailure() {
  clickChoice = -1;
  getDocEle("direction_guide").textContent = "Navigation Disabled";
}

function followPositionSuccess(position, fromClick = 0) {
  if (!hasRoute) {
    return;
  }
  if (fromClick == 0) {
    //from watcher
    if (autoNavMode) {
      dirLat = routeSteps.coords.lat() - clickOrigin.coords.lat();
      dirLng = routeSteps.coords.lng() - clickOrigin.coords.lng();
      mag = Math.sqrt(Math.pow(dirLat, 2) + Math.pow(dirLng, 2));
      dirLat = dirLat / mag;
      dirLng = dirLng / mag;
      dirLat = clickOrigin.coords.lat() + dirLat * autoRouteDist;
      dirLng = clickOrigin.coords.lng() + dirLng * autoRouteDist;
      clickOrigin = { coords: new google.maps.LatLng(dirLat, dirLng) };
    } else {
      clickOrigin = {
        coords: new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        ),
      };
    }
  } else {
    clickOrigin = {
      coords: new google.maps.LatLng(position.lat(), position.lng()),
    };
  }
  updateRoute();
}

function followPositionFailure() {
  clickChoice = -1;
  getDocEle("direction_guide").textContent = "Navigation Disabled";
}

function updatePosition() {
  if (!hasRoute) {
    locationNavigator.getCurrentPosition(
      currentPositionSuccess,
      currentPositionFailure,
      locationOptions
    );
  } else {
    locationNavigator.getCurrentPosition(
      followPositionSuccess,
      followPositionFailure,
      locationOptions
    );
  }
  setTimeout(updatePosition, positionUpdateTime);
}

function toggleSelection() {
  selectionToggle = !selectionToggle;
  let selectionTogglePos = window.innerWidth <= 750 ? "90vw" : "30vw";
  if (userMode) {
    getDocEle("spot_selection").style.display = selectionToggle
      ? "block"
      : "none";
    getDocEle("analytics_bg1").style.display = selectionToggle
      ? "block"
      : "none";
    getDocEle("analytics_bg1").style.right = 0;
    getDocEle("chevron_bg1").style.left = selectionToggle ? "26.5vw" : "0px";
  } else {
    getDocEle("analytics_bg1").style.display = selectionToggle
      ? "block"
      : "none";
    getDocEle("chevron_bg1").style.left = selectionToggle
      ? selectionTogglePos
      : "0px";
  }
  getDocEle("chevron").style.transform = selectionToggle
    ? "scaleX(1)"
    : "scaleX(-1)";
}

function updateChevronPos() {
  let selectionTogglePos = window.innerWidth <= 750 ? "90vw" : "30vw";
  if (userMode) {
    getDocEle("chevron_bg1").style.left = selectionToggle ? "26.5vw" : "0px";
  } else {
    getDocEle("chevron_bg1").style.left = selectionToggle
      ? selectionTogglePos
      : "0px";
  }
}

window.onresize = updateChevronPos;

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

function getDocEle(className) {
  return document.getElementsByClassName(className)[0];
}

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

function updateSpots() {
  var json_obj = JSON.parse(Get(jsonURL + "?angle=bird"))["parking_spaces"];
  for (let i = 0; i < json_obj.length; i++) {
    let spot = json_obj[i];
    if (!(spot.open === window["bspot" + spot.id].open)) {
      window["bspot" + spot.id].setOptions({
        strokeColor: spot.open ? "#00FF00" : "#FF0000",
        fillColor: spot.open ? "#00FF00" : "#FF0000",
      });
      window["bspot" + spot.id].open = spot.open;
    }
  }
  json_obj = JSON.parse(Get(jsonURL + "?angle=side"))["parking_spaces"];
  for (let i = 0; i < json_obj.length; i++) {
    let spot = json_obj[i];
    if (!(spot.open === window["sspot" + spot.id].open)) {
      console.log(spot.id);
      window["sspot" + spot.id].setOptions({
        strokeColor: spot.open ? "#00FF00" : "#FF0000",
        fillColor: spot.open ? "#00FF00" : "#FF0000",
      });
      window["sspot" + spot.id].open = spot.open;
    }
  }
}

function analytics(data) {
  document.getElementById("location_name").innerHTML = data.location.name;
  document.getElementById("location_address").innerHTML = data.location.address;

  const occupancy = data.occupancy;

  [time, day] = getDateAndTime();

  document.getElementById("last_updated_text").innerHTML =
    "Last Updated - " + day + " @ " + time;

  let hours = [];
  let occupied = [];
  let backgroundColours = [];
  let totalSpots = 0;

  let numEntries = 0;

  occupancy.forEach(() => numEntries++);

  if (numEntries !== 24) {
    document.getElementById("analytics_cards_bg").style.visibility = "hidden";

    document.getElementById("total_text").innerHTML =
      "We are crunching these numbers for you... Come back soon!";
  } else {
    occupancy.forEach((f) => {
      resSpots = f.occupancy.res.length;
      accSpots = f.occupancy.acc.length;
      stdSpots = f.occupancy.std.length;

      totalSpots = resSpots + accSpots + stdSpots;

      resAvail = resSpots - f.occupancy.res.filter(Boolean).length;
      accAvail = accSpots - f.occupancy.acc.filter(Boolean).length;
      stdAvail = stdSpots - f.occupancy.std.filter(Boolean).length;

      totalAvail = resAvail + accAvail + stdAvail;

      if (f.hour === time) {
        document.getElementById("res_number").innerHTML = resAvail;
        document.getElementById("acc_number").innerHTML = accAvail;
        document.getElementById("std_number").innerHTML = stdAvail;

        document.getElementById("res_total").innerHTML = "out of " + resSpots;
        document.getElementById("acc_total").innerHTML = "out of " + accSpots;
        document.getElementById("std_total").innerHTML = "out of " + stdSpots;

        document.getElementById("total_text").innerHTML =
          "TOTAL AVAILABLE - " + totalAvail + "/" + totalSpots;
        document.getElementById("spot_selection_stats").innerHTML =
          totalAvail + " Spots Available";
      }

      totalOccupied = totalSpots - totalAvail;
      ratio = totalOccupied / totalAvail;

      hours.push(f.hour);
      occupied.push(totalOccupied);

      backgroundColours.push(generateColour(ratio));
    });

    drawGraph(hours, occupied, backgroundColours, totalSpots);
  }
}

function getDateAndTime() {
  let dateTime = new Date();
  let dateTimeSplit = dateTime.toString().split(" ");

  let time = parseInt(dateTimeSplit[4].split(":")[0]);

  if (time == 0) time = "12am";
  else if (time > 12) time = (time % 12) + "pm";
  else time += "am";

  let day = dateTimeSplit[1] + " " + dateTimeSplit[2] + ", " + dateTimeSplit[3];

  return [time, day];
}

function generateColour(ratio) {
  const colours = [
    "#61FF00",
    "#CCFF00",
    "#FFE600",
    "#FF8A00",
    "#FF0000",
    "#FF0F0F",
  ];

  let backgroundColour = colours[5];

  if (ratio < 0.1) backgroundColour = colours[0];
  else if (ratio < 0.25) backgroundColour = colours[1];
  else if (ratio < 0.45) backgroundColour = colours[2];
  else if (ratio < 0.6) backgroundColour = colours[3];
  else backgroundColour = colours[4];

  return backgroundColour;
}

function drawGraph(labels, data, backgroundColours, totalSpots) {
  var ctx = document.getElementById("analyticsGraph");

  var analyticsGraph = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColours,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: totalSpots,
        },
      },
    },
  });
}
