import request from 'supertest';
import app from "../index"

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

describe('GET /', () => {
  it('should return 200 and a greeting message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, TypeScript with Express!');
  });
});
