import express from 'express';
import { PrismaClient } from '../prisma/generated/client/index.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ai-service' });
});

// Simple dynamic pricing stub
app.get('/pricing/:tripId', (req, res) => {
  const { tripId } = req.params;
  const basePrice = 1000; // placeholder
  res.json({ tripId, price: basePrice, strategy: 'static-stub' });
});

// Log pricing call (example persistence)
const prisma = new PrismaClient();
app.post('/pricing/:tripId/log', async (req, res) => {
  const { tripId } = req.params;
  const { basePrice, finalPrice, factors } = req.body || {};
  if (!basePrice || !finalPrice) {
    return res.status(400).json({ error: 'basePrice and finalPrice required' });
  }
  const log = await prisma.pricingLog.create({ 
    data: { 
      tripId, 
      inputs: factors ?? {}, 
      price: finalPrice, 
      strategy: 'dynamic' 
    } 
  });
  res.status(201).json(log);
});

const port = Number(process.env.PORT || 3003);
export { app };
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`ai-service listening on http://localhost:${port}`);
  });
}


