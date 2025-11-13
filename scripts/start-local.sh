#!/bin/bash

# Start All Services Locally
# This script starts all BookYourTrip services in the background

set -e

echo "🚀 Starting BookYourTrip services locally..."
echo ""

# Check if services are already running
if lsof -i :3001 > /dev/null 2>&1; then
    echo "⚠️  Port 3001 is already in use (Auth Service)"
    exit 1
fi

if lsof -i :3002 > /dev/null 2>&1; then
    echo "⚠️  Port 3002 is already in use (Booking Service)"
    exit 1
fi

if lsof -i :3003 > /dev/null 2>&1; then
    echo "⚠️  Port 3003 is already in use (AI Service)"
    exit 1
fi

if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 is already in use (Web App)"
    exit 1
fi

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Create log directory
mkdir -p logs

# Start Auth Service
echo "Starting Auth Service (port 3001)..."
cd services/auth-service
npm run dev > "$PROJECT_ROOT/logs/auth-service.log" 2>&1 &
AUTH_PID=$!
cd "$PROJECT_ROOT"
echo "  Auth Service started (PID: $AUTH_PID)"

# Wait a bit for auth service to start
sleep 2

# Start Booking Service
echo "Starting Booking Service (port 3002)..."
cd services/booking-service
npm run dev > "$PROJECT_ROOT/logs/booking-service.log" 2>&1 &
BOOKING_PID=$!
cd "$PROJECT_ROOT"
echo "  Booking Service started (PID: $BOOKING_PID)"

# Wait a bit for booking service to start
sleep 2

# Start AI Service
echo "Starting AI Service (port 3003)..."
cd services/ai-service
npm run dev > "$PROJECT_ROOT/logs/ai-service.log" 2>&1 &
AI_PID=$!
cd "$PROJECT_ROOT"
echo "  AI Service started (PID: $AI_PID)"

# Wait a bit for AI service to start
sleep 2

# Start Web App
echo "Starting Web App (port 3000)..."
cd web
npm run dev > "$PROJECT_ROOT/logs/web-app.log" 2>&1 &
WEB_PID=$!
cd "$PROJECT_ROOT"
echo "  Web App started (PID: $WEB_PID)"

# Save PIDs to file
echo "$AUTH_PID" > logs/auth-service.pid
echo "$BOOKING_PID" > logs/booking-service.pid
echo "$AI_PID" > logs/ai-service.pid
echo "$WEB_PID" > logs/web-app.pid

echo ""
echo "✅ All services started!"
echo ""
echo "Services:"
echo "  Auth Service:    http://localhost:3001"
echo "  Booking Service: http://localhost:3002"
echo "  AI Service:      http://localhost:3003"
echo "  Web App:         http://localhost:3000"
echo ""
echo "Logs are in the 'logs' directory"
echo ""
echo "To stop all services, run:"
echo "  ./scripts/stop-local.sh"
echo ""
echo "Or manually kill processes:"
echo "  kill $AUTH_PID $BOOKING_PID $AI_PID $WEB_PID"

