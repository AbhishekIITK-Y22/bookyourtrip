#!/bin/bash

# Setup Local Databases for BookYourTrip
# This script creates PostgreSQL databases and users for local development

set -e

echo "🔧 Setting up local databases for BookYourTrip..."
echo ""

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL 15+ and try again"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running"
    echo "Please start PostgreSQL and try again"
    echo "  macOS: brew services start postgresql@15"
    echo "  Linux: sudo systemctl start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Detect PostgreSQL superuser (macOS Homebrew uses current user, Linux uses postgres)
CURRENT_USER=$(whoami)

# Try current user first (macOS Homebrew default)
if psql -U "$CURRENT_USER" -d postgres -c "SELECT 1;" >/dev/null 2>&1; then
    PGUSER="$CURRENT_USER"
    echo "✅ Detected PostgreSQL user: $PGUSER (no password required)"
    export PGUSER
# Try postgres user (Linux default)
elif psql -U postgres -d postgres -c "SELECT 1;" >/dev/null 2>&1; then
    PGUSER="postgres"
    echo "✅ Detected PostgreSQL user: $PGUSER (no password required)"
    export PGUSER
# Try without specifying user (will use current user)
elif psql -d postgres -c "SELECT 1;" >/dev/null 2>&1; then
    PGUSER="$CURRENT_USER"
    echo "✅ Using current user: $PGUSER (no password required)"
    export PGUSER
else
    echo "❌ Cannot connect to PostgreSQL"
    echo "Tried users: $CURRENT_USER, postgres"
    echo ""
    echo "Please ensure PostgreSQL is running and accessible."
    echo "On macOS, try: psql postgres"
    echo "On Linux, try: sudo -u postgres psql"
    exit 1
fi

echo ""
echo "Creating databases and users..."

# Create databases (connect to postgres database)
psql -U "$PGUSER" -d postgres -c "CREATE DATABASE auth_db;" 2>/dev/null || echo "Database auth_db already exists"
psql -U "$PGUSER" -d postgres -c "CREATE DATABASE booking_db;" 2>/dev/null || echo "Database booking_db already exists"
psql -U "$PGUSER" -d postgres -c "CREATE DATABASE ai_db;" 2>/dev/null || echo "Database ai_db already exists"

# Create users (connect to postgres database)
psql -U "$PGUSER" -d postgres -c "CREATE USER auth_user WITH PASSWORD 'auth_password';" 2>/dev/null || echo "User auth_user already exists"
psql -U "$PGUSER" -d postgres -c "CREATE USER booking_user WITH PASSWORD 'booking_password';" 2>/dev/null || echo "User booking_user already exists"
psql -U "$PGUSER" -d postgres -c "CREATE USER ai_user WITH PASSWORD 'ai_password';" 2>/dev/null || echo "User ai_user already exists"

# Grant privileges (connect to postgres database)
psql -U "$PGUSER" -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE auth_db TO auth_user;"
psql -U "$PGUSER" -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE booking_db TO booking_user;"
psql -U "$PGUSER" -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE ai_db TO ai_user;"

# Grant schema privileges (PostgreSQL 15+) - connect to each database
psql -U "$PGUSER" -d auth_db -c "GRANT ALL ON SCHEMA public TO auth_user;"
psql -U "$PGUSER" -d booking_db -c "GRANT ALL ON SCHEMA public TO booking_user;"
psql -U "$PGUSER" -d ai_db -c "GRANT ALL ON SCHEMA public TO ai_user;"

echo ""
echo "✅ Databases and users created successfully!"
echo ""
echo "Database URLs:"
echo "  Auth:    postgresql://auth_user:auth_password@localhost:5432/auth_db"
echo "  Booking: postgresql://booking_user:booking_password@localhost:5432/booking_db"
echo "  AI:      postgresql://ai_user:ai_password@localhost:5432/ai_db"
echo ""
echo "Next steps:"
echo "  1. Create .env files in each service directory (see LOCAL_SETUP.md)"
echo "  2. Run migrations: cd services/auth-service && npx prisma migrate deploy"
echo "  3. Run migrations: cd services/booking-service && npx prisma migrate deploy"
echo "  4. Run migrations: cd services/ai-service && npx prisma migrate deploy"
echo "  5. Start services: npm run dev in each service directory"

