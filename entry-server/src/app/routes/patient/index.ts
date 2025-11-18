import { Router, type Request, type Response } from "express";
import { AsyncHandler } from "../../lib/api.helper";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { proxyToPatientService } from "../../lib/proxy";

export function createRouter(): Router {
  const router = Router();

  // All patient routes require authentication
  router.use(isAuthenticated);

  // Catch-all route that proxies all requests to patient-service
  // Since both entry-server and patient-service use /api/v1/patient as base,
  // we just proxy the path after the base route
  router.all(
    "*",
    AsyncHandler(async (req: Request, res: Response) => {
      // req.path gives us the path after the base route (/api/v1/patient)
      // So if request is /api/v1/patient/profile, req.path will be /profile
      // We construct the full path for patient-service: /api/v1/patient + req.path
      const targetPath = `/api/v1/patient${req.path}`;
      await proxyToPatientService(req, res, targetPath);
    })
  );

  return router;
}

const patientRoutes = createRouter();
export { patientRoutes };
