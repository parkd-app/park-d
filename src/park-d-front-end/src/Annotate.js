// async function fetchAnnotations() {
//   try {
//     const response = await fetch("http://localhost:8000/annotations", {
//       method: "GET",
//       credentials: "same-origin",
//     });
//     const obj = await response.json();
//     return obj;
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function renderAnnotations() {
//   const obj = await fetchAnnotations();
//   console.log(obj);
//   let str = JSON.stringify(obj);
//   console.log(str);
//   return str;
// }

function writeToJSON(annotation, currAnnotations) {
  newId = currAnnotations.length - 2;
  annotation.id = newId;
  fetch("http://localhost:8000/annotations", {
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

async function deleteAnnotation(annotation) {
  fetch("http://localhost:8000/annotations/" + annotation.id, {
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
