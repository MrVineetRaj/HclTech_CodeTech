import { NextFunction, Router, type Request, type Response } from "express";

import passport from "../../lib/passport";
import { ApiResponse, AsyncHandler } from "../../lib/api.helper";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import Controller from "./controller";
import { generateToken } from "../../lib/jwt";
import { envConf } from "../../lib/envConf";

export function createRouter(): Router {
  const router = Router();
  const controller = new Controller();

  // Patient login
  router.post(
    "/login/patient",
    passport.authenticate("patient-local"),
    (req: Request, res: Response) => {
      const user = req.user as { id: string; userType: string };
      console.log("patient user", req.user);
      
      // Generate JWT token
      const token = generateToken({
        id: user.id,
        userType: user.userType as "patient" | "provider",
      });

      // Set JWT as HTTP-only cookie
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: envConf.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      res.json(
        new ApiResponse<typeof user>({
          message: "Patient Login Successful",
          statusCode: 200,
          data: user,
        })
      );
    }
  );

  // Provider login
  router.post(
    "/login/provider",
    passport.authenticate("provider-local"),
    (req: Request, res: Response) => {
      const user = req.user as { id: string; userType: string };
      console.log("provider user", req.user);
      
      // Generate JWT token
      const token = generateToken({
        id: user.id,
        userType: user.userType as "patient" | "provider",
      });

      // Set JWT as HTTP-only cookie
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: envConf.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      res.json(
        new ApiResponse<typeof user>({
          message: "Provider Login Successful",
          statusCode: 200,
          data: user,
        })
      );
    }
  );

  // Patient signup
  router.post(
    "/signup/patient",
    AsyncHandler(controller.signupPatient.bind(controller))
  );

  // Provider signup
  router.post(
    "/signup/provider",
    AsyncHandler(controller.signupProvider.bind(controller))
  );

  // req.user is populated by deserializeUser
  router.get(
    "/profile",
    isAuthenticated,
    AsyncHandler(controller.getProfile.bind(controller))
  );

  router.get(
    "/logout",
    isAuthenticated,
    AsyncHandler(controller.logout.bind(controller))
  );

  return router;
}

const authRoutes = createRouter();
export { authRoutes };
