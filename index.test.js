// index.test.js
const request = require('supertest');
require('dotenv').config();

let server;
beforeAll(() => {
  server = require('./index');
});
afterAll(() => {
  server.close();
});

describe('GET /', () => {
  it('should respond with welcome message', async () => {
    const res = await request(server).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Welcome to the enhanced Node\.js Scalability Demo/);
  });
});

describe('GET /data', () => {
  it('should return JSON with content field', async () => {
    const res = await request(server).get('/data');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('content');
  });
});