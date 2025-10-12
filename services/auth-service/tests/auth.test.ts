import request from 'supertest';
import { app } from '../src/index';
import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

describe('Auth Service', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /health', () => {
    it('returns service status', async () => {
      const res = await request(app).get('/health');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ 
        status: 'ok', 
        service: 'auth-service' 
      });
    });
  });

  describe('POST /auth/signup', () => {
    it('creates a new customer user', async () => {
      const email = `customer_${Date.now()}@test.com`;
      const res = await request(app)
        .post('/auth/signup')
        .send({ 
          email, 
          password: 'password123', 
          role: 'CUSTOMER' 
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(email);
      expect(res.body.user.role).toBe('CUSTOMER');
    }, 15000);

    it('creates a new provider user', async () => {
      const email = `provider_${Date.now()}@test.com`;
      const res = await request(app)
        .post('/auth/signup')
        .send({ 
          email, 
          password: 'password123', 
          role: 'PROVIDER' 
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.role).toBe('PROVIDER');
    }, 15000);

    it('rejects duplicate email', async () => {
      const email = `duplicate_${Date.now()}@test.com`;
      await request(app)
        .post('/auth/signup')
        .send({ email, password: 'password123', role: 'CUSTOMER' });
      
      const res = await request(app)
        .post('/auth/signup')
        .send({ email, password: 'password123', role: 'CUSTOMER' });
      
      expect(res.status).toBe(409);
    }, 15000);

    it('rejects invalid email format', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({ 
          email: 'notanemail', 
          password: 'password123', 
          role: 'CUSTOMER' 
        });
      
      expect(res.status).toBe(400);
    });

    it('rejects short password', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({ 
          email: `shortpass_${Date.now()}@test.com`, 
          password: '123', 
          role: 'CUSTOMER' 
        });
      
      expect(res.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('returns token for valid credentials', async () => {
      const email = `login_${Date.now()}@test.com`;
      const password = 'password123';
      
      // Create user
      await request(app)
        .post('/auth/signup')
        .send({ email, password, role: 'CUSTOMER' });
      
      // Login
      const res = await request(app)
        .post('/auth/login')
        .send({ email, password });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(email);
    }, 20000);

    it('rejects wrong password', async () => {
      const email = `wrongpass_${Date.now()}@test.com`;
      await request(app)
        .post('/auth/signup')
        .send({ email, password: 'correctpass', role: 'CUSTOMER' });
      
      const res = await request(app)
        .post('/auth/login')
        .send({ email, password: 'wrongpassword' });
      
      expect(res.status).toBe(401);
    }, 20000);

    it('rejects non-existent user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ 
          email: `nonexistent_${Date.now()}@test.com`, 
          password: 'password123' 
        });
      
      expect(res.status).toBe(401);
    });
  });
});
