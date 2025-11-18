# Backend Service Connection Issue - Diagnosis & Fix

## 🔍 Issue Identified

The frontend is getting **502 Bad Gateway** errors when trying to access provider/admin endpoints:
```
GET http://localhost:8080/api/v1/admin/patients 502 (Bad Gateway)
Error: Failed to connect to admin service
```

## 📊 Current Service Status

| Service | Port | Status |
|---------|------|--------|
| **Entry Server** | 8080 | ✅ Running |
| **Patient Services** | 8082 | ✅ Running |
| **Admin Services** | 8083 | ❌ **NOT RUNNING** |
| **Redis** | 6379 | ✅ Running |

## 🎯 Root Cause

The **admin-services** microservice is **not running**, causing the entry-server's proxy requests to fail.

### Why admin-services is not running:
1. ❌ **No `.env` file** - Service requires environment configuration
2. ❌ **No `node_modules`** - Dependencies not installed
3. ❌ **Service not started** - No process running on port 8083

## 🔧 Solution Steps

### Step 1: Create `.env` file for admin-services

Create `services/admin-services/.env` with the following content:

```env
# Admin Service Configuration
PORT=8083
NODE_ENV=development

# API URLs
BASE_URL=http://localhost:8083
FRONTEND_URL=http://localhost:5173
VALID_ORIGINS=http://localhost:5173;http://localhost:3000

# Database (Use same MongoDB as other services)
DATABASE_URL=mongodb://localhost:27017/meditech
# OR if using MongoDB Atlas, copy from entry-server/.env

# Security (Copy these from entry-server/.env)
HASH_KEY=your-secret-hash-key-here
SESSION_SECRET=your-session-secret-here
PRIVATE_IP=127.0.0.1

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

**IMPORTANT**: Copy the exact values for `DATABASE_URL`, `HASH_KEY`, and `SESSION_SECRET` from `entry-server/.env` to ensure consistency.

### Step 2: Install Dependencies

```bash
cd services/admin-services
npm install
```

### Step 3: Update package.json (if needed)

The `services/admin-services/package.json` currently has incorrect name. Update it:

```json
{
  "name": "admin-services",
  "version": "1.0.0",
  "description": "Admin service for healthcare providers",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "@types/express-session": "^1.18.2",
    "bcryptjs": "^2.4.3",
    "connect-redis": "^9.0.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "express-rate-limit": "^8.2.1",
    "express-session": "^1.18.2",
    "mongoose": "^8.0.0",
    "passport": "^0.7.0",
    "prom-client": "^15.1.3",
    "redis": "^5.9.0",
    "response-time": "^2.3.4",
    "winston": "^3.18.3",
    "winston-loki": "^6.1.3",
    "zod": "^4.1.12"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cookie-parser": "^1.4.10",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.5",
    "@types/node": "^24.10.1",
    "@types/passport": "^1.0.17",
    "@types/response-time": "^2.3.9",
    "nodemon": "^3.1.11",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.3"
  }
}
```

### Step 4: Start admin-services

Open a **new terminal** and run:

```bash
cd services/admin-services
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully
Server is up on port 8083
```

## ✅ Verification

After starting all services, verify they're running:

```bash
# Windows PowerShell
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -in @(8080, 8082, 8083) } | Select-Object LocalPort, State
```

**Expected Output:**
```
LocalPort  State
---------  -----
8080       Listen  ← Entry Server
8082       Listen  ← Patient Services  
8083       Listen  ← Admin Services ✅ NOW RUNNING
```

## 🧪 Test the Fix

### Test 1: Health Check
```bash
curl http://localhost:8083/api/v1/health/express
```

### Test 2: Login as Provider
Go to: http://localhost:5173/login
- Select "Provider" tab
- Login with provider credentials

### Test 3: Access Provider Dashboard
After login, you should see the provider dashboard with a list of patients (no more 502 errors)

## 📝 Service Startup Order

For future reference, start services in this order:

1. **Redis** (via Docker): `docker-compose up redis -d`
2. **Patient Services**: `cd services/patient-services && npm run dev`
3. **Admin Services**: `cd services/admin-services && npm run dev` ← **This was missing!**
4. **Entry Server**: `cd entry-server && npm run dev`
5. **Frontend**: `cd Frontend && npm run dev`

## 🚀 Quick Start Script

Create `start-all-services.ps1`:

```powershell
# Start Redis (if not running)
docker-compose up redis -d

# Start Patient Services
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/patient-services; npm run dev"

# Wait 3 seconds
Start-Sleep -Seconds 3

# Start Admin Services
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/admin-services; npm run dev"

# Wait 3 seconds
Start-Sleep -Seconds 3

# Start Entry Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd entry-server; npm run dev"

# Wait 3 seconds
Start-Sleep -Seconds 3

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Frontend; npm run dev"

Write-Host "✅ All services started! Check individual terminal windows for status."
```

## 📌 Summary

**Problem**: Admin-services not running on port 8083  
**Cause**: Missing .env file and node_modules  
**Fix**: Create .env, install dependencies, start the service  
**Result**: Provider portal now works without 502 errors  

---

## Additional Notes

### Loki Logging Errors (Non-Critical)
The errors about Loki (port 3100) are non-critical. They occur because winston-loki is trying to send logs to Grafana Loki, but it's not running. To fix:

```bash
docker-compose up loki -d
```

Or disable Loki transport in logger configuration if not needed for development.

