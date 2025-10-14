import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../prisma/generated/client/index.js';
import { z } from 'zod';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*'}));

// Removed Swagger to avoid test dependencies

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

/*const schemas = {
        CreateProvider: {
          type: 'object',
          required: ['name'],
          properties: { name: { type: 'string' } },
        },
        CreateRoute: {
          type: 'object',
          required: ['providerId', 'source', 'destination'],
          properties: {
            providerId: { type: 'string' },
            source: { type: 'string' },
            destination: { type: 'string' },
          },
        },
        CreateTrip: {
          type: 'object',
          required: ['routeId', 'departure', 'capacity', 'basePrice'],
          properties: {
            routeId: { type: 'string' },
            departure: { type: 'string', format: 'date-time' },
            capacity: { type: 'integer' },
            basePrice: { type: 'integer' },
          },
        },
        CreateBooking: {
          type: 'object',
          required: ['tripId', 'seatNo'],
          properties: {
            tripId: { type: 'string' },
            seatNo: { type: 'string' },
            price: { type: 'number' },
            passengerName: { type: 'string' },
            passengerEmail: { type: 'string', format: 'email' },
            passengerPhone: { type: 'string' },
          },
        },
        UpdatePassengerDetails: {
          type: 'object',
          properties: {
            passengerName: { type: 'string' },
            passengerEmail: { type: 'string', format: 'email' },
            passengerPhone: { type: 'string' },
          },
        },
        UpdateProviderDetails: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            description: { type: 'string' },
          },
        },
        ProcessPayment: {
          type: 'object',
          required: ['cardNumber'],
          properties: {
            cardNumber: { type: 'string' },
            expiryDate: { type: 'string' },
            cvv: { type: 'string' },
          },
        },
        RescheduleBooking: {
          type: 'object',
          required: ['newTripId', 'newSeatNo'],
          properties: {
            newTripId: { type: 'string' },
            newSeatNo: { type: 'string' },
          },
        },
        UpdateProviderStatus: {
          type: 'object',
          required: ['status'],
          properties: { status: { type: 'string', enum: ['ACTIVE', 'DISABLED'] } },
        },
      },
    },
  },
   Include TS in dev and built JS in prod
 */ 
// apis: ['./src/**/*.ts', './dist/**/*.js'],*/
//});
//app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// Simple routes for provider and trips (stubs to verify DB connectivity)
/**
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoute'
 */
app.post('/routes', async (req: Request, res: Response) => {
  const { providerId, source, destination } = req.body;
  if (!providerId || !source || !destination) return res.status(400).json({ error: 'providerId, source, destination required' });
  const route = await prisma.route.create({ data: { providerId, source, destination } });
  res.status(201).json(route);
});

// Listings for provider dashboard
app.get('/providers', async (_req: Request, res: Response) => {
  const providers = await prisma.provider.findMany();
  res.json(providers);
});

app.get('/routes', async (_req: Request, res: Response) => {
  const routes = await prisma.route.findMany({ include: { provider: true } });
  res.json(routes);
});

app.get('/trips', async (_req: Request, res: Response) => {
  const trips = await prisma.trip.findMany({ include: { route: true } });
  res.json(trips);
});

// Get a single trip with seats and route
app.get('/trips/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const trip = await prisma.trip.findUnique({ 
    where: { id }, 
    include: { 
      route: true,
      seats: true,
    } 
  });
  if (!trip) return res.status(404).json({ error: 'not found' });
  res.json(trip);
});

/**
 * @openapi
 * /trips:
 *   post:
 *     summary: Create trip
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTrip'
 */
app.post('/trips', async (req: Request, res: Response) => {
  const { routeId, departure, capacity, basePrice } = req.body;
  if (!routeId || !departure || !capacity || !basePrice) return res.status(400).json({ error: 'routeId, departure, capacity, basePrice required' });
  const trip = await prisma.trip.create({ data: { routeId, departure: new Date(departure), capacity, basePrice } });
  
  // Auto-create seats for the trip
  const seats = [];
  for (let i = 1; i <= capacity; i++) {
    seats.push({
      tripId: trip.id,
      seatNo: `A${i.toString().padStart(2, '0')}`,
      status: 'AVAILABLE' as const
    });
  }
  await prisma.seat.createMany({ data: seats });
  
  res.status(201).json(trip);
});

// Search/filter listings
/**
 * @openapi
 * /search:
 *   get:
 *     summary: Search trips
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string }
 *       - in: query
 *         name: to
 *         schema: { type: string }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
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
  const trips = await prisma.trip.findMany({ 
    where, 
    include: { 
      route: true,
      seats: {
        where: { status: 'AVAILABLE' }
      }
    } 
  });
  res.json(trips);
});

// Protected booking create (skeleton)
const createBookingSchema = z.object({ 
  tripId: z.string(), 
  seatNo: z.string(), 
  price: z.number().optional(),
  passengerName: z.string().optional(),
  passengerEmail: z.string().email().optional(),
  passengerPhone: z.string().optional(),
});
/**
 * @openapi
 * /bookings:
 *   post:
 *     summary: Create booking (idempotent)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Idempotency-Key
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBooking'
 */
app.post('/bookings', auth, async (req: Request, res: Response) => {
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { tripId, seatNo, price, passengerName, passengerEmail, passengerPhone } = parsed.data;
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

    // Determine applied price using AGENTIC AI
    let appliedPrice: number | null = typeof price === 'number' ? price : null;
    if (appliedPrice == null) {
      // Try AI service first; if unavailable, fall back to trip basePrice
      let aiPrice: number | null = null;
      try {
        const aiUrl = process.env.AI_SERVICE_URL || 'http://ai-service:3003';
        
        // Get trip details for AI agent (capacity, availability, base price)
        const tripWithSeats = await prisma.trip.findUnique({
          where: { id: tripId },
          include: {
            seats: {
              where: { status: 'AVAILABLE' }
            }
          }
        });
        
        if (tripWithSeats) {
          const seatsAvailable = tripWithSeats.seats.length;
          const totalSeats = tripWithSeats.capacity;
          
          // Call AGENTIC AI with seat availability data
          const pricingUrl = `${aiUrl}/pricing/${encodeURIComponent(tripId)}?basePrice=${tripWithSeats.basePrice}&seatsAvailable=${seatsAvailable}&totalSeats=${totalSeats}`;
          const resp = await fetch(pricingUrl);
          
          if (resp.ok) {
            const data = await resp.json();
            const parsed = Number(data.finalPrice);
            if (!Number.isNaN(parsed) && parsed > 0) aiPrice = parsed;
          }
        }
      } catch {
        // ignore network/AI errors and fall back to basePrice
      }
      if (aiPrice == null) {
        const trip = await prisma.trip.findUnique({ where: { id: tripId }, select: { basePrice: true } });
        appliedPrice = trip?.basePrice ?? 0;
      } else {
        appliedPrice = aiPrice;
      }
    }
    const booking = await prisma.booking.create({ 
      data: { 
        tripId, 
        userId, 
        seatNo, 
        priceApplied: appliedPrice, 
        idempotencyKey: idempotencyKey || null,
        passengerName: passengerName || null,
        passengerEmail: passengerEmail || null,
        passengerPhone: passengerPhone || null,
      } 
    });
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
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
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
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RescheduleBooking'
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProviderStatus'
 */
app.patch('/providers/:id/status', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status?: 'ACTIVE' | 'DISABLED' };
  if (!status) return res.status(400).json({ error: 'status required' });
  const provider = await prisma.provider.update({ where: { id }, data: { status } });
  res.json(provider);
});

// Update provider details
/**
 * @openapi
 * /providers/{id}:
 *   patch:
 *     summary: Update provider details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProviderDetails'
 */
app.patch('/providers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, description } = req.body;
  const updateData: any = {};
  if (name) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (description !== undefined) updateData.description = description;
  
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'at least one field required' });
  }
  
  const provider = await prisma.provider.update({ where: { id }, data: updateData });
  res.json(provider);
});

// Update passenger details in booking
/**
 * @openapi
 * /bookings/{id}/passenger:
 *   patch:
 *     summary: Update passenger details
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePassengerDetails'
 */
app.patch('/bookings/:id/passenger', auth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { passengerName, passengerEmail, passengerPhone } = req.body;
  const userId = ((req as any).user?.sub ?? '') as string;
  
  // Verify ownership
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return res.status(404).json({ error: 'booking not found' });
  if (booking.userId !== userId) return res.status(403).json({ error: 'forbidden' });
  
  const updateData: any = {};
  if (passengerName !== undefined) updateData.passengerName = passengerName;
  if (passengerEmail !== undefined) updateData.passengerEmail = passengerEmail;
  if (passengerPhone !== undefined) updateData.passengerPhone = passengerPhone;
  
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'at least one field required' });
  }
  
  const updated = await prisma.booking.update({ where: { id }, data: updateData });
  res.json(updated);
});

// Process payment (dummy implementation)
/**
 * @openapi
 * /bookings/{id}/payment:
 *   post:
 *     summary: Process payment for booking
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProcessPayment'
 */
app.post('/bookings/:id/payment', auth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { cardNumber } = req.body;
  const userId = ((req as any).user?.sub ?? '') as string;
  
  if (!cardNumber) return res.status(400).json({ error: 'cardNumber required' });
  
  // Verify ownership
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return res.status(404).json({ error: 'booking not found' });
  if (booking.userId !== userId) return res.status(403).json({ error: 'forbidden' });
  
  // Check if already paid
  if (booking.paymentState === 'PAID') {
    return res.status(400).json({ error: 'already paid' });
  }
  
  // Dummy payment processing - simulate success/failure based on card number
  const isSuccess = !cardNumber.startsWith('0000'); // Dummy logic: 0000* = failure
  
  if (isSuccess) {
    // Update payment and booking state
    const updated = await prisma.booking.update({
      where: { id },
      data: { 
        paymentState: 'PAID',
        state: 'CONFIRMED' // Auto-confirm on payment
      },
    });
    res.json({ 
      success: true, 
      message: 'payment successful',
      booking: updated 
    });
  } else {
    // Mark as failed
    await prisma.booking.update({
      where: { id },
      data: { paymentState: 'FAILED' },
    });
    res.status(400).json({ 
      success: false, 
      error: 'payment failed' 
    });
  }
});

// Get booking details
/**
 * @openapi
 * /bookings/{id}:
 *   get:
 *     summary: Get booking details
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 */
app.get('/bookings/:id', auth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = ((req as any).user?.sub ?? '') as string;
  const userRole = ((req as any).user?.role ?? '') as string;
  
  const booking = await prisma.booking.findUnique({ 
    where: { id },
    include: { trip: { include: { route: true } } }
  });
  
  if (!booking) return res.status(404).json({ error: 'booking not found' });
  
  // Only allow owner or provider to view
  if (booking.userId !== userId && userRole !== 'PROVIDER') {
    return res.status(403).json({ error: 'forbidden' });
  }
  
  res.json(booking);
});

// List current user's bookings
app.get('/bookings', auth, async (req: Request, res: Response) => {
  const userId = ((req as any).user?.sub ?? '') as string;
  const bookings = await prisma.booking.findMany({ 
    where: { userId }, 
    orderBy: { createdAt: 'desc' as const },
    include: { trip: { include: { route: true } } }
  });
  res.json(bookings);
});

const port = Number(process.env.PORT || 3002);
export { app };
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`booking-service listening on http://localhost:${port}`);
  });
}


