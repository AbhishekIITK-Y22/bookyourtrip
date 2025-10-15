import express from 'express';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, Prisma } from '../prisma/generated/client/index.js';
import { z } from 'zod';
import { logger, requestLogger } from './logger.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

const prisma = new PrismaClient();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['CUSTOMER', 'PROVIDER']).default('CUSTOMER'),
  companyName: z.string().optional(), // Required for PROVIDER role (validated in handler)
});

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Signup a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *               role: { type: string, enum: [CUSTOMER, PROVIDER] }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Bad Request }
 *       409: { description: Conflict }
 */
app.post('/auth/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    logger.warn({ errors: parsed.error.flatten() }, 'Signup validation failed');
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { email, password, role, companyName } = parsed.data;
  
  // Validate companyName is provided for PROVIDER role
  if (role === 'PROVIDER' && !companyName) {
    logger.warn({ email, role }, 'Signup validation failed: companyName required for PROVIDER');
    return res.status(400).json({ error: { formErrors: ['Company name is required for provider accounts'] } });
  }
  
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    logger.warn({ email }, 'Signup failed: email already registered');
    return res.status(409).json({ error: 'Email already registered' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed, role } });
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '2h' });
  logger.info({ userId: user.id, email, role }, 'User signed up successfully');
  
  // If PROVIDER, auto-create Provider entity in booking-service
  if (role === 'PROVIDER' && companyName) {
    try {
      const bookingServiceUrl = process.env.BOOKING_SERVICE_URL || 'http://booking-service:3002';
      const providerRes = await fetch(`${bookingServiceUrl}/providers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name: companyName })
      });
      
      if (!providerRes.ok) {
        const errorData = await providerRes.json();
        logger.error({ userId: user.id, companyName, error: errorData }, 'Failed to create Provider entity');
        // Continue anyway - user is created, provider can be created later
      } else {
        const providerData = await providerRes.json();
        logger.info({ userId: user.id, providerId: providerData.id, companyName }, 'Provider entity created successfully');
      }
    } catch (e) {
      logger.error({ error: e, userId: user.id, companyName }, 'Error calling booking-service to create Provider');
      // Continue anyway
    }
  }
  
  res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

const loginSchema = z.object({ email: z.string().email(), password: z.string() });

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: OK }
 *       400: { description: Bad Request }
 *       401: { description: Unauthorized }
 */
app.post('/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '2h' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

const port = Number(process.env.PORT || 3001);
export { app };
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`auth-service listening on http://localhost:${port}`);
  });
}


