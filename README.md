# 🏥 MediTech Platform

A comprehensive healthcare management platform connecting healthcare providers with patients through medication tracking, goal monitoring, and AI-powered voice reminders.

## 📋 Overview

**Two Portals:**

- **Healthcare Provider Portal** - Manage patients, medications, medical conditions, goals, and AI-powered reminders
- **Patient Portal** - Track medications, goals, medical conditions, view health data, and receive AI call reminders

## 🏗️ Architecture

![Architecture](./architecture.png)

**Microservices Architecture:**

- **Entry Server** - API Gateway with authentication & routing
- **Admin Services** - Provider/admin operations
- **Patient Services** - Patient-specific operations
- **Workers** - Background jobs & AI voice call integration
- **Frontend** - React.js SPA

## 🗄️ Database Design

![Database Schema](./db-schema.png)

## ✨ Features

### Provider Portal

- 👥 Manage patient profiles
- 💊 Assign medications with schedules
- 🏥 Add and track medical conditions
- 🎯 Set personalized health goals
- 📞 Trigger AI voice call reminders
- 📊 View patient statistics and compliance

### Patient Portal

- 📱 View medication schedule
- ✅ Track and update goal status
- 🏥 View medical conditions
- 👤 Manage profile information
- 📞 Receive AI voice call reminders
- 📊 View health metrics

### AI Voice Agent (VAPI Integration)

- 📞 Automated phone calls for medication reminders
- 🗣️ Natural conversation with patients
- ✅ Track medication adherence
- 📊 Compliance monitoring
- 🔔 Scheduled and on-demand reminders

## 🛠️ Tech Stack

### Frontend

- **React.js** 19+ with React Router 7
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Axios** for API calls

### Backend

- **Node.js** + **Express.js** (Microservices)
- **TypeScript** throughout
- **MongoDB** with Mongoose ODM
- **Redis** for caching & sessions
- **BullMQ** for job queues
- **JWT** & **Passport.js** for authentication
- **Winston** for logging

### DevOps

- **Docker** & Docker Compose
- **Loki** for log aggregation

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm/pnpm
- **MongoDB** 6.0+ (local or cloud)
- **Redis** 7.0+

### 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/HclTech_CodeTech.git
cd HclTech_CodeTech
```

2. **Install Dependencies**

```bash
# Entry Server
cd entry-server
npm install

# Admin Services
cd ../services/admin-services
npm install

# Patient Services
cd ../patient-services
npm install

# Workers
cd ../../workers
npm install

# Frontend
cd ../Frontend
npm install
```

### ⚙️ Environment Configuration

Create `.env` files in each service directory:

#### 1. Entry Server (`entry-server/.env`)

```env
# Server Configuration
PORT=8080
NODE_ENV=development
BASE_URL=http://localhost:8080
PRIVATE_IP=127.0.0.1

# Frontend
FRONTEND_URL=http://localhost:8080
VALID_ORIGINS=http://localhost:8080,http://localhost:5173

# Database
DATABASE_URL=mongodb://localhost:27017/meditech

# Authentication
SESSION_SECRET=your-super-secret-session-key-change-this
JWT_SECRET=your-jwt-secret-key-change-this
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your-32-char-encryption-key-here

# Microservices URLs
PATIENT_SERVICE_URL=http://localhost:8082
ADMIN_SERVICE_URL=http://localhost:8083

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### 2. Admin Services (`services/admin-services/.env`)

```env
# Server Configuration
PORT=8083
NODE_ENV=development
BASE_URL=http://localhost:8083
PRIVATE_IP=127.0.0.1

# Frontend
FRONTEND_URL=http://localhost:8080
VALID_ORIGINS=http://localhost:8080

# Database
DATABASE_URL=mongodb://localhost:27017/meditech

# Authentication
SESSION_SECRET=your-super-secret-session-key-change-this
HASH_KEY=your-hash-key-for-passwords

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### 3. Patient Services (`services/patient-services/.env`)

```env
# Server Configuration
PORT=8082
NODE_ENV=development
BASE_URL=http://localhost:8082
PRIVATE_IP=127.0.0.1

# Database
DATABASE_URL=mongodb://localhost:27017/meditech

# Authentication
SESSION_SECRET=your-super-secret-session-key-change-this
HASH_KEY=your-hash-key-for-passwords

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### 4. Workers (`workers/.env`)

```env
# Server Configuration
PORT=8084
NODE_ENV=development
BASE_URL=http://localhost:8084
PRIVATE_IP=127.0.0.1

# Database
DATABASE_URL=mongodb://localhost:27017/meditech

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# VAPI Configuration (AI Voice Calls)
VAPI_API_KEY=your-vapi-api-key-here
VAPI_PHONE_NUMBER_ID=your-vapi-phone-number-id
HASH_KEY=your-hash-key-here
```

### 🎬 Running the Application

**Option 1: Development Mode**

Open **5 separate terminals** and run each service:

```bash
# Terminal 1 - Entry Server (API Gateway)
cd entry-server
npm run dev

# Terminal 2 - Admin Services
cd services/admin-services
npm run dev

# Terminal 3 - Patient Services
cd services/patient-services
npm run dev

# Terminal 4 - Workers (Background Jobs)
cd workers
npm run dev

# Terminal 5 - Frontend
cd Frontend
npm run dev
```

**Option 2: Docker Compose (Production)**

```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 🔍 Verify Services

Check if all services are running:

```bash
# Windows PowerShell
netstat -ano | findstr "8080 8082 8083 8084"

# Linux/Mac
netstat -tulpn | grep -E "8080|8082|8083|8084"
```

Expected output:

- Port **8080** - Entry Server & Frontend
- Port **8082** - Patient Services
- Port **8083** - Admin Services
- Port **8084** - Workers

### 🌐 Access the Application

- **Frontend**: http://localhost:8080
- **API Gateway**: http://localhost:8080/api/v1
- **Health Check**: http://localhost:8080/api/v1/health

## 📁 Project Structure

```
HclTech_CodeTech/
├── entry-server/              # API Gateway (Port 8080)
│   ├── src/
│   │   ├── app/
│   │   │   ├── routes/       # Auth & proxy routes
│   │   │   ├── middlewares/  # Auth guards
│   │   │   ├── lib/          # Utilities, JWT, DB
│   │   │   └── models/       # Mongoose models
│   │   └── server.ts         # Entry point
│   └── package.json
│
├── services/
│   ├── admin-services/       # Provider Portal Backend (Port 8083)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── routes/
│   │   │   │   │   └── admin/  # Patient management, conditions, goals
│   │   │   │   ├── models/     # Patient, Provider, Conditions
│   │   │   │   └── lib/
│   │   │   └── server.ts
│   │   └── package.json
│   │
│   └── patient-services/     # Patient Portal Backend (Port 8082)
│       ├── src/
│       │   ├── app/
│       │   │   ├── routes/
│       │   │   │   └── patient/  # Goals, medications, tracking
│       │   │   ├── models/
│       │   │   └── lib/
│       │   └── server.ts
│       └── package.json
│
├── workers/                  # Background Jobs (Port 8084)
│   ├── src/
│   │   ├── app/
│   │   │   ├── notification-worker.ts  # BullMQ worker
│   │   │   └── services/
│   │   │       └── vapi.service.ts     # VAPI integration
│   │   └── server.ts
│   └── package.json
│
├── Frontend/                 # React.js Frontend
│   ├── app/
│   │   ├── routes/           # Patient & Provider pages
│   │   │   ├── patient.*     # Patient portal routes
│   │   │   ├── provider.*    # Provider portal routes
│   │   │   └── login.tsx
│   │   └── lib/              # API clients, auth helpers
│   ├── public/
│   └── package.json
│
├── docker-compose.yml        # Multi-container setup
└── README.md                 # This file
```

## 📱 Usage Guide

### For Healthcare Providers:

1. **Login** to provider portal at `/login` (select Provider)
2. **Dashboard** - View all patients and statistics
3. **Patient Details** - Click on a patient to:
   - View complete profile
   - Add/edit medical conditions
   - Assign health goals
   - Trigger AI voice call reminders
4. **Invite Patients** - Send invitation links to new patients

### For Patients:

1. **Register/Login** at `/login` (select Patient)
2. **Dashboard** - Overview of medications and goals
3. **Medications** - View medication schedule
4. **Medical Conditions** - Track health conditions
5. **Goals** - View and update health goals
6. **Profile** - Update personal information

## 👥 Team

- Vineet Raj
- Anurag Singh
- Mohit Bharti
