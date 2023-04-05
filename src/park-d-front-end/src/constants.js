// other urls extend off this
const backendURL = "https://back-end-new-api.azurewebsites.net/";
const jsonURL = backendURL + "rt_parking_info"; // all spots for given lot
const postURL = backendURL + "save_coord"; // save changed spots
const createLotURL = backendURL + "create_parking_lot"; // create a lot in db
const allLotURL = backendURL + "get_all_parking_lots"; // all lots

// for camera annotations
const prevLayoutURL = backendURL + "get_prev_layout";
const snapshotURL = backendURL + "get_parking_snapshot?name=";
const snapshotBackupURL = backendURL + "get_parking_snapshot_backup";

const updateInterval = 5000; // how often to query the backend

// green: regular, blue: accessible, red: reserved
const colorToType = { "#00FF00": 0, "#0000FF": 1, "#FF0000": 2 };
const typeToColor = { 0: "#00FF00", 1: "#0000FF", 2: "#FF0000" };
// grey
const newSpotColor = "#888888";
