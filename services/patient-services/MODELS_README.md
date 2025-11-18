# MongoDB Models Documentation

This document provides an overview of all MongoDB/Mongoose models used in the MediTech Platform patient-services.

## Table of Contents

1. [HealthProvider](#healthprovider)
2. [Patient](#patient)
3. [PatientMedicalConditions](#patientmedicalconditions)
4. [UserGoals](#usergoals)
5. [GoalTracking](#goaltracking)
6. [Relationships](#relationships)

---

## HealthProvider

Represents doctors or healthcare assistants who manage patients.

### Schema

| Field     | Type     | Required | Unique | Description                        |
| --------- | -------- | -------- | ------ | ---------------------------------- |
| \_id      | ObjectId | Auto     | Yes    | Auto-generated MongoDB ID          |
| name      | String   | Yes      | No     | Full name of the health provider   |
| email     | String   | Yes      | Yes    | Email address (unique, lowercase)  |
| password  | String   | Yes      | No     | Hashed password (min 6 characters) |
| phone     | String   | Yes      | No     | Contact phone number               |
| address   | String   | Yes      | No     | Street address                     |
| city      | String   | Yes      | No     | City                               |
| state     | String   | Yes      | No     | State/Province                     |
| pincode   | Number   | Yes      | No     | Postal/ZIP code                    |
| country   | String   | Yes      | No     | Country                            |
| createdAt | Date     | Auto     | No     | Record creation timestamp          |
| updatedAt | Date     | Auto     | No     | Record last update timestamp       |

### Indexes

- `email` (ascending)
- `phone` (ascending)

### Relationships

- **One-to-Many** with `Patient` (one provider can have many patients)
- **One-to-Many** with `UserGoals` (one provider can create many goals)
- **One-to-Many** with `GoalTracking` (one provider can track many goals)

---

## Patient

Represents patients who receive care from health providers.

### Schema

| Field            | Type     | Required | Unique | Description                        |
| ---------------- | -------- | -------- | ------ | ---------------------------------- |
| \_id             | ObjectId | Auto     | Yes    | Auto-generated MongoDB ID          |
| healthProviderId | ObjectId | Yes      | No     | Reference to HealthProvider        |
| fullname         | String   | Yes      | No     | Patient's full name                |
| email            | String   | Yes      | Yes    | Email address (unique, lowercase)  |
| password         | String   | Yes      | No     | Hashed password (min 6 characters) |
| phone            | String   | Yes      | No     | Contact phone number               |
| address          | String   | Yes      | No     | Street address                     |
| city             | String   | Yes      | No     | City                               |
| state            | String   | Yes      | No     | State/Province                     |
| pincode          | Number   | Yes      | No     | Postal/ZIP code                    |
| country          | String   | Yes      | No     | Country                            |
| createdAt        | Date     | Auto     | No     | Record creation timestamp          |
| updatedAt        | Date     | Auto     | No     | Record last update timestamp       |

### Indexes

- `email` (ascending)
- `phone` (ascending)
- `healthProviderId` (ascending)

### Relationships

- **Many-to-One** with `HealthProvider` (many patients to one provider)
- **One-to-Many** with `PatientMedicalConditions` (one patient can have many conditions)
- **One-to-Many** with `UserGoals` (one patient can have many goals)
- **One-to-Many** with `GoalTracking` (one patient can have many tracked goals)

---

## PatientMedicalConditions

Stores medical conditions and health information for patients.

### Schema

| Field     | Type     | Required | Description                      |
| --------- | -------- | -------- | -------------------------------- |
| \_id      | ObjectId | Auto     | Auto-generated MongoDB ID        |
| category  | String   | Yes      | Type of medical condition (enum) |
| patientId | ObjectId | Yes      | Reference to Patient             |
| label     | String   | Yes      | Condition name/label             |
| value     | String   | Yes      | Condition details/description    |
| createdAt | Date     | Auto     | Record creation timestamp        |
| updatedAt | Date     | Auto     | Record last update timestamp     |

### Category Enum Values

- `allergy`
- `chronic_condition`
- `medication`
- `surgery`
- `family_history`
- `lifestyle`
- `other`

### Indexes

- `patientId` (ascending)
- Compound: `patientId + category` (ascending)

### Relationships

- **Many-to-One** with `Patient` (many conditions can belong to one patient)

---

## UserGoals

Represents health goals set by providers for patients.

### Schema

| Field            | Type     | Required | Description                             |
| ---------------- | -------- | -------- | --------------------------------------- |
| \_id             | ObjectId | Auto     | Auto-generated MongoDB ID               |
| healthProviderId | ObjectId | Yes      | Reference to HealthProvider             |
| patientId        | ObjectId | Yes      | Reference to Patient                    |
| category         | String   | Yes      | Goal type (enum)                        |
| value            | [String] | Yes      | Array of goal descriptions (min 1 item) |
| createdAt        | Date     | Auto     | Record creation timestamp               |
| updatedAt        | Date     | Auto     | Record last update timestamp            |

### Category Enum Values

- `medication` - Medication-related goals
- `general` - General health goals
- `healthcheckup` - Health checkup reminders

### Indexes

- `patientId` (ascending)
- `healthProviderId` (ascending)
- Compound: `patientId + category` (ascending)
- Compound: `healthProviderId + patientId` (ascending)

### Relationships

- **Many-to-One** with `HealthProvider` (many goals can be created by one provider)
- **Many-to-One** with `Patient` (many goals can belong to one patient)
- **One-to-One** with `GoalTracking` (one goal can have one tracking record)

---

## GoalTracking

Tracks the progress and completion status of user goals.

### Schema

| Field            | Type     | Required | Default | Description                  |
| ---------------- | -------- | -------- | ------- | ---------------------------- |
| \_id             | ObjectId | Auto     | -       | Auto-generated MongoDB ID    |
| userId           | ObjectId | Yes      | -       | Reference to Patient         |
| healthProviderId | ObjectId | Yes      | -       | Reference to HealthProvider  |
| target           | String   | Yes      | -       | Goal target description      |
| completed        | Boolean  | Yes      | false   | Completion status            |
| goalID           | ObjectId | Yes      | -       | Reference to UserGoals       |
| createdAt        | Date     | Auto     | -       | Record creation timestamp    |
| updatedAt        | Date     | Auto     | -       | Record last update timestamp |

### Indexes

- `userId` (ascending)
- `healthProviderId` (ascending)
- `goalID` (ascending)
- Compound: `userId + goalID` (ascending)
- Compound: `userId + completed` (ascending)
- Compound: `healthProviderId + userId` (ascending)

### Relationships

- **Many-to-One** with `Patient` via `userId` (many tracking records can belong to one patient)
- **Many-to-One** with `HealthProvider` (many tracking records can be monitored by one provider)
- **One-to-One** with `UserGoals` via `goalID` (one tracking record for one goal)

---

## Relationships Diagram

```
HealthProvider (1) ----< (N) Patient
      |                        |
      |                        +----< (N) PatientMedicalConditions
      |                        |
      +----< (N) UserGoals (N) +
      |            |
      |            | (1:1)
      |            |
      +----< (N) GoalTracking
                   |
                   +----< (1) Patient (via userId)
```

---

## Usage Examples

### Creating a Health Provider

```typescript
import { HealthProvider } from "./models";

const provider = await HealthProvider.create({
  name: "Dr. John Smith",
  email: "john.smith@hospital.com",
  password: "hashedPassword123", // Remember to hash before saving!
  phone: "+1234567890",
  address: "123 Medical Center",
  city: "New York",
  state: "NY",
  pincode: 10001,
  country: "USA",
});
```

### Creating a Patient

```typescript
import { Patient } from "./models";

const patient = await Patient.create({
  healthProviderId: provider._id,
  fullname: "Jane Doe",
  email: "jane.doe@email.com",
  password: "hashedPassword123",
  phone: "+1987654321",
  address: "456 Patient St",
  city: "New York",
  state: "NY",
  pincode: 10002,
  country: "USA",
});
```

### Adding Medical Conditions

```typescript
import { PatientMedicalConditions } from "./models";

const condition = await PatientMedicalConditions.create({
  category: "allergy",
  patientId: patient._id,
  label: "Peanut Allergy",
  value: "Severe allergic reaction to peanuts",
});
```

### Creating User Goals

```typescript
import { UserGoals } from "./models";

const goal = await UserGoals.create({
  healthProviderId: provider._id,
  patientId: patient._id,
  category: "medication",
  value: ["Take insulin twice daily", "Monitor blood sugar levels"],
});
```

### Tracking Goals

```typescript
import { GoalTracking } from "./models";

const tracking = await GoalTracking.create({
  userId: patient._id,
  healthProviderId: provider._id,
  target: "Take morning insulin",
  completed: false,
  goalID: goal._id,
});
```

### Querying with Population

```typescript
// Get patient with their health provider
const patientWithProvider = await Patient.findById(patientId).populate(
  "healthProviderId"
);

// Get all goals for a patient with provider details
const goals = await UserGoals.find({ patientId })
  .populate("healthProviderId")
  .populate("patientId");

// Get goal tracking with all related data
const trackingData = await GoalTracking.find({ userId: patientId })
  .populate("userId")
  .populate("healthProviderId")
  .populate("goalID");
```

---

## Best Practices

1. **Password Hashing**: Always hash passwords before saving using bcrypt or similar libraries
2. **Validation**: Use the built-in Mongoose validators or add custom validation
3. **Population**: Use `.populate()` to resolve references when needed
4. **Indexes**: Indexes are already configured for optimal query performance
5. **Error Handling**: Always wrap database operations in try-catch blocks
6. **Timestamps**: `createdAt` and `updatedAt` are automatically managed by Mongoose

---

## Environment Setup

Make sure your `.env` file contains the MongoDB connection string:

```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/meditech?retryWrites=true&w=majority
```

The database connection is automatically established when the server starts via `src/server.ts`.
