const request = require('supertest');
const app = require('../app');

describe('GET /balanceData', () => {
  it('should return 404 if no data is available', async () => {
    const response = await request(app).get('/balanceData');
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('No data available yet.');
  });

  it('should return data if it is available', async () => {
    const mockData = { balance: 12345 };
    app.setStoredData(mockData);
    const response = await request(app).get('/balanceData');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockData);
  });
});