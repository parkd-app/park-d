import Labelling from "./Labelling";
import logoIcon from "./parkdlogo.png";
import logoName from "./parkd.png";
import settingsIcon from "./settings.png";

import React, { useState } from "react";
import ParkingLotDropdown from "./components/ParkingLotDropdown";

// import logo from './logo.svg';
import "./App.css";
import Analytics from "./Analytics";
import Map from "./Map";

function App() {
  const [hidden, setHidden] = useState(true);
  const [aHidden, setAHidden] = useState(true);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logoIcon} className="App-icon" alt="logoIcon" />
        <img src={logoName} className="App-name" alt="logoName" />
        <img
          src={settingsIcon}
          className="Settings-icon"
          alt="settingsIconName"
        />
      </header>
      <body>
        <div className="ParkingPref">
          {!hidden ? (
            <form className="ParkingPref-Form" id="parkingPref">
              <input type="checkbox" id="checkReserved" name="checkReserved" />
              <label for="checkReserved">Reserved</label>
              <br></br>
              <input
                type="checkbox"
                id="checkHandicapped"
                name="checkHandicapped"
              />
              <label for="checkHandicapped">Handicapped</label>
            </form>
          ) : null}
          <button onClick={() => setHidden((s) => !s)}>
            Parking Preferences
          </button>
        </div>
      </body>
      <div>
        {/* Map Component */}
        <div className="Map">
          <Map />
        </div>
        {/* Labelling Component */}
        <div className="Labelling">
          <Labelling />
        </div>
      </div>

      {aHidden ? (
        <>
          <button onClick={() => setAHidden(false)} className="analyticsBtn">
            Show Analytics
          </button>
        </>
      ) : (
        <>
          <button onClick={() => setAHidden(true)} className="analyticsBtn">
            Hide Analytics
          </button>
          <div className="Analytics">
            <Analytics />
          </div>
        </>
      )}

      <div className="ParkingLotDropdown">
        <ParkingLotDropdown />
      </div>
    </div>
  );
}

export default App;
