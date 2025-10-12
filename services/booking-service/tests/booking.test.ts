import request from 'supertest';
import { app } from '../src/index';
import { PrismaClient } from '../prisma/generated/client/index.js';
import Redis from 'ioredis';

describe('Booking Service basic', () => {
  const prisma = new PrismaClient();
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  afterAll(async () => {
    await prisma.$disconnect();
    await redis.quit();
  });

  it('health endpoint works', async () => {
    await request(app).get('/health').expect(200);
  });
});


