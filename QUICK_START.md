# Quick Start Guide - VAPI AI Medication Reminder

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Patient Service
cd services/patient-services
npm install

# Worker
cd ../../workers
npm install
```

### 2. Configure Environment Variables

**Create `services/patient-services/.env`:**

```env
PORT=8080
NODE_ENV=development
BASE_URL=http://localhost:8080/
VALID_ORIGINS=http://localhost:5173/;
FRONTEND_URL=http://localhost:5173/
ENCRYPTION_KEY=your_encryption_key_here
HASH_KEY=your_hash_key_here
PRIVATE_IP=192.168.1.9

# MongoDB Atlas - Add your connection string
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/meditech?retryWrites=true&w=majority

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

SESSION_SECRET=your_session_secret_here

REDIS_HOST=localhost
REDIS_PORT=6379

GRAFANA_USERNAME=admin
GRAFANA_PASSWORD=admin

LOKI_ENABLED=false
```

**Create `workers/.env`:**

```env
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
HASH_KEY=your_hash_key_here
PRIVATE_IP=192.168.1.9

# MongoDB Atlas - Same as patient service
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/meditech?retryWrites=true&w=majority

REDIS_HOST=localhost
REDIS_PORT=6379

# VAPI Credentials
VAPI_API_KEY=your_vapi_api_key
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id
```

### 3. Start Redis

```bash
docker-compose up -d redis
```

### 4. Seed Database

```bash
cd services/patient-services
npm run seed
```

**Save the Patient IDs from the output!**

### 5. Start Services

**Terminal 1 - Patient Service:**

```bash
cd services/patient-services
npm run dev
```

**Terminal 2 - Worker:**

```bash
cd workers
npm run dev
```

### 6. Test!

**Send notification with Postman or cURL:**

```bash
curl -X POST http://localhost:8080/api/v1/notification/send-reminder \
  -H "Content-Type: application/json" \
  -d '{"patientId":"YOUR_PATIENT_ID_HERE","notificationType":"medication"}'
```

Replace `YOUR_PATIENT_ID_HERE` with an ID from step 4.

---

## 📋 What Was Built

### MongoDB Schemas

- ✅ HealthProvider
- ✅ Patient
- ✅ PatientMedicalConditions
- ✅ UserGoals
- ✅ GoalTracking

### Services

- ✅ Patient API Service (port 8080)
- ✅ BullMQ Worker (background)
- ✅ VAPI Integration
- ✅ Redis Queue

### API Endpoints

- `POST /api/v1/notification/send-reminder` - Send single notification
- `POST /api/v1/notification/send-bulk` - Send bulk notifications
- `GET /api/v1/notification/status/:jobId` - Check job status

---

## 📖 Full Documentation

- **VAPI_TESTING_GUIDE.md** - Complete testing guide with Postman examples
- **services/patient-services/SETUP_GUIDE.md** - MongoDB Atlas setup
- **services/patient-services/MODELS_README.md** - Database schema details

---

## 🎯 System Flow

```
1. POST to API endpoint with patientId
2. Job added to Redis queue
3. Worker picks up job
4. Worker fetches patient data from MongoDB
5. Worker generates personalized message
6. Worker calls VAPI API
7. VAPI makes AI phone call to patient
8. Patient receives medication reminder
```

---

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] `.env` files configured with MongoDB Atlas
- [ ] Redis running
- [ ] Database seeded
- [ ] Patient service running (port 8080)
- [ ] Worker running and listening
- [ ] Test API call successful
- [ ] Worker processes job
- [ ] VAPI call initiated

---

## 🆘 Common Issues

**"MongoDB connection failed"**
→ Check DATABASE_URL in both `.env` files

**"Cannot find module mongoose"**
→ Run `npm install` in both directories

**"VAPI call failed"**
→ Verify VAPI credentials in workers/.env

**"Patient not found"**
→ Run `npm run seed` and use correct patient ID

---

## 🎉 You're Ready!

Your AI medication reminder system is live. Test it with Postman and watch the worker logs to see the magic happen!

For detailed testing instructions, see **VAPI_TESTING_GUIDE.md**
