#!/bin/bash

# Stop All Services Locally
# This script stops all BookYourTrip services

set -e

echo "🛑 Stopping BookYourTrip services..."
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOGS_DIR="$PROJECT_ROOT/logs"

# Stop services using PID files
if [ -f "$LOGS_DIR/auth-service.pid" ]; then
    AUTH_PID=$(cat "$LOGS_DIR/auth-service.pid")
    if kill -0 "$AUTH_PID" 2>/dev/null; then
        kill "$AUTH_PID"
        echo "✅ Stopped Auth Service (PID: $AUTH_PID)"
    else
        echo "⚠️  Auth Service already stopped"
    fi
    rm -f "$LOGS_DIR/auth-service.pid"
else
    echo "⚠️  Auth Service PID file not found"
fi

if [ -f "$LOGS_DIR/booking-service.pid" ]; then
    BOOKING_PID=$(cat "$LOGS_DIR/booking-service.pid")
    if kill -0 "$BOOKING_PID" 2>/dev/null; then
        kill "$BOOKING_PID"
        echo "✅ Stopped Booking Service (PID: $BOOKING_PID)"
    else
        echo "⚠️  Booking Service already stopped"
    fi
    rm -f "$LOGS_DIR/booking-service.pid"
else
    echo "⚠️  Booking Service PID file not found"
fi

if [ -f "$LOGS_DIR/ai-service.pid" ]; then
    AI_PID=$(cat "$LOGS_DIR/ai-service.pid")
    if kill -0 "$AI_PID" 2>/dev/null; then
        kill "$AI_PID"
        echo "✅ Stopped AI Service (PID: $AI_PID)"
    else
        echo "⚠️  AI Service already stopped"
    fi
    rm -f "$LOGS_DIR/ai-service.pid"
else
    echo "⚠️  AI Service PID file not found"
fi

if [ -f "$LOGS_DIR/web-app.pid" ]; then
    WEB_PID=$(cat "$LOGS_DIR/web-app.pid")
    if kill -0 "$WEB_PID" 2>/dev/null; then
        kill "$WEB_PID"
        echo "✅ Stopped Web App (PID: $WEB_PID)"
    else
        echo "⚠️  Web App already stopped"
    fi
    rm -f "$LOGS_DIR/web-app.pid"
else
    echo "⚠️  Web App PID file not found"
fi

# Fallback: kill processes by port
echo ""
echo "Checking for processes on service ports..."

for port in 3001 3002 3003 3000; do
    PID=$(lsof -ti :$port 2>/dev/null || true)
    if [ -n "$PID" ]; then
        echo "⚠️  Found process on port $port (PID: $PID), killing..."
        kill "$PID" 2>/dev/null || true
    fi
done

echo ""
echo "✅ All services stopped!"

