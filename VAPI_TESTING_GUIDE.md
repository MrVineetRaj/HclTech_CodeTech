# VAPI AI Medication Reminder - Testing Guide

## Setup Overview

This system uses **BullMQ** queues to send patient medication reminders via **VAPI AI voice calls**.

**Flow:** API Endpoint → Redis Queue → Worker → MongoDB → VAPI → Phone Call

---

## Prerequisites

1. **MongoDB Atlas** - Connection string in `.env`
2. **Redis** - Running on localhost:6379
3. **VAPI Account** - API key and phone number ID configured
4. **Seeded Database** - Run `npm run seed` first

---

## Step 1: Seed the Database

```bash
cd services/patient-services
npm run seed
```

**Expected Output:**

```
🎉 Database seeding completed successfully!
📝 Summary:
   - Health Providers: 2
   - Patients: 4
   - Medical Conditions: 5
   - User Goals: 5
   - Goal Tracking: 6
📋 Sample Patient IDs for testing:
   - Patient 1 (John Doe): 67abc123def456...
   - Patient 2 (Jane Smith): 67abc789ghi012...
```

**Save these Patient IDs for testing!**

---

## Step 2: Start Services

### Terminal 1: Start Redis

```bash
docker-compose up redis
# Or if Redis is already running locally, skip this
```

### Terminal 2: Start Patient Service (API)

```bash
cd services/patient-services
npm run dev
```

**Expected Output:**

```
✅ MongoDB Atlas connected successfully
✅ Notification queue initialized
Server is up on port 8080
```

### Terminal 3: Start Worker

```bash
cd workers
npm run dev
```

**Expected Output:**

```
🚀 Notification Worker initiated
✅ Worker: MongoDB Atlas connected successfully
👂 Worker is listening for notification jobs...
```

---

## Step 3: Test with Postman

### A. Send Single Notification

**Endpoint:** `POST http://localhost:8080/api/v1/notification/send-reminder`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "patientId": "67abc123def456...",
  "notificationType": "medication"
}
```

Replace `patientId` with an actual ID from the seed output.

**Expected Response:**

```json
{
  "statusCode": 200,
  "message": "Notification job added to queue successfully",
  "data": {
    "jobId": "1",
    "patientId": "67abc123def456...",
    "notificationType": "medication",
    "status": "queued"
  }
}
```

**Worker Console Output:**

```
📋 Processing notification job: 1
🔍 Fetching patient data for ID: 67abc123def456...
✅ Found patient: John Doe
💊 Found 1 medication goal(s)
📞 Message prepared: "Hi John Doe, this is your medication reminder..."
📞 Initiating VAPI call to John Doe (+1987654321)
✅ VAPI call initiated successfully. Call ID: call_abc123
✅ Call initiated successfully! Call ID: call_abc123
✅ Job 1 completed successfully
```

---

### B. Check Job Status

**Endpoint:** `GET http://localhost:8080/api/v1/notification/status/:jobId`

**Example:** `GET http://localhost:8080/api/v1/notification/status/1`

**Expected Response:**

```json
{
  "statusCode": 200,
  "message": "Job status retrieved",
  "data": {
    "jobId": "1",
    "state": "completed",
    "progress": 0,
    "result": {
      "status": "success",
      "callId": "call_abc123",
      "patient": "John Doe",
      "phone": "+1987654321"
    },
    "data": {
      "patientId": "67abc123def456...",
      "notificationType": "medication"
    }
  }
}
```

---

### C. Send Bulk Notifications

**Endpoint:** `POST http://localhost:8080/api/v1/notification/send-bulk`

**Body (JSON):**

```json
{
  "patientIds": ["67abc123def456...", "67abc789ghi012...", "67abcxyzpqr345..."]
}
```

**Expected Response:**

```json
{
  "statusCode": 200,
  "message": "3 notification jobs queued successfully",
  "data": {
    "jobIds": ["2", "3", "4"],
    "count": 3
  }
}
```

---

## Step 4: Test with cURL

### Send Single Notification

```bash
curl -X POST http://localhost:8080/api/v1/notification/send-reminder \
  -H "Content-Type: application/json" \
  -d '{"patientId":"67abc123def456...","notificationType":"medication"}'
```

### Check Job Status

```bash
curl http://localhost:8080/api/v1/notification/status/1
```

### Send Bulk Notifications

```bash
curl -X POST http://localhost:8080/api/v1/notification/send-bulk \
  -H "Content-Type: application/json" \
  -d '{"patientIds":["67abc123def456...","67abc789ghi012..."]}'
```

---

## Troubleshooting

### Error: "Patient not found"

- Run `npm run seed` again
- Use correct Patient ID from seed output
- Check MongoDB connection

### Error: "Cannot find module mongoose"

- In `workers/` directory: `npm install`
- In `services/patient-services/` directory: `npm install`

### Error: "VAPI call failed"

- Check `VAPI_API_KEY` and `VAPI_PHONE_NUMBER_ID` in worker `.env`
- Verify VAPI account is active
- Check phone number format (E.164: +1234567890)

### No worker console output

- Ensure worker is running (`npm run dev` in workers/)
- Check Redis connection
- Verify Redis is running on port 6379

### Queue not processing

- Restart Redis: `docker-compose restart redis`
- Restart worker
- Check BullMQ connection in worker console

---

## API Endpoints Summary

| Method | Endpoint                             | Description              |
| ------ | ------------------------------------ | ------------------------ |
| POST   | `/api/v1/notification/send-reminder` | Send single notification |
| POST   | `/api/v1/notification/send-bulk`     | Send bulk notifications  |
| GET    | `/api/v1/notification/status/:jobId` | Get job status           |
| GET    | `/api/v1/health`                     | Health check             |

---

## Environment Variables Checklist

### services/patient-services/.env

```
PORT=8080
DATABASE_URL=mongodb+srv://...
REDIS_HOST=localhost
REDIS_PORT=6379
(... other vars ...)
```

### workers/.env

```
DATABASE_URL=mongodb+srv://...
REDIS_HOST=localhost
REDIS_PORT=6379
VAPI_API_KEY=f89c1482-396b-4336-a4ab-17d14a3bfb70
VAPI_PHONE_NUMBER_ID=f441fda6-85f8-4fbe-a7b9-783979f61a95
```

---

## Success Indicators

✅ **Patient Service:**

- MongoDB connected
- Server running on port 8080
- Notification queue initialized

✅ **Worker:**

- MongoDB connected
- Listening for notification jobs

✅ **API Test:**

- Returns jobId
- Status 200

✅ **Worker Processing:**

- Job picked up
- Patient data fetched
- VAPI call initiated
- Job completed

✅ **VAPI:**

- Call ID returned
- Patient receives call

---

## Next Steps

1. Monitor VAPI dashboard for call logs
2. Test with real phone numbers
3. Add scheduled reminders (cron jobs)
4. Implement call status webhooks
5. Add patient confirmation tracking

---

## Need Help?

- Check worker console for detailed logs
- Verify all services are running
- Ensure MongoDB has seeded data
- Test VAPI credentials separately
- Check Redis connection

🎉 Happy Testing!
