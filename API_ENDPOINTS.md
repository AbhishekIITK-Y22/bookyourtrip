# BookYourTrip API Endpoints

## Auth Service (Port 3001)

### Public Endpoints

#### Health Check
```http
GET http://localhost:3001/health
```

#### Signup
```http
POST http://localhost:3001/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "CUSTOMER"  // or "PROVIDER"
}
```

#### Login
```http
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: {
  "token": "jwt_token_here",
  "user": { "id": "...", "email": "...", "role": "..." }
}
```

---

## Booking Service (Port 3002)

### Public Endpoints

#### Health Check
```http
GET http://localhost:3002/health
```

#### Create Provider
```http
POST http://localhost:3002/providers
Content-Type: application/json

{
  "name": "Express Bus Co."
}
```

#### Create Route
```http
POST http://localhost:3002/routes
Content-Type: application/json

{
  "providerId": "provider_id_here",
  "source": "New York",
  "destination": "Boston"
}
```

#### Create Trip
```http
POST http://localhost:3002/trips
Content-Type: application/json

{
  "routeId": "route_id_here",
  "departure": "2025-10-15T09:00:00Z",
  "capacity": 40,
  "basePrice": 2500
}
```

#### Search Trips
```http
GET http://localhost:3002/search?from=New York&to=Boston&date=2025-10-15
```

#### Update Provider Status
```http
PATCH http://localhost:3002/providers/{provider_id}/status
Content-Type: application/json

{
  "status": "ACTIVE"  // or "DISABLED"
}
```

### Protected Endpoints (Require JWT Token)

#### Create Booking
```http
POST http://localhost:3002/bookings
Authorization: Bearer {jwt_token}
Content-Type: application/json
Idempotency-Key: unique_key_123  // optional

{
  "tripId": "trip_id_here",
  "seatNo": "A12",
  "price": 2500  // optional, will fetch from AI service if not provided
}
```

#### Cancel Booking
```http
POST http://localhost:3002/bookings/{booking_id}/cancel
Authorization: Bearer {jwt_token}
```

#### Reschedule Booking
```http
POST http://localhost:3002/bookings/{booking_id}/reschedule
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "newTripId": "new_trip_id_here",
  "newSeatNo": "B15"
}
```

---

## AI Service (Port 3003)

#### Health Check
```http
GET http://localhost:3003/health
```

#### Get Dynamic Pricing
```http
GET http://localhost:3003/pricing/{trip_id}

Response: {
  "tripId": "...",
  "price": 1000,
  "strategy": "static-stub"
}
```

#### Log Pricing Call
```http
POST http://localhost:3003/pricing/{trip_id}/log
Content-Type: application/json

{
  "inputs": {},
  "price": 1000,
  "strategy": "static"
}
```

---

## Testing with curl

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

### 4. Create Booking (with token)
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:3002/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tripId":"trip_id","seatNo":"A12"}'
```

---

## Why Swagger Was Removed

Swagger was causing test failures due to:
1. Complex dependency chain (`js-yaml` module resolution issues in Jest)
2. Only 1 endpoint was properly documented  
3. Adding proper JSDoc annotations for all endpoints would be time-consuming
4. Direct API testing with curl/Postman/tests is more reliable

For production, consider re-adding Swagger with proper mocking in tests or using a separate documentation-only build.

