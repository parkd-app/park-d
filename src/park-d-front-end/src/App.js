import Labelling from './Labelling';
import logoIcon from './parkdlogo.png';
import logoName from './parkd.png';
import settingsIcon from './settings.png';

import React, { useState } from "react";

// import logo from './logo.svg';
import './App.css';
import Analytics from './Analytics';
import Map from './Map';

function App() {
  const [hidden, setHidden] = useState(true)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logoIcon} className="App-icon" alt="logoIcon" />
        <img src={logoName} className="App-name" alt="logoName" />
        <img src={settingsIcon} className="Settings-icon" alt="settingsIconName" />
      </header>
      <body>
        <div className="ParkingPref">
            {!hidden ?
            <form className="ParkingPref-Form" id="parkingPref">
            <input type="checkbox" id="checkReserved" name="checkReserved"/>
            <label for="checkReserved">Reserved</label><br></br>
            <input type="checkbox" id="checkHandicapped" name="checkHandicapped"/>
            <label for="checkHandicapped">Handicapped</label>
            </form> : null}
            <button onClick={() => setHidden(s => !s)}>Parking Preferences</button>
          </div>
      </body>
    <div>
        { /* Map Component */ }
        <div>
          <Map/>
        </div>
        { /* Labelling Component */ }
        <div>
          <Labelling/>
        </div>
    </div>
      <Analytics/>
    </div>
  );
}

export default App;
