#!/bin/bash

echo "🧪 Generating Test Coverage Report..."
echo "======================================"
echo ""

# Run tests with coverage for each service
cd services/auth-service
echo "📝 Auth Service Coverage..."
npm test -- --coverage --silent 2>/dev/null || true

cd ../booking-service
echo ""
echo "📝 Booking Service Coverage..."
npm test -- --coverage --silent 2>/dev/null || true

cd ../ai-service
echo ""
echo "📝 AI Service Coverage..."
npm test -- --coverage --silent 2>/dev/null || true

echo ""
echo "✅ Coverage reports generated!"
echo "Check coverage/ directories in each service"
