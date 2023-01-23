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
    styles: noPoi
  }
var mapBounds;

var directionsRenderer;
var directionsService;

var clickOrigin;
var clickDestination;
var clickChoice = 0;
var routeMarkers = [];

function initMap(){
    directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
    directionsService = new google.maps.DirectionsService();

    map = new google.maps.Map(document.getElementById('map'), defaultOptions);
    mapBounds = new google.maps.LatLngBounds();

    google.maps.event.addListener(map, 'click', function(event){
        if (clickChoice == 0)
        {
            clickOrigin = {coords:event.latLng};
            routeMarkers.push(placeMarker(clickOrigin.coords, "./CarMarker.png"));
              pickDestination();
        }
        else if (clickChoice == 1)
        {
            clickDestination = {coords:event.latLng};
            directionsRenderer.setMap(map);
            getRoute(directionsRenderer, directionsService);
            pickDone();
        }
    });

}

function pickDone()
{
    clickChoice = -1;
    document.getElementById("PickLabel").textContent = "Route Calculated";
    document.getElementById("ResetRouteButton").disabled = false;
}

function pickDestination()
{
    clickChoice = 1;
    document.getElementById("PickLabel").textContent = "Choose Destination";
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
    document.getElementById("PickLabel").textContent = "Choose Origin";
    document.getElementById("ResetRouteButton").disabled = true;
    clearMarkers(routeMarkers);
    routeMarkers = [];
    directionsRenderer.setMap(null);
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

function getRoute(directionsRenderer, directionsService)
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
        routeMarkers.push(placeMarker(response.routes[0].legs[0].start_location, "./CarMarker.png"));
        routeMarkers.push(placeMarker(response.routes[0].legs[0].end_location, "./ParkingMarker.png"));
    })
    .catch((e) => window.alert("Direction request failed."));

}