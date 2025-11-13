# AI Service - LLM-Powered Dynamic Pricing

## Overview

This AI service provides intelligent pricing decisions and travel recommendations using Google Gemini LLM integration.

## Features

- **LLM-Powered Dynamic Pricing**: Uses Google Gemini to analyze market conditions and make intelligent pricing decisions
- **Trip Recommendations**: AI-generated personalized travel suggestions
- **Fallback System**: Rule-based pricing when LLM is unavailable
- **Historical Learning**: Learns from past pricing decisions
- **Real-time Analysis**: Considers current market conditions, occupancy, and temporal factors

## Setup

### 1. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment

Add to your `.env` file or docker-compose.yml:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Service

```bash
npm run dev
```

## API Endpoints

### Dynamic Pricing

**GET** `/pricing/:tripId`

Analyzes trip data and provides intelligent pricing recommendations using LLM.

**Query Parameters:**
- `basePrice`: Base price in cents
- `seatsAvailable`: Number of available seats
- `totalSeats`: Total seat capacity
- `source`: Origin city
- `destination`: Destination city
- `departure`: Departure date/time

**Response:**
```json
{
  "tripId": "trip123",
  "basePrice": 2500,
  "finalPrice": 3200,
  "priceIncrease": 28,
  "strategy": "llm-dynamic",
  "agenticAI": {
    "decision": "AI analyzed high demand patterns and applied surge pricing",
    "reasoning": ["High occupancy detected", "Weekend travel premium"],
    "confidence": "87%",
    "llmModel": "gemini-1.5-flash",
    "llmIntegration": true
  },
  "aiInsights": {
    "message": "High demand detected - book soon!",
    "confidence": "87%",
    "recommendation": "🔥 High demand detected - book soon!"
  }
}
```

### Trip Recommendations

**POST** `/recommendations`

Provides personalized travel recommendations based on user preferences.

**Request Body:**
```json
{
  "preferences": {
    "timePreference": "morning",
    "comfort": "standard"
  },
  "budget": 5000,
  "origin": "New York",
  "destination": "Boston",
  "date": "2025-10-20",
  "passengerCount": 2
}
```

### AI Health Check

**GET** `/ai/status`

Tests LLM connectivity and service health.

**Response:**
```json
{
  "status": "healthy",
  "llm": "gemini-1.5-flash",
  "connectivity": "connected",
  "response": "OK",
  "timestamp": "2025-10-16T10:30:00.000Z"
}
```

## LLM Integration Details

### Google Gemini Free Tier Limits

- **15 requests per minute**
- **1 million tokens per day**
- **Rate limiting**: Automatic retry with exponential backoff

### Fallback System

If the LLM service is unavailable:
- Automatically switches to rule-based pricing
- Maintains service availability
- Logs the fallback event
- Returns degraded confidence levels

### Pricing Analysis Factors

The LLM analyzes:
- **Market Conditions**: Current time, day of week, season
- **Supply & Demand**: Seat occupancy, booking patterns
- **Historical Data**: Past pricing decisions for the route
- **Temporal Factors**: Weekend premiums, peak hour pricing
- **Competitive Positioning**: Market dynamics and positioning

## Development

### Running Tests

```bash
npm test
```

### Building

```bash
npm run build
```

### Logs

The service uses structured logging with Pino. In development, logs are pretty-printed.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Booking       │───▶│    AI Service    │───▶│  Google Gemini  │
│   Service       │    │                  │    │      LLM        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   AI Database    │
                       │  (Pricing Logs)  │
                       └──────────────────┘
```

## Error Handling

- **LLM API Failures**: Automatic fallback to rule-based pricing
- **Rate Limiting**: Exponential backoff and retry logic
- **Invalid Responses**: JSON parsing error handling with fallbacks
- **Network Issues**: Timeout handling and graceful degradation

## Monitoring

- Health check endpoint for service monitoring
- Structured logging for debugging and analysis
- Pricing decision logging for learning and optimization
- Performance metrics and error tracking
