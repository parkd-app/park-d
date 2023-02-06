var view = "bird";
var coordURL = "http://127.0.0.1:5000/req_coordinate";
var imgURL = "http://127.0.0.1:5000/get_parking_snapshot?angle=";
var sideURL = "http://127.0.0.1:5000/get_parking_snapshot?angle=side";
var birdURL = "http://127.0.0.1:5000/get_parking_snapshot?angle=bird";

var currW3cBird = [];
var currW3cSide = [];
var workingBird = [];
var workingSide = [];

function Get(URL) {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", URL, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}

function Post(URL, content) {
  fetch(URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
}

function Put(URL, content) {
  fetch(URL, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
}

function writeToJSON(annotation, currAnnotations) {
  if (view == "bird") {
    newId = currW3cBird.length - 2;
    annotation.id = newId;
    // console.log(annotation);
    currW3cBird.push(annotation);
    // console.log(currW3cBird);
    workingBird.push([w3cToBird(annotation)]);
    // console.log(workingAnnotations);
  } else {
    newId = currW3cSide.length - 2;
    annotation.id = newId;
    // console.log(annotation);
    currW3cSide.push(annotation);
    // console.log(currW3cBird);
    workingSide.push([w3cToSide(annotation)]);
    // console.log(workingAnnotations);
  }

  // fetch(imgURL + view, {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(annotation),
  // })
  //   .then((response) => response.json())
  //   .then((response) => console.log(JSON.stringify(response)));
}

function deleteAnnotation(annotation) {
  fetch(imgURL + view + "/" + annotation.id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(annotation),
  })
    .then((response) => response.json())
    .then((response) => console.log(JSON.stringify(response)));
}

function getImage(view) {
  const imageUrl = imgURL + view;

  fetch(imageUrl)
    //                         vvvv
    .then((response) => response.blob())
    .then((imageBlob) => {
      // Then create a local URL for that image and print it
      const imageObjectURL = URL.createObjectURL(imageBlob);
      console.log(imageObjectURL);
      return imageObjectURL;
    });
}
function getView() {
  return view;
}

function setView(newView) {
  view = newView;
}

function w3cToBird(annotation) {
  // console.log(annotation);
  var annStr = JSON.stringify(annotation.target.selector.value);
  annStr = annStr.slice(12, annStr.length - 1);
  annArr = annStr.split(",");
  // console.log("annStr = " + annStr);
  // console.log(annArr);
  return annArr;
}

function w3cToSide(annotation) {
  var annStr = JSON.stringify(annotation.target.selector.value);
  annStr = annStr.slice(24, annStr.length - 20);
  annArr = annStr.split(" ");
  // console.log("annStr = " + annStr);
  // console.log(annArr);
  return annArr;
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

// function getAnn() {
//   var currAnn = Get(coordURL);
//   return currAnn;
// }

// function getSideAnn() {
//   var currAnn = sideToW3c(getAnn());
//   var w3cAnn = sideToW3c(currAnn);
//   return w3cAnn;
// }

// function getBirdAnn() {
//   var currAnn = birdToW3c(getAnn());
//   var w3cAnn = birdToW3c(currAnn);
//   return w3cAnn;
// }

function saveAnn() {
  if (view == "bird") {
    saveBirdAnn();
  } else {
    saveSideAnn();
  }
}

function saveBirdAnn() {
  var birdForm = {
    identifier: "bird",
    coordinates: workingBird,
  };
  Post(coordURL, birdForm);
  workingBird = [];
}

function saveSideAnn() {
  var sideForm = {
    identifier: "side",
    coordinates: workingSide,
  };
  Post(coordURL, sideForm);
  workingSide = [];
}

function getW3cBird() {
  console.log(currW3cBird);
  return currW3cBird;
}

function getW3cSide() {
  console.log(currW3cSide);
  return currW3cSide;
}

// function birdToW3c(annotation) {
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

// function sideToW3c(annotation) {
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
