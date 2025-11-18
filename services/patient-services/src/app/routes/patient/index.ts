import { NextFunction, Router, type Request, type Response } from "express";

import passport from "../../lib/passport";
import { ApiResponse, AsyncHandler } from "../../lib/api.helper";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import Controller from "./controller";

export function createRouter(): Router {
  const router = Router();
  const controller = new Controller();

  // Patient Profile Routes
  router.get(
    "/profile",
    AsyncHandler(controller.getPatientProfile.bind(controller))
  );

  router.put(
    "/profile",
    AsyncHandler(controller.putPatientProfile.bind(controller))
  );

  // Health Provider Routes
  router.get(
    "/health-provider",
    AsyncHandler(controller.getHealthProvider.bind(controller))
  );

  // Medical Conditions Routes
  router.get(
    "/medical-conditions",
    AsyncHandler(controller.getMedicalConditions.bind(controller))
  );

  router.get(
    "/medical-conditions/category/:category",
    AsyncHandler(controller.getMedicalConditionsByCategory.bind(controller))
  );

  router.get(
    "/medical-conditions/:id",
    AsyncHandler(controller.getMedicalConditionById.bind(controller))
  );

  router.post(
    "/medical-conditions",
    AsyncHandler(controller.createMedicalCondition.bind(controller))
  );

  router.put(
    "/medical-conditions/:id",
    AsyncHandler(controller.updateMedicalCondition.bind(controller))
  );

  router.delete(
    "/medical-conditions/:id",
    AsyncHandler(controller.deleteMedicalCondition.bind(controller))
  );

  // User Goals Routes
  router.get(
    "/goals",
    AsyncHandler(controller.getUserGoals.bind(controller))
  );

  router.get(
    "/goals/category/:category",
    AsyncHandler(controller.getUserGoalsByCategory.bind(controller))
  );

  router.get(
    "/goals/:id",
    AsyncHandler(controller.getUserGoalById.bind(controller))
  );

  router.post(
    "/goals",
    AsyncHandler(controller.createUserGoal.bind(controller))
  );

  router.put(
    "/goals/:id",
    AsyncHandler(controller.updateUserGoal.bind(controller))
  );

  router.delete(
    "/goals/:id",
    AsyncHandler(controller.deleteUserGoal.bind(controller))
  );

  // Goal Tracking Routes
  router.get(
    "/goal-tracking",
    AsyncHandler(controller.getGoalTracking.bind(controller))
  );

  router.get(
    "/goal-tracking/goal/:goalId",
    AsyncHandler(controller.getGoalTrackingByGoalId.bind(controller))
  );

  router.get(
    "/goal-tracking/completed",
    AsyncHandler(controller.getCompletedGoals.bind(controller))
  );

  router.get(
    "/goal-tracking/pending",
    AsyncHandler(controller.getPendingGoals.bind(controller))
  );

  router.post(
    "/goal-tracking",
    AsyncHandler(controller.createGoalTracking.bind(controller))
  );

  router.put(
    "/goal-tracking/:id",
    AsyncHandler(controller.updateGoalTracking.bind(controller))
  );

  router.delete(
    "/goal-tracking/:id",
    AsyncHandler(controller.deleteGoalTracking.bind(controller))
  );

  return router;
}

const patientRoutes = createRouter();
export { patientRoutes };
