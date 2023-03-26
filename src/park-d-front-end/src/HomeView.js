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
  zoom: 15,
  center: { lat: 43.889901600142586, lng: -79.31179722822955 },

  disableDefaultUI: true,
  styles: noPoi,
};

var userMode = true;

var directionsRenderer;
var directionsService;
var clickOrigin;
var clickDestination;
var clickChoice = 0;
var routeMarkers = [];
var locationNavigator;
var navDisable = false;
var hasRoute = false;
const distanceTol = 5;
var targetSpot = -1;
var distMatrixservice;
const timeoutTol = 60;
var timeoutTime = -1;
const positionUpdateTime = 500;
var routeSteps = null;
const autoRouteDist = 0.00005; //Might need to tweek numbers to prevent skipping around, but it can't be perfect
var autoNavMode = false;
var autoNavComplete = false;

var lotData;
var spotData = [];
var numSpots;

var lotID;
var lotOwner;

var intervalID;
var initialized = false;

var selectionToggle = false;
var selection;
var parkingLayoutIds = [];

var authorized;

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

  try {
    loadAllLots();

    if (!userMode) {
      disableNavigation();
      return;
    }

    locationNavigator = navigator.geolocation;
    getDocEle("direction_guide").textContent = "Finding location";
    updatePosition();
    distMatrixservice = new google.maps.DistanceMatrixService();
  } catch (e) {
    console.log(e);
    window.alert("Couldn't load parking lot locations.");
  }

  google.maps.event.addListener(map, "click", function (event) {
    if (clickChoice == 1) {
      selection = verifySpotSelect(event.latLng);
      if (selection == -1) {
        getDocEle("direction_guide").textContent = "Invalid Spot";
        return;
      } else if (!window[parkingLayoutIds[selection]].status) {
        getDocEle("direction_guide").textContent = "Spot taken";
        return;
      }
      else {
        if (window[parkingLayoutIds[selection]].type != 0 && !authorized) {
          getDocEle("direction_guide").textContent = "Not authorized";
          return;
        }
        clickDestination = { coords: event.latLng };
        confirmSpotSelect();
      }
    } else if (clickChoice == 2) {
      // window[targetSpot].open = false;
      // followPositionSuccess(event.latLng, 1);
    }
  });
}

function verifySpotSelect(dest) {
  dest = new google.maps.LatLng(dest.lat(), dest.lng());
  console.log(parkingLayoutIds.length);
  for (let index = 0; index < parkingLayoutIds.length; index++) {
    console.log(parkingLayoutIds[index]);
    poly = window[parkingLayoutIds[index]];
    console.log(poly)
    contains = google.maps.geometry.poly.containsLocation(dest, poly);
    if (contains) {
      console.log(index)
      return index;
    }
  }
  return -1;
}

function confirmSpotSelect() {
  directionsRenderer.setMap(map);
  hasRoute = true;
  console.log(selection)
  targetSpot = parkingLayoutIds[selection];
  getDocEle("direction_guide").textContent = "Calculating Route";
  getRoute();
  pickDone();
}

function setTimeoutTime(response, status) {
  if (!hasRoute) {
    return;
  }
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
  authorized = confirm("Confirm that you are authorized to use restricted spaces, or Cancel if you are not.")
  console.log(userMode);
  getDocEle("analytics_bg1").style.display = "none";

  getDocEle("nav-button").style.display = userMode ? "none" : "block";
  getDocEle("loginView").style.display = userMode ? "block" : "none";
  getDocEle("search_bar_bg").style.display = userMode ? "block" : "none";
  getDocEle("annotate").style.display = userMode ? "none" : "block";
  // getDocEle("adminMap").style.display = userMode ? "none" : "block";
  // document.getElementById("SetupBirdButton").style.display = userMode
  //   ? "none"
  //   : "block";
  // document.getElementById("SetupSideButton").style.display = userMode
  //   ? "none"
  //   : "block";

  // getDocEle("header-center").style.margin = userMode
  //   ? "0 0 0 40%"
  //   : "0 0 0 42.5%";
}

function pickDone() {
  clickChoice = 2;
  getDocEle("direction_guide").textContent = "Route Calculated";
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
}

function updateRoute() {
  directionsRenderer.setMap(null);
  directionsRenderer.setMap(map);
  const d = new Date();
  console.log(targetSpot)
  if (
    google.maps.geometry.spherical.computeDistanceBetween(
      clickOrigin.coords,
      clickDestination.coords
    ) < distanceTol
  ) {
    resetRoute(1);
  } else if (!window[targetSpot].status) {
    resetRoute(2);
  } else if (timeoutTime != -1 && d.getTime() / 1000 > timeoutTime) {
    resetRoute(3);
  } else {
    getRoute();
  }
}

function resetRoute(resetReason) {
  console.log("route reset");
  clickChoice = navDisable ? -1 : 1;
  targetSpot = -1;
  hasRoute = false;
  timeoutTime = -1;
  autoNavComplete = false;
  clearMarkers(routeMarkers);
  routeMarkers = [];
  directionsRenderer.setMap(null);
  clickDestination = null;
  routeSteps = null;

  if (resetReason == 0) {
    reason = navDisable ? "Navigation Disabled" : "Select Parking Lot";
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
  if (!autoNavMode || (autoNavMode && !autoNavComplete)) {
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
    defaultOptions.center = clickOrigin.coords;
    recenter();
  } else {
    routeMarkers[0].setPosition(clickOrigin.coords);
  }

  if (getDocEle("direction_guide").textContent == "Finding location") {
    getDocEle("direction_guide").textContent = "Select Parking Spot";
    clickChoice = 1;
  }
}

function currentPositionFailure() {
  disableNavigation();
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
  disableNavigation();
}

function disableNavigation() {
  clickChoice = -1;
  getDocEle("direction_guide").textContent = "Navigation Disabled";
  navDisable = true;
}

function updatePosition() {
  if (navDisable) {
    return;
  }
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
  getDocEle("chevron_bg").style.right = selectionToggle
    ? selectionTogglePos
    : "0px";

  getDocEle("analytics_bg1").style.right = 0;
  getDocEle("analytics_bg1").style.display = selectionToggle ? "block" : "none";
  getDocEle("chevron").style.transform = selectionToggle
    ? "scaleX(1)"
    : "scaleX(-1)";
}

function updateChevronPos() {
  let selectionTogglePos = window.innerWidth <= 750 ? "90vw" : "30vw";
  getDocEle("chevron_bg").style.right = selectionToggle
    ? selectionTogglePos
    : "0px";
}

window.onresize = updateChevronPos;

function getDocEle(className) {
  return document.getElementsByClassName(className)[0];
}

function loadAllLots() {
  lotData = JSON.parse(Get(allLotURL, {}))["parking_lots"];
  for (let i = 3; i < 5; i++) {
    body = {};
    body.id = lotData[i].id;
    body.name = lotData[i].name;
    let spots = JSON.parse(Get(prevLayoutURL, body))["result"]["parking_lots"]["parking_spaces"];
    window["lot" + lotData[i].name + lotData[i].id] = new google.maps.Circle({
      strokeColor: "#0000FF",
      fillColor: "#0000FF",
      map,
      center: {
        lat: spots[0].mapcoords[0][0],
        lng: spots[0].mapcoords[0][1],
      },
      radius: 20,
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
    radius: 20,
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
      clickable: false,
    });
    window["spot" + spotData[i].id].status = open;
    window["spot" + spotData[i].id].type = type;
    window["spot" + spotData[i].id].setMap(map);
    parkingLayoutIds.push("spot" + spotData[i].id);
  }
  reloadAnalytics();
  numSpots = spotData.length;
  clearInterval(intervalID);
  intervalID = setInterval(updateSpots, updateInterval);
}

function updateSpots() {
  body = {};
  body.id = lotID;
  body.name = lotOwner;
  console.log(body);
  var spots = JSON.parse(Get(prevLayoutURL, body))["result"]["parking_lots"]["parking_spaces"];
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

function reloadAnalytics() {
  // lotID and lotOwner are global variables
  let theID = lotID;
  let theOwner = lotOwner; 
}