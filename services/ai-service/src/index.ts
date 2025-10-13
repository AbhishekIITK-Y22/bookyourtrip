import express from 'express';
import { PrismaClient } from '../prisma/generated/client/index.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ai-service' });
});

// AI-Powered Dynamic Pricing
app.get('/pricing/:tripId', async (req, res) => {
  const { tripId } = req.params;
  const { basePrice: queryBasePrice } = req.query;
  
  // Get base price from query or database
  const basePrice = queryBasePrice ? Number(queryBasePrice) : 1000;
  
  // AI-driven pricing factors (Agentic AI decision making)
  const factors = {
    // Time-based surge pricing
    timeOfDay: new Date().getHours(),
    dayOfWeek: new Date().getDay(),
    
    // Demand simulation (AI prediction)
    demandMultiplier: 1 + (Math.random() * 0.5), // 1.0 to 1.5x
    
    // Seasonal factors
    isWeekend: new Date().getDay() === 0 || new Date().getDay() === 6,
    isPeakHour: new Date().getHours() >= 8 && new Date().getHours() <= 20,
    
    // Randomized AI "prediction" of demand
    predictedDemand: Math.random() > 0.5 ? 'high' : 'normal',
  };
  
  // AI Pricing Algorithm (Rule-based + ML simulation)
  let finalPrice = basePrice;
  
  // Weekend surge (20% increase)
  if (factors.isWeekend) {
    finalPrice *= 1.2;
  }
  
  // Peak hour pricing (15% increase)
  if (factors.isPeakHour) {
    finalPrice *= 1.15;
  }
  
  // AI demand prediction (apply demand multiplier)
  finalPrice *= factors.demandMultiplier;
  
  // High demand surge (AI prediction)
  if (factors.predictedDemand === 'high') {
    finalPrice *= 1.25;
  }
  
  // Round to nearest 10
  finalPrice = Math.round(finalPrice / 10) * 10;
  
  // Determine strategy used
  let strategy = 'dynamic-ai';
  if (factors.isWeekend && factors.isPeakHour) {
    strategy = 'surge-pricing';
  } else if (factors.predictedDemand === 'high') {
    strategy = 'demand-based';
  }
  
  // Log pricing decision to database for AI learning
  try {
    await prisma.pricingLog.create({
      data: {
        tripId,
        inputs: factors,
        price: finalPrice,
        strategy
      }
    });
  } catch (error) {
    // Logging failed, but continue
    console.warn('Pricing log failed:', error);
  }
  
  res.json({ 
    tripId, 
    basePrice, 
    finalPrice, 
    priceIncrease: Math.round(((finalPrice - basePrice) / basePrice) * 100),
    strategy,
    factors,
    aiInsights: {
      message: `Price adjusted by ${Math.round(((finalPrice - basePrice) / basePrice) * 100)}% based on AI demand prediction`,
      confidence: Math.round(factors.demandMultiplier * 60) + '%',
      recommendation: finalPrice > basePrice * 1.3 ? 'High demand - book soon!' : 'Good time to book'
    }
  });
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


