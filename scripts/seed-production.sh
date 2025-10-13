#!/bin/bash

# Seed Production Database on Render.com
# This creates sample data for demonstration

BOOKING_URL="https://booking-service-zrn1.onrender.com"

echo "🌱 Seeding production database..."
echo ""

# Create providers
echo "Creating providers..."
P1=$(curl -s -X POST "$BOOKING_URL/providers" \
  -H "Content-Type: application/json" \
  -d '{"name":"Express Bus Co."}' | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "  ✓ Provider 1: $P1"

P2=$(curl -s -X POST "$BOOKING_URL/providers" \
  -H "Content-Type: application/json" \
  -d '{"name":"Fast Travel Inc."}' | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "  ✓ Provider 2: $P2"

# Create routes
echo ""
echo "Creating routes..."
R1=$(curl -s -X POST "$BOOKING_URL/routes" \
  -H "Content-Type: application/json" \
  -d "{\"providerId\":\"$P1\",\"source\":\"New York\",\"destination\":\"Boston\"}" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "  ✓ Route 1 (NY→Boston): $R1"

R2=$(curl -s -X POST "$BOOKING_URL/routes" \
  -H "Content-Type: application/json" \
  -d "{\"providerId\":\"$P1\",\"source\":\"Boston\",\"destination\":\"Philadelphia\"}" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "  ✓ Route 2 (Boston→Philly): $R2"

R3=$(curl -s -X POST "$BOOKING_URL/routes" \
  -H "Content-Type: application/json" \
  -d "{\"providerId\":\"$P2\",\"source\":\"New York\",\"destination\":\"Washington DC\"}" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "  ✓ Route 3 (NY→DC): $R3"

# Create trips
echo ""
echo "Creating trips..."

# Trip 1: Tomorrow 9 AM
TOMORROW=$(date -u -v+1d +"%Y-%m-%dT09:00:00Z")
T1=$(curl -s -X POST "$BOOKING_URL/trips" \
  -H "Content-Type: application/json" \
  -d "{\"routeId\":\"$R1\",\"departure\":\"$TOMORROW\",\"capacity\":40,\"basePrice\":2500}" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "  ✓ Trip 1 (NY→Boston, tomorrow 9am): $T1"

# Trip 2: Next week 2 PM
NEXTWEEK=$(date -u -v+7d +"%Y-%m-%dT14:00:00Z")
T2=$(curl -s -X POST "$BOOKING_URL/trips" \
  -H "Content-Type: application/json" \
  -d "{\"routeId\":\"$R1\",\"departure\":\"$NEXTWEEK\",\"capacity\":40,\"basePrice\":3000}" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "  ✓ Trip 2 (NY→Boston, next week 2pm): $T2"

# Trip 3: Tomorrow 10 AM
T3=$(curl -s -X POST "$BOOKING_URL/trips" \
  -H "Content-Type: application/json" \
  -d "{\"routeId\":\"$R2\",\"departure\":\"$TOMORROW\",\"capacity\":30,\"basePrice\":2000}" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "  ✓ Trip 3 (Boston→Philly, tomorrow 10am): $T3"

# Trip 4: Next week 3 PM
T4=$(curl -s -X POST "$BOOKING_URL/trips" \
  -H "Content-Type: application/json" \
  -d "{\"routeId\":\"$R3\",\"departure\":\"$NEXTWEEK\",\"capacity\":50,\"basePrice\":3500}" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "  ✓ Trip 4 (NY→DC, next week 3pm): $T4"

echo ""
echo "🎉 Production database seeded successfully!"
echo ""
echo "Test search:"
echo "  curl \"$BOOKING_URL/search?from=New%20York&to=Boston\""

