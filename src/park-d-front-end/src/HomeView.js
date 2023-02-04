var map;
var noPoi = [
    {
        featureType: "poi",
        stylers: [
          { visibility: "off" }
        ]   
      }
    ];
var defaultOptions = {
    zoom:17,
    center:{lat:43.89043899872149, lng:-79.3134901958874},
    disableDefaultUI: true,
    styles: noPoi,
  }

var userMode = false;

var directionsRenderer;
var directionsService;
var clickOrigin;
var clickDestination;
var clickChoice = 0;
var routeMarkers = [];

var selectionToggle = false;
class ParkingSpot
{
    constructor(id, open, coords)
    {
        this.id = id;
        this.open = open;
        this.coords = coords;
    }
}

var parkingLayout = [
    new ParkingSpot(0, false, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(1, false, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(2, true, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(3, false, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(4, true, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(5, false, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(6, true, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(7, true, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(8, false, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(9, true, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(10, false, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(11, false, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(12, false, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(13, true, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(14, true, {lat:43.89043899872149, lng:-79.3134901958874}),
    new ParkingSpot(15, true, {lat:43.89043899872149, lng:-79.3134901958874})
];

var analyticsData = [
    { name: "12am", occupancy: 1 },
    { name: "1am", occupancy: 1 },
    { name: "2am", occupancy: 1 },
    { name: "3am", occupancy: 1 },
    { name: "4am", occupancy: 1 },
    { name: "5am", occupancy: 1 },
    { name: "6am", occupancy: 2 },
    { name: "7am", occupancy: 3 },
    { name: "8am", occupancy: 4 },
    { name: "9am", occupancy: 5 },
    { name: "10am", occupancy: 8 },
    { name: "11am", occupancy: 9 },
    { name: "12pm", occupancy: 10 },
    { name: "1pm", occupancy: 9 },
    { name: "2pm", occupancy: 8 },
    { name: "3pm", occupancy: 5 },
    { name: "4pm", occupancy: 6 },
    { name: "5pm", occupancy: 7 },
    { name: "6pm", occupancy: 8 },
    { name: "7pm", occupancy: 9 },
    { name: "8pm", occupancy: 6 },
    { name: "9pm", occupancy: 3 },
    { name: "10pm", occupancy: 2 },
    { name: "11pm", occupancy: 1 }
];

function initMap(){
    directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
    directionsService = new google.maps.DirectionsService();

    map = new google.maps.Map(document.getElementById('map'), defaultOptions);
    google.maps.event.addListener(map, 'click', function(event){
        if (clickChoice == 0)
        {
            clickOrigin = {coords:event.latLng};
            routeMarkers.push(placeMarker(clickOrigin.coords, "./Images/CarMarker.png"));
              pickDestination();
        }
        else if (clickChoice == 1)
        {
            clickDestination = {coords:event.latLng};
            // directionsRenderer.setMap(map);
            // getRoute();
            // pickDone();
            // check clickDestination to be within bounds of parking lot
            toggleSelection();
            clickChoice = 2;
        }
    });

    initPage();
}

function initPage()
{
    getDocEle("chevron_bg1").style.display = userMode ? "none" : "block";
    getDocEle("analytics_bg1").style.display = "none";
    getDocEle("spot_selection").style.display = "none";
    getDocEle("search_bar_bg1").style.display = userMode ? "block" : "none";

    // toggleSelection();

    
    updateSelection();
}

function updateSelection()
{
    var available = 0;
    for (let index = 0; index < parkingLayout.length; index++)
    {
        document.getElementById("parked_car" + index).style.background = parkingLayout[index].open ? "none" : "url(Images/parked_car.png)";
        if (parkingLayout[index].open) {available += 1;}
    }
    getDocEle("spot_selection_stats").textContent = available + " Spots Available";
    getDocEle("spot_availability_text").textContent = available + " Spots Available";
}

function pickDone()
{
    clickChoice = -1;
    getDocEle("direction_guide").textContent = "Route Calculated";
}

function pickDestination()
{
    clickChoice = 1;
    getDocEle("direction_guide").textContent = "Select Destination";
}

function placeMarker(position, icon)
{
    marker = new google.maps.Marker({
        position: position,
        map:map,
        icon: icon,
      });
    return marker;
}

function resetData()
{
    clickChoice = 0;
    getDocEle("direction_guide").textContent = "Select your location";
    clearMarkers(routeMarkers);
    routeMarkers = [];
    directionsRenderer.setMap(null);
    recenter();
}

function recenter()
{
    map.setCenter(defaultOptions.center);
    map.setZoom(defaultOptions.zoom);
}

function clearMarkers(markers)
{
    for (let index = 0; index < markers.length; index++) {
        markers[index].setMap(null);
        markers[index] = null;
    }
}

function getRoute()
{
    directionsService
    .route({
            origin:clickOrigin.coords,
            destination:clickDestination.coords,
            travelMode:google.maps.TravelMode["DRIVING"],
    })
    .then((response) => {
        directionsRenderer.setDirections(response);
        clearMarkers(routeMarkers);
        routeMarkers = [];
        routeMarkers.push(placeMarker(response.routes[0].legs[0].start_location, "./Images/CarMarker.png"));
        routeMarkers.push(placeMarker(response.routes[0].legs[0].end_location, "./Images/ParkingMarker.png"));
    })
    .catch((e) => window.alert("Direction request failed."));
}

function toggleSelection()
{
  selectionToggle = !selectionToggle;
  if (userMode)
  {
    getDocEle("spot_selection").style.display = selectionToggle ? "block" : "none";
    getDocEle("chevron_bg1").style.left = selectionToggle ? "405px" : "0px";    
  }
  else
  {
    getDocEle("analytics_bg1").style.display = selectionToggle ? "block" : "none";
    getDocEle("chevron_bg1").style.left = selectionToggle ? "565px" : "0px";
  }
    getDocEle("chevron").style.transform = selectionToggle ? "scaleX(1)" : "scaleX(-1)";
}

function selectionSelect(id)
{
    if (clickChoice != 2 || id > parkingLayout.length || !parkingLayout[id].open) {return;}

    clickDestination = {coords:parkingLayout[id].coords};
    directionsRenderer.setMap(map);
    getRoute();
    pickDone();
    toggleSelection();
    parkingLayout[id].open = false;
    updateSelection();
}

function getDocEle(className) {
  return document.getElementsByClassName(className)[0];
}