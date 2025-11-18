import { type Request, type Response } from "express";
import { ApiResponse, ErrorResponse } from "../../lib/api.helper";
import { notificationQueue } from "../../services/notification-queue";

interface SendReminderRequest extends Request {
  body: {
    patientId: string;
    notificationType?: "medication" | "goal" | "checkup";
  };
}

class NotificationController {
  /**
   * Send medication/health reminder to a patient
   * POST /api/v1/notification/send-reminder
   */
  public async sendReminder(
    req: SendReminderRequest,
    res: Response
  ): Promise<void> {
    try {
      const { patientId, notificationType } = req.body;

      // Validate patientId
      if (!patientId) {
        res.status(400).json(
          new ErrorResponse({
            statusCode: 400,
            success: false,
            message: "patientId is required",
          })
        );
        return;
      }

      // Add job to notification queue
      const job = await notificationQueue.add(
        "send-reminder",
        {
          patientId,
          notificationType: notificationType || "medication",
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: false,
          removeOnFail: false,
        }
      );

      console.log(`✅ Notification job added to queue. Job ID: ${job.id}`);

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Notification job added to queue successfully",
          result: {
            jobId: job.id,
            patientId,
            notificationType: notificationType || "medication",
            status: "queued",
          },
        })
      );
    } catch (error: any) {
      console.error("Error adding notification job:", error);
      res.status(500).json(
        new ErrorResponse({
          statusCode: 500,
          success: false,
          message: "Failed to queue notification",
          details: error.message,
        })
      );
    }
  }

  /**
   * Get status of a notification job
   * GET /api/v1/notification/status/:jobId
   */
  public async getJobStatus(req: Request, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;

      if (!jobId) {
        res.status(400).json(
          new ErrorResponse({
            statusCode: 400,
            success: false,
            message: "jobId is required",
          })
        );
        return;
      }

      const job = await notificationQueue.getJob(jobId);

      if (!job) {
        res.status(404).json(
          new ErrorResponse({
            statusCode: 404,
            success: false,
            message: "Job not found",
          })
        );
        return;
      }

      const state = await job.getState();
      const progress = job.progress;
      const result = job.returnvalue;

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Job status retrieved",
          result: {
            jobId: job.id,
            state,
            progress,
            result,
            data: job.data,
          },
        })
      );
    } catch (error: any) {
      console.error("Error getting job status:", error);
      res.status(500).json(
        new ErrorResponse({
          statusCode: 500,
          success: false,
          message: "Failed to get job status",
          details: error.message,
        })
      );
    }
  }

  /**
   * Send bulk reminders to multiple patients
   * POST /api/v1/notification/send-bulk
   */
  public async sendBulkReminders(req: Request, res: Response): Promise<void> {
    try {
      const { patientIds } = req.body;

      if (
        !patientIds ||
        !Array.isArray(patientIds) ||
        patientIds.length === 0
      ) {
        res.status(400).json(
          new ErrorResponse({
            statusCode: 400,
            success: false,
            message: "patientIds array is required",
          })
        );
        return;
      }

      const jobs = await Promise.all(
        patientIds.map((patientId) =>
          notificationQueue.add("send-reminder", {
            patientId,
            notificationType: "medication",
          })
        )
      );

      const jobIds = jobs.map((job) => job.id);

      console.log(`✅ ${jobs.length} notification jobs added to queue`);

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: `${jobs.length} notification jobs queued successfully`,
          result: {
            jobIds,
            count: jobs.length,
          },
        })
      );
    } catch (error: any) {
      console.error("Error adding bulk notifications:", error);
      res.status(500).json(
        new ErrorResponse({
          statusCode: 500,
          success: false,
          message: "Failed to queue bulk notifications",
          details: error.message,
        })
      );
    }
  }
}

export default NotificationController;
