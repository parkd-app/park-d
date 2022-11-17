import Labelling from './Labelling';
import logoIcon from './parkdlogo.png';
import logoName from './parkd.png';
import settingsIcon from './settings.png';

import React, { useState } from "react";
import Dropdown from 'react-dropdown';
import ParkingLotDropdown from './components/ParkingLotDropdown';

// import logo from './logo.svg';
import './App.css';
import Analytics from './Analytics';

function App() {
  const [hidden, setHidden] = useState(true)
  const lotOptions = ['Lot 1', 'Lot 2', 'Lot 3']

  return (
    <div className="App">
      <header className="App-header">
        <img src={logoIcon} className="App-icon" alt="logoIcon" />
        <img src={logoName} className="App-name" alt="logoName" />
        <img src={settingsIcon} className="Settings-icon" alt="settingsIconName" />
      </header>
      <body>
        <Dropdown className='Select-Lot-Dropdown' options={lotOptions} placeholder="Select a parking lot"/>
        <button onClick={() => setHidden(s => !s)}>Parking Preferences</button>
          {!hidden ?
          <form id="parkingPref">
          <input type="checkbox" id="checkReserved" name="checkReserved"/>
          <label for="checkReserved">Reserved</label><br></br>
          <input type="checkbox" id="checkHandicapped" name="checkHandicapped"/>
          <label for="checkHandicapped">Handicapped</label>
          </form> : null}
      </body>
    <div>
        { /* Labelling Component */ }
        <div>
          <Labelling/>
        </div>
    </div>
      <Analytics/>
      <ParkingLotDropdown/>
    </div>
  );
}

export default App;
