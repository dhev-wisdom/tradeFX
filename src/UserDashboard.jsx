import React, { useEffect, useState } from 'react';
import Chart from "chart.js/auto";
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const [traderData, setTraderData] = useState({});
    const MAX_DATA_POINTS = 30;
    const [traderID, setTraderID] = useState(1);
    const [input_, setInput_] = useState(1);

    const handleInputChange = (e) => {
        setInput_(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTraderID(input_);
        setInput_('');
    };

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/ws/traders/`);
    
        socket.onopen = () => {
          console.log('WebSocket connected');
          socket.send(JSON.stringify({ type: 'get_trader_data' }));
        };
    
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          let traderdata = {};
          data.data.forEach(element => {
            if (parseInt(element.id) === parseInt(traderID)) {
                traderdata = { ...traderData, ...element };
            }
          });

          setTraderData(traderdata);
          const { total_profit, timestamp, last_trade_profit, last_trade_time } = traderdata;

          setChartData((prevChartData) => {
            const updatedLabels = prevChartData.labels.length >= MAX_DATA_POINTS
                    ? [...prevChartData.labels.slice(1), timestamp]
                    : [...prevChartData.labels, timestamp];

            const updatedData = prevChartData.datasets[0].data.length >= MAX_DATA_POINTS
                ? [...prevChartData.datasets[0].data.slice(1), total_profit]
                : [...prevChartData.datasets[0].data, total_profit];

            return {
                ...prevChartData,
                labels: updatedLabels,
                datasets: [
                    {
                    ...prevChartData.datasets[0],
                    data: updatedData,
                    },
                    ],
                };
            });
            setLastChartData((prevChartData) => {
                const updatedLabels =
                prevChartData.labels.length >= MAX_DATA_POINTS
                    ? [...prevChartData.labels.slice(1), last_trade_time]
                    : [...prevChartData.labels, last_trade_time];
        
                const updatedData =
                prevChartData.datasets[0].data.length >= MAX_DATA_POINTS
                    ? [...prevChartData.datasets[0].data.slice(1), last_trade_profit]
                    : [...prevChartData.datasets[0].data, last_trade_profit];
        
                return {
                ...prevChartData,
                labels: updatedLabels,
                datasets: [
                    {
                    ...prevChartData.datasets[0],
                    data: updatedData,
                    },
                ],
                };
            });
        };
    
        socket.onclose = () => {
          console.log('WebSocket disconnected');
        };
    
      }, [traderID]);
    
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
            label: 'All Time Profit/Loss vs Time Graph',
            data: [],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            },
        ],
    });

    const [lastChartData, setLastChartData] = useState({
        labels: [],
        datasets: [
        {
            label: 'Last Trade Profit/Loss vs Time Graph',
            data: [],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        },
        ],
      });

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Profit/Loss ($)',
                },
                ticks: {
                    callback: function (value) {
                    return value + ' $';
                    },
                },
            },
        },
    };


    return (
        <div style={{ width: '100vw', padding: '10px 20px', margin: '0px auto' }}>
        <h1>User Dashboard</h1>
        <h2>Trader Name: <span style={{ color: 'rgb(75, 192, 192)' }}>{traderData.name}</span></h2>
        <h2>Trader ID: <span style={{ color: 'rgb(75, 192, 192)' }}>{traderData.id}</span></h2>
        <div id='chart2' style={{ maxWidth: '100vw', height: '90vh', padding: '20px', boxSizing: 'border-box', }}>
            <h3>Recent Trading Activities</h3>
            <Line data={lastChartData} options={options} />
        </div>
        <br /><br /><br />
        <div id='chart1' style={{ maxWidth: '100vw', height: '90vh', padding: '10px', boxSizing: 'border-box' }}>
            <h3>All-Time Trading Activity</h3>
            <Line data={chartData} options={options} />
        </div>
        <br /><br /><br />
        <form onSubmit={handleSubmit}>
            <h4>See different trader's dashboard</h4>
            <div style={{width: '50vw', display: 'flex', position: 'relative', rowGap: '5px'}}>
            <input type="number" min={1} max={10} value={input_} onChange={handleInputChange} placeholder='Input trader ID E.g 1' style={{width: '70%', borderRadius: '10px', padding: '10px'}} />
            <input type="submit" value="View" style={{width: 'auto', border: 'none', borderRadius: '5px', fontWeight: '500', marginLeft: '5px'}} />
            </div>
        </form>
        <br /><br /><br />
        <Link to="/admin-dashboard">Go To Admin Dashboard</Link>
        </div>
    );
}

export default UserDashboard;