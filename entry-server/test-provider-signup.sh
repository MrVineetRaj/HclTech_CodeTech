#!/bin/bash

# Test script for provider signup endpoint
# Make sure your server is running before executing these commands

BASE_URL="${BASE_URL:-http://localhost:3000}"  # Adjust if your server runs on a different port
TEST_DATA_DIR="./test-data"

echo "Testing Provider Signup Endpoint"
echo "================================="
echo ""

# Test 1: Complete provider data (using JSON file)
echo "Test 1: Complete provider signup (Provider 1)"
curl -X POST "${BASE_URL}/api/v1/auth/signup/provider" \
  -H "Content-Type: application/json" \
  -d @${TEST_DATA_DIR}/provider1.json
echo -e "\n\n"

# Test 2: Minimal required fields only
echo "Test 2: Minimal required fields"
curl -X POST "${BASE_URL}/api/v1/auth/signup/provider" \
  -H "Content-Type: application/json" \
  -d @${TEST_DATA_DIR}/provider-minimal.json
echo -e "\n\n"

# Test 3: Another complete provider
echo "Test 3: Another complete provider (Provider 2)"
curl -X POST "${BASE_URL}/api/v1/auth/signup/provider" \
  -H "Content-Type: application/json" \
  -d @${TEST_DATA_DIR}/provider2.json
echo -e "\n\n"

# Test 4: Missing required field (should fail)
echo "Test 4: Missing required field (should return error)"
curl -X POST "${BASE_URL}/api/v1/auth/signup/provider" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Incomplete",
    "email": "incomplete@healthcare.com"
  }'
echo -e "\n\n"

# Test 5: Duplicate email (should fail if provider1 was created)
echo "Test 5: Duplicate email (should return error if already exists)"
curl -X POST "${BASE_URL}/api/v1/auth/signup/provider" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Duplicate",
    "email": "sarah.johnson@healthcare.com",
    "password": "AnotherPass123!"
  }'
echo -e "\n"

