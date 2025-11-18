# PowerShell Test Script for Patient Router API
# Tests GET, POST, PUT, DELETE operations

$BASE_URL = if ($env:BASE_URL) { $env:BASE_URL } else { "http://localhost:3000" }
$API_BASE = "$BASE_URL/api/v1/patient"

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

$PASSED = 0
$FAILED = 0
$results = @()

# Test helper function
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [object]$Body = $null
    )
    
    Write-ColorOutput Cyan "Testing: $Name"
    Write-Host "  $Method $Url"
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $headers
            UseBasicParsing = $true
            TimeoutSec = 10
        }
        
        if ($Body -and ($Method -eq "POST" -or $Method -eq "PUT")) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-WebRequest @params
        $statusCode = $response.StatusCode
        $responseBody = $response.Content | ConvertFrom-Json
        
        if ($statusCode -ge 200 -and $statusCode -lt 300) {
            Write-ColorOutput Green "  [PASS] ($statusCode)"
            if ($responseBody.result) {
                Write-Host "  Result: $(($responseBody.result | ConvertTo-Json -Compress))"
            }
            $script:PASSED++
            return @{ Success = $true; Data = $responseBody; StatusCode = $statusCode }
        } else {
            Write-ColorOutput Red "  [FAIL] ($statusCode)"
            Write-Host "  Error: $($responseBody | ConvertTo-Json -Compress)"
            $script:FAILED++
            return @{ Success = $false; Data = $responseBody; StatusCode = $statusCode }
        }
    } catch {
        Write-ColorOutput Red "  [FAIL]"
        Write-Host "  Error: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode.value__
            Write-Host "  Status: $statusCode"
        }
        $script:FAILED++
        return @{ Success = $false; Error = $_.Exception.Message }
    }
    Write-Host ""
}

Write-ColorOutput Blue "========================================"
Write-ColorOutput Blue "Patient Router API Tests"
Write-ColorOutput Blue "========================================"
Write-Host ""

# Check if server is running
Write-Host "Checking if server is running..."
try {
    $healthCheck = Invoke-WebRequest -Uri "$BASE_URL/api/v1/health/express" -Method GET -UseBasicParsing -TimeoutSec 2
    Write-ColorOutput Green "[OK] Server is running"
    Write-Host ""
} catch {
    Write-ColorOutput Red "[ERROR] Server is not running!"
    Write-Host "Please start the server first with: npm run dev"
    Write-Host ""
    exit 1
}

# Variables to store IDs
$HEALTH_PROVIDER_ID = "507f1f77bcf86cd799439011"  # Replace with actual health provider ID
$PATIENT_ID = $null
$MEDICAL_CONDITION_ID = $null
$USER_GOAL_ID = $null
$GOAL_TRACKING_ID = $null

Write-ColorOutput Yellow "Note: Using mock healthProviderId: $HEALTH_PROVIDER_ID"
Write-ColorOutput Yellow "Make sure this health provider exists in your database"
Write-Host ""

# ==================== PATIENT PROFILE TESTS ====================
Write-ColorOutput Blue "--- Patient Profile Tests ---"
Write-Host ""

# 1. Register Patient
$email = "test.patient.$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
$registerData = @{
    healthProviderId = $HEALTH_PROVIDER_ID
    fullname = "Test Patient"
    email = $email
    password = "test123456"
    phone = "1234567890"
    address = "123 Test Street"
    city = "Test City"
    state = "Test State"
    pincode = 12345
    country = "Test Country"
}

$result = Test-Endpoint "Register Patient" "POST" "$API_BASE/register" $registerData
if ($result.Success -and $result.Data.result._id) {
    $PATIENT_ID = $result.Data.result._id
    Write-Host "  Patient ID: $PATIENT_ID"
    Write-Host ""
}

# 2. Login Patient
if ($email) {
    $loginData = @{
        email = $email
        password = "test123456"
    }
    Test-Endpoint "Login Patient" "POST" "$API_BASE/login" $loginData
    Write-Host ""
}

# 3. Get Patient Profile
if ($PATIENT_ID) {
    Test-Endpoint "Get Patient Profile" "GET" "$API_BASE/profile?patientId=$PATIENT_ID"
    Write-Host ""
}

# 4. Update Patient Profile
if ($PATIENT_ID) {
    $updateData = @{
        fullname = "Updated Test Patient"
        city = "Updated City"
        patientId = $PATIENT_ID
    }
    Test-Endpoint "Update Patient Profile" "PUT" "$API_BASE/profile?patientId=$PATIENT_ID" $updateData
    Write-Host ""
}

# 5. Get Health Provider
if ($PATIENT_ID) {
    Test-Endpoint "Get Health Provider" "GET" "$API_BASE/health-provider?patientId=$PATIENT_ID"
    Write-Host ""
}

# ==================== MEDICAL CONDITIONS TESTS ====================
Write-ColorOutput Blue "--- Medical Conditions Tests ---"
Write-Host ""

# 6. Create Medical Condition
if ($PATIENT_ID) {
    $conditionData = @{
        category = "allergy"
        label = "Peanut Allergy"
        value = "Severe"
        patientId = $PATIENT_ID
    }
    $result = Test-Endpoint "Create Medical Condition" "POST" "$API_BASE/medical-conditions?patientId=$PATIENT_ID" $conditionData
    if ($result.Success -and $result.Data.result._id) {
        $MEDICAL_CONDITION_ID = $result.Data.result._id
        Write-Host "  Medical Condition ID: $MEDICAL_CONDITION_ID"
        Write-Host ""
    }
}

# 7. Get All Medical Conditions
if ($PATIENT_ID) {
    Test-Endpoint "Get All Medical Conditions" "GET" "$API_BASE/medical-conditions?patientId=$PATIENT_ID"
    Write-Host ""
}

# 8. Get Medical Condition by ID
if ($PATIENT_ID -and $MEDICAL_CONDITION_ID) {
    Test-Endpoint "Get Medical Condition by ID" "GET" "$API_BASE/medical-conditions/$MEDICAL_CONDITION_ID?patientId=$PATIENT_ID"
    Write-Host ""
}

# 9. Get Medical Conditions by Category
if ($PATIENT_ID) {
    Test-Endpoint "Get Medical Conditions by Category" "GET" "$API_BASE/medical-conditions/category/allergy?patientId=$PATIENT_ID"
    Write-Host ""
}

# 10. Update Medical Condition
if ($PATIENT_ID -and $MEDICAL_CONDITION_ID) {
    $updateConditionData = @{
        value = "Moderate"
        patientId = $PATIENT_ID
    }
    Test-Endpoint "Update Medical Condition" "PUT" "$API_BASE/medical-conditions/$MEDICAL_CONDITION_ID?patientId=$PATIENT_ID" $updateConditionData
    Write-Host ""
}

# ==================== USER GOALS TESTS ====================
Write-ColorOutput Blue "--- User Goals Tests ---"
Write-Host ""

# 11. Create User Goal
if ($PATIENT_ID -and $HEALTH_PROVIDER_ID) {
    $goalData = @{
        healthProviderId = $HEALTH_PROVIDER_ID
        category = "medication"
        value = @("Take medicine twice daily", "Drink plenty of water")
        patientId = $PATIENT_ID
    }
    $result = Test-Endpoint "Create User Goal" "POST" "$API_BASE/goals?patientId=$PATIENT_ID" $goalData
    if ($result.Success -and $result.Data.result._id) {
        $USER_GOAL_ID = $result.Data.result._id
        Write-Host "  User Goal ID: $USER_GOAL_ID"
        Write-Host ""
    }
}

# 12. Get All User Goals
if ($PATIENT_ID) {
    Test-Endpoint "Get All User Goals" "GET" "$API_BASE/goals?patientId=$PATIENT_ID"
    Write-Host ""
}

# 13. Get User Goal by ID
if ($PATIENT_ID -and $USER_GOAL_ID) {
    Test-Endpoint "Get User Goal by ID" "GET" "$API_BASE/goals/$USER_GOAL_ID?patientId=$PATIENT_ID"
    Write-Host ""
}

# 14. Get User Goals by Category
if ($PATIENT_ID) {
    Test-Endpoint "Get User Goals by Category" "GET" "$API_BASE/goals/category/medication?patientId=$PATIENT_ID"
    Write-Host ""
}

# 15. Update User Goal
if ($PATIENT_ID -and $USER_GOAL_ID) {
    $updateGoalData = @{
        value = @("Take medicine three times daily", "Drink plenty of water", "Exercise daily")
        patientId = $PATIENT_ID
    }
    Test-Endpoint "Update User Goal" "PUT" "$API_BASE/goals/$USER_GOAL_ID?patientId=$PATIENT_ID" $updateGoalData
    Write-Host ""
}

# ==================== GOAL TRACKING TESTS ====================
Write-ColorOutput Blue "--- Goal Tracking Tests ---"
Write-Host ""

# 16. Create Goal Tracking
if ($PATIENT_ID -and $HEALTH_PROVIDER_ID -and $USER_GOAL_ID) {
    $trackingData = @{
        healthProviderId = $HEALTH_PROVIDER_ID
        target = "Complete medication schedule for 30 days"
        goalID = $USER_GOAL_ID
        completed = $false
        patientId = $PATIENT_ID
    }
    $result = Test-Endpoint "Create Goal Tracking" "POST" "$API_BASE/goal-tracking?patientId=$PATIENT_ID" $trackingData
    if ($result.Success -and $result.Data.result._id) {
        $GOAL_TRACKING_ID = $result.Data.result._id
        Write-Host "  Goal Tracking ID: $GOAL_TRACKING_ID"
        Write-Host ""
    }
}

# 17. Get All Goal Tracking
if ($PATIENT_ID) {
    Test-Endpoint "Get All Goal Tracking" "GET" "$API_BASE/goal-tracking?patientId=$PATIENT_ID"
    Write-Host ""
}

# 18. Get Goal Tracking by Goal ID
if ($PATIENT_ID -and $USER_GOAL_ID) {
    Test-Endpoint "Get Goal Tracking by Goal ID" "GET" "$API_BASE/goal-tracking/goal/$USER_GOAL_ID?patientId=$PATIENT_ID"
    Write-Host ""
}

# 19. Get Completed Goals
if ($PATIENT_ID) {
    Test-Endpoint "Get Completed Goals" "GET" "$API_BASE/goal-tracking/completed?patientId=$PATIENT_ID"
    Write-Host ""
}

# 20. Get Pending Goals
if ($PATIENT_ID) {
    Test-Endpoint "Get Pending Goals" "GET" "$API_BASE/goal-tracking/pending?patientId=$PATIENT_ID"
    Write-Host ""
}

# 21. Update Goal Tracking
if ($PATIENT_ID -and $GOAL_TRACKING_ID) {
    $updateTrackingData = @{
        completed = $true
        patientId = $PATIENT_ID
    }
    Test-Endpoint "Update Goal Tracking" "PUT" "$API_BASE/goal-tracking/$GOAL_TRACKING_ID?patientId=$PATIENT_ID" $updateTrackingData
    Write-Host ""
}

# ==================== DELETE TESTS ====================
Write-ColorOutput Blue "--- Delete Tests ---"
Write-Host ""

# 22. Delete Goal Tracking
if ($PATIENT_ID -and $GOAL_TRACKING_ID) {
    Test-Endpoint "Delete Goal Tracking" "DELETE" "$API_BASE/goal-tracking/$GOAL_TRACKING_ID?patientId=$PATIENT_ID"
    Write-Host ""
}

# 23. Delete User Goal
if ($PATIENT_ID -and $USER_GOAL_ID) {
    Test-Endpoint "Delete User Goal" "DELETE" "$API_BASE/goals/$USER_GOAL_ID?patientId=$PATIENT_ID"
    Write-Host ""
}

# 24. Delete Medical Condition
if ($PATIENT_ID -and $MEDICAL_CONDITION_ID) {
    Test-Endpoint "Delete Medical Condition" "DELETE" "$API_BASE/medical-conditions/$MEDICAL_CONDITION_ID?patientId=$PATIENT_ID"
    Write-Host ""
}

# ==================== SUMMARY ====================
Write-ColorOutput Blue "========================================"
Write-ColorOutput Blue "Test Summary"
Write-ColorOutput Blue "========================================"
Write-Host ""

$TOTAL = $PASSED + $FAILED
Write-Host "Total Tests: $TOTAL"
Write-ColorOutput Green "Passed: $PASSED"
Write-ColorOutput Red "Failed: $FAILED"
Write-Host ""

if ($FAILED -eq 0) {
    Write-ColorOutput Green "All tests passed!"
    exit 0
} else {
    Write-ColorOutput Red "Some tests failed."
    exit 1
}

