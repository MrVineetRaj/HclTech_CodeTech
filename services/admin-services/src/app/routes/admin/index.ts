import { NextFunction, Router, type Request, type Response } from "express";
import { ApiResponse, AsyncHandler } from "../../lib/api.helper";
import { isProvider } from "../../middlewares/is-provider";
import Controller from "./controller";

export function createRouter(): Router {
  const router = Router();
  const controller = new Controller();

  // All admin routes require provider authentication
  router.use(isProvider);

  // ==================== Patient Management Routes ====================
  
  router.get(
    "/patients",
    AsyncHandler(controller.getAllPatients.bind(controller))
  );

  router.get(
    "/patients/:id",
    AsyncHandler(controller.getPatientById.bind(controller))
  );

  router.put(
    "/patients/:id",
    AsyncHandler(controller.updatePatient.bind(controller))
  );

  router.post(
    "/patients/invite",
    AsyncHandler(controller.invitePatient.bind(controller))
  );

  // ==================== Medical Conditions Routes ====================

  router.post(
    "/patients/:patientId/medical-conditions",
    AsyncHandler(controller.addMedicalCondition.bind(controller))
  );

  router.get(
    "/patients/:patientId/medical-conditions",
    AsyncHandler(controller.getPatientMedicalConditions.bind(controller))
  );

  router.put(
    "/patients/:patientId/medical-conditions/:id",
    AsyncHandler(controller.updateMedicalCondition.bind(controller))
  );

  router.delete(
    "/patients/:patientId/medical-conditions/:id",
    AsyncHandler(controller.deleteMedicalCondition.bind(controller))
  );

  // ==================== User Goals Routes ====================

  router.post(
    "/patients/:patientId/goals",
    AsyncHandler(controller.addUserGoal.bind(controller))
  );

  router.get(
    "/patients/:patientId/goals",
    AsyncHandler(controller.getPatientGoals.bind(controller))
  );

  router.put(
    "/patients/:patientId/goals/:id",
    AsyncHandler(controller.updateUserGoal.bind(controller))
  );

  router.delete(
    "/patients/:patientId/goals/:id",
    AsyncHandler(controller.deleteUserGoal.bind(controller))
  );

  return router;
}

const adminRoutes = createRouter();
export { adminRoutes };

