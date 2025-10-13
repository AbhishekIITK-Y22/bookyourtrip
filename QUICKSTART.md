# BookYourTrip - Quick Start Guide

## ✅ All Services Running

Services are now running on Docker:
- **Auth Service**: `http://localhost:3001`
- **Booking Service**: `http://localhost:3002`
- **AI Service**: `http://localhost:3003`

## 🧪 Test the APIs

### 1. Signup
```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"CUSTOMER"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cmgo6cazr0000gcs08tv5vzgw",
    "email": "demo@test.com",
    "role": "CUSTOMER"
  }
}
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

**Response:** List of trips with routes and available seats.

### 4. Create Booking (requires token)
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:3002/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tripId":"trip_id_from_search","seatNo":"A12"}'
```

## 📊 Database (Already Seeded)

The booking database has sample data:
- **2 providers**: Express Bus Co., Fast Travel Inc.
- **3 routes**: NY↔Boston, Boston↔Philly, NY↔DC
- **4 trips**: Tomorrow & next week departures
- **160 seats**: 40-50 seats per trip

## 🔧 Development Commands

### Start Services
```bash
cd /Users/abhishek/Desktop/CS455/bookyourtrip
docker compose up -d
```

### Stop Services
```bash
docker compose down
```

### View Logs
```bash
docker compose logs -f auth-service
docker compose logs -f booking-service
```

### Rebuild After Code Changes
```bash
docker compose build auth-service booking-service
docker compose up -d
```

### Run Tests
```bash
cd services/auth-service
NODE_ENV=test DATABASE_URL="postgres://auth_user:auth_password@localhost:5433/auth_db" npm test
```

## 📝 Complete API Documentation

See `API_ENDPOINTS.md` for all available endpoints.

##issues Resolved

1. ✅ **Swagger Removed**: Was breaking tests, only 1 endpoint working
2. ✅ **TypeScript Build Fixed**: `rootDir: "src"` with correct Prisma import paths
3. ✅ **Docker Path Fixed**: Commands updated to use `dist/index.js`
4. ✅ **Tests Pass**: 9/9 auth tests passing
5. ✅ **Database Seeded**: Sample data loaded
6. ✅ **All Services Running**: Auth, Booking, AI services operational

## 🎯 What Works

- ✅ User signup/login with JWT
- ✅ Trip search by source/destination/date
- ✅ Booking creation with seat reservation
- ✅ Booking cancellation
- ✅ Booking rescheduling with penalties
- ✅ Provider status management
- ✅ Dynamic pricing via AI service
- ✅ Redis-based seat holds
- ✅ Idempotent booking creation
- ✅ Test suite operational

## 🚀 Next Steps

1. Add more comprehensive tests for booking service
2. Implement frontend or use Postman for manual testing
3. Add authentication middleware to protected endpoints
4. Implement NATS event streaming for booking events
5. Add more sophisticated AI pricing strategies

