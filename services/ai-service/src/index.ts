import express from 'express';
import { PrismaClient } from '../prisma/generated/client/index.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ai-service' });
});

// AGENTIC AI-Powered Dynamic Pricing
// This AI agent autonomously makes pricing decisions using:
// 1. Real-time environmental factors
// 2. Historical learning from past decisions
// 3. Predictive analytics
// 4. Self-optimization strategies
app.get('/pricing/:tripId', async (req, res) => {
  const { tripId } = req.params;
  const { basePrice: queryBasePrice, seatsAvailable, totalSeats } = req.query;
  
  // Get base price and capacity from query or database
  const basePrice = queryBasePrice ? Number(queryBasePrice) : 1000;
  const available = seatsAvailable ? Number(seatsAvailable) : 40;
  const total = totalSeats ? Number(totalSeats) : 40;
  
  // AGENTIC AI: Learn from historical data
  const historicalPricing = await prisma.pricingLog.findMany({
    where: { tripId },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  
  // AI calculates average historical price for this trip
  const avgHistoricalPrice = historicalPricing.length > 0
    ? historicalPricing.reduce((sum, log) => sum + log.price, 0) / historicalPricing.length
    : basePrice;
  
  // AI learning: If historical prices are higher, it learns demand is strong
  const historicalDemandFactor = avgHistoricalPrice / basePrice;
  
  // AGENTIC AI: Calculate seat occupancy (scarcity pricing)
  const occupancyRate = ((total - available) / total) * 100;
  const scarcityMultiplier = occupancyRate > 80 ? 1.5 :  // Critical (>80% full)
                             occupancyRate > 60 ? 1.3 :  // High (>60% full)
                             occupancyRate > 40 ? 1.15 : // Medium (>40% full)
                             1.0;                        // Low availability
  
  // AI-driven pricing factors (Agentic AI decision making)
  const factors = {
    // Real-time environmental awareness
    timeOfDay: new Date().getHours(),
    dayOfWeek: new Date().getDay(),
    
    // AGENTIC: Historical learning
    historicalDemandFactor: Math.min(historicalDemandFactor, 2.0), // Cap at 2x
    avgHistoricalPrice,
    priceHistory: historicalPricing.length,
    
    // AGENTIC: Inventory awareness (scarcity pricing)
    occupancyRate: Math.round(occupancyRate),
    seatsAvailable: available,
    totalSeats: total,
    scarcityMultiplier,
    
    // AGENTIC: Demand prediction based on patterns
    demandMultiplier: 1 + (Math.random() * 0.5), // Simulates ML prediction
    
    // Temporal factors
    isWeekend: new Date().getDay() === 0 || new Date().getDay() === 6,
    isPeakHour: new Date().getHours() >= 8 && new Date().getHours() <= 20,
    
    // AGENTIC: Predictive demand (AI forecasting)
    predictedDemand: occupancyRate > 70 || historicalDemandFactor > 1.3 ? 'high' : 
                     occupancyRate > 40 ? 'medium' : 'normal',
  };
  
  // AGENTIC AI PRICING ALGORITHM
  // The AI agent autonomously decides pricing based on multiple factors
  let finalPrice = basePrice;
  
  // AGENTIC: Apply historical learning
  if (historicalDemandFactor > 1.2) {
    finalPrice *= Math.min(historicalDemandFactor, 1.5); // Learn from past success
  }
  
  // AGENTIC: Scarcity-based pricing (inventory awareness)
  finalPrice *= scarcityMultiplier;
  
  // Temporal factors: Weekend surge (20% increase)
  if (factors.isWeekend) {
    finalPrice *= 1.2;
  }
  
  // Temporal factors: Peak hour pricing (15% increase)
  if (factors.isPeakHour) {
    finalPrice *= 1.15;
  }
  
  // AGENTIC: AI demand prediction (apply ML-simulated multiplier)
  finalPrice *= factors.demandMultiplier;
  
  // AGENTIC: Predictive surge pricing
  if (factors.predictedDemand === 'high') {
    finalPrice *= 1.3; // High demand
  } else if (factors.predictedDemand === 'medium') {
    finalPrice *= 1.15; // Medium demand
  }
  
  // Round to nearest 10
  finalPrice = Math.round(finalPrice / 10) * 10;
  
  // AGENTIC: Autonomous strategy decision
  let strategy = 'agentic-dynamic';
  let agentDecision = 'Standard dynamic pricing';
  let agentReasoning = [];
  
  // AI explains its reasoning (transparency)
  if (scarcityMultiplier >= 1.5) {
    strategy = 'agentic-scarcity';
    agentDecision = 'Critical scarcity detected - aggressive pricing';
    agentReasoning.push(`Only ${available}/${total} seats left (${Math.round(occupancyRate)}% full)`);
  } else if (historicalDemandFactor > 1.3) {
    strategy = 'agentic-learning';
    agentDecision = 'Historical demand analysis - learned pricing';
    agentReasoning.push(`Learned from ${historicalPricing.length} past pricing decisions`);
    agentReasoning.push(`Historical avg: $${Math.round(avgHistoricalPrice)} vs base: $${basePrice}`);
  } else if (factors.predictedDemand === 'high') {
    strategy = 'agentic-surge';
    agentDecision = 'High demand predicted - surge pricing';
    agentReasoning.push(`High demand: ${Math.round(occupancyRate)}% occupancy + historical patterns`);
  } else if (factors.demandMultiplier > 1.3) {
    strategy = 'agentic-demand';
    agentDecision = 'Real-time demand-based pricing';
    agentReasoning.push(`Demand multiplier: ${factors.demandMultiplier.toFixed(2)}x`);
  }
  
  // Add temporal factors to reasoning
  if (factors.isWeekend) agentReasoning.push('Weekend travel (+20%)');
  if (factors.isPeakHour) agentReasoning.push('Peak hour travel (+15%)');
  
  // AGENTIC: Log decision for continuous learning
  try {
    await prisma.pricingLog.create({
      data: {
        tripId,
        inputs: {
          ...factors,
          agentDecision,
          agentReasoning,
        },
        price: finalPrice,
        strategy
      }
    });
  } catch (error) {
    // Logging failed, but continue
    console.warn('Pricing log failed:', error);
  }
  
  // AGENTIC: Calculate confidence based on data availability
  const confidence = historicalPricing.length > 5 
    ? Math.min(85 + historicalPricing.length, 98) // High confidence with data
    : Math.min(60 + (occupancyRate / 2), 75); // Lower confidence without history
  
  res.json({ 
    tripId, 
    basePrice, 
    finalPrice, 
    priceIncrease: Math.round(((finalPrice - basePrice) / basePrice) * 100),
    strategy,
    factors,
    // AGENTIC: AI explains its autonomous decision
    agenticAI: {
      decision: agentDecision,
      reasoning: agentReasoning,
      confidence: `${Math.round(confidence)}%`,
      dataPoints: historicalPricing.length,
      autonomousActions: [
        'Analyzed historical pricing patterns',
        'Monitored real-time seat availability',
        'Predicted demand based on multiple factors',
        'Autonomously selected optimal pricing strategy',
        'Logged decision for future learning'
      ]
    },
    aiInsights: {
      message: `AI agent decision: ${agentDecision}`,
      confidence: `${Math.round(confidence)}%`,
      recommendation: finalPrice > basePrice * 1.5 ? '🔥 Very high demand - book immediately!' :
                      finalPrice > basePrice * 1.3 ? '⚠️ High demand - book soon!' : 
                      finalPrice > basePrice * 1.1 ? '✅ Good time to book' :
                      '💰 Great deal - low demand!'
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


