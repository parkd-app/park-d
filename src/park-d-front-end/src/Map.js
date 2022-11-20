import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faXmarkCircle, faWheelchair } from '@fortawesome/free-solid-svg-icons';

import './Map.css';

function ParseJSON() {
    // import json
    const spaceData = require('./SpaceData.json');

    const states = new Array(spaceData.parking_spaces.length);
    for (var i = 0; i < states.length; i++) {
        states[i] = spaceData.parking_spaces[i].status;
    }
    return states;
}

function Map() {
    const states = ParseJSON();
    return (
        <div>
            <div class="parkingRow">
                <div class = {states[1] ? "space empty" : "space full"} >
                    <div class = 'icon'>
                        {states[1] ? <FontAwesomeIcon icon={faCheckCircle} color="green" size="3x" /> :
                        <FontAwesomeIcon icon={faXmarkCircle} color="red" size="3x" />}
                    </div>
                </div>

                <div class = {states[0] ? "space empty" : "space full"} >
                    <div class = 'icon'>
                        {states[0] ? <FontAwesomeIcon icon={faCheckCircle} color="green" size="3x" /> :
                        <FontAwesomeIcon icon={faXmarkCircle} color="red" size="3x" />}
                    </div>
                </div>
            </div>
            <div class="parkingRow">
                <div class = {states[2] ? "space empty" : "space full"} >
                    <div class = 'icon'>
                        {states[2] ? <FontAwesomeIcon icon={faCheckCircle} color="green" size="3x" /> :
                        <FontAwesomeIcon icon={faXmarkCircle} color="red" size="3x" />}
                    </div>
                </div>
                <div class = {states[3] ? "space empty" : "space full"} >
                    <div class = 'icon'>
                        {states[3] ? <FontAwesomeIcon icon={faCheckCircle} color="green" size="3x" /> :
                        <FontAwesomeIcon icon={faXmarkCircle} color="red" size="3x" />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Map;