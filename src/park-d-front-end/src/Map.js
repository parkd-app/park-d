import React, { useState } from 'react';
import './Map.css';

function ParseJSON() {
    const spaceData = require('./SpaceData.json');
    console.log(spaceData.parking_spaces);

    
}

function Map() {
    ParseJSON();
    return (
        <div>
            <div class="parkingRow">
                <div class="spaceEmpty"></div>
                <div class="spaceFull"></div>
            </div>
            <div class="parkingRow">
                <div class="spaceEmpty"></div>
                <div class="spaceFull"></div>
            </div>
        </div>
    );
}

export default Map;