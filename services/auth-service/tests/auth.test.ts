import request from 'supertest';
import { app } from '../src/index';

describe('Auth Service', () => {
  it('signup then login', async () => {
    const email = `user_${Date.now()}@test.com`;
    const password = 'Password1!';
    await request(app).post('/auth/signup').send({ email, password, role: 'CUSTOMER' }).expect(201);
    const res = await request(app).post('/auth/login').send({ email, password }).expect(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe(email);
  });
});


