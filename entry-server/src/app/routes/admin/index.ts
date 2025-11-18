import { Router, type Request, type Response } from "express";
import { AsyncHandler } from "../../lib/api.helper";
import { isProvider } from "../../middlewares/is-provider";
import { proxyToAdminService } from "../../lib/proxy";

export function createRouter(): Router {
  const router = Router();

  // All admin routes require provider authentication
  router.use(isProvider);

  // ==================== Patient Management Routes ====================
  
  router.get(
    "/patients",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToAdminService(req, res, "/api/v1/admin/patients");
    })
  );

  router.get(
    "/patients/:id",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToAdminService(
        req,
        res,
        `/api/v1/admin/patients/${req.params.id}`
      );
    })
  );

  router.put(
    "/patients/:id",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToAdminService(
        req,
        res,
        `/api/v1/admin/patients/${req.params.id}`
      );
    })
  );

  router.post(
    "/patients/invite",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToAdminService(req, res, "/api/v1/admin/patients/invite");
    })
  );

  // ==================== Medical Conditions Routes ====================

  router.post(
    "/patients/:patientId/medical-conditions",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToAdminService(
        req,
        res,
        `/api/v1/admin/patients/${req.params.patientId}/medical-conditions`
      );
    })
  );

  router.get(
    "/patients/:patientId/medical-conditions",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToAdminService(
        req,
        res,
        `/api/v1/admin/patients/${req.params.patientId}/medical-conditions`
      );
    })
  );

  router.put(
    "/patients/:patientId/medical-conditions/:id",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToAdminService(
        req,
        res,
        `/api/v1/admin/patients/${req.params.patientId}/medical-conditions/${req.params.id}`
      );
    })
  );

  router.delete(
    "/patients/:patientId/medical-conditions/:id",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToAdminService(
        req,
        res,
        `/api/v1/admin/patients/${req.params.patientId}/medical-conditions/${req.params.id}`
      );
    })
  );

  // ==================== User Goals Routes ====================

  router.post(
    "/patients/:patientId/goals",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToAdminService(
        req,
        res,
        `/api/v1/admin/patients/${req.params.patientId}/goals`
      );
    })
  );

  router.get(
    "/patients/:patientId/goals",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToAdminService(
        req,
        res,
        `/api/v1/admin/patients/${req.params.patientId}/goals`
      );
    })
  );

  router.put(
    "/patients/:patientId/goals/:id",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToAdminService(
        req,
        res,
        `/api/v1/admin/patients/${req.params.patientId}/goals/${req.params.id}`
      );
    })
  );

  router.delete(
    "/patients/:patientId/goals/:id",
    AsyncHandler(async (req: Request, res: Response) => {
      await proxyToAdminService(
        req,
        res,
        `/api/v1/admin/patients/${req.params.patientId}/goals/${req.params.id}`
      );
    })
  );

  return router;
}

const adminRoutes = createRouter();
export { adminRoutes };

