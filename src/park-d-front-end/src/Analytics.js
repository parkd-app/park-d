import React, { useState } from 'react';
import './Analytics.css';

function Analytics() {

    const [data, setData] = useState({data: []});
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState('');

    const handleClick = async () => {
        setIsLoading(true);

        try {
        // const response = await fetch('https://reqres.in/api/users', {
        const response = await fetch('localhost:3000/rt_parking_info', {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();

        console.log('result is: ', JSON.stringify(result, null, 4));

        setData(result);
        } catch (err) {
        setErr(err.message);
        } finally {
        setIsLoading(false);
        }
    };

  console.log(data);

    return (
        <div>
            {err && <h2>{err}</h2>}

            <button onClick={handleClick}>Fetch data</button>

            {isLoading && <h2>Loading...</h2>}

            {data.data.map(spot => {
            return (
                <div key={spot.id}>
                <h2>{spot.id}</h2>
                <h2>{spot.status}</h2>
                <br />
                </div>
            );
            })}
        </div>
    );
}

export default Analytics;