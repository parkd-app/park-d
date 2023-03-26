// constants moved to constants.js

var localURL = "http://localhost:8000/";
var coordURL = backendURL + "rt_parking_info";
var w3cURL = backendURL + "w3c";
var snapURL = backendURL + "get_parking_snapshot";
// var localURL = "http://localhost:8000/";
var backURL = "https://back-end-new-api.azurewebsites.net/";
var coordURL = backURL + "rt_parking_info";
var w3cURL = backURL + "w3c";
var snapURL = backURL + "get_parking_snapshot";
var saveURL = backURL + "save_coord";
// var coordBird = "http://localhost:8000/formatted_bird";
// var coordSide = "http://localhost:8000/formatted_side";
// var imgURL = "http://localhost:8000/assets/images/";
// var sideURL = "http://localhost:8000/assets/images/lot_side.png";
// var birdURL = "http://localhost:8000/assets/images/lot_bird.png";

var view = "bird";

var activeAnnotations = [];
// var newAnnotations = [];
// var deletedAnnotations = [];
var lotData = [];
var spotData = [];

var activeLot;
var lotOwner;

function Get(URL, body) {
  // console.log(body);
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("POST", URL, false);
  Httpreq.setRequestHeader("Content-Type", "application/json");
  Httpreq.send(JSON.stringify(body));
  // console.log(Httpreq.responseText);
  return Httpreq.responseText;
}

function Post(URL, body) {
  // console.log(body);
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("POST", URL, false);
  Httpreq.setRequestHeader("Content-Type", "application/json");
  Httpreq.send(JSON.stringify(body));
  // console.log(Httpreq.responseText);
  return Httpreq.responseText;
}

function loadAnnotations(image) {
  lotID = parseInt(document.getElementById("IDBox").value);
  owner = document.getElementById("OwnerBox").value;
  activeLot = lotID;
  lotOwner = owner;
  anno.setAnnotations(loadBirdAnn(activeLot));
}

function createAnnotation(annotation, currAnnotations) {
  if (activeAnnotations == null) {
    activeAnnotations = [];
  }
  // console.log(w3cToBird(annotation));
  var maxId = 0;
  let newId = 0;
  // console.log(currAnnotations);
  //  find highest id for current annotations
  // console.log("currAnnotations.length = " + currAnnotations.length);
  if (currAnnotations.length > 1) {
    for (i = 0; i < currAnnotations.length; i++) {
      annId = currAnnotations[i].id;
      // console.log("annId = " + annId);
      if (annId > maxId) {
        maxId = annId;
      }
    }
    newId = maxId + 1;
  } else {
    newId = 0;
    annotation.id = 0;
    // console.log("ZERO");
  }
  // console.log("new id = " + newId);
  annotation.id = newId;
  annotation.lot = 1;
  annotation.owner = lotOwner;
  annotation.spotType = 0;
  // newAnnotations.push(annotation);
  activeAnnotations.push(annotation);
  // console.log("activeAnnotations");
  // console.log(activeAnnotations);

  let newSpot = {};
  newSpot.id = newId;
  newSpot.status = true;
  // console.log(annotation);
  newSpot.camcoords = w3cCoords(annotation);
  newSpot.mapcoords = [];
  newSpot.type = 0;
  if (spotData == null) {
    spotData = [];
    spotData[0] = newSpot;
    // console.log(spotData[0]);
  } else {
    spotData[spotData.length] = newSpot;
    // console.log(spotData[spotData.length]);
  }
  // console.log("spotData = ");
  // console.log(spotData);
}

function deleteAnnotation(annotation, currAnnotations) {
  // deletedAnnotations.push(annotation);
  activeAnnotations = currAnnotations;
  var annId = annotation.id;
  var index;
  for (i = 0; i < spotData.length; i++) {
    if (spotData[i].id == annId) {
      index = i;
    }
  }
  spotData.splice(index, 1);
}

function updateAnnotation(annotation, previous, currAnnotations) {
  // deletedAnnotations.push(previous);
  // console.log("pushed to deletedAnnotations");
  // newAnnotations.push(annotation);
  // console.log("pushed to newAnnotations");
  activeAnnotations = currAnnotations;
  updateCamcoords(annotation, previous);
}

function updateCamcoords(annotation, previous) {
  annId = annotation.id;
  // console.log("annId = " + annId);
  var index;
  for (i = 0; i < spotData.length; i++) {
    if (spotData[i].id == annId) {
      index = i;
      // console.log("index = " + index);
    }
  }
  // console.log(spotData);
  spotData[index].status = true;
  spotData[index].camcoords = w3cCoords(annotation);
}

function checkIntersection(selection) {
  var intExist = false;
  selectionCoords = w3cToSide(selection);
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

function getImage(view) {
  var imageUrl = imgURL + view;

  fetch(imageUrl)
    //                         vvvv
    .then((response) => response.blob())
    .then((imageBlob) => {
      // Then create a local URL for that image and print it
      var imageObjectURL = URL.createObjectURL(imageBlob);
      // console.log(imageObjectURL);
      return imageObjectURL;
    });
}

function getView() {
  return view;
}

function setView(newView) {
  view = newView;
}

function loadBirdAnn(lotId) {
  body = {};
  body.parking_lot_id = lotId;
  body.owner = lotOwner;
  lotData = JSON.parse(Get(coordURL, body));
  // console.log("lotData = ");
  // console.log(lotData);
  spotData = lotData.parking_lots.parking_spaces;
  // console.log("spotData = ");
  // console.log(spotData);
  var w3c = lotData.parking_lots.w3c;
  activeAnnotations = w3c;
  // console.log(JSON.stringify(w3c));
  return w3c;
}

function getSideURL() {
  return sideURL;
}

function getBirdURL() {
  return birdURL;
}

function saveFormatted(ID, owner) {
  // console.log(JSON.stringify(spotData));
  let payload = {};
  payload.parking_lots = {};
  payload.parking_lots.id = ID;
  payload.parking_lots.owner = owner;
  payload.parking_lots.parking_spaces = spotData;
  payload.parking_lots.w3c = activeAnnotations;
  // console.log("payload");
  // console.log(payload);
  // console.log(JSON.stringify(payload));
  Post(saveURL, payload);
}

function saveAnn() {
  // savew3c();
  saveFormatted(activeLot, lotOwner);
}

function w3cCoords(annotation) {
  coordArr = w3cToSide(annotation);
  // console.log("coordArr = " + coordArr);
  return coordArr;
}

function w3cToBird(annotation) {
  var annStr = JSON.stringify(annotation.target.selector.value);
  annStr = annStr.slice(12, annStr.length - 1);
  annArr = annStr.split(",");
  // console.log("annStr = " + annStr);
  // console.log(annArr);
  for (i = 0; i < annArr.length; i++) {
    annArr[i] = parseFloat(annArr[i]);
  }
  return annArr;
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
  // console.log(coordArr);

  // var coordArr = [
  //   [annArr[0], annArr[1]],
  //   [annArr[0] + annArr[2], annArr[1]],
  //   [annArr[0], annArr[1] + annArr[3]],
  //   [annArr[0] + annArr[2], annArr[1] + annArr[3]],
  // ];
  // console.log(JSON.stringify(coordArr));
  return coordArr;
}

function getSnapshot() {
  body = {};
  body.url = "https://www.youtube.com/watch?v=c38K8IsYnB0";
  // console.log("getting snapshot");
  // console.log("body = ");
  // console.log(body);
  var imageURL = JSON.parse(Get(snapURL, body)).image;
  return imageURL;
}

// function getImgURL() {
//   return imgURL;
// }

// function getCoordURL() {
//   return coordURL;
// }

// function Get(URL) {
//   var Httpreq = new XMLHttpRequest(); // a new request
//   Httpreq.open("GET", URL, false);
//   Httpreq.send(null);
//   return Httpreq.responseText;
// }

// function Post(URL, content) {
//   fetch(URL, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(content),
//   });
// }

// function Put(URL, content) {
//   fetch(URL, {
//     method: "PUT",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(content),
//   });
// }

// function writeToJSON(annotation, currAnnotations) {
//   if (view == "bird") {
//     activeAnnotations.push(w3cToBird(annotation));
//   } else {
//     activeAnnotations.push(w3cToSide(annotation));
//   }
//   newId = currAnnotations.length - 1;
//   annotation.id = newId;
//   fetch(imgURL + view, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(annotation),
//   })
//     .then((response) => response.json())
//     .then((response) => console.log(JSON.stringify(response)));
// }

// function getAnn() {
//   var currAnn = Get(coordURL);
//   return currAnn;
// }

// function getSideAnn() {
//   var currAnn = sideToW3c(Get(coordSide));
//   var w3cAnn = sideToW3c(currAnn);
//   return w3cAnn;
// }

// function getBirdAnn() {
//   var parking_lots = JSON.parse(Get(coordURL));
//   console.log(parking_lots[0].w3c);

//   return w3cAnn;
// }

// function saveAnn() {
//   if (view == "bird") {
//     saveBirdAnn();
//   } else {
//     saveSideAnn();
//   }
// }

// function saveBirdAnn() {
//   var birdForm = {
//     identifier: "bird",
//     coordinates: workingAnnotations,
//   };
//   Post(coordURL, birdForm);
//   workingAnnotations = [];
// }

// function saveSideAnn() {
//   var sideForm = {
//     identifier: "side",
//     coordinates: workingAnnotations,
//   };
//   Post(coordURL, sideForm);
//   workingAnnotations = [];
// }

// function w3cToSide(annotation) {
//   var annStr = JSON.stringify(annotation.target.selector.value);
//   annStr = annStr.slice(24, annStr.length - 20);
//   annArr = annStr.split(" ");
//   console.log("annStr = " + annStr);
//   console.log(annArr);
//   return annArr;
// }

// function birdToW3c(birdCoords) {
//   coordValue =
//     "xywh=" + birdCoords[0] + birdCoords[1] + birdCoords[2] + birdCoords[3];

//   var w3cForm = {
//     annotations_bird: [
//       {
//         "@context": "http://www.w3.org/ns/anno.jsonld",
//         type: "Annotation",
//         body: [
//           {
//             type: "TextualBody",
//             value: "asdf",
//             purpose: "commenting",
//             creator: {
//               id: "http://www.example.com/yapetej",
//               name: "Jonathan",
//             },
//             created: "2023-02-05T07:35:15.562Z",
//             modified: "2023-02-05T07:35:15.716Z",
//           },
//         ],
//         target: {
//           source:
//             "http://127.0.0.1:5500/park-d/src/park-d-front-end/src/test_lot.png",
//           selector: {
//             type: "FragmentSelector",
//             conformsTo: "http://www.w3.org/TR/media-frags/",
//             value: "xywh=pixel:13,148,120,250",
//           },
//         },
//         id: -1,
//       },
//     ],
//   };

//   // console.log(w3cForm.annotations_bird[0].target.selector.value);
//   w3cForm.annotations_bird[0].target.selector.value = coordValue;
//   return w3cForm.annotations_bird[0];
// }

// function birdToW3c(birdCoords) {
//   var currAnn = annotation;
//   var w3cForm = {
//     annotations_bird: [
//       {
//         "@context": "http://www.w3.org/ns/anno.jsonld",
//         type: "Annotation",
//         body: [
//           {
//             type: "TextualBody",
//             value: "asdf",
//             purpose: "commenting",
//             creator: {
//               id: "http://www.example.com/yapetej",
//               name: "Jonathan",
//             },
//             created: "2023-02-05T07:35:15.562Z",
//             modified: "2023-02-05T07:35:15.716Z",
//           },
//         ],
//         target: {
//           source:
//             "http://127.0.0.1:5500/park-d/src/park-d-front-end/src/test_lot.png",
//           selector: {
//             type: "FragmentSelector",
//             conformsTo: "http://www.w3.org/TR/media-frags/",
//             value: "xywh=pixel:13,148,120,250",
//           },
//         },
//         id: -1,
//       },
//     ],
//   };
// }

// function sideToW3c(birdCoords) {
//   var currAnn = annotation;
//   var w3cForm = {
//     annotations_bird: [
//       {
//         "@context": "http://www.w3.org/ns/anno.jsonld",
//         type: "Annotation",
//         body: [
//           {
//             type: "TextualBody",
//             value: "asdf",
//             purpose: "commenting",
//             creator: {
//               id: "http://www.example.com/yapetej",
//               name: "Jonathan",
//             },
//             created: "2023-02-05T07:35:15.562Z",
//             modified: "2023-02-05T07:35:15.716Z",
//           },
//         ],
//         target: {
//           source:
//             "http://127.0.0.1:5500/park-d/src/park-d-front-end/src/test_lot.png",
//           selector: {
//             type: "FragmentSelector",
//             conformsTo: "http://www.w3.org/TR/media-frags/",
//             value:
//               '<svg><polygon points="694,597 892,473 594,279 422,395"></polygon></svg>',
//           },
//         },
//         id: -1,
//       },
//     ],
//   };
// }
// function savew3c() {
//   for (i = 0; i < deletedAnnotations.length; i++) {
//     fetch(w3cURL + "/" + deletedAnnotations[i].id, {
//       method: "DELETE",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(deletedAnnotations[i]),
//     })
//       .then((response) => response.json())
//       .then((response) => console.log(JSON.stringify(response)));
//   }
//   // console.log("saved deleted annotations");
//   for (i = 0; i < newAnnotations.length; i++) {
//     fetch(w3cURL, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(newAnnotations[i]),
//     })
//       .then((response) => response.json())
//       .then((response) => console.log(JSON.stringify(response)));
//   }
//   // console.log("saved new annotations");
//   alert("Annotations Saved");
//   // console.log("Saved W3C");
//   // newAnnotations = [];
//   // deletedAnnotations = [];
// }
