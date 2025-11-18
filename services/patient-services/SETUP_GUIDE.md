# MongoDB Atlas Setup Guide

## Quick Setup

### 1. Create MongoDB Atlas Account

- Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Sign up for free

### 2. Create Cluster

- Click **"Build a Database"** → Choose **FREE** tier
- Select region → Click **"Create Cluster"** (takes 3-5 min)

### 3. Database User

- Go to **"Database Access"**
- Add user with username & password (save these!)

### 4. Network Access

- Go to **"Network Access"**
- Click **"Add IP Address"** → **"Allow Access from Anywhere"** (0.0.0.0/0)

### 5. Get Connection String

- Go to **"Database"** → Click **"Connect"**
- Choose **"Connect your application"**
- Copy connection string:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Configure Backend

**Update your `.env` file:**

Replace the PostgreSQL `DATABASE_URL` with your MongoDB Atlas connection string:

```env
DATABASE_URL=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/meditech?retryWrites=true&w=majority
```

**Important**: Replace `<username>`, `<password>`, and add database name `meditech`

### 7. Install & Run

```bash
cd HclTech_CodeTech/services/patient-services
npm install
npm run dev
```

Expected output:

```
✅ MongoDB Atlas connected successfully
Server is up on port 8080
```

---

## Models Created

5 MongoDB models with relationships:

- HealthProvider
- Patient
- PatientMedicalConditions
- UserGoals
- GoalTracking

See [MODELS_README.md](./MODELS_README.md) for details.

---

## Troubleshooting

**"MongoServerError: bad auth"** → Check username/password in connection string

**"MongooseServerSelectionError"** → Whitelist your IP in Network Access

**"Cannot find module 'mongoose'"** → Run `npm install`
