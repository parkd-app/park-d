import Labelling from './Labelling';
import logoIcon from './parkdlogo.png';
import logoName from './parkd.png';
import settingsIcon from './settings.png';

import React, { useState } from "react";
import ParkingLotDropdown from './components/ParkingLotDropdown';

// import logo from './logo.svg';
import './App.css';
import './HomeView.css'
import Analytics from './Analytics';
import Map from './Map';
import HomeViewHeader from './HomeViewHeader'
import HomeViewMap from './HomeViewMap'
import HomeViewSelection from './HomeViewSelection'
import HomeViewAnalytics from './HomeViewAnalytics'

function App() {
  const [hidden, setHidden] = useState(true)
  const [aHidden, setAHidden] = useState(true)

  return (
    <div className="App">
      {/* <div className='HomeViewMap'><HomeViewMap/></div> */}
      <div className='HomeViewHeader'><HomeViewHeader/></div>
      {/* <div className='HomeViewSelection'><HomeViewSelection/></div> */}
      {/* <div className='HomeViewAnalytics'><HomeViewAnalytics/></div>
      <div className='Analytics'><Analytics/></div> */}
      {/* move left */}

    </div>
  );
}

export default App;
