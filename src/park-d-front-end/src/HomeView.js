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
    zoom:15,
    center:{lat:43.2609,lng:-79.9192},
    disableDefaultUI: true,
    styles: noPoi,
  }

var directionsRenderer;
var directionsService;
var clickOrigin;
var clickDestination;
var clickChoice = 0;
var routeMarkers = [];

var selectionToggle = false;

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
            directionsRenderer.setMap(map);
            getRoute();
            pickDone();
        }
    });

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
  getDocEle("spot_selection").style.display = selectionToggle ? "block" : "none";
  getDocEle("chevron_bg1").style.left = selectionToggle ? "405px" : "0px";
  getDocEle("chevron").style.transform = selectionToggle ? "scaleX(1)" : "scaleX(-1)";
}

function getDocEle(className) {
  return document.getElementsByClassName(className)[0];
}