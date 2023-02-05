function appendAnnotation(annotation) {
  renderAnnotations();
}

async function fetchAnnotations() {
  try {
    const response = await fetch("./annotations.w3c.json", {
      method: "GET",
      credentials: "same-origin",
    });
    const exam = await response.json();
    return exam;
  } catch (error) {
    console.error(error);
  }
}

async function renderAnnotations() {
  const exam = await fetchAnnotations();
  console.log(exam);
  let str = JSON.stringify(exam);
  console.log(str);
  return str;
}

async function writeToJSON() {
  // create a JSON object
  const user = {
    id: 1,
    name: "John Doe",
    age: 22,
  };

  // convert JSON object to a string
  const data = JSON.stringify(user);

  // write JSON string to a file
  fs.writeFile("user.json", data, (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON data is saved.");
  });
}
