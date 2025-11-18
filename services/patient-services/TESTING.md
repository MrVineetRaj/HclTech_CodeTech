# Patient Router API Testing Guide

This guide explains how to test the Patient Router endpoints using GET, POST, PUT, and DELETE operations.

## Prerequisites

1. **Server must be running**: Start the patient services server first
   ```bash
   npm run dev
   # or
   npm start
   ```

2. **Database connection**: Ensure MongoDB is connected and accessible

3. **Health Provider**: You need at least one Health Provider in the database for patient registration

## Test Scripts

### Option 1: TypeScript Test Script (Recommended)

Run the comprehensive TypeScript test script:

```bash
cd services/patient-services
npx ts-node test-patient-routes.ts
```

**Note**: Update the `healthProviderId` in the script with a valid Health Provider ID from your database.

### Option 2: Bash Script (Linux/Mac/Git Bash)

```bash
cd services/patient-services
chmod +x test-routes.sh
./test-routes.sh
```

### Option 3: Manual Testing with curl

See examples below for each endpoint.

## Test Endpoints

### Patient Profile Endpoints

#### 1. Register Patient (POST)
```bash
curl -X POST http://localhost:3000/api/v1/patient/register \
  -H "Content-Type: application/json" \
  -d '{
    "healthProviderId": "YOUR_HEALTH_PROVIDER_ID",
    "fullname": "Test Patient",
    "email": "test@example.com",
    "password": "test123456",
    "phone": "1234567890",
    "address": "123 Test Street",
    "city": "Test City",
    "state": "Test State",
    "pincode": 12345,
    "country": "Test Country"
  }'
```

#### 2. Login Patient (POST)
```bash
curl -X POST http://localhost:3000/api/v1/patient/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

#### 3. Get Patient Profile (GET)
```bash
curl -X GET "http://localhost:3000/api/v1/patient/profile?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

#### 4. Update Patient Profile (PUT)
```bash
curl -X PUT "http://localhost:3000/api/v1/patient/profile?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Updated Name",
    "city": "New City",
    "patientId": "YOUR_PATIENT_ID"
  }'
```

#### 5. Get Health Provider (GET)
```bash
curl -X GET "http://localhost:3000/api/v1/patient/health-provider?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

### Medical Conditions Endpoints

#### 6. Create Medical Condition (POST)
```bash
curl -X POST "http://localhost:3000/api/v1/patient/medical-conditions?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "allergy",
    "label": "Peanut Allergy",
    "value": "Severe",
    "patientId": "YOUR_PATIENT_ID"
  }'
```

#### 7. Get All Medical Conditions (GET)
```bash
curl -X GET "http://localhost:3000/api/v1/patient/medical-conditions?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

#### 8. Get Medical Condition by ID (GET)
```bash
curl -X GET "http://localhost:3000/api/v1/patient/medical-conditions/CONDITION_ID?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

#### 9. Get Medical Conditions by Category (GET)
```bash
curl -X GET "http://localhost:3000/api/v1/patient/medical-conditions/category/allergy?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

#### 10. Update Medical Condition (PUT)
```bash
curl -X PUT "http://localhost:3000/api/v1/patient/medical-conditions/CONDITION_ID?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "Moderate",
    "patientId": "YOUR_PATIENT_ID"
  }'
```

#### 11. Delete Medical Condition (DELETE)
```bash
curl -X DELETE "http://localhost:3000/api/v1/patient/medical-conditions/CONDITION_ID?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

### User Goals Endpoints

#### 12. Create User Goal (POST)
```bash
curl -X POST "http://localhost:3000/api/v1/patient/goals?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "healthProviderId": "YOUR_HEALTH_PROVIDER_ID",
    "category": "medication",
    "value": ["Take medicine twice daily", "Drink plenty of water"],
    "patientId": "YOUR_PATIENT_ID"
  }'
```

#### 13. Get All User Goals (GET)
```bash
curl -X GET "http://localhost:3000/api/v1/patient/goals?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

#### 14. Get User Goal by ID (GET)
```bash
curl -X GET "http://localhost:3000/api/v1/patient/goals/GOAL_ID?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

#### 15. Get User Goals by Category (GET)
```bash
curl -X GET "http://localhost:3000/api/v1/patient/goals/category/medication?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

#### 16. Update User Goal (PUT)
```bash
curl -X PUT "http://localhost:3000/api/v1/patient/goals/GOAL_ID?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "value": ["Updated goal 1", "Updated goal 2"],
    "patientId": "YOUR_PATIENT_ID"
  }'
```

#### 17. Delete User Goal (DELETE)
```bash
curl -X DELETE "http://localhost:3000/api/v1/patient/goals/GOAL_ID?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

### Goal Tracking Endpoints

#### 18. Create Goal Tracking (POST)
```bash
curl -X POST "http://localhost:3000/api/v1/patient/goal-tracking?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "healthProviderId": "YOUR_HEALTH_PROVIDER_ID",
    "target": "Complete medication schedule for 30 days",
    "goalID": "YOUR_GOAL_ID",
    "completed": false,
    "patientId": "YOUR_PATIENT_ID"
  }'
```

#### 19. Get All Goal Tracking (GET)
```bash
curl -X GET "http://localhost:3000/api/v1/patient/goal-tracking?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

#### 20. Get Goal Tracking by Goal ID (GET)
```bash
curl -X GET "http://localhost:3000/api/v1/patient/goal-tracking/goal/GOAL_ID?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

#### 21. Get Completed Goals (GET)
```bash
curl -X GET "http://localhost:3000/api/v1/patient/goal-tracking/completed?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

#### 22. Get Pending Goals (GET)
```bash
curl -X GET "http://localhost:3000/api/v1/patient/goal-tracking/pending?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

#### 23. Update Goal Tracking (PUT)
```bash
curl -X PUT "http://localhost:3000/api/v1/patient/goal-tracking/TRACKING_ID?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true,
    "patientId": "YOUR_PATIENT_ID"
  }'
```

#### 24. Delete Goal Tracking (DELETE)
```bash
curl -X DELETE "http://localhost:3000/api/v1/patient/goal-tracking/TRACKING_ID?patientId=YOUR_PATIENT_ID" \
  -H "Content-Type: application/json"
```

## Testing Workflow

1. **Start the server**: `npm run dev`
2. **Create a Health Provider** (if not exists) - you'll need this ID
3. **Run the test script** or test endpoints manually
4. **Check the results** - all endpoints should return proper responses

## Expected Responses

### Success Response Format
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Operation successful",
  "result": { ... }
}
```

### Error Response Format
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Error message",
  "details": { ... }
}
```

## Notes

- For testing purposes, `patientId` can be passed as a query parameter or in the request body
- In production, authentication should be handled via session/passport
- All ObjectIds must be valid MongoDB ObjectIds
- Medical condition categories: `allergy`, `chronic_condition`, `medication`, `surgery`, `family_history`, `lifestyle`, `other`
- User goal categories: `medication`, `general`, `healthcheckup`

## Troubleshooting

1. **Connection refused**: Make sure the server is running
2. **404 errors**: Check the route paths and ensure they match
3. **401 errors**: Patient ID not found - ensure you're passing `patientId` in query/body
4. **400 errors**: Check request body format and required fields
5. **500 errors**: Check server logs and database connection

