var view = "bird";

function writeToJSON(annotation, currAnnotations) {
  newId = currAnnotations.length - 2;
  annotation.id = newId;
  fetch("http://localhost:8000/annotations_" + view, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(annotation),
  })
    .then((response) => response.json())
    .then((response) => console.log(JSON.stringify(response)));
}

function deleteAnnotation(annotation) {
  fetch("http://localhost:8000/annotations_" + view + "/" + annotation.id, {
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
  const imageUrl = "http://localhost:8000/public/assets/images/lot_" + view;

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
