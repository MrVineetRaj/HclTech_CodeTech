import { createServer } from "http";
import { createExpressApp } from "./app/express";
import { envConf } from "./app/lib/envConf";
import logger, { loggerMetadata } from "./app/lib/logger";
import { database } from "./app/lib/db";
import client from "prom-client";
// import { appRouter } from "./app/trpc-routes";
// import { initiateDbInstanceJobs } from "./app/workers/db-instance-jobs";
// import { discordService } from "./app/services/discord";
// import { initiateNotificationJobs } from "./app/workers/notification-jobs";
// import "./app/workers/cron-jobs";
const PORT = envConf.PORT;

const server = createServer(createExpressApp());

const { collectDefaultMetrics } = client;

collectDefaultMetrics({
  register: client.register,
});

// export const dbInstanceJobs = initiateDbInstanceJobs({
//   redisConnection: {
//     host: envConf.REDIS_HOST,
//     port: +envConf.REDIS_PORT,
//   },
// });
// export const notificationJobs = initiateNotificationJobs({
//   redisConnection: {
//     host: envConf.REDIS_HOST,
//     port: +envConf.REDIS_PORT,
//   },
// });

// export const dbInstanceJobQueue = dbInstanceJobs.getQueue();
// export const notificationJobQueue = notificationJobs.getQueue();

// export const discordClient = discordService.getClient();

/**
 * Initialize database connection and start server
 */
async function startServer() {
  try {
    // Connect to MongoDB Atlas
    await database.connect();

    // Start Express server
    server.listen(PORT, () => {
      logger.info(
        `Server is up on port ${PORT}`,
        loggerMetadata.system({ filePath: __filename })
      );
    });
  } catch (error) {
    logger.error(
      `Failed to start server: ${(error as Error).message}`,
      loggerMetadata.system({ filePath: __filename })
    );
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(signal: string) {
  logger.info(
    `${signal} received. Starting graceful shutdown...`,
    loggerMetadata.system({ filePath: __filename })
  );

  try {
    // Close database connection
    await database.disconnect();

    // Close server
    server.close(() => {
      logger.info(
        "Server closed successfully",
        loggerMetadata.system({ filePath: __filename })
      );
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error(
        "Could not close connections in time, forcefully shutting down",
        loggerMetadata.system({ filePath: __filename })
      );
      process.exit(1);
    }, 10000);
  } catch (error) {
    logger.error(
      `Error during shutdown: ${(error as Error).message}`,
      loggerMetadata.system({ filePath: __filename })
    );
    process.exit(1);
  }
}

// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught errors
process.on("uncaughtException", (error: Error) => {
  logger.error(
    `Uncaught Exception: ${error.message}`,
    loggerMetadata.system({ filePath: __filename })
  );
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason: any) => {
  logger.error(
    `Unhandled Rejection: ${reason}`,
    loggerMetadata.system({ filePath: __filename })
  );
  gracefulShutdown("unhandledRejection");
});

// Start the server
startServer();
