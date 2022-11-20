import React, { useState } from 'react';
import './Analytics.css';

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

function Analytics() {
    const [availableSpots, setAvailableSpots] = useState(0);
    const [occupiedSpots, setOccupiedSpots] = useState(0);
    var json_obj;

    const handleClick = async() => {
        json_obj = JSON.parse(Get("http://localhost:8000/parking_spaces"));
        var newAvailableSpots = 0;
        var newOccupiedSpots = 0;
        for (var i = 0; i < json_obj.length; i++) {
            if (json_obj[i].status) {
                newAvailableSpots += 1;
            } else {
                newOccupiedSpots += 1;
            }
        }
        setAvailableSpots(newAvailableSpots);
        setOccupiedSpots(newOccupiedSpots);
    }
    return (
        <div>
            <button onClick={handleClick}>Update Analytics</button>
            <div>
                {"Available spots: " + availableSpots}
            </div>
            <div>
                {"Occupied spots: " + occupiedSpots}
            </div>
        </div>
    );
}

export default Analytics;