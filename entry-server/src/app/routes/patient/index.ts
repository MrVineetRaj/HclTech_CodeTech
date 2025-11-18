import { Router, type Request, type Response } from "express";
import { AsyncHandler } from "../../lib/api.helper";
import { isPatient } from "../../middlewares/is-patient";
import { proxyToPatientService } from "../../lib/proxy";

export function createRouter(): Router {
  const router = Router();

  // All patient routes require patient authentication
  router.use(isPatient);

  // Patient Profile Routes
  router.get(
    "/profile",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(req, res, "/api/v1/patient/profile");
    })
  );

  router.put(
    "/profile",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(req, res, "/api/v1/patient/profile");
    })
  );

  // Health Provider Routes
  router.get(
    "/health-provider",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(req, res, "/api/v1/patient/health-provider");
    })
  );

  // Medical Conditions Routes
  router.get(
    "/medical-conditions",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        "/api/v1/patient/medical-conditions"
      );
    })
  );

  router.get(
    "/medical-conditions/category/:category",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        `/api/v1/patient/medical-conditions/category/${req.params.category}`
      );
    })
  );

  router.get(
    "/medical-conditions/:id",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        `/api/v1/patient/medical-conditions/${req.params.id}`
      );
    })
  );

  router.post(
    "/medical-conditions",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        "/api/v1/patient/medical-conditions"
      );
    })
  );

  router.put(
    "/medical-conditions/:id",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        `/api/v1/patient/medical-conditions/${req.params.id}`
      );
    })
  );

  router.delete(
    "/medical-conditions/:id",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        `/api/v1/patient/medical-conditions/${req.params.id}`
      );
    })
  );

  // User Goals Routes
  router.get(
    "/goals",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(req, res, "/api/v1/patient/goals");
    })
  );

  router.get(
    "/goals/category/:category",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        `/api/v1/patient/goals/category/${req.params.category}`
      );
    })
  );

  router.get(
    "/goals/:id",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        `/api/v1/patient/goals/${req.params.id}`
      );
    })
  );

  router.post(
    "/goals",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(req, res, "/api/v1/patient/goals");
    })
  );

  router.put(
    "/goals/:id",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        `/api/v1/patient/goals/${req.params.id}`
      );
    })
  );

  router.delete(
    "/goals/:id",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        `/api/v1/patient/goals/${req.params.id}`
      );
    })
  );

  // Goal Tracking Routes
  router.get(
    "/goal-tracking",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(req, res, "/api/v1/patient/goal-tracking");
    })
  );

  router.get(
    "/goal-tracking/goal/:goalId",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        `/api/v1/patient/goal-tracking/goal/${req.params.goalId}`
      );
    })
  );

  router.get(
    "/goal-tracking/completed",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        "/api/v1/patient/goal-tracking/completed"
      );
    })
  );

  router.get(
    "/goal-tracking/pending",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        "/api/v1/patient/goal-tracking/pending"
      );
    })
  );

  router.post(
    "/goal-tracking",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(req, res, "/api/v1/patient/goal-tracking");
    })
  );

  router.put(
    "/goal-tracking/:id",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        `/api/v1/patient/goal-tracking/${req.params.id}`
      );
    })
  );

  router.delete(
    "/goal-tracking/:id",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToPatientService(
        req,
        res,
        `/api/v1/patient/goal-tracking/${req.params.id}`
      );
    })
  );

  return router;
}

const patientRoutes = createRouter();
export { patientRoutes };
