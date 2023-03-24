var coordURL = "http://localhost:8000/parking_lots";
var w3cURL = "http://localhost:8000/w3c";
// var coordBird = "http://localhost:8000/formatted_bird";
// var coordSide = "http://localhost:8000/formatted_side";
// var imgURL = "http://localhost:8000/assets/images/";
// var sideURL = "http://localhost:8000/assets/images/lot_side.png";
// var birdURL = "http://localhost:8000/assets/images/lot_bird.png";
var backendURL = "https://back-end-new-api.azurewebsites.net/";

var view = "bird";

var activeAnnotations = [];
var newAnnotations = [];
var deletedAnnotations = [];
var spotData;

var activeLot = 1;
var lotOwner = "5dert6";

function Get(URL, ID, owner) {
  var body = {};
  body.parking_lot_id = ID;
  body.owner = owner;

  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", URL, false);
  Httpreq.send(JSON.stringify(body));
  // console.log(Httpreq.responseText);
  return Httpreq.responseText;
}

function createAnnotation(annotation, currAnnotations) {
  console.log(w3cToBird(annotation));
  let maxId = 0;
  //  find highest id for current annotations
  for (i = 0; i < currAnnotations.length; i++) {
    annId = currAnnotations[i].id;
    if (annId > maxId) {
      maxId = annId;
    }
  }
  newId = maxId;
  console.log("new id = " + newId);
  annotation.id = newId;
  annotation.lot = 1;
  annotation.owner = lotOwner;
  annotation.type = 0;
  newAnnotations.push(annotation);
  activeAnnotations.push(annotation);

  let newSpot = {};
  newSpot.id = newId;
  newSpot.status = true;
  console.log(annotation);
  newSpot.camcoords = w3cCoords(annotation);
  newSpot.spotType = 0;
  spotData[spotData.length] = newSpot;
  // nextID++;
  // numSpots++;
}

function deleteAnnotation(annotation) {
  deletedAnnotations.push(annotation);
}

function updateAnnotation(annotation, previous) {
  deletedAnnotations.push(previous);
  // console.log("pushed to deletedAnnotations");
  newAnnotations.push(annotation);
  // console.log("pushed to newAnnotations");
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
  spotData = JSON.parse(Get(coordURL, lotId, lotOwner))["parking_spaces"];
  // console.log(spotData);
  return w3cURL + "?lot=" + lotId;
}

function getCoordURL() {
  return coordURL;
}

function getSideURL() {
  return sideURL;
}

function getBirdURL() {
  return birdURL;
}

function getImgURL() {
  return imgURL;
}

function w3cCoords(annotation) {
  // console.log(annotation);
}

function savew3c() {
  for (i = 0; i < deletedAnnotations.length; i++) {
    fetch(w3cURL + "/" + deletedAnnotations[i].id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deletedAnnotations[i]),
    })
      .then((response) => response.json())
      .then((response) => console.log(JSON.stringify(response)));
  }
  // console.log("saved deleted annotations");
  for (i = 0; i < newAnnotations.length; i++) {
    fetch(w3cURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAnnotations[i]),
    })
      .then((response) => response.json())
      .then((response) => console.log(JSON.stringify(response)));
  }
  // console.log("saved new annotations");
  alert("Annotations Saved");
  // console.log("Saved W3C");
}

function saveFormatted(ID, owner) {
  spotData;
}

function saveAnn() {
  savew3c();
  saveFormatted(activeLot, lotOwner);
}

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

function w3cToBird(annotation) {
  var annStr = JSON.stringify(annotation.target.selector.value);
  annStr = annStr.slice(12, annStr.length - 1);
  annArr = annStr.split(",");
  // console.log("annStr = " + annStr);
  console.log(annArr);
  return annArr;
}

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
