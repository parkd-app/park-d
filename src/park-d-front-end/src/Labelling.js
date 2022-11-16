import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faXmarkCircle, faWheelchair } from '@fortawesome/free-solid-svg-icons';

import './Labelling.css';

function Labelling() {
    const [showLabel, setShowLabel] = useState(false);

    const onClick = () => {
        showLabel ? setShowLabel(false) : setShowLabel(true);
    }

    return (
        <div>
            <input 
                className="showLabelBtn"
                type="submit" 
                value={showLabel ? "Hide Label" : "Show Label"}
                onClick={onClick}
            />
            
            { showLabel ? 
                <div style={{ padding: "30px", display: "flex", justifyContent: "center" }}>
                    <tbody>
                        <tr>
                            <th style={{ textAlign:"center" }}>Label</th>
                            <th>
                                <div className="labelRow">
                                    <FontAwesomeIcon 
                                        icon={faCheckCircle}
                                        color="green"
                                        size="lg" />
                                    <div style={{ fontSize: "14px" }}>
                                        Available Parking
                                    </div>
                                </div>
                            </th>
                            <th>
                                <div className="labelRow">
                                    <FontAwesomeIcon 
                                        icon={faXmarkCircle}
                                        color="red"
                                        size="lg" />
                                    <div style={{ fontSize: "14px"}}>
                                        Unavailable Parking
                                    </div>
                                </div> 
                            </th>
                            <th>
                                <div className="labelRow">
                                    <FontAwesomeIcon 
                                        icon={faWheelchair}
                                        color="blue"
                                        size="lg" />
                                    <div style={{ fontSize: "14px" }}>
                                        Accessibility Parking
                                    </div>
                                </div> 
                            </th>
                            <th>
                                <div className="labelRow">
                                    <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Singapore_Road_Signs_-_Restrictive_Sign_-_No_Parking.svg/1104px-Singapore_Road_Signs_-_Restrictive_Sign_-_No_Parking.svg.png?20110615033427"
                                        alt="Reserved Parking"
                                        style={{ maxWidth: "20px" }}
                                    />
                                    <div style={{ fontSize: "14px" }}>
                                        Reserved Parking
                                    </div>
                                </div> 
                            </th>
                        </tr>
                    </tbody>
                </div> : null }
        </div>
    );
}

export default Labelling;