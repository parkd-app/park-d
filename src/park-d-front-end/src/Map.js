import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';

import './Map.css';

const jsonURL = 'http://127.0.0.1:5000/rt_parking_info'

function Map() {
    const [states, setState] = useState([true,true,true,true]);
    
    useEffect(() => {
        let interval = setInterval(() => {
            let json_obj = JSON.parse(Get(jsonURL));
            console.log(json_obj)
            let statuses = json_obj['parking_space'].map(space => space.status)
            setState(statuses);
        }, 2000);
        return () => {
            clearInterval(interval);
        }
      });

    return drawSpaces(states)
}

function Get(jsonURL){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",jsonURL,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

function drawSpaces(states) {
    return (
        <div>
            <div className="parkingRow">
                <div className = {states[1] ? "space empty" : "space full"} >
                    <div className = 'icon'>
                        {states[1] ? <FontAwesomeIcon icon={faCheckCircle} color="green" size="3x" /> :
                        <FontAwesomeIcon icon={faXmarkCircle} color="red" size="3x" />}
                    </div>
                </div>

                <div className = {states[0] ? "space empty" : "space full"} >
                    <div className = 'icon'>
                        {states[0] ? <FontAwesomeIcon icon={faCheckCircle} color="green" size="3x" /> :
                        <FontAwesomeIcon icon={faXmarkCircle} color="red" size="3x" />}
                    </div>
                </div>
            </div>
            <div className="parkingRow">
                <div className = {states[2] ? "space empty" : "space full"} >
                    <div className = 'icon'>
                        {states[2] ? <FontAwesomeIcon icon={faCheckCircle} color="green" size="3x" /> :
                        <FontAwesomeIcon icon={faXmarkCircle} color="red" size="3x" />}
                    </div>
                </div>
                <div className = {states[3] ? "space empty" : "space full"} >
                    <div className = 'icon'>
                        {states[3] ? <FontAwesomeIcon icon={faCheckCircle} color="green" size="3x" /> :
                        <FontAwesomeIcon icon={faXmarkCircle} color="red" size="3x" />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Map;