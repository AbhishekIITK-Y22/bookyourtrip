#!/bin/bash

# Create .env files for all services
# This script creates .env files with local development configuration

set -e

echo "🔧 Creating .env files for local development..."
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Auth Service .env
if [ ! -f "services/auth-service/.env" ] || [ ! -s "services/auth-service/.env" ]; then
    cat > services/auth-service/.env << EOF
# Auth Service Environment Variables
PORT=3001

# Database (PostgreSQL)
DATABASE_URL=postgresql://auth_user:auth_password@localhost:5432/auth_db

# Redis
REDIS_URL=redis://localhost:6379

# NATS (optional)
NATS_URL=nats://localhost:4222

# JWT Secret
JWT_SECRET=supersecret

# Booking Service URL
BOOKING_SERVICE_URL=http://localhost:3002

# SMTP Settings (optional - for email OTP)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_gmail_username
# SMTP_PASS=your_gmail_app_password
# EMAIL_FROM=BookYourTrip <no-reply@yourdomain.com>
EOF
    echo "✅ Created services/auth-service/.env"
else
    echo "⚠️  services/auth-service/.env already exists and has content (skipping)"
fi

# Booking Service .env
if [ ! -f "services/booking-service/.env" ] || [ ! -s "services/booking-service/.env" ]; then
    cat > services/booking-service/.env << EOF
# Booking Service Environment Variables
PORT=3002

# Database (PostgreSQL)
DATABASE_URL=postgresql://booking_user:booking_password@localhost:5432/booking_db

# Redis
REDIS_URL=redis://localhost:6379

# NATS (optional)
NATS_URL=nats://localhost:4222

# JWT Secret (must match auth-service)
JWT_SECRET=supersecret

# AI Service URL
AI_SERVICE_URL=http://localhost:3003

# CORS Origin (optional)
CORS_ORIGIN=*
EOF
    echo "✅ Created services/booking-service/.env"
else
    echo "⚠️  services/booking-service/.env already exists and has content (skipping)"
fi

# AI Service .env
if [ ! -f "services/ai-service/.env" ] || [ ! -s "services/ai-service/.env" ]; then
    cat > services/ai-service/.env << EOF
# AI Service Environment Variables
PORT=3003

# Database (PostgreSQL)
DATABASE_URL=postgresql://ai_user:ai_password@localhost:5432/ai_db

# NATS (optional)
NATS_URL=nats://localhost:4222
EOF
    echo "✅ Created services/ai-service/.env"
else
    echo "⚠️  services/ai-service/.env already exists and has content (skipping)"
fi

# Web App .env.local
if [ ! -f "web/.env.local" ] || [ ! -s "web/.env.local" ]; then
    cat > web/.env.local << EOF
# Web App Environment Variables
NEXT_PUBLIC_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_BOOKING_URL=http://localhost:3002
NEXT_PUBLIC_AI_URL=http://localhost:3003
EOF
    echo "✅ Created web/.env.local"
else
    echo "⚠️  web/.env.local already exists (skipping)"
fi

echo ""
echo "✅ All .env files created!"
echo ""
echo "Next steps:"
echo "  1. Make sure PostgreSQL and Redis are running"
echo "  2. Run database setup: ./scripts/setup-local-databases.sh"
echo "  3. Run migrations: cd services/auth-service && npx prisma migrate deploy"
echo "  4. Run migrations: cd services/booking-service && npx prisma migrate deploy"
echo "  5. Run migrations: cd services/ai-service && npx prisma migrate deploy"
echo "  6. Start services: ./scripts/start-local.sh"

