const request = require('supertest');
// Use the real app exported from index for integration checks
const app = require('./index');

describe('basic health check (integration)', () => {
  it('returns ok for the /health endpoint', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('returns running message at root /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(typeof response.text).toBe('string');
  });
});
