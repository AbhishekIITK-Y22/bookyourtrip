#!/bin/bash

# BookYourTrip - Deployment Verification Script
# Run this after deploying to Render.com to verify all services are working

echo "🔍 BookYourTrip Deployment Verification"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if URLs are provided
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: ./verify-deployment.sh <AUTH_URL> <BOOKING_URL> <AI_URL>"
    echo ""
    echo "Example:"
    echo "  ./verify-deployment.sh \\"
    echo "    https://bookyourtrip-auth.onrender.com \\"
    echo "    https://bookyourtrip-booking.onrender.com \\"
    echo "    https://bookyourtrip-ai.onrender.com"
    exit 1
fi

AUTH_URL=$1
BOOKING_URL=$2
AI_URL=$3

echo "Testing services:"
echo "  Auth:    $AUTH_URL"
echo "  Booking: $BOOKING_URL"
echo "  AI:      $AI_URL"
echo ""

# Function to check health endpoint
check_health() {
    local SERVICE_NAME=$1
    local URL=$2
    
    echo -n "Checking $SERVICE_NAME... "
    
    RESPONSE=$(curl -s -w "\n%{http_code}" "$URL/health" 2>&1)
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n-1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ OK${NC}"
        echo "  Response: $BODY"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "  HTTP Code: $HTTP_CODE"
        echo "  Response: $BODY"
        return 1
    fi
}

# Test each service
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Health Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

AUTH_OK=0
BOOKING_OK=0
AI_OK=0

check_health "Auth Service   " "$AUTH_URL" && AUTH_OK=1
check_health "Booking Service" "$BOOKING_URL" && BOOKING_OK=1
check_health "AI Service     " "$AI_URL" && AI_OK=1

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Functional Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test signup
if [ $AUTH_OK -eq 1 ]; then
    echo -n "Testing signup... "
    SIGNUP_RESPONSE=$(curl -s -X POST "$AUTH_URL/auth/signup" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"test-$(date +%s)@example.com\",\"password\":\"test123\",\"role\":\"CUSTOMER\"}")
    
    if echo "$SIGNUP_RESPONSE" | grep -q "token"; then
        echo -e "${GREEN}✓ Signup works${NC}"
        TOKEN=$(echo "$SIGNUP_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
        echo "  Got JWT token: ${TOKEN:0:20}..."
    else
        echo -e "${RED}✗ Signup failed${NC}"
        echo "  Response: $SIGNUP_RESPONSE"
    fi
fi

# Test search
if [ $BOOKING_OK -eq 1 ]; then
    echo -n "Testing search... "
    SEARCH_RESPONSE=$(curl -s "$BOOKING_URL/search?from=New%20York&to=Boston")
    
    if echo "$SEARCH_RESPONSE" | grep -q "id"; then
        TRIP_COUNT=$(echo "$SEARCH_RESPONSE" | grep -o '"id"' | wc -l)
        echo -e "${GREEN}✓ Search works${NC}"
        echo "  Found $TRIP_COUNT trips"
    else
        echo -e "${YELLOW}⚠ No trips found (database might be empty)${NC}"
        echo "  Response: $SEARCH_RESPONSE"
    fi
fi

# Test AI pricing
if [ $AI_OK -eq 1 ]; then
    echo -n "Testing AI pricing... "
    AI_RESPONSE=$(curl -s "$AI_URL/pricing/test-trip-123")
    
    if echo "$AI_RESPONSE" | grep -q "price"; then
        PRICE=$(echo "$AI_RESPONSE" | grep -o '"price":[0-9]*' | cut -d':' -f2)
        echo -e "${GREEN}✓ AI pricing works${NC}"
        echo "  Generated price: $PRICE"
    else
        echo -e "${RED}✗ AI pricing failed${NC}"
        echo "  Response: $AI_RESPONSE"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TOTAL_SERVICES=3
WORKING_SERVICES=$(($AUTH_OK + $BOOKING_OK + $AI_OK))

echo "Services Status: $WORKING_SERVICES/$TOTAL_SERVICES working"

if [ $AUTH_OK -eq 1 ]; then
    echo -e "  ${GREEN}✓${NC} Auth Service"
else
    echo -e "  ${RED}✗${NC} Auth Service"
fi

if [ $BOOKING_OK -eq 1 ]; then
    echo -e "  ${GREEN}✓${NC} Booking Service"
else
    echo -e "  ${RED}✗${NC} Booking Service"
fi

if [ $AI_OK -eq 1 ]; then
    echo -e "  ${GREEN}✓${NC} AI Service"
else
    echo -e "  ${RED}✗${NC} AI Service"
fi

echo ""
if [ $WORKING_SERVICES -eq $TOTAL_SERVICES ]; then
    echo -e "${GREEN}🎉 All services are working correctly!${NC}"
    echo ""
    echo "Your BookYourTrip system is deployed and ready!"
    echo ""
    echo "Next steps:"
    echo "  1. Run the seed script to add test data"
    echo "  2. Test the full booking flow"
    echo "  3. Update environment variables if needed"
    exit 0
else
    echo -e "${RED}⚠️  Some services are not working${NC}"
    echo ""
    echo "Check the Render.com dashboard for:"
    echo "  - Build logs"
    echo "  - Runtime logs"
    echo "  - Environment variables"
    exit 1
fi

