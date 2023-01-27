import React, { useState, useEffect } from 'react';
import './Analytics.css';
import CustomBar from './components/CustomBar';
import AnalyticsCard from './AnalyticsCard';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BarChart, Bar, XAxis, Tooltip, CartesianGrid } from 'recharts';

// set url to fetch parking data
const jsonURL = 'http://localhost:8000/parking_spaces'

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

function Analytics() {
    let date = Date().toLocaleString().split(" ");
    let formattedDate = date[1] + " " + date[2] + ", " + date[3];
    let formattedTime = date[date.length - 3].split(":")[0];
    let formattedTimeString = formattedTime % 12;
    formattedTimeString += (formattedTime > 12) ? "pm" : "am";

    const colours = ['#61FF00', '#CCFF00', '#FFE600', '#FF8A00', '#FF0000'];

    const data = [
        { name: "12am", occupancy: 1 },
        { name: "1am", occupancy: 1 },
        { name: "2am", occupancy: 1 },
        { name: "3am", occupancy: 1 },
        { name: "4am", occupancy: 1 },
        { name: "5am", occupancy: 1 },
        { name: "6am", occupancy: 2 },
        { name: "7am", occupancy: 3 },
        { name: "8am", occupancy: 4 },
        { name: "9am", occupancy: 5 },
        { name: "10am", occupancy: 8 },
        { name: "11am", occupancy: 9 },
        { name: "12pm", occupancy: 10 },
        { name: "1pm", occupancy: 9 },
        { name: "2pm", occupancy: 8 },
        { name: "3pm", occupancy: 5 },
        { name: "4pm", occupancy: 6 },
        { name: "5pm", occupancy: 7 },
        { name: "6pm", occupancy: 8 },
        { name: "7pm", occupancy: 9 },
        { name: "8pm", occupancy: 6 },
        { name: "9pm", occupancy: 3 },
        { name: "10pm", occupancy: 2 },
        { name: "11pm", occupancy: 1 },
    ];

    let total = 10;

    let locationName = "Pierre Elliott Trudeau High School";
    let locationAddress = "90 Bur Oak Ave, Markham, ON L6C 2E6";

    // The following code will be used to retrieve live occupancy data
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
            {/*
                The following code will be used to retrieve historical occupancy data.

                Currently these values are sourced from the JSON object above. In order to render the graph, the ReCharts
                library is used. ReCharts does not natively support the ability to customize the colour of individual bar
                graphs. To circumvent this issue, I have written a CustomBar component.
            */}

            <h5 style={{ textAlign: "center" }}>{locationName}</h5>
            <p style={{ textAlign: "center", color: "gray" }}>{locationAddress}</p>

            <div className="analyticsCards">
                <AnalyticsCard total={total} available={spotNum[0]} parkingType='STANDARD' colour="success"/>
                <AnalyticsCard total={total} available={spotNum[0]} parkingType='ACCESSIBLE' colour="primary"/>
                <AnalyticsCard total={total} available={spotNum[0]} parkingType='RESERVED' colour="warning"/>
            </div>

            <div>
                <BarChart width={575} height={300} data={data} barSize={20} margin={{ left: 80}}>
                    <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} interval={0}tick={{fontSize: 8}}/>
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar shape={(data) => CustomBar({...data, total, colours})} dataKey="occupancy" total={total} />
                </BarChart>
                <p style={{ textAlign: "right", color: "gray" }}>
                    Last Updated - {formattedDate} @ {formattedTimeString}
                </p>
            </div>

            <h4 style={{ textAlign: "center" }}>Live Data</h4>
            <div style={{ textAlign: "center" }}>
                {"Available spots: " + spotNum[0]}
            </div>
            <div style={{ textAlign: "center" }}>
                {"Occupied spots: " + spotNum[1]}
            </div>
        </div>
    );
}

export default Analytics;