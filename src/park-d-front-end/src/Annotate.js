// constants moved to constants.js

var activeAnnotations = [];
var lotData = [];
var spotData = [];
var lotURL;

var activeLot;
var lotOwner;

function Get(URL, payload) {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("POST", URL, false);
  Httpreq.setRequestHeader("Content-Type", "application/json");
  Httpreq.send(JSON.stringify(payload));
  // console.log(Httpreq.responseText);
  return Httpreq.responseText;
}

function GetParam(URL, param) {
  const params = {
    name: param,
  };
  const options = {
    method: "POST",
    body: JSON.stringify(params),
  };
  fetch(URL, options)
    .then((response) => response.json())
    .then((response) => {
      return response.json();
    });
}

function Post(URL, payload) {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("POST", URL, false);
  Httpreq.setRequestHeader("Content-Type", "application/json");
  Httpreq.send(JSON.stringify(payload));
  return Httpreq.responseText;
}

function loadAnnotations(newLot, image) {
  if (newLot) {
    owner = document.getElementById("NewOwnerBox").value;
    lotURL = document.getElementById("URLBox").value;
    lotID = 1;
  } else {
    lotID = parseInt(document.getElementById("IDBox").value);
    owner = document.getElementById("OwnerBox").value;
    payload = {};
    payload.id = lotID;
    payload.name = owner;
    lotData = JSON.parse(Get(prevLayoutURL, payload)).result;
    lotURL = lotData.parking_lots.url;
  }
  activeLot = lotID;
  lotOwner = owner;
  image.src = getSnapshot(lotURL);
  anno.setAnnotations(loadBirdAnn(activeLot));
}

function createAnnotation(annotation, currAnnotations) {
  if (activeAnnotations == null) {
    activeAnnotations = [];
  }
  var maxId = 0;
  let newId = 0;
  //  find highest id for current annotations
  if (currAnnotations.length > 1) {
    for (i = 0; i < currAnnotations.length; i++) {
      annId = currAnnotations[i].id;
      if (annId > maxId) {
        maxId = annId;
      }
    }
    newId = maxId + 1;
  } else {
    newId = 0;
    annotation.id = 0;
  }
  console.log(annotation);
  annotation.id = newId;
  annotation.lot = activeLot;
  annotation.owner = lotOwner;
  annotation.spotType = 0;
  annotation.body.purpose = "commenting";
  activeAnnotations.push(annotation);

  let newSpot = {};
  newSpot.id = newId;
  newSpot.status = true;
  newSpot.camcoords = w3cCoords(annotation);
  newSpot.mapcoords = [];
  newSpot.type = 0;
  if (spotData == null) {
    spotData = [];
    spotData[0] = newSpot;
  } else {
    spotData[spotData.length] = newSpot;
  }
}

function deleteAnnotation(annotation, currAnnotations) {
  var annId = annotation.id;
  console.log("annId = " + annId);
  for (i = 0; i < activeAnnotations.length; i++) {
    if (activeAnnotations[i].id == annId) {
      activeAnnotations.splice(i, 1);
      console.log(activeAnnotations);
    }
  }
  var index;
  for (i = 0; i < spotData.length; i++) {
    if (spotData[i].id == annId) {
      index = i;
    }
  }
  spotData.splice(index, 1);
  anno.setAnnotations(activeAnnotations);
}

function updateAnnotation(annotation, previous, currAnnotations) {
  for (i = 0; i < activeAnnotations.length; i++) {
    if (activeAnnotations[i].id == previous.id) {
      activeAnnotations[i] = annotation;
    }
  }
  anno.setAnnotations(activeAnnotations);
  updateCamcoords(annotation, previous);
}

function updateCamcoords(annotation, previous) {
  annId = annotation.id;
  var index;
  for (i = 0; i < spotData.length; i++) {
    if (spotData[i].id == annId) {
      index = i;
    }
  }
  spotData[index].status = true;
  spotData[index].camcoords = w3cCoords(annotation);
}

function checkIntersection(selection) {
  if (activeAnnotations == null) {
    return false;
  }
  var intExist = false;
  selectionCoords = w3cToSide(selection);
  if (selectionCoords.length != 4) {
    return true;
  }
  console.log(JSON.stringify(selectionCoords));
  console.log(activeAnnotations.length);
  for (index = 0; index < activeAnnotations.length; index++) {
    annCoords = w3cToSide(activeAnnotations[index]);
    console.log(JSON.stringify(annCoords));
    var polygons = {
      first: [
        { x: selectionCoords[0][0], y: selectionCoords[0][1] },
        { x: selectionCoords[1][0], y: selectionCoords[1][1] },
        { x: selectionCoords[2][0], y: selectionCoords[2][1] },
        { x: selectionCoords[3][0], y: selectionCoords[3][1] },
      ],
      second: [
        { x: annCoords[0][0], y: annCoords[0][1] },
        { x: annCoords[1][0], y: annCoords[1][1] },
        { x: annCoords[2][0], y: annCoords[2][1] },
        { x: annCoords[3][0], y: annCoords[3][1] },
      ],
    };
    intersectVal = intersect(polygons.first, polygons.second);
    if (intersectVal != "") {
      intExist = true;
      break;
    }
  }
  return intExist;
}

function loadBirdAnn(lotId) {
  payload = {};
  payload.id = lotId;
  payload.name = lotOwner;
  payload.url = lotURL;
  lotData = JSON.parse(Get(prevLayoutURL, payload)).result;
  spotData = lotData.parking_lots.parking_spaces;
  var w3c = lotData.parking_lots.w3c;
  activeAnnotations = w3c;
  return w3c;
}

function getSideURL() {
  return sideURL;
}

function getBirdURL() {
  return birdURL;
}

function w3cCoords(annotation) {
  coordArr = w3cToSide(annotation);
  return coordArr;
}

function w3cToSide(annotation) {
  var annStr = JSON.stringify(annotation.target.selector.value);
  annStr = annStr.slice(24, annStr.length - 20);
  annArr = annStr.split(" ");
  var coordArr = [];
  for (i = 0; i < annArr.length; i++) {
    coordArr[i] = annArr[i].split(",");
    coordArr[i][0] = Math.round(parseFloat(coordArr[i][0]));
    coordArr[i][1] = Math.round(parseFloat(coordArr[i][1]));
  }
  return coordArr;
}

function getSnapshot(link) {
  if (lotOwner == "Gary") {
    var imageURL = JSON.parse(Get(snapshotURL + "Gary")).url;
  } else if (lotOwner == "Jon") {
    var imageURL = JSON.parse(Get(snapshotURL + "Jon")).url;
  } else {
    payload = {};
    payload.url = link;
    var imageURL = JSON.parse(Get(snapshotBackupURL, payload)).url;
  }
  return imageURL;
}

// function saveFormatted(ID, owner) {
//   let payload = {};
//   payload.parking_lots = {};
//   payload.parking_lots.id = ID;
//   payload.parking_lots.owner = owner;
//   payload.parking_lots.parking_spaces = spotData;
//   payload.parking_lots.w3c = activeAnnotations;
//   console.log("payload");
//   console.log(payload);
//   Post(saveURL, payload);
// }

// function saveAnn() {
//   saveFormatted(activeLot, lotOwner);
// }
