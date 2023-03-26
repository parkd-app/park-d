// json parsing
const backendURL = "https://back-end-new-api.azurewebsites.net/";
//const backendURL = "http://localhost:8000/";
const jsonURL = backendURL + "rt_parking_info";
//const jsonURL = backendURL + "parking_lots";
const lotsURL = backendURL + "get_all_parking_lots";
//const lotsURL = "http://localhost:8001/parking_lots";
const postURL = backendURL + "save_coord";
//const postURL = backendURL + "parking_lots";
const createLotURL = backendURL + "create_parking_lot";
const allLotURL = backendURL + "get_all_parking_lots";

const updateInterval = 5000;

const colorToType = { "#00FF00": 0, "#0000FF": 1, "#FF0000": 2 };
const typeToColor = { 0: "#00FF00", 1: "#0000FF", 2: "#FF0000" };
const newSpotColor = "#888888";