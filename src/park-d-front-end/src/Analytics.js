import React, { useState, useEffect } from 'react';
import './Analytics.css';

// set url to fetch parking data
const jsonURL = 'http://localhost:8000/parking_spaces'

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

function Analytics() {
    //spotNum[0] = # of available spots, spotNum[1] = # of occupied spots
    const [spotNum, setSpotNum] = useState([0,0]);

    // periodically check parking data
    useEffect(() => {
        let interval = setInterval(() => {
            let json_obj = JSON.parse(Get(jsonURL));
            let availableSpots = 0;
            let occupiedSpots = 0;
            for (var i = 0; i < json_obj.length; i++) {
                if (json_obj[i].status) {
                    availableSpots += 1;
                } else {
                    occupiedSpots += 1;
                }
            }
            setSpotNum([availableSpots, occupiedSpots]);
        }, 2000);
        return () => {
            clearInterval(interval);
        }
      });

    return (
        <div>
            <div><h2>Analytics</h2></div>
            <div>
                {"Available spots: " + spotNum[0]}
            </div>
            <div>
                {"Occupied spots: " + spotNum[1]}
            </div>
        </div>
    );
}

export default Analytics;