import express, { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../prisma/generated/client/index.js';
import { z } from 'zod';
import Redis from 'ioredis';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();
app.use(express.json());

// Swagger
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Booking Service', version: '1.0.0' },
  },
  // Include TS in dev and built JS in prod
  apis: ['./src/**/*.ts', './dist/**/*.js'],
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'booking-service' });
});

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

// Auth middleware
function auth(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'missing token' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as jwt.JwtPayload;
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'invalid token' });
  }
}

// Simple routes for provider and trips (stubs to verify DB connectivity)
/**
 * @openapi
 * /providers:
 *   post:
 *     summary: Create provider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *     responses: { 201: { description: Created } }
 */
app.post('/providers', async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const provider = await prisma.provider.create({ data: { name } });
  res.status(201).json(provider);
});

/**
 * @openapi
 * /routes:
 *   post:
 *     summary: Create route
 */
app.post('/routes', async (req: Request, res: Response) => {
  const { providerId, source, destination } = req.body;
  if (!providerId || !source || !destination) return res.status(400).json({ error: 'providerId, source, destination required' });
  const route = await prisma.route.create({ data: { providerId, source, destination } });
  res.status(201).json(route);
});

/**
 * @openapi
 * /trips:
 *   post:
 *     summary: Create trip
 */
app.post('/trips', async (req: Request, res: Response) => {
  const { routeId, departure, capacity, basePrice } = req.body;
  if (!routeId || !departure || !capacity || !basePrice) return res.status(400).json({ error: 'routeId, departure, capacity, basePrice required' });
  const trip = await prisma.trip.create({ data: { routeId, departure: new Date(departure), capacity, basePrice } });
  res.status(201).json(trip);
});

// Search/filter listings
/**
 * @openapi
 * /search:
 *   get:
 *     summary: Search trips
 */
app.get('/search', async (req: Request, res: Response) => {
  const { from, to, date } = req.query as Record<string, string | undefined>;
  const where: any = {};
  if (from || to) {
    where.route = {};
    if (from) where.route.source = String(from);
    if (to) where.route.destination = String(to);
  }
  if (date) {
    const start = new Date(String(date));
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    where.departure = { gte: start, lt: end };
  }
  const trips = await prisma.trip.findMany({ where, include: { route: true } });
  res.json(trips);
});

// Protected booking create (skeleton)
const createBookingSchema = z.object({ tripId: z.string(), seatNo: z.string(), price: z.number().optional() });
/**
 * @openapi
 * /bookings:
 *   post:
 *     summary: Create booking (idempotent)
 */
app.post('/bookings', auth, async (req: Request, res: Response) => {
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { tripId, seatNo, price } = parsed.data;
  const userId = ((req as any).user?.sub ?? '') as string;
  const idempotencyKey = (req.headers['idempotency-key'] ?? '') as string;
  try {
    if (idempotencyKey) {
      const existing = await prisma.booking.findUnique({ where: { idempotencyKey } });
      if (existing) return res.status(200).json(existing);
    }
    const holdKey = `hold:${tripId}:${seatNo}`;
    const holdOk = await redis.set(holdKey, userId, 'EX', 120, 'NX');
    if (!holdOk) return res.status(409).json({ error: 'seat temporarily held' });

    let appliedPrice = price ?? 0;
    if (!price) {
      const aiUrl = process.env.AI_SERVICE_URL || 'http://ai-service:3003';
      const resp = await fetch(`${aiUrl}/pricing/${encodeURIComponent(tripId)}`);
      const data = await resp.json();
      appliedPrice = Number(data.price ?? 0);
    }
    const booking = await prisma.booking.create({ data: { tripId, userId, seatNo, priceApplied: appliedPrice, idempotencyKey: idempotencyKey || null } });
    await redis.del(holdKey);
    return res.status(201).json(booking);
  } catch (e) {
    // release hold on failure
    try { await redis.del(`hold:${parsed.data.tripId}:${parsed.data.seatNo}`); } catch {}
    return res.status(409).json({ error: 'seat already taken' });
  }
});

// Cancel booking (seat release via unique constraint suffices)
/**
 * @openapi
 * /bookings/{id}/cancel:
 *   post:
 *     summary: Cancel booking
 */
app.post('/bookings/:id/cancel', auth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await prisma.booking.update({ where: { id }, data: { state: 'CANCELLED' } });
  res.json(updated);
});

// Reschedule with penalty
const rescheduleSchema = z.object({ newTripId: z.string(), newSeatNo: z.string() });
/**
 * @openapi
 * /bookings/{id}/reschedule:
 *   post:
 *     summary: Reschedule booking
 */
app.post('/bookings/:id/reschedule', auth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = rescheduleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { newTripId, newSeatNo } = parsed.data;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return res.status(404).json({ error: 'not found' });
  // Compute penalty: 20% if <24h to original departure, else 0
  const originalTrip = await prisma.trip.findUnique({ where: { id: booking.tripId } });
  if (!originalTrip) return res.status(400).json({ error: 'original trip missing' });
  const hoursToDeparture = (new Date(originalTrip.departure).getTime() - Date.now()) / 36e5;
  const penaltyPct = hoursToDeparture < 24 ? 0.2 : 0;
  const aiUrl = process.env.AI_SERVICE_URL || 'http://ai-service:3003';
  const resp = await fetch(`${aiUrl}/pricing/${encodeURIComponent(newTripId)}`);
  const data = await resp.json();
  const basePrice = Number(data.price ?? booking.priceApplied);
  const penalty = Math.round(basePrice * penaltyPct);
  try {
    const updated = await prisma.booking.update({
      where: { id },
      data: { tripId: newTripId, seatNo: newSeatNo, priceApplied: basePrice + penalty, state: 'RESCHEDULED' },
    });
    res.json(updated);
  } catch (e) {
    return res.status(409).json({ error: 'new seat already taken' });
  }
});

// Provider disable/enable
/**
 * @openapi
 * /providers/{id}/status:
 *   patch:
 *     summary: Update provider status
 */
app.patch('/providers/:id/status', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status?: 'ACTIVE' | 'DISABLED' };
  if (!status) return res.status(400).json({ error: 'status required' });
  const provider = await prisma.provider.update({ where: { id }, data: { status } });
  res.json(provider);
});

const port = Number(process.env.PORT || 3002);
export { app };
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`booking-service listening on http://localhost:${port}`);
  });
}


