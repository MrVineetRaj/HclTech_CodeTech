/**
 * Test script for Patient Router endpoints
 * Tests GET, POST, PUT, DELETE operations
 * 
 * Usage: npx ts-node test-patient-routes.ts
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE = `${BASE_URL}/api/v1/patient`;

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

interface TestResult {
  name: string;
  method: string;
  url: string;
  status: "PASS" | "FAIL";
  statusCode?: number;
  error?: string;
  data?: any;
}

const results: TestResult[] = [];

// Helper function to make HTTP requests
async function makeRequest(
  method: string,
  url: string,
  body?: any,
  headers?: Record<string, string>
): Promise<{ status: number; data: any }> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();
  return { status: response.status, data };
}

// Test helper
async function test(
  name: string,
  method: string,
  url: string,
  body?: any,
  headers?: Record<string, string>
): Promise<TestResult> {
  try {
    console.log(`${colors.cyan}Testing: ${name}${colors.reset}`);
    console.log(`  ${method} ${url}`);
    
    const { status, data } = await makeRequest(method, url, body, headers);
    
    const result: TestResult = {
      name,
      method,
      url,
      status: status >= 200 && status < 300 ? "PASS" : "FAIL",
      statusCode: status,
      data,
    };

    if (result.status === "PASS") {
      console.log(`${colors.green}  ✓ PASS${colors.reset} (${status})`);
    } else {
      console.log(`${colors.red}  ✗ FAIL${colors.reset} (${status})`);
      console.log(`  Error: ${JSON.stringify(data, null, 2)}`);
    }
    
    return result;
  } catch (error: any) {
    const result: TestResult = {
      name,
      method,
      url,
      status: "FAIL",
      error: error.message,
    };
    console.log(`${colors.red}  ✗ FAIL${colors.reset}`);
    console.log(`  Error: ${error.message}`);
    return result;
  }
}

// Store IDs for cleanup and chained tests
let patientId: string | null = null;
let healthProviderId: string | null = null;
let medicalConditionId: string | null = null;
let userGoalId: string | null = null;
let goalTrackingId: string | null = null;

async function runTests() {
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}Patient Router API Tests${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}\n`);

  // First, we need a health provider for patient registration
  // For testing, we'll use a mock ID or create one via a separate endpoint
  // For now, let's assume we have a health provider ID
  healthProviderId = "507f1f77bcf86cd799439011"; // Mock ObjectId - replace with actual

  console.log(`${colors.yellow}Note: Using mock healthProviderId: ${healthProviderId}${colors.reset}`);
  console.log(`${colors.yellow}Make sure this health provider exists in your database${colors.reset}\n`);

  // ==================== PATIENT PROFILE TESTS ====================
  console.log(`${colors.blue}--- Patient Profile Tests ---${colors.reset}\n`);

  // 1. Register Patient (POST)
  const registerResult = await test(
    "Register Patient",
    "POST",
    `${API_BASE}/register`,
    {
      healthProviderId,
      fullname: "Test Patient",
      email: `test.patient.${Date.now()}@example.com`,
      password: "test123456",
      phone: "1234567890",
      address: "123 Test Street",
      city: "Test City",
      state: "Test State",
      pincode: 12345,
      country: "Test Country",
    }
  );
  results.push(registerResult);
  
  if (registerResult.status === "PASS" && registerResult.data?.result?._id) {
    patientId = registerResult.data.result._id;
    console.log(`  Patient ID: ${patientId}\n`);
  }

  // 2. Login Patient (POST)
  if (registerResult.data?.result?.email) {
    const loginResult = await test(
      "Login Patient",
      "POST",
      `${API_BASE}/login`,
      {
        email: registerResult.data.result.email,
        password: "test123456",
      }
    );
    results.push(loginResult);
    console.log();
  }

  // 3. Get Patient Profile (GET) - requires patientId in query/body for testing
  if (patientId) {
    const getProfileResult = await test(
      "Get Patient Profile",
      "GET",
      `${API_BASE}/profile?patientId=${patientId}`
    );
    results.push(getProfileResult);
    console.log();
  }

  // 4. Update Patient Profile (PUT)
  if (patientId) {
    const updateProfileResult = await test(
      "Update Patient Profile",
      "PUT",
      `${API_BASE}/profile?patientId=${patientId}`,
      {
        fullname: "Updated Test Patient",
        city: "Updated City",
        patientId, // Include in body for testing
      }
    );
    results.push(updateProfileResult);
    console.log();
  }

  // 5. Get Health Provider (GET)
  if (patientId) {
    const getHealthProviderResult = await test(
      "Get Health Provider",
      "GET",
      `${API_BASE}/health-provider?patientId=${patientId}`
    );
    results.push(getHealthProviderResult);
    console.log();
  }

  // ==================== MEDICAL CONDITIONS TESTS ====================
  console.log(`${colors.blue}--- Medical Conditions Tests ---${colors.reset}\n`);

  // 6. Create Medical Condition (POST)
  if (patientId) {
    const createConditionResult = await test(
      "Create Medical Condition",
      "POST",
      `${API_BASE}/medical-conditions?patientId=${patientId}`,
      {
        category: "allergy",
        label: "Peanut Allergy",
        value: "Severe",
        patientId,
      }
    );
    results.push(createConditionResult);
    
    if (createConditionResult.status === "PASS" && createConditionResult.data?.result?._id) {
      medicalConditionId = createConditionResult.data.result._id;
      console.log(`  Medical Condition ID: ${medicalConditionId}\n`);
    }
  }

  // 7. Get All Medical Conditions (GET)
  if (patientId) {
    const getConditionsResult = await test(
      "Get All Medical Conditions",
      "GET",
      `${API_BASE}/medical-conditions?patientId=${patientId}`
    );
    results.push(getConditionsResult);
    console.log();
  }

  // 8. Get Medical Condition by ID (GET)
  if (patientId && medicalConditionId) {
    const getConditionByIdResult = await test(
      "Get Medical Condition by ID",
      "GET",
      `${API_BASE}/medical-conditions/${medicalConditionId}?patientId=${patientId}`
    );
    results.push(getConditionByIdResult);
    console.log();
  }

  // 9. Get Medical Conditions by Category (GET)
  if (patientId) {
    const getByCategoryResult = await test(
      "Get Medical Conditions by Category",
      "GET",
      `${API_BASE}/medical-conditions/category/allergy?patientId=${patientId}`
    );
    results.push(getByCategoryResult);
    console.log();
  }

  // 10. Update Medical Condition (PUT)
  if (patientId && medicalConditionId) {
    const updateConditionResult = await test(
      "Update Medical Condition",
      "PUT",
      `${API_BASE}/medical-conditions/${medicalConditionId}?patientId=${patientId}`,
      {
        value: "Moderate",
        patientId,
      }
    );
    results.push(updateConditionResult);
    console.log();
  }

  // ==================== USER GOALS TESTS ====================
  console.log(`${colors.blue}--- User Goals Tests ---${colors.reset}\n`);

  // 11. Create User Goal (POST)
  if (patientId && healthProviderId) {
    const createGoalResult = await test(
      "Create User Goal",
      "POST",
      `${API_BASE}/goals?patientId=${patientId}`,
      {
        healthProviderId,
        category: "medication",
        value: ["Take medicine twice daily", "Drink plenty of water"],
        patientId,
      }
    );
    results.push(createGoalResult);
    
    if (createGoalResult.status === "PASS" && createGoalResult.data?.result?._id) {
      userGoalId = createGoalResult.data.result._id;
      console.log(`  User Goal ID: ${userGoalId}\n`);
    }
  }

  // 12. Get All User Goals (GET)
  if (patientId) {
    const getGoalsResult = await test(
      "Get All User Goals",
      "GET",
      `${API_BASE}/goals?patientId=${patientId}`
    );
    results.push(getGoalsResult);
    console.log();
  }

  // 13. Get User Goal by ID (GET)
  if (patientId && userGoalId) {
    const getGoalByIdResult = await test(
      "Get User Goal by ID",
      "GET",
      `${API_BASE}/goals/${userGoalId}?patientId=${patientId}`
    );
    results.push(getGoalByIdResult);
    console.log();
  }

  // 14. Get User Goals by Category (GET)
  if (patientId) {
    const getGoalsByCategoryResult = await test(
      "Get User Goals by Category",
      "GET",
      `${API_BASE}/goals/category/medication?patientId=${patientId}`
    );
    results.push(getGoalsByCategoryResult);
    console.log();
  }

  // 15. Update User Goal (PUT)
  if (patientId && userGoalId) {
    const updateGoalResult = await test(
      "Update User Goal",
      "PUT",
      `${API_BASE}/goals/${userGoalId}?patientId=${patientId}`,
      {
        value: ["Take medicine three times daily", "Drink plenty of water", "Exercise daily"],
        patientId,
      }
    );
    results.push(updateGoalResult);
    console.log();
  }

  // ==================== GOAL TRACKING TESTS ====================
  console.log(`${colors.blue}--- Goal Tracking Tests ---${colors.reset}\n`);

  // 16. Create Goal Tracking (POST)
  if (patientId && healthProviderId && userGoalId) {
    const createTrackingResult = await test(
      "Create Goal Tracking",
      "POST",
      `${API_BASE}/goal-tracking?patientId=${patientId}`,
      {
        healthProviderId,
        target: "Complete medication schedule for 30 days",
        goalID: userGoalId,
        completed: false,
        patientId,
      }
    );
    results.push(createTrackingResult);
    
    if (createTrackingResult.status === "PASS" && createTrackingResult.data?.result?._id) {
      goalTrackingId = createTrackingResult.data.result._id;
      console.log(`  Goal Tracking ID: ${goalTrackingId}\n`);
    }
  }

  // 17. Get All Goal Tracking (GET)
  if (patientId) {
    const getTrackingResult = await test(
      "Get All Goal Tracking",
      "GET",
      `${API_BASE}/goal-tracking?patientId=${patientId}`
    );
    results.push(getTrackingResult);
    console.log();
  }

  // 18. Get Goal Tracking by Goal ID (GET)
  if (patientId && userGoalId) {
    const getTrackingByGoalIdResult = await test(
      "Get Goal Tracking by Goal ID",
      "GET",
      `${API_BASE}/goal-tracking/goal/${userGoalId}?patientId=${patientId}`
    );
    results.push(getTrackingByGoalIdResult);
    console.log();
  }

  // 19. Get Completed Goals (GET)
  if (patientId) {
    const getCompletedResult = await test(
      "Get Completed Goals",
      "GET",
      `${API_BASE}/goal-tracking/completed?patientId=${patientId}`
    );
    results.push(getCompletedResult);
    console.log();
  }

  // 20. Get Pending Goals (GET)
  if (patientId) {
    const getPendingResult = await test(
      "Get Pending Goals",
      "GET",
      `${API_BASE}/goal-tracking/pending?patientId=${patientId}`
    );
    results.push(getPendingResult);
    console.log();
  }

  // 21. Update Goal Tracking (PUT)
  if (patientId && goalTrackingId) {
    const updateTrackingResult = await test(
      "Update Goal Tracking",
      "PUT",
      `${API_BASE}/goal-tracking/${goalTrackingId}?patientId=${patientId}`,
      {
        completed: true,
        patientId,
      }
    );
    results.push(updateTrackingResult);
    console.log();
  }

  // ==================== DELETE TESTS ====================
  console.log(`${colors.blue}--- Delete Tests ---${colors.reset}\n`);

  // 22. Delete Goal Tracking (DELETE)
  if (patientId && goalTrackingId) {
    const deleteTrackingResult = await test(
      "Delete Goal Tracking",
      "DELETE",
      `${API_BASE}/goal-tracking/${goalTrackingId}?patientId=${patientId}`
    );
    results.push(deleteTrackingResult);
    console.log();
  }

  // 23. Delete User Goal (DELETE)
  if (patientId && userGoalId) {
    const deleteGoalResult = await test(
      "Delete User Goal",
      "DELETE",
      `${API_BASE}/goals/${userGoalId}?patientId=${patientId}`
    );
    results.push(deleteGoalResult);
    console.log();
  }

  // 24. Delete Medical Condition (DELETE)
  if (patientId && medicalConditionId) {
    const deleteConditionResult = await test(
      "Delete Medical Condition",
      "DELETE",
      `${API_BASE}/medical-conditions/${medicalConditionId}?patientId=${patientId}`
    );
    results.push(deleteConditionResult);
    console.log();
  }

  // ==================== SUMMARY ====================
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}Test Summary${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}\n`);

  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const total = results.length;

  console.log(`Total Tests: ${total}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}\n`);

  if (failed > 0) {
    console.log(`${colors.red}Failed Tests:${colors.reset}`);
    results
      .filter((r) => r.status === "FAIL")
      .forEach((r) => {
        console.log(`  ${colors.red}✗${colors.reset} ${r.name} (${r.method} ${r.url})`);
        if (r.error) {
          console.log(`    Error: ${r.error}`);
        }
        if (r.statusCode) {
          console.log(`    Status: ${r.statusCode}`);
        }
      });
  }

  console.log(`\n${colors.blue}========================================${colors.reset}`);
}

// Run tests
runTests().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});

