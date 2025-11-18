import { RedisQueueAndWorker } from "./services/redis";

async function initiateNotificationJob(redisConnection: {
  redisHost: string;
  redisPort: number;
}) {
  console.log("Notification Worker initiated");
  const notificationJob = new RedisQueueAndWorker({
    queueName: "notification-queue",
    connection: {
      host: redisConnection.redisHost,
      port: redisConnection.redisPort,
    },
  });

  const notificationJobQueue = notificationJob.getQueue();
  const notificationWorker = notificationJob.getWorker(async (job) => {
    const { name, data } = job;

    console.log({ name, data });
  });
}

export { initiateNotificationJob };
