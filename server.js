const cron = require('node-cron');
const axios = require('axios');
const cors = require('cors');
const app = require('./app');
const PORT = 3005;

let balanceData = null;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Fetch data from xero every month
const fetchData = async (maxRetries = 2, retryDelay = 5000) => {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const response = await axios.get('http://localhost:3003/api.xro/2.0/Reports/BalanceSheet');
      
      if (!response.data) {
        throw new Error('Xero returned empty data');
      }

      app.setStoredData(response.data);
      console.log('Data fetched and stored at', new Date().toISOString());
      return;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      if (attempt === maxRetries) {
        console.error('Max retries reached. Aborting fetch.');
        break;
      }
      await delay(retryDelay); // Wait before next attempt
      
      //Setting balanceData to null to avoid showing old data when the new data errors	  
      balanceData = null;	  
    }
    attempt++;
  }
};

// Monthly Schedule
try {
  cron.schedule('0 0 1 * *', async () => {
    await fetchData();
  });
  console.log('Cron job scheduled atarted for this month', new Date().toISOString());
} catch (cronError) {
  console.error('Failed to schedule cron job:', cronError.message);
}

fetchData();

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
