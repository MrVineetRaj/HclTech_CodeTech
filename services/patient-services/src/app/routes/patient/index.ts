import { NextFunction, Router, type Request, type Response } from "express";

import passport from "../../lib/passport";
import { ApiResponse, AsyncHandler } from "../../lib/api.helper";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import Controller from "./controller";

export function createRouter(): Router {
  const router = Router();
  const controller = new Controller();

  router.get(
    "/profile",
    AsyncHandler(controller.getPatientProfile.bind(controller))
  );

  return router;
}

const patientRoutes = createRouter();
export { patientRoutes };
