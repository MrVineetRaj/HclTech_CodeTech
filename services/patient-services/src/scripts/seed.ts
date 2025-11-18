import { database } from "../app/lib/db";
import {
  HealthProvider,
  Patient,
  PatientMedicalConditions,
  UserGoals,
  GoalTracking,
} from "../app/models";

/**
 * Seed script to populate MongoDB with dummy data
 * Run with: npm run seed
 */
async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await database.connect();

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await HealthProvider.deleteMany({});
    await Patient.deleteMany({});
    await PatientMedicalConditions.deleteMany({});
    await UserGoals.deleteMany({});
    await GoalTracking.deleteMany({});

    // Create Health Providers
    console.log("👨‍⚕️ Creating Health Providers...");
    const provider1 = await HealthProvider.create({
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@hospital.com",
      password: "hashed_password_123", // In real app, hash this
      phone: "+1234567890",
      address: "123 Medical Center Drive",
      city: "New York",
      state: "NY",
      pincode: 10001,
      country: "USA",
    });

    const provider2 = await HealthProvider.create({
      name: "Dr. Michael Chen",
      email: "michael.chen@hospital.com",
      password: "hashed_password_456",
      phone: "+1234567891",
      address: "456 Healthcare Plaza",
      city: "Los Angeles",
      state: "CA",
      pincode: 90001,
      country: "USA",
    });

    console.log(`✅ Created ${2} health providers`);

    // Create Patients
    console.log("👤 Creating Patients...");
    const patient1 = await Patient.create({
      healthProviderId: provider1._id,
      fullname: "John Doe",
      email: "john.doe@email.com",
      password: "hashed_password_789",
      phone: "+1987654321",
      address: "789 Patient Street",
      city: "New York",
      state: "NY",
      pincode: 10002,
      country: "USA",
    });

    const patient2 = await Patient.create({
      healthProviderId: provider1._id,
      fullname: "Jane Smith",
      email: "jane.smith@email.com",
      password: "hashed_password_101",
      phone: "+1987654322",
      address: "321 Wellness Ave",
      city: "Brooklyn",
      state: "NY",
      pincode: 11201,
      country: "USA",
    });

    const patient3 = await Patient.create({
      healthProviderId: provider2._id,
      fullname: "Robert Williams",
      email: "robert.williams@email.com",
      password: "hashed_password_202",
      phone: "+1987654323",
      address: "555 Health Blvd",
      city: "Los Angeles",
      state: "CA",
      pincode: 90002,
      country: "USA",
    });

    const patient4 = await Patient.create({
      healthProviderId: provider2._id,
      fullname: "Emily Davis",
      email: "emily.davis@email.com",
      password: "hashed_password_303",
      phone: "+1987654324",
      address: "777 Care Lane",
      city: "San Diego",
      state: "CA",
      pincode: 92101,
      country: "USA",
    });

    console.log(`✅ Created ${4} patients`);

    // Create Medical Conditions
    console.log("🏥 Creating Medical Conditions...");
    await PatientMedicalConditions.create([
      {
        category: "chronic_condition",
        patientId: patient1._id,
        label: "Type 2 Diabetes",
        value: "Diagnosed 5 years ago, well controlled with medication",
      },
      {
        category: "allergy",
        patientId: patient1._id,
        label: "Penicillin Allergy",
        value: "Severe reaction - use alternative antibiotics",
      },
      {
        category: "medication",
        patientId: patient2._id,
        label: "Hypertension Medication",
        value: "Lisinopril 10mg daily",
      },
      {
        category: "chronic_condition",
        patientId: patient3._id,
        label: "Asthma",
        value: "Mild intermittent asthma, uses rescue inhaler as needed",
      },
      {
        category: "allergy",
        patientId: patient4._id,
        label: "Peanut Allergy",
        value: "Anaphylactic reaction - carries EpiPen",
      },
    ]);

    console.log(`✅ Created medical conditions`);

    // Create User Goals
    console.log("🎯 Creating User Goals...");
    const goal1 = await UserGoals.create({
      healthProviderId: provider1._id,
      patientId: patient1._id,
      category: "medication",
      value: [
        "Take Metformin 500mg twice daily (morning and evening)",
        "Check blood sugar levels before breakfast",
      ],
    });

    const goal2 = await UserGoals.create({
      healthProviderId: provider1._id,
      patientId: patient1._id,
      category: "general",
      value: ["Walk 30 minutes daily", "Maintain low-carb diet"],
    });

    const goal3 = await UserGoals.create({
      healthProviderId: provider1._id,
      patientId: patient2._id,
      category: "medication",
      value: [
        "Take Lisinopril 10mg every morning",
        "Monitor blood pressure weekly",
      ],
    });

    const goal4 = await UserGoals.create({
      healthProviderId: provider2._id,
      patientId: patient3._id,
      category: "healthcheckup",
      value: ["Schedule annual physical exam", "Get flu shot this season"],
    });

    const goal5 = await UserGoals.create({
      healthProviderId: provider2._id,
      patientId: patient4._id,
      category: "medication",
      value: [
        "Carry EpiPen at all times",
        "Read food labels carefully for allergens",
      ],
    });

    console.log(`✅ Created ${5} user goals`);

    // Create Goal Tracking
    console.log("📊 Creating Goal Tracking entries...");
    await GoalTracking.create([
      {
        userId: patient1._id,
        healthProviderId: provider1._id,
        target: "Take morning Metformin dose",
        completed: false,
        goalID: goal1._id,
      },
      {
        userId: patient1._id,
        healthProviderId: provider1._id,
        target: "Take evening Metformin dose",
        completed: false,
        goalID: goal1._id,
      },
      {
        userId: patient1._id,
        healthProviderId: provider1._id,
        target: "30 minute walk",
        completed: true,
        goalID: goal2._id,
      },
      {
        userId: patient2._id,
        healthProviderId: provider1._id,
        target: "Take morning Lisinopril",
        completed: false,
        goalID: goal3._id,
      },
      {
        userId: patient3._id,
        healthProviderId: provider2._id,
        target: "Schedule annual checkup",
        completed: false,
        goalID: goal4._id,
      },
      {
        userId: patient4._id,
        healthProviderId: provider2._id,
        target: "Check EpiPen expiration date",
        completed: true,
        goalID: goal5._id,
      },
    ]);

    console.log(`✅ Created goal tracking entries`);

    // Display summary
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📝 Summary:");
    console.log(`   - Health Providers: 2`);
    console.log(`   - Patients: 4`);
    console.log(`   - Medical Conditions: 5`);
    console.log(`   - User Goals: 5`);
    console.log(`   - Goal Tracking: 6`);
    console.log("\n📋 Sample Patient IDs for testing:");
    console.log(`   - Patient 1 (John Doe): ${patient1._id}`);
    console.log(`   - Patient 2 (Jane Smith): ${patient2._id}`);
    console.log(`   - Patient 3 (Robert Williams): ${patient3._id}`);
    console.log(`   - Patient 4 (Emily Davis): ${patient4._id}`);

    // Disconnect
    await database.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    await database.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
