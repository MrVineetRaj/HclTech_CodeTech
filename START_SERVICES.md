# How to Start Services

## Architecture
- **Entry-Server** (Port 8080) - Main API gateway, handles auth, proxies to patient-service
- **Patient-Service** (Port 8082) - Handles all patient data endpoints

## Step-by-Step Startup

### 1. Start Patient-Service First

```bash
cd HclTech_CodeTech/services/patient-services
npm run dev
```

**Expected output:**
```
✅ MongoDB Atlas connected successfully
Server is up on port 8082
```

**If you see port conflict:**
- Check your `.env` file has `PORT=8082`
- Or kill the process using that port

### 2. Start Entry-Server

```bash
cd HclTech_CodeTech/entry-server
npm run dev
```

**Expected output:**
```
✅ MongoDB connected successfully
Server is up on port 8080
```

### 3. Verify Both Are Running

- Entry-Server: http://localhost:8080/api/v1/health/express
- Patient-Service: http://localhost:8082/api/v1/health/express (if it has health endpoint)

## Port Configuration

### Patient-Service `.env`
```env
PORT=8082
```

### Entry-Server `.env`
```env
PORT=8080
PATIENT_SERVICE_URL=http://localhost:8082
```

## Troubleshooting

**"Port 8080 already in use"**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /F /PID <PID>

# Or change entry-server port to 8081
```

**"404 errors from patient routes"**
- Make sure patient-service is running on port 8082
- Check `PATIENT_SERVICE_URL` in entry-server `.env` matches patient-service port

**"Cannot connect to patient-service"**
- Verify patient-service is running: `curl http://localhost:8082/api/v1/patient/profile`
- Check firewall isn't blocking the port

