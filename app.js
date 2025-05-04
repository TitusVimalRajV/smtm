const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

let balanceData = null;

// API endpoint to get the xero data
app.get('/balanceData', (req, res) => {
    if (!balanceData) return res.status(404).json({ message: 'No data available yet.' });
    res.json(balanceData);
  });
    
app.setStoredData = (data) => {
  balanceData = data;
};

module.exports = app;