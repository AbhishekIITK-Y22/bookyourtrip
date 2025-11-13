# Migration from Docker to Local Development

## What Was Changed

### ✅ Removed Docker Files
- Deleted `docker-compose.yml`
- Deleted all `Dockerfile` files:
  - `services/auth-service/Dockerfile`
  - `services/booking-service/Dockerfile`
  - `services/ai-service/Dockerfile`
  - `web/Dockerfile`

### ✅ Updated Code
- Updated all service URLs from Docker service names to `localhost`:
  - `http://booking-service:3002` → `http://localhost:3002`
  - `http://ai-service:3003` → `http://localhost:3003`
  - `redis://redis:6379` → `redis://localhost:6379`
- Updated default environment variables in code to use localhost

### ✅ Created Setup Scripts
- `scripts/setup-local-databases.sh` - Creates PostgreSQL databases and users
- `scripts/create-env-files.sh` - Creates .env files for all services
- `scripts/start-local.sh` - Starts all services in the background
- `scripts/stop-local.sh` - Stops all services

### ✅ Created Documentation
- `LOCAL_SETUP.md` - Comprehensive local setup guide
- `QUICK_START_LOCAL.md` - Quick start guide for local development
- Updated `README.md` - Removed Docker references, added local setup instructions
- Updated `QUICKSTART.md` - Updated for local development

### ✅ Updated Configuration
- Updated `.gitignore` to include `logs/` and `*.pid` files
- Updated database URLs to use default PostgreSQL port (5432) instead of custom ports

## Next Steps

### 1. Install Prerequisites

**macOS:**
```bash
brew install postgresql@15 redis nats-server
brew services start postgresql@15
brew services start redis
brew services start nats-server
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql-15 postgresql-contrib redis-server
sudo systemctl start postgresql
sudo systemctl start redis
sudo systemctl enable postgresql
sudo systemctl enable redis
```

### 2. Setup Databases

```bash
cd /Users/abhishek/Desktop/CS455/bookyourtrip
./scripts/setup-local-databases.sh
```

### 3. Create Environment Files

```bash
./scripts/create-env-files.sh
```

This creates:
- `services/auth-service/.env`
- `services/booking-service/.env`
- `services/ai-service/.env`
- `web/.env.local`

### 4. Install Dependencies

```bash
npm install
cd services/auth-service && npm install && cd ../..
cd services/booking-service && npm install && cd ../..
cd services/ai-service && npm install && cd ../..
cd web && npm install && cd ..
```

### 5. Run Migrations

```bash
cd services/auth-service && npx prisma migrate deploy && cd ../..
cd services/booking-service && npx prisma migrate deploy && cd ../..
cd services/ai-service && npx prisma migrate deploy && cd ../..
```

### 6. Seed Database (Optional)

```bash
cd services/booking-service && npm run seed && cd ../..
```

### 7. Start Services

**Option 1: Use start script (background)**
```bash
./scripts/start-local.sh
```

**Option 2: Start manually (separate terminals)**
```bash
# Terminal 1
cd services/auth-service && npm run dev

# Terminal 2
cd services/booking-service && npm run dev

# Terminal 3
cd services/ai-service && npm run dev

# Terminal 4
cd web && npm run dev
```

### 8. Verify Services

```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
```

## Service URLs

- **Auth Service**: http://localhost:3001
- **Booking Service**: http://localhost:3002
- **AI Service**: http://localhost:3003
- **Web App**: http://localhost:3000

## Database Configuration

All databases use the default PostgreSQL port (5432):

- **Auth DB**: `postgresql://auth_user:auth_password@localhost:5432/auth_db`
- **Booking DB**: `postgresql://booking_user:booking_password@localhost:5432/booking_db`
- **AI DB**: `postgresql://ai_user:ai_password@localhost:5432/ai_db`

## Important Notes

1. **PostgreSQL** must be running on port 5432
2. **Redis** must be running on port 6379
3. **NATS** is optional but should run on port 4222 if used
4. All services now use `localhost` instead of Docker service names
5. Logs are stored in the `logs/` directory when using `start-local.sh`
6. Service PIDs are stored in `logs/*.pid` files

## Troubleshooting

See `LOCAL_SETUP.md` for detailed troubleshooting guide.

Common issues:
- **PostgreSQL not running**: `brew services start postgresql@15` (macOS)
- **Redis not running**: `brew services start redis` (macOS)
- **Port already in use**: `lsof -i :3001` to find the process
- **Database connection errors**: Check database URLs in .env files

## Stopping Services

```bash
./scripts/stop-local.sh
```

Or manually kill processes:
```bash
pkill -f "node.*dev"
```

## Additional Resources

- [LOCAL_SETUP.md](./LOCAL_SETUP.md) - Detailed setup instructions
- [QUICK_START_LOCAL.md](./QUICK_START_LOCAL.md) - Quick start guide
- [README.md](./README.md) - Project documentation
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API documentation

