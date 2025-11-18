# Quick Test Examples for Provider Signup

## The Problem
The original JSON file had nested objects. The API expects a flat provider object, not a wrapper.

## Solution
Use the individual JSON files in the `test-data/` folder, or use the examples below.

## Quick cURL Examples

### Example 1: Using a JSON file
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup/provider \
  -H "Content-Type: application/json" \
  -d @test-data/provider1.json
```

### Example 2: Inline JSON (copy-paste ready)
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup/provider \
  -H "Content-Type: application/json" \
  -d '{"name":"Dr. Sarah Johnson","email":"sarah.johnson@healthcare.com","password":"SecurePass123!","phone":"+1-555-0123","address":"123 Medical Center Drive","city":"New York","state":"New York","pincode":10001,"country":"United States"}'
```

### Example 3: Minimal required fields
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup/provider \
  -H "Content-Type: application/json" \
  -d '{"name":"Dr. Test Provider","email":"test.provider@healthcare.com","password":"Test123456!"}'
```

## Individual Test Files
- `test-data/provider1.json` - Complete provider data
- `test-data/provider2.json` - Another complete provider
- `test-data/provider3.json` - Third complete provider
- `test-data/provider-minimal.json` - Minimal required fields only

## Using Postman/Insomnia
1. Set method to `POST`
2. URL: `http://localhost:3000/api/v1/auth/signup/provider`
3. Headers: `Content-Type: application/json`
4. Body: Copy the content from any file in `test-data/` folder

