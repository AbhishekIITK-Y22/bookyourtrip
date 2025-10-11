import request from 'supertest';
import { app } from '../src/index';

describe('Booking Service basic', () => {
  it('health endpoint works', async () => {
    await request(app).get('/health').expect(200);
  });
});


