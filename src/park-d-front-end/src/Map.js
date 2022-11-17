import React, { useState } from 'react';
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
                <div class = {states[1] ? "space empty" : "space full"} ></div>
                <div class = {states[0] ? "space empty" : "space full"} ></div>
            </div>
            <div class="parkingRow">
                <div class = {states[2] ? "space empty" : "space full"} ></div>
                <div class = {states[3] ? "space empty" : "space full"} ></div>
            </div>
        </div>
    );
}

export default Map;