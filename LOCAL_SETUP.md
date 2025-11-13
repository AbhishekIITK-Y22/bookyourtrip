# Local Development Setup Guide (No Docker)

This guide will help you set up and run BookYourTrip locally without Docker.

## Prerequisites

1. **Node.js 20+** - [Download](https://nodejs.org/)
2. **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/)
3. **Redis 7+** - [Download](https://redis.io/download)
4. **NATS Server (optional)** - [Download](https://nats.io/download/)

## Step 1: Install Prerequisites

### macOS (using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Install Redis
brew install redis
brew services start redis

# Install NATS (optional)
brew install nats-server
brew services start nats-server
```

### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql-15 postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Redis
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis

# Install NATS (optional)
curl -L https://github.com/nats-io/nats-server/releases/download/v2.10.0/nats-server-v2.10.0-linux-amd64.zip -o nats-server.zip
unzip nats-server.zip
sudo mv nats-server-v2.10.0-linux-amd64/nats-server /usr/local/bin/
```

### Windows

- **PostgreSQL**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **Redis**: Download from [redis.io](https://redis.io/download) or use WSL
- **NATS**: Download from [nats.io](https://nats.io/download/)

## Step 2: Create Databases

Run the database setup script:

```bash
cd /Users/abhishek/Desktop/CS455/bookyourtrip
chmod +x scripts/setup-local-databases.sh
./scripts/setup-local-databases.sh
```

Or manually create databases:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create databases and users
CREATE DATABASE auth_db;
CREATE DATABASE booking_db;
CREATE DATABASE ai_db;

CREATE USER auth_user WITH PASSWORD 'auth_password';
CREATE USER booking_user WITH PASSWORD 'booking_password';
CREATE USER ai_user WITH PASSWORD 'ai_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE auth_db TO auth_user;
GRANT ALL PRIVILEGES ON DATABASE booking_db TO booking_user;
GRANT ALL PRIVILEGES ON DATABASE ai_db TO ai_user;

# Exit psql
\q
```

## Step 3: Configure Environment Variables

### Auth Service

Create `services/auth-service/.env`:

```env
PORT=3001
DATABASE_URL=postgresql://auth_user:auth_password@localhost:5432/auth_db
REDIS_URL=redis://localhost:6379
NATS_URL=nats://localhost:4222
JWT_SECRET=supersecret
BOOKING_SERVICE_URL=http://localhost:3002
```

### Booking Service

Create `services/booking-service/.env`:

```env
PORT=3002
DATABASE_URL=postgresql://booking_user:booking_password@localhost:5432/booking_db
REDIS_URL=redis://localhost:6379
NATS_URL=nats://localhost:4222
JWT_SECRET=supersecret
AI_SERVICE_URL=http://localhost:3003
CORS_ORIGIN=*
```

### AI Service

Create `services/ai-service/.env`:

```env
PORT=3003
DATABASE_URL=postgresql://ai_user:ai_password@localhost:5432/ai_db
NATS_URL=nats://localhost:4222
```

### Web App

Create `web/.env.local`:

```env
NEXT_PUBLIC_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_BOOKING_URL=http://localhost:3002
NEXT_PUBLIC_AI_URL=http://localhost:3003
```

## Step 4: Install Dependencies

```bash
# Install root dependencies
cd /Users/abhishek/Desktop/CS455/bookyourtrip
npm install

# Install service dependencies
cd services/auth-service && npm install && cd ../..
cd services/booking-service && npm install && cd ../..
cd services/ai-service && npm install && cd ../..

# Install web dependencies
cd web && npm install && cd ..
```

## Step 5: Run Database Migrations

```bash
# Auth Service
cd services/auth-service
npx prisma migrate deploy
cd ../..

# Booking Service
cd services/booking-service
npx prisma migrate deploy
cd ../..

# AI Service
cd services/ai-service
npx prisma migrate deploy
cd ../..
```

## Step 6: Seed Database (Optional)

```bash
cd services/booking-service
npm run seed
cd ../..
```

## Step 7: Start Services

You'll need to run each service in a separate terminal window.

### Terminal 1: Auth Service

```bash
cd services/auth-service
npm run dev
```

### Terminal 2: Booking Service

```bash
cd services/booking-service
npm run dev
```

### Terminal 3: AI Service

```bash
cd services/ai-service
npm run dev
```

### Terminal 4: Web App

```bash
cd web
npm run dev
```

## Step 8: Verify Services

- **Auth Service**: http://localhost:3001/health
- **Booking Service**: http://localhost:3002/health
- **AI Service**: http://localhost:3003/health
- **Web App**: http://localhost:3000

## Quick Start Script

Alternatively, you can use the provided start script:

```bash
chmod +x scripts/start-local.sh
./scripts/start-local.sh
```

This will start all services in the background.

## Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Check PostgreSQL status
brew services list  # macOS
sudo systemctl status postgresql  # Linux
```

### Redis Connection Issues

```bash
# Check if Redis is running
redis-cli ping  # Should return PONG

# Check Redis status
brew services list  # macOS
sudo systemctl status redis  # Linux
```

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3001
lsof -i :3002
lsof -i :3003

# Kill the process
kill -9 <PID>
```

### Database Migration Issues

```bash
# Reset database (WARNING: deletes all data)
cd services/auth-service
npx prisma migrate reset
npx prisma migrate deploy
```

### Environment Variables Not Loading

Make sure you've created `.env` files in each service directory with the correct values.

## Development Workflow

1. Start infrastructure (PostgreSQL, Redis, NATS)
2. Run migrations for all services
3. Start services in order: Auth → Booking → AI → Web
4. Test endpoints using curl or the web app

## Stopping Services

Press `Ctrl+C` in each terminal window, or use:

```bash
# Kill all Node processes (be careful!)
pkill -f "node.*dev"
```

## Next Steps

- See `README.md` for API documentation
- See `API_ENDPOINTS.md` for detailed endpoint information
- Run tests with `npm test` in each service directory

