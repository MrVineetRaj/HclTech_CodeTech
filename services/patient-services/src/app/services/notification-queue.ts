import { Queue } from "bullmq";
import { envConf } from "../lib/envConf";

/**
 * BullMQ Queue for notification jobs
 * This queue is used to send notification jobs to the worker
 */
export const notificationQueue = new Queue("notification-queue", {
  connection: {
    host: envConf.REDIS_HOST,
    port: +envConf.REDIS_PORT,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: {
      age: 3600, // Keep completed jobs for 1 hour
      count: 100, // Keep last 100 completed jobs
    },
    removeOnFail: {
      age: 86400, // Keep failed jobs for 24 hours
    },
  },
});

// Queue event listeners
notificationQueue.on("waiting", (jobId) => {
  console.log(`Job ${jobId} is waiting`);
});

notificationQueue.on("error", (error) => {
  console.error("Queue error:", error);
});

console.log("✅ Notification queue initialized");
