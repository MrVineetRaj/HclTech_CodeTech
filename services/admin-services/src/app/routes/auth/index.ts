import { NextFunction, Router, type Request, type Response } from "express";

import passport from "../../lib/passport";
import { ApiResponse, AsyncHandler } from "../../lib/api.helper";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import Controller from "./controller";

export function createRouter(): Router {
  const router = Router();
  const controller = new Controller();

  // Google OAuth authentication route
  router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    })
  );

  // GitHub OAuth callback route
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login", // On failure, go here
    }),
    AsyncHandler(controller.googleCallback.bind(controller))
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
