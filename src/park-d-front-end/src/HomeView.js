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

var selectionToggle = false;

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