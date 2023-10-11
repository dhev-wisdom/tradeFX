import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [traders, setTraders] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/traders/');

    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({ type: 'get_trader_data' }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const updatedTraders = [...traders, ...data.data];
      setTraders(updatedTraders);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
  }, []);

  const style = {
    width: '100%',
    padding: '50px',
    textAlign: 'center',
    fontSize: '16px',
    border: '2px solid rgb(75, 192, 192)',
    borderCollapse: 'collapse',
};
const body = {
  padding: '20px',
  border: '1px solid rgb(75, 192, 192)',
  borderCollapse: 'collapse',
}
const data = {
  marginBottom: '50px',
  height: '50px',
  padding: '20px auto',
}
const center = {
  overFlowX: 'auto',
  boxSizing: 'border-box',
  width: '100vw',
  padding: '20px',
}

  return (
    <div style={center}>
      <h1>Admin Dashboard</h1>
      <table style={style}>
        <thead style={data}>
          <tr>
            <th>Trader ID</th>
            <th>Username</th>
            <th>Initial Funding</th>
            <th>Date Started Trading</th>
            <th>Current Balance</th>
            <th>Total Profit</th>
            <th>Last Trade Profit</th>
            <th>Last Trade Time</th>
          </tr>
        </thead>
        <tbody style={body}>
          {traders.map((trader, index) => (
            <tr key={index}>
              <td style={data}>{trader.id}</td>
              <td style={data}>{trader.name}</td>
              <td style={data}>$100.00</td>
              <td style={data}>{trader.timestamp}</td>
              <td style={data}>${trader.balance}</td>
              <td style={data}>${trader.total_profit}</td>
              <td style={data}>${trader.last_trade_profit}</td>
              <td style={data}>{trader.last_trade_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
        <br /><br /><br />
        <Link to="/user-dashboard">Go To User Dashboard</Link>
        
    </div>
  );
};

export default AdminDashboard;

