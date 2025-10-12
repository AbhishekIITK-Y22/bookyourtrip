import request from 'supertest';
import { app } from '../src/index';
import { PrismaClient } from '../prisma/generated/client/index.js';
import Redis from 'ioredis';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Helper to generate test JWT
function generateTestToken(userId: string, role: string = 'CUSTOMER') {
  return jwt.sign(
    { sub: userId, role },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '1h' }
  );
}

describe('Booking Service', () => {
  let testProviderId: string;
  let testRouteId: string;
  let testTripId: string;
  let testToken: string;
  const testUserId = 'test-user-123';

  beforeAll(async () => {
    // Clean up test data
    await prisma.booking.deleteMany();
    await prisma.trip.deleteMany();
    await prisma.route.deleteMany();
    await prisma.provider.deleteMany();

    // Create test data
    const provider = await prisma.provider.create({
      data: { name: 'Test Provider' }
    });
    testProviderId = provider.id;

    const route = await prisma.route.create({
      data: {
        providerId: testProviderId,
        source: 'CityA',
        destination: 'CityB'
      }
    });
    testRouteId = route.id;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const trip = await prisma.trip.create({
      data: {
        routeId: testRouteId,
        departure: tomorrow,
        capacity: 10,
        basePrice: 5000
      }
    });
    testTripId = trip.id;

    testToken = generateTestToken(testUserId);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redis.quit();
  });

  describe('GET /health', () => {
    it('returns service status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok', service: 'booking-service' });
    });
  });

  describe('POST /providers', () => {
    it('creates a new provider', async () => {
      const res = await request(app)
        .post('/providers')
        .send({ name: 'New Bus Company' });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('New Bus Company');
      expect(res.body.status).toBe('ACTIVE');
    });

    it('rejects missing name', async () => {
      const res = await request(app)
        .post('/providers')
        .send({});
      
      expect(res.status).toBe(400);
    });
  });

  describe('POST /routes', () => {
    it('creates a new route', async () => {
      const res = await request(app)
        .post('/routes')
        .send({
          providerId: testProviderId,
          source: 'New York',
          destination: 'Boston'
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.source).toBe('New York');
      expect(res.body.destination).toBe('Boston');
    });

    it('rejects missing fields', async () => {
      const res = await request(app)
        .post('/routes')
        .send({ source: 'New York' });
      
      expect(res.status).toBe(400);
    });
  });

  describe('POST /trips', () => {
    it('creates a new trip', async () => {
      const departure = new Date();
      departure.setDate(departure.getDate() + 2);
      
      const res = await request(app)
        .post('/trips')
        .send({
          routeId: testRouteId,
          departure: departure.toISOString(),
          capacity: 40,
          basePrice: 3000
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.capacity).toBe(40);
      expect(res.body.basePrice).toBe(3000);
    });

    it('rejects missing fields', async () => {
      const res = await request(app)
        .post('/trips')
        .send({ capacity: 40 });
      
      expect(res.status).toBe(400);
    });

    it('rejects invalid date', async () => {
      const res = await request(app)
        .post('/trips')
        .send({
          routeId: testRouteId,
          departure: 'invalid-date',
          capacity: 40,
          basePrice: 3000
        });
      
      // Prisma will throw an error which gets caught as 500
      expect([400, 500]).toContain(res.status);
    });
  });

  describe('GET /search', () => {
    it('returns all trips without filters', async () => {
      const res = await request(app).get('/search');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('filters by source', async () => {
      const res = await request(app)
        .get('/search')
        .query({ from: 'CityA' });
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((trip: any) => {
        expect(trip.route.source).toBe('CityA');
      });
    });

    it('filters by destination', async () => {
      const res = await request(app)
        .get('/search')
        .query({ to: 'CityB' });
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((trip: any) => {
        expect(trip.route.destination).toBe('CityB');
      });
    });

    it('filters by date', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      
      const res = await request(app)
        .get('/search')
        .query({ date: dateStr });
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('combines multiple filters', async () => {
      const res = await request(app)
        .get('/search')
        .query({ from: 'CityA', to: 'CityB' });
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /bookings', () => {
    it('creates a booking with authentication', async () => {
      const res = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          tripId: testTripId,
          seatNo: 'A1',
          price: 5000
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.tripId).toBe(testTripId);
      expect(res.body.seatNo).toBe('A1');
      expect(res.body.userId).toBe(testUserId);
    });

    it('rejects booking without authentication', async () => {
      const res = await request(app)
        .post('/bookings')
        .send({
          tripId: testTripId,
          seatNo: 'A2'
        });
      
      expect(res.status).toBe(401);
    });

    it('prevents duplicate seat booking', async () => {
      const seatNo = 'A3';
      
      // First booking
      await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          tripId: testTripId,
          seatNo,
          price: 5000
        });
      
      // Second booking for same seat
      const res = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          tripId: testTripId,
          seatNo,
          price: 5000
        });
      
      expect(res.status).toBe(409);
    });

    it('supports idempotency with idempotency-key', async () => {
      const idempotencyKey = `test-key-${Date.now()}`;
      
      // First request
      const res1 = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          tripId: testTripId,
          seatNo: 'A4',
          price: 5000
        });
      
      expect(res1.status).toBe(201);
      const booking1Id = res1.body.id;
      
      // Second request with same key
      const res2 = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          tripId: testTripId,
          seatNo: 'A4',
          price: 5000
        });
      
      expect(res2.status).toBe(200);
      expect(res2.body.id).toBe(booking1Id);
    });

    it('rejects invalid trip ID', async () => {
      const res = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          tripId: 'invalid-trip-id',
          seatNo: 'A5'
        });
      
      // Will fail due to FK constraint or not found
      expect([404, 409, 500]).toContain(res.status);
    });
  });

  describe('POST /bookings/:id/cancel', () => {
    it('cancels an existing booking', async () => {
      // Create booking
      const booking = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          tripId: testTripId,
          seatNo: 'B1',
          price: 5000
        });
      
      const bookingId = booking.body.id;
      
      // Cancel it
      const res = await request(app)
        .post(`/bookings/${bookingId}/cancel`)
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.state).toBe('CANCELLED');
    });

    it('requires authentication', async () => {
      const res = await request(app)
        .post('/bookings/some-id/cancel');
      
      expect(res.status).toBe(401);
    });
  });

  describe('POST /bookings/:id/reschedule', () => {
    it('reschedules a booking to new trip', async () => {
      // Create second trip
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const newTrip = await prisma.trip.create({
        data: {
          routeId: testRouteId,
          departure: tomorrow,
          capacity: 10,
          basePrice: 6000
        }
      });
      
      // Create booking
      const booking = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          tripId: testTripId,
          seatNo: 'C1',
          price: 5000
        });
      
      const bookingId = booking.body.id;
      
      // Reschedule it
      const res = await request(app)
        .post(`/bookings/${bookingId}/reschedule`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          newTripId: newTrip.id,
          newSeatNo: 'C2'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.state).toBe('RESCHEDULED');
      expect(res.body.tripId).toBe(newTrip.id);
      expect(res.body.seatNo).toBe('C2');
    });

    it('requires authentication', async () => {
      const res = await request(app)
        .post('/bookings/some-id/reschedule')
        .send({
          newTripId: testTripId,
          newSeatNo: 'D1'
        });
      
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /providers/:id/status', () => {
    it('updates provider status to DISABLED', async () => {
      const provider = await prisma.provider.create({
        data: { name: 'Provider to Disable' }
      });
      
      const res = await request(app)
        .patch(`/providers/${provider.id}/status`)
        .send({ status: 'DISABLED' });
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('DISABLED');
    });

    it('updates provider status to ACTIVE', async () => {
      const provider = await prisma.provider.create({
        data: { name: 'Provider to Enable', status: 'DISABLED' }
      });
      
      const res = await request(app)
        .patch(`/providers/${provider.id}/status`)
        .send({ status: 'ACTIVE' });
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ACTIVE');
    });

    it('rejects invalid status', async () => {
      const res = await request(app)
        .patch(`/providers/${testProviderId}/status`)
        .send({ status: 'INVALID' });
      
      // Prisma will reject invalid enum value
      expect([400, 500]).toContain(res.status);
    }, 15000);

    it('rejects missing status', async () => {
      const res = await request(app)
        .patch(`/providers/${testProviderId}/status`)
        .send({});
      
      expect(res.status).toBe(400);
    });
  });
});
