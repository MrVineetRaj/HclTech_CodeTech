import { Router } from "express";
import { AsyncHandler } from "../../lib/api.helper";
import NotificationController from "./controller";

const notificationRoutes = Router();
const notificationController = new NotificationController();

/**
 * POST /api/v1/notification/send-reminder
 * Send notification reminder to a patient
 */
notificationRoutes.post(
  "/send-reminder",
  AsyncHandler(notificationController.sendReminder.bind(notificationController))
);

/**
 * GET /api/v1/notification/status/:jobId
 * Get status of a notification job
 */
notificationRoutes.get(
  "/status/:jobId",
  AsyncHandler(notificationController.getJobStatus.bind(notificationController))
);

/**
 * POST /api/v1/notification/send-bulk
 * Send bulk notifications to multiple patients
 */
notificationRoutes.post(
  "/send-bulk",
  AsyncHandler(
    notificationController.sendBulkReminders.bind(notificationController)
  )
);

export { notificationRoutes };
