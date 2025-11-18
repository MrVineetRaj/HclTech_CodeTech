#!/bin/bash

# Test script for Patient Router endpoints using curl
# Make sure the server is running before executing this script

BASE_URL="${BASE_URL:-http://localhost:3000}"
API_BASE="${BASE_URL}/api/v1/patient"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Patient Router API Tests (curl)${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Variables to store IDs
HEALTH_PROVIDER_ID="507f1f77bcf86cd799439011"  # Replace with actual health provider ID
PATIENT_ID=""
MEDICAL_CONDITION_ID=""
USER_GOAL_ID=""
GOAL_TRACKING_ID=""

# Test counter
PASSED=0
FAILED=0

# Test helper function
test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    
    echo -e "${CYAN}Testing: ${name}${NC}"
    echo -e "  ${method} ${url}"
    
    if [ "$method" = "GET" ] || [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" -H "Content-Type: application/json")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}  ✓ PASS${NC} (${http_code})"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}  ✗ FAIL${NC} (${http_code})"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
        ((FAILED++))
        return 1
    fi
    echo ""
}

# ==================== PATIENT PROFILE TESTS ====================
echo -e "${BLUE}--- Patient Profile Tests ---${NC}\n"

# 1. Register Patient
EMAIL="test.patient.$(date +%s)@example.com"
REGISTER_DATA=$(cat <<EOF
{
  "healthProviderId": "$HEALTH_PROVIDER_ID",
  "fullname": "Test Patient",
  "email": "$EMAIL",
  "password": "test123456",
  "phone": "1234567890",
  "address": "123 Test Street",
  "city": "Test City",
  "state": "Test State",
  "pincode": 12345,
  "country": "Test Country"
}
EOF
)

if test_endpoint "Register Patient" "POST" "${API_BASE}/register" "$REGISTER_DATA"; then
    PATIENT_ID=$(echo "$body" | jq -r '.result._id // empty' 2>/dev/null)
    if [ -n "$PATIENT_ID" ]; then
        echo -e "  Patient ID: ${YELLOW}${PATIENT_ID}${NC}\n"
    fi
fi

# 2. Login Patient
LOGIN_DATA=$(cat <<EOF
{
  "email": "$EMAIL",
  "password": "test123456"
}
EOF
)
test_endpoint "Login Patient" "POST" "${API_BASE}/login" "$LOGIN_DATA"
echo ""

# 3. Get Patient Profile
if [ -n "$PATIENT_ID" ]; then
    test_endpoint "Get Patient Profile" "GET" "${API_BASE}/profile?patientId=${PATIENT_ID}"
    echo ""
fi

# 4. Update Patient Profile
if [ -n "$PATIENT_ID" ]; then
    UPDATE_DATA=$(cat <<EOF
{
  "fullname": "Updated Test Patient",
  "city": "Updated City",
  "patientId": "$PATIENT_ID"
}
EOF
)
    test_endpoint "Update Patient Profile" "PUT" "${API_BASE}/profile?patientId=${PATIENT_ID}" "$UPDATE_DATA"
    echo ""
fi

# 5. Get Health Provider
if [ -n "$PATIENT_ID" ]; then
    test_endpoint "Get Health Provider" "GET" "${API_BASE}/health-provider?patientId=${PATIENT_ID}"
    echo ""
fi

# ==================== MEDICAL CONDITIONS TESTS ====================
echo -e "${BLUE}--- Medical Conditions Tests ---${NC}\n"

# 6. Create Medical Condition
if [ -n "$PATIENT_ID" ]; then
    CONDITION_DATA=$(cat <<EOF
{
  "category": "allergy",
  "label": "Peanut Allergy",
  "value": "Severe",
  "patientId": "$PATIENT_ID"
}
EOF
)
    if test_endpoint "Create Medical Condition" "POST" "${API_BASE}/medical-conditions?patientId=${PATIENT_ID}" "$CONDITION_DATA"; then
        MEDICAL_CONDITION_ID=$(echo "$body" | jq -r '.result._id // empty' 2>/dev/null)
        if [ -n "$MEDICAL_CONDITION_ID" ]; then
            echo -e "  Medical Condition ID: ${YELLOW}${MEDICAL_CONDITION_ID}${NC}\n"
        fi
    fi
fi

# 7. Get All Medical Conditions
if [ -n "$PATIENT_ID" ]; then
    test_endpoint "Get All Medical Conditions" "GET" "${API_BASE}/medical-conditions?patientId=${PATIENT_ID}"
    echo ""
fi

# 8. Get Medical Condition by ID
if [ -n "$PATIENT_ID" ] && [ -n "$MEDICAL_CONDITION_ID" ]; then
    test_endpoint "Get Medical Condition by ID" "GET" "${API_BASE}/medical-conditions/${MEDICAL_CONDITION_ID}?patientId=${PATIENT_ID}"
    echo ""
fi

# 9. Get Medical Conditions by Category
if [ -n "$PATIENT_ID" ]; then
    test_endpoint "Get Medical Conditions by Category" "GET" "${API_BASE}/medical-conditions/category/allergy?patientId=${PATIENT_ID}"
    echo ""
fi

# 10. Update Medical Condition
if [ -n "$PATIENT_ID" ] && [ -n "$MEDICAL_CONDITION_ID" ]; then
    UPDATE_CONDITION_DATA=$(cat <<EOF
{
  "value": "Moderate",
  "patientId": "$PATIENT_ID"
}
EOF
)
    test_endpoint "Update Medical Condition" "PUT" "${API_BASE}/medical-conditions/${MEDICAL_CONDITION_ID}?patientId=${PATIENT_ID}" "$UPDATE_CONDITION_DATA"
    echo ""
fi

# ==================== USER GOALS TESTS ====================
echo -e "${BLUE}--- User Goals Tests ---${NC}\n"

# 11. Create User Goal
if [ -n "$PATIENT_ID" ] && [ -n "$HEALTH_PROVIDER_ID" ]; then
    GOAL_DATA=$(cat <<EOF
{
  "healthProviderId": "$HEALTH_PROVIDER_ID",
  "category": "medication",
  "value": ["Take medicine twice daily", "Drink plenty of water"],
  "patientId": "$PATIENT_ID"
}
EOF
)
    if test_endpoint "Create User Goal" "POST" "${API_BASE}/goals?patientId=${PATIENT_ID}" "$GOAL_DATA"; then
        USER_GOAL_ID=$(echo "$body" | jq -r '.result._id // empty' 2>/dev/null)
        if [ -n "$USER_GOAL_ID" ]; then
            echo -e "  User Goal ID: ${YELLOW}${USER_GOAL_ID}${NC}\n"
        fi
    fi
fi

# 12. Get All User Goals
if [ -n "$PATIENT_ID" ]; then
    test_endpoint "Get All User Goals" "GET" "${API_BASE}/goals?patientId=${PATIENT_ID}"
    echo ""
fi

# 13. Get User Goal by ID
if [ -n "$PATIENT_ID" ] && [ -n "$USER_GOAL_ID" ]; then
    test_endpoint "Get User Goal by ID" "GET" "${API_BASE}/goals/${USER_GOAL_ID}?patientId=${PATIENT_ID}"
    echo ""
fi

# 14. Get User Goals by Category
if [ -n "$PATIENT_ID" ]; then
    test_endpoint "Get User Goals by Category" "GET" "${API_BASE}/goals/category/medication?patientId=${PATIENT_ID}"
    echo ""
fi

# 15. Update User Goal
if [ -n "$PATIENT_ID" ] && [ -n "$USER_GOAL_ID" ]; then
    UPDATE_GOAL_DATA=$(cat <<EOF
{
  "value": ["Take medicine three times daily", "Drink plenty of water", "Exercise daily"],
  "patientId": "$PATIENT_ID"
}
EOF
)
    test_endpoint "Update User Goal" "PUT" "${API_BASE}/goals/${USER_GOAL_ID}?patientId=${PATIENT_ID}" "$UPDATE_GOAL_DATA"
    echo ""
fi

# ==================== GOAL TRACKING TESTS ====================
echo -e "${BLUE}--- Goal Tracking Tests ---${NC}\n"

# 16. Create Goal Tracking
if [ -n "$PATIENT_ID" ] && [ -n "$HEALTH_PROVIDER_ID" ] && [ -n "$USER_GOAL_ID" ]; then
    TRACKING_DATA=$(cat <<EOF
{
  "healthProviderId": "$HEALTH_PROVIDER_ID",
  "target": "Complete medication schedule for 30 days",
  "goalID": "$USER_GOAL_ID",
  "completed": false,
  "patientId": "$PATIENT_ID"
}
EOF
)
    if test_endpoint "Create Goal Tracking" "POST" "${API_BASE}/goal-tracking?patientId=${PATIENT_ID}" "$TRACKING_DATA"; then
        GOAL_TRACKING_ID=$(echo "$body" | jq -r '.result._id // empty' 2>/dev/null)
        if [ -n "$GOAL_TRACKING_ID" ]; then
            echo -e "  Goal Tracking ID: ${YELLOW}${GOAL_TRACKING_ID}${NC}\n"
        fi
    fi
fi

# 17. Get All Goal Tracking
if [ -n "$PATIENT_ID" ]; then
    test_endpoint "Get All Goal Tracking" "GET" "${API_BASE}/goal-tracking?patientId=${PATIENT_ID}"
    echo ""
fi

# 18. Get Goal Tracking by Goal ID
if [ -n "$PATIENT_ID" ] && [ -n "$USER_GOAL_ID" ]; then
    test_endpoint "Get Goal Tracking by Goal ID" "GET" "${API_BASE}/goal-tracking/goal/${USER_GOAL_ID}?patientId=${PATIENT_ID}"
    echo ""
fi

# 19. Get Completed Goals
if [ -n "$PATIENT_ID" ]; then
    test_endpoint "Get Completed Goals" "GET" "${API_BASE}/goal-tracking/completed?patientId=${PATIENT_ID}"
    echo ""
fi

# 20. Get Pending Goals
if [ -n "$PATIENT_ID" ]; then
    test_endpoint "Get Pending Goals" "GET" "${API_BASE}/goal-tracking/pending?patientId=${PATIENT_ID}"
    echo ""
fi

# 21. Update Goal Tracking
if [ -n "$PATIENT_ID" ] && [ -n "$GOAL_TRACKING_ID" ]; then
    UPDATE_TRACKING_DATA=$(cat <<EOF
{
  "completed": true,
  "patientId": "$PATIENT_ID"
}
EOF
)
    test_endpoint "Update Goal Tracking" "PUT" "${API_BASE}/goal-tracking/${GOAL_TRACKING_ID}?patientId=${PATIENT_ID}" "$UPDATE_TRACKING_DATA"
    echo ""
fi

# ==================== DELETE TESTS ====================
echo -e "${BLUE}--- Delete Tests ---${NC}\n"

# 22. Delete Goal Tracking
if [ -n "$PATIENT_ID" ] && [ -n "$GOAL_TRACKING_ID" ]; then
    test_endpoint "Delete Goal Tracking" "DELETE" "${API_BASE}/goal-tracking/${GOAL_TRACKING_ID}?patientId=${PATIENT_ID}"
    echo ""
fi

# 23. Delete User Goal
if [ -n "$PATIENT_ID" ] && [ -n "$USER_GOAL_ID" ]; then
    test_endpoint "Delete User Goal" "DELETE" "${API_BASE}/goals/${USER_GOAL_ID}?patientId=${PATIENT_ID}"
    echo ""
fi

# 24. Delete Medical Condition
if [ -n "$PATIENT_ID" ] && [ -n "$MEDICAL_CONDITION_ID" ]; then
    test_endpoint "Delete Medical Condition" "DELETE" "${API_BASE}/medical-conditions/${MEDICAL_CONDITION_ID}?patientId=${PATIENT_ID}"
    echo ""
fi

# ==================== SUMMARY ====================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}========================================${NC}\n"

TOTAL=$((PASSED + FAILED))
echo -e "Total Tests: ${TOTAL}"
echo -e "${GREEN}Passed: ${PASSED}${NC}"
echo -e "${RED}Failed: ${FAILED}${NC}\n"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. ✗${NC}"
    exit 1
fi

