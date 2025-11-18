import { RedisQueueAndWorker } from "./services/redis";
import { database } from "./lib/db";
import { Patient, UserGoals, GoalTracking } from "./models";
import { vapiService } from "./services/vapi.service";

interface NotificationJobData {
  patientId: string;
  notificationType?: "medication" | "goal" | "checkup";
}

async function initiateNotificationJob(redisConnection: {
  redisHost: string;
  redisPort: number;
}) {
  console.log("🚀 Notification Worker initiated");

  // Connect to MongoDB
  try {
    await database.connect();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }

  const notificationJob = new RedisQueueAndWorker({
    queueName: "notification-queue",
    connection: {
      host: redisConnection.redisHost,
      port: redisConnection.redisPort,
    },
  });

  const notificationJobQueue = notificationJob.getQueue();

  const notificationWorker = notificationJob.getWorker<NotificationJobData>(
    async (job) => {
      console.log(`\n📋 Processing notification job: ${job.id}`);
      const { patientId, notificationType } = job.data;

      try {
        // Fetch patient details
        console.log(`🔍 Fetching patient data for ID: ${patientId}`);
        const patient = await Patient.findById(patientId).populate(
          "healthProviderId"
        );

        if (!patient) {
          console.error(`❌ Patient not found: ${patientId}`);
          throw new Error(`Patient not found: ${patientId}`);
        }

        console.log(`✅ Found patient: ${patient.fullname}`);

        // Fetch patient's medication goals
        const medicationGoals = await UserGoals.find({
          patientId: patient._id,
          category: "medication",
        });

        if (medicationGoals.length === 0) {
          console.log(`⚠️ No medication goals found for ${patient.fullname}`);
          return;
        }

        console.log(`💊 Found ${medicationGoals.length} medication goal(s)`);

        // Get pending goal tracking items
        const pendingGoals = await GoalTracking.find({
          userId: patient._id,
          completed: false,
        }).limit(3);

        // Prepare medication list
        const medications: string[] = [];
        medicationGoals.forEach((goal) => {
          medications.push(...goal.value);
        });

        // Generate reminder message
        let message: string;
        if (medications.length > 0) {
          message = vapiService.generateMedicationReminder(
            patient.fullname,
            medications
          );
        } else if (pendingGoals.length > 0 && pendingGoals[0]) {
          message = vapiService.generateGoalReminder(
            patient.fullname,
            pendingGoals[0].target
          );
        } else {
          message = `Hi ${patient.fullname}, this is a general health reminder. Please remember to take care of your health today.`;
        }

        console.log(`📞 Message prepared: "${message.substring(0, 50)}..."`);

        // Make VAPI call
        const callResult = await vapiService.makeCall(
          patient.phone,
          message,
          patient.fullname
        );

        if (callResult.success) {
          console.log(
            `✅ Call initiated successfully! Call ID: ${callResult.callId}`
          );
        } else {
          console.error(`❌ Call failed: ${callResult.error}`);
          throw new Error(`VAPI call failed: ${callResult.error}`);
        }
      } catch (error: any) {
        console.error(`❌ Error processing notification job:`, error.message);
        throw error;
      }
    }
  );

  // Worker event listeners
  notificationWorker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed successfully`);
  });

  notificationWorker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err.message);
  });

  console.log("👂 Worker is listening for notification jobs...\n");

  return { queue: notificationJobQueue, worker: notificationWorker };
}

export { initiateNotificationJob };
