# LLM Integration Setup Guide

## Google Gemini API Setup (Free Tier)

Your AI service is now fully integrated with Google Gemini LLM! Here's how to activate it:

### Step 1: Get Your Free Gemini API Key

1. **Visit Google AI Studio**: Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

2. **Sign In**: Use your Google account to sign in

3. **Create API Key**: Click "Create API Key" and select "Create API key in new project"

4. **Copy the Key**: Copy the generated API key (starts with `AIza...`)

### Step 2: Configure the API Key

**Option A: Local Development**
Create a `.env` file in the project root:
```bash
GEMINI_API_KEY=AIzaSyC...your_actual_api_key_here
```

**Option B: Docker Environment**
Add to your `docker-compose.yml` environment section:
```yaml
environment:
  GEMINI_API_KEY: AIzaSyC...your_actual_api_key_here
```

### Step 3: Restart Services

```bash
# Stop and restart the AI service
docker compose stop ai-service
docker compose up ai-service -d

# Or restart all services
docker compose down
docker compose up -d
```

### Step 4: Verify LLM Integration

Test the AI service:
```bash
# Check AI status
curl http://localhost:3003/ai/status

# Test pricing with LLM
curl "http://localhost:3003/pricing/test123?basePrice=2500&seatsAvailable=10&totalSeats=40&source=New%20York&destination=Boston"
```

## What You'll See

### With API Key (LLM Active):
```json
{
  "status": "healthy",
  "llm": "gemini-1.5-flash",
  "connectivity": "connected",
  "response": "OK"
}
```

### Without API Key (Fallback Mode):
```json
{
  "status": "degraded",
  "llm": "gemini-1.5-flash", 
  "connectivity": "failed",
  "fallback": true
}
```

## Free Tier Limits

Google Gemini Free Tier includes:
- **15 requests per minute**
- **1 million tokens per day**
- **Rate limiting**: Automatic retry with exponential backoff
- **No credit card required**

## LLM Features Now Available

### 1. **Intelligent Dynamic Pricing**
- Real AI analysis of market conditions
- Natural language reasoning for pricing decisions
- Context-aware recommendations

### 2. **Trip Recommendations**
- Personalized travel suggestions
- AI-powered insights and tips
- Budget optimization advice

### 3. **Autonomous Decision Making**
- True "agentic AI" behavior
- Self-explanatory reasoning
- Continuous learning from decisions

## Example LLM Response

When active, you'll see responses like:
```json
{
  "agenticAI": {
    "decision": "AI analyzed high demand patterns and applied surge pricing",
    "reasoning": [
      "High occupancy detected (75% full)",
      "Weekend travel premium applied", 
      "Peak hour pricing active",
      "Historical data shows strong demand for this route"
    ],
    "confidence": "87%",
    "llmModel": "gemini-1.5-flash",
    "llmIntegration": true
  }
}
```

## Troubleshooting

### API Key Issues
- Ensure the key starts with `AIza`
- Check for extra spaces or characters
- Verify the key is active in Google AI Studio

### Rate Limiting
- The service automatically handles rate limits
- Free tier allows 15 requests/minute
- Consider upgrading for production use

### Fallback Mode
- System automatically falls back to rule-based pricing if LLM fails
- Service remains fully functional
- Check logs for error details

## Next Steps

1. **Get your API key** from Google AI Studio
2. **Configure the environment** variable
3. **Restart the AI service**
4. **Test the integration** with the curl commands above
5. **Enjoy true LLM-powered AI** in your booking system!

The system is now ready for genuine AI integration that meets your assignment requirements! 🚀
