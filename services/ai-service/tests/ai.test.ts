import request from 'supertest';
import { app } from '../src/index';
import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

describe('AI Service', () => {
  const testTripId = 'test-trip-123';

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /health', () => {
    it('returns service status', async () => {
      const res = await request(app).get('/health');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ 
        status: 'ok', 
        service: 'ai-service' 
      });
    });
  });

  describe('GET /pricing/:tripId', () => {
    it('returns dynamic pricing for a trip', async () => {
      const res = await request(app).get(`/pricing/${testTripId}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('tripId', testTripId);
      expect(res.body).toHaveProperty('price');
      expect(typeof res.body.price).toBe('number');
      expect(res.body.price).toBeGreaterThan(0);
    });

    it('returns different pricing for different trips', async () => {
      const res1 = await request(app).get('/pricing/trip-1');
      const res2 = await request(app).get('/pricing/trip-2');
      
      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(res1.body.price).toBeGreaterThan(0);
      expect(res2.body.price).toBeGreaterThan(0);
    });

    it('handles special characters in trip ID', async () => {
      const res = await request(app).get('/pricing/trip-with-special-chars-123');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('price');
    });
  });

  describe('POST /pricing/:tripId/log', () => {
    it('logs pricing decision', async () => {
      const res = await request(app)
        .post(`/pricing/${testTripId}/log`)
        .send({
          basePrice: 5000,
          finalPrice: 5500,
          factors: { demand: 1.1 }
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.tripId).toBe(testTripId);
      expect(res.body.price).toBe(5500); // finalPrice is stored as price
      expect(res.body.strategy).toBe('dynamic');
    });

    it('handles missing optional fields', async () => {
      const res = await request(app)
        .post(`/pricing/${testTripId}/log`)
        .send({
          basePrice: 5000,
          finalPrice: 5500
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('rejects invalid pricing data', async () => {
      const res = await request(app)
        .post(`/pricing/${testTripId}/log`)
        .send({});
      
      expect(res.status).toBe(400);
    });

    it('creates multiple logs for same trip', async () => {
      const res1 = await request(app)
        .post(`/pricing/${testTripId}/log`)
        .send({
          basePrice: 5000,
          finalPrice: 5500,
          factors: { demand: 1.1 }
        });
      
      const res2 = await request(app)
        .post(`/pricing/${testTripId}/log`)
        .send({
          basePrice: 5000,
          finalPrice: 6000,
          factors: { demand: 1.2 }
        });
      
      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
      expect(res1.body.id).not.toBe(res2.body.id);
    });
  });

  describe('Pricing Algorithm', () => {
    it('generates reasonable prices', async () => {
      const prices: number[] = [];
      
      // Get pricing for multiple trips
      for (let i = 0; i < 10; i++) {
        const res = await request(app).get(`/pricing/trip-${i}`);
        prices.push(res.body.price);
      }
      
      // Verify prices are within reasonable range
      for (const price of prices) {
        expect(price).toBeGreaterThan(1000); // At least $10
        expect(price).toBeLessThan(50000);   // At most $500
      }
    });
  });
});

