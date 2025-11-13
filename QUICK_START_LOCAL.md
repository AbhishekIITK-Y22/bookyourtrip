# Quick Start - Local Development

## Prerequisites

Make sure you have installed:
- **PostgreSQL 15+** (running on port 5432)
- **Redis 7+** (running on port 6379)
- **Node.js 20+**
- **NATS Server** (optional, port 4222)

## One-Command Setup

```bash
# 1. Setup databases
./scripts/setup-local-databases.sh

# 2. Create .env files
./scripts/create-env-files.sh

# 3. Install dependencies (if not done already)
npm install
cd services/auth-service && npm install && cd ../..
cd services/booking-service && npm install && cd ../..
cd services/ai-service && npm install && cd ../..
cd web && npm install && cd ..

# 4. Run migrations
cd services/auth-service && npx prisma migrate deploy && cd ../..
cd services/booking-service && npx prisma migrate deploy && cd ../..
cd services/ai-service && npx prisma migrate deploy && cd ../..

# 5. Seed database (optional)
cd services/booking-service && npm run seed && cd ../..

# 6. Start all services
./scripts/start-local.sh
```

## Verify Services

```bash
# Check health endpoints
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health

# Access web app
open http://localhost:3000
```

## Test APIs

### 1. Signup
```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"CUSTOMER"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Search Trips
```bash
curl "http://localhost:3002/search?from=New%20York&to=Boston"
```

### 4. Create Booking
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:3002/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tripId":"trip_id_from_search","seatNo":"A12"}'
```

## Stop Services

```bash
./scripts/stop-local.sh
```

## Troubleshooting

### PostgreSQL not running
```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### Redis not running
```bash
# macOS
brew services start redis

# Linux
sudo systemctl start redis
```

### Port already in use
```bash
# Check what's using the port
lsof -i :3001
lsof -i :3002
lsof -i :3003
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Database connection errors
```bash
# Verify database exists
psql -U postgres -l | grep -E "auth_db|booking_db|ai_db"

# If databases don't exist, run setup script
./scripts/setup-local-databases.sh
```

## Manual Service Startup

If you prefer to start services manually in separate terminals:

```bash
# Terminal 1: Auth Service
cd services/auth-service
npm run dev

# Terminal 2: Booking Service
cd services/booking-service
npm run dev

# Terminal 3: AI Service
cd services/ai-service
npm run dev

# Terminal 4: Web App
cd web
npm run dev
```

## Next Steps

- See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for detailed setup instructions
- See [README.md](./README.md) for API documentation
- See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for all available endpoints

