// json parsing
const jsonURL = 'http://localhost:8000/parking_spaces'
function Get(jsonURL){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",jsonURL,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

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
    zoom:19,
    center:{lat:43.8899806,lng:-79.3120005},
    styles: noPoi
  }
var mapBounds;

var directionsRenderer;
var directionsService;

var clickOrigin;
var clickDestination;
var clickChoice = 0;
var routeMarkers = [];

var polygon;
var adding = false;
var numSpots = 0;

const spotWidth = 0.000025;
const spotLength = 0.00007;
const spotAngle = 109;

function initMap(){
    directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
    directionsService = new google.maps.DirectionsService();

    map = new google.maps.Map(document.getElementById('map'), defaultOptions);
    mapBounds = new google.maps.LatLngBounds();

    let json_obj = JSON.parse(Get(jsonURL));
    console.log(json_obj);
    loadSpots(json_obj)

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
        else if (clickChoice == 2)
        {
            putSpot(event.latLng.lat(), event.latLng.lng());
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

function resetSpot()
{
    document.getElementById("AddSpotButton").textContent = "Add Parking Spot";
    resetData();
}

// initiating placing spot from ui
function addSpot()
{
    if (!adding)
    {
        adding = true;
        clickChoice = 2;
        document.getElementById("PickLabel").textContent = "Click to add a spot";
        document.getElementById("AddSpotButton").textContent = "Done";
    }
    else
    {
        adding = false;
        clickChoice = 0;
        resetSpot();
    }
}

// admin placing spot
function putSpot(lat, lng)
{
    eventLat = lat;
    eventLng = lng;
    point2 = [eventLat+spotWidth*Math.sin(spotAngle*Math.PI/180), eventLng+spotWidth*Math.cos(spotAngle*Math.PI/180)]
    
    // strangely not 90 degree adjustment
    point3 = [point2[0]+spotLength*Math.sin((spotAngle+85)*Math.PI/180), point2[1]+spotLength*Math.cos((spotAngle+85)*Math.PI/180)]
    point4 = [point3[0]+spotWidth*Math.sin((spotAngle+180)*Math.PI/180), point3[1]+spotWidth*Math.cos((spotAngle+180)*Math.PI/180)]
    
    window['spot'+numSpots] = new google.maps.Polygon({
        paths: [
            { lat: eventLat, lng: eventLng },
            { lat: point2[0], lng: point2[1] },
            { lat: point3[0], lng: point3[1] },
            { lat: point4[0], lng: point4[1] },
        ],
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        editable: true,
        draggable: true,
        geodesic: true
    });
    window['spot'+numSpots].setMap(map);
    numSpots += 1;
}

// loading all spots from remote
function loadSpots(spots)
{
    for (let i = 0; i < spots.length; i++) {
        let coords = spots[i].corners;
        let open = spots[i].open;
        window['spot'+numSpots] = new google.maps.Polygon({
            paths: [
                { lat: coords[0][0], lng: coords[0][1] },
                { lat: coords[1][0], lng: coords[1][1] },
                { lat: coords[2][0], lng: coords[2][1] },
                { lat: coords[3][0], lng: coords[3][1] },
            ],
            strokeColor: open ? "#00FF00": "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: open ? "#00FF00": "#FF0000",
            fillOpacity: 0.35,
            editable: true,
            draggable: true,
            geodesic: true
        });
        window['spot'+numSpots].setMap(map);
        numSpots += 1;
    }
}