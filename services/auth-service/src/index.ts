import express from 'express';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, Prisma } from '../prisma/generated/client/index.js';
import { z } from 'zod';
import { logger, requestLogger } from './logger.js';
import cors from 'cors';
import Redis from 'ioredis';
import { sendSignupOtpEmail } from './mailer.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['CUSTOMER', 'PROVIDER']).default('CUSTOMER'),
  companyName: z.string().optional(), // Required for PROVIDER role (validated in handler)
});

// OTP-based signup (step 1): initiate email verification
const signupInitiateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['CUSTOMER', 'PROVIDER']).default('CUSTOMER'),
  companyName: z.string().optional(),
});

/**
 * @openapi
 * /auth/signup/initiate:
 *   post:
 *     summary: Initiate signup with email OTP verification
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
 *               companyName: { type: string }
 *     responses:
 *       200: { description: OTP sent if SMTP configured, or logged in dev }
 *       400: { description: Bad Request }
 *       409: { description: Email already registered }
 */
app.post('/auth/signup/initiate', async (req, res) => {
  const parsed = signupInitiateSchema.safeParse(req.body);
  if (!parsed.success) {
    logger.warn({ errors: parsed.error.flatten() }, 'Signup initiate validation failed');
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { email, password, role, companyName } = parsed.data;

  if (role === 'PROVIDER' && !companyName) {
    return res.status(400).json({ error: { formErrors: ['Company name is required for provider accounts'] } });
  }

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  // Prepare OTP + payload
  const hashedPassword = await bcrypt.hash(password, 10);
  const otpCode = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
  const otpHash = await bcrypt.hash(otpCode, 10);
  const payload = {
    hashedPassword,
    role,
    companyName: companyName ?? null,
  };

  // In development without SMTP, print OTP to logs for convenience
  if (
    process.env.NODE_ENV !== 'production' &&
    !process.env.SMTP_SERVICE &&
    !process.env.SMTP_HOST
  ) {
    // Log OTP prominently so it's easy to find
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📧 DEV MODE: OTP Code (SMTP not configured)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Email: ${email}`);
    console.log(`OTP Code: ${otpCode}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    logger.warn({ email, otpCode }, 'DEV ONLY: OTP code (no SMTP configured)');
  }

  const key = `signup:otp:${email}`;
  const entry = {
    otpHash,
    payload,
    attempts: 0,
    createdAt: Date.now(),
  };
  // TTL 10 minutes
  await redis.set(key, JSON.stringify(entry), 'EX', 10 * 60);

  try {
    await sendSignupOtpEmail(email, otpCode);
  } catch (e) {
    // If SMTP not configured, mailer logs a warning; continue
    logger.warn({ email }, 'OTP email not sent (likely SMTP not configured). OTP logged in dev.');
  }

  logger.info({ email }, 'Signup OTP initiated');
  return res.json({ ok: true, message: 'Verification code sent to email (valid for 10 minutes)' });
});

// OTP-based signup (step 2): verify OTP and create account
const signupVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/),
});

/**
 * @openapi
 * /auth/signup/verify:
 *   post:
 *     summary: Verify OTP and complete signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email }
 *               otp: { type: string, minLength: 6, maxLength: 6 }
 *     responses:
 *       201: { description: Account created }
 *       400: { description: Bad Request }
 *       401: { description: Invalid or expired OTP }
 *       409: { description: Email already registered }
 */
app.post('/auth/signup/verify', async (req, res) => {
  const parsed = signupVerifySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { email, otp } = parsed.data;

  const key = `signup:otp:${email}`;
  const raw = await redis.get(key);
  if (!raw) {
    return res.status(401).json({ error: 'Invalid or expired code' });
  }
  let entry: { otpHash: string; payload: { hashedPassword: string; role: string; companyName: string | null }; attempts: number } | null = null;
  try {
    entry = JSON.parse(raw);
  } catch {
    // Corrupted entry; remove and abort
    await redis.del(key);
    return res.status(401).json({ error: 'Invalid or expired code' });
  }

  // Ensure parsed entry exists
  if (!entry) {
    await redis.del(key);
    return res.status(401).json({ error: 'Invalid or expired code' });
  }

  // Limit attempts (max 5)
  if (entry.attempts >= 5) {
    await redis.del(key);
    return res.status(401).json({ error: 'Too many attempts. Please restart signup.' });
  }

  const isMatch = await bcrypt.compare(otp, entry.otpHash);
  if (!isMatch) {
    // Increment attempts
    entry.attempts += 1;
    await redis.set(key, JSON.stringify(entry), 'EX', 10 * 60);
    return res.status(401).json({ error: 'Incorrect code' });
  }

  // Double-check not already registered concurrently
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await redis.del(key);
    return res.status(409).json({ error: 'Email already registered' });
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: entry.payload.hashedPassword,
      role: (entry.payload.role as 'CUSTOMER' | 'PROVIDER') ?? 'CUSTOMER',
      // phone is optional; not set here
    },
  });

  // Cleanup OTP
  await redis.del(key);

  // Provider auto-create if needed
  if (user.role === 'PROVIDER' && entry.payload.companyName) {
    try {
      const bookingServiceUrl = process.env.BOOKING_SERVICE_URL || 'http://localhost:3002';
      const providerRes = await fetch(`${bookingServiceUrl}/providers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name: entry.payload.companyName }),
      });
      if (!providerRes.ok) {
        const errorData = await providerRes.json().catch(() => ({}));
        logger.error({ userId: user.id, error: errorData }, 'Failed to create Provider entity (post-verify)');
      }
    } catch (e) {
      logger.error({ error: e, userId: user.id }, 'Error calling booking-service to create Provider (post-verify)');
    }
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '2h' });
  logger.info({ userId: user.id, email, role: user.role }, 'User signup verified successfully');
  return res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
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
      const bookingServiceUrl = process.env.BOOKING_SERVICE_URL || 'http://localhost:3002';
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


