# Provider Signup Test Data

This document contains dummy data for testing the provider signup endpoint.

## Endpoint
`POST /api/v1/auth/signup/provider`

## Required Fields
- `name` (string)
- `email` (string, must be unique)
- `password` (string, minimum 6 characters)

## Optional Fields
- `phone` (string)
- `address` (string)
- `city` (string)
- `state` (string)
- `pincode` (number)
- `country` (string)

## Test Data Examples

### Example 1: Complete Provider Data
```json
{
  "name": "Dr. Sarah Johnson",
  "email": "sarah.johnson@healthcare.com",
  "password": "SecurePass123!",
  "phone": "+1-555-0123",
  "address": "123 Medical Center Drive",
  "city": "New York",
  "state": "New York",
  "pincode": 10001,
  "country": "United States"
}
```

### Example 2: Another Complete Provider
```json
{
  "name": "Dr. Michael Chen",
  "email": "michael.chen@healthcare.com",
  "password": "HealthCare2024!",
  "phone": "+1-555-0124",
  "address": "456 Wellness Boulevard",
  "city": "Los Angeles",
  "state": "California",
  "pincode": 90001,
  "country": "United States"
}
```

### Example 3: Minimal Required Fields Only
```json
{
  "name": "Dr. Test Provider",
  "email": "test.provider@healthcare.com",
  "password": "Test123456!"
}
```

### Example 4: With Phone Number
```json
{
  "name": "Dr. Minimal Provider",
  "email": "minimal.provider@healthcare.com",
  "password": "Minimal123!",
  "phone": "+1-555-9999"
}
```

## Quick cURL Commands

### Test with complete data:
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup/provider \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Sarah Johnson",
    "email": "sarah.johnson@healthcare.com",
    "password": "SecurePass123!",
    "phone": "+1-555-0123",
    "address": "123 Medical Center Drive",
    "city": "New York",
    "state": "New York",
    "pincode": 10001,
    "country": "United States"
  }'
```

### Test with minimal data:
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup/provider \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Test Provider",
    "email": "test.provider@healthcare.com",
    "password": "Test123456!"
  }'
```

## Using the Test Script

Run the provided test script:
```bash
./test-provider-signup.sh
```

Or if you need to specify a different base URL:
```bash
BASE_URL="http://localhost:3000" ./test-provider-signup.sh
```

## Expected Response

### Success Response (201):
```json
{
  "statusCode": 201,
  "message": "Health provider registered successfully",
  "data": {
    "id": "...",
    "name": "Dr. Sarah Johnson",
    "email": "sarah.johnson@healthcare.com",
    "phone": "+1-555-0123",
    "userType": "provider"
  }
}
```

### Error Response (400):
```json
{
  "statusCode": 400,
  "message": "Health provider already exists with this email",
  "success": false
}
```

## Notes

- Each email must be unique. If you try to register with an existing email, you'll get an error.
- Password must be at least 6 characters long.
- All test data is stored in `provider-signup-test-data.json` for easy reference.

