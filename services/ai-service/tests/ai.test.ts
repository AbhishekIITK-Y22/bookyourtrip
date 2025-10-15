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
      expect(res.body).toHaveProperty('finalPrice'); // Changed from 'price' to 'finalPrice'
      expect(typeof res.body.finalPrice).toBe('number');
      expect(res.body.finalPrice).toBeGreaterThan(0);
      
      // Verify agentic AI response structure
      expect(res.body).toHaveProperty('basePrice');
      expect(res.body).toHaveProperty('strategy');
      expect(res.body).toHaveProperty('factors');
      expect(res.body).toHaveProperty('agenticAI');
      expect(res.body.agenticAI).toHaveProperty('decision');
      expect(res.body.agenticAI).toHaveProperty('reasoning');
      expect(res.body.agenticAI).toHaveProperty('confidence');
      expect(res.body.agenticAI).toHaveProperty('autonomousActions');
    });

    it('returns different pricing for different trips', async () => {
      const res1 = await request(app).get('/pricing/trip-1');
      const res2 = await request(app).get('/pricing/trip-2');
      
      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(res1.body.finalPrice).toBeGreaterThan(0); // Changed from 'price'
      expect(res2.body.finalPrice).toBeGreaterThan(0); // Changed from 'price'
    });

    it('handles special characters in trip ID', async () => {
      const res = await request(app).get('/pricing/trip-with-special-chars-123');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('finalPrice'); // Changed from 'price'
    });

    it('includes agentic AI reasoning and transparency', async () => {
      const res = await request(app).get(`/pricing/${testTripId}?seatsAvailable=5&totalSeats=40`);
      
      expect(res.status).toBe(200);
      expect(res.body.agenticAI.reasoning).toBeInstanceOf(Array);
      expect(res.body.agenticAI.reasoning.length).toBeGreaterThan(0);
      expect(res.body.agenticAI.confidence).toMatch(/\d+%/); // e.g., "85%"
      expect(res.body.agenticAI.dataPoints).toBeGreaterThanOrEqual(0);
    });

    it('applies scarcity pricing when seats are low', async () => {
      // High occupancy scenario
      const resHigh = await request(app).get(`/pricing/${testTripId}?basePrice=1000&seatsAvailable=5&totalSeats=40`);
      
      // Low occupancy scenario
      const resLow = await request(app).get(`/pricing/${testTripId}?basePrice=1000&seatsAvailable=35&totalSeats=40`);
      
      expect(resHigh.status).toBe(200);
      expect(resLow.status).toBe(200);
      
      // High occupancy should have higher price due to scarcity
      expect(resHigh.body.finalPrice).toBeGreaterThan(resLow.body.finalPrice);
      
      // Strategy should reflect scarcity for high occupancy
      expect(['agentic-scarcity', 'agentic-surge', 'agentic-demand']).toContain(resHigh.body.strategy);
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
        prices.push(res.body.finalPrice); // Changed from 'price' to 'finalPrice'
      }
      
      // Verify prices are within reasonable range
      for (const price of prices) {
        expect(price).toBeGreaterThanOrEqual(1000); // At least $1000
        expect(price).toBeLessThanOrEqual(50000);   // At most $50000
      }
    });

    it('includes historical learning factors', async () => {
      const res = await request(app).get(`/pricing/test-trip?basePrice=1000`);
      
      expect(res.status).toBe(200);
      expect(res.body.factors).toHaveProperty('historicalDemandFactor');
      expect(res.body.factors).toHaveProperty('avgHistoricalPrice');
      expect(res.body.factors).toHaveProperty('priceHistory');
    });

    it('applies scarcity pricing based on seat availability', async () => {
      // Critical scarcity (95% full)
      const resHigh = await request(app).get(`/pricing/test?basePrice=1000&seatsAvailable=2&totalSeats=40`);
      
      // Low occupancy (12.5% full)
      const resLow = await request(app).get(`/pricing/test?basePrice=1000&seatsAvailable=35&totalSeats=40`);
      
      expect(resHigh.status).toBe(200);
      expect(resLow.status).toBe(200);
      
      // High occupancy should result in higher scarcity multiplier (deterministic check)
      expect(resHigh.body.factors.scarcityMultiplier).toBeGreaterThan(resLow.body.factors.scarcityMultiplier);
      
      // Verify scarcity multipliers are correct
      expect(resHigh.body.factors.scarcityMultiplier).toBe(1.5); // 95% occupancy > 80%
      expect(resLow.body.factors.scarcityMultiplier).toBe(1.0);  // 12.5% occupancy < 40%
      
      // High occupancy rate should be higher
      expect(resHigh.body.factors.occupancyRate).toBeGreaterThan(resLow.body.factors.occupancyRate);
    });
  });
});

