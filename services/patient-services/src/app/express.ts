import { envConf } from "./lib/envConf";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import responseTime from "response-time";
import client from "prom-client";
import { healthRoutes } from "./routes/health";
import cookieParser from "cookie-parser";
import session from "express-session";
import { redisServices } from "./services/redis";
import passport from "passport";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { patientRoutes } from "./routes/patient";
import { notificationRoutes } from "./routes/notification";
// import { dbInstanceJobQueue, notificationJobQueue } from "../server";

import { ApiResponse, AsyncHandler } from "./lib/api.helper";

/**
 * Creates and configures an Express application instance.
 * Initializes all essential middleware, sets up API routes,
 * and configures session management with Passport.
 * @returns {Application} The configured Express application.
 */
export function createExpressApp(): Application {
  const app: Application = express();

  /**
   * Used to allow multiple valid frontend routes to access this backend
   * valid methods wll be GET, POST, PUT, DELETE
   */
  app.use(
    cors({
      origin: envConf.VALID_ORIGINS.split(";"), // your client URL
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      exposedHeaders: [
        "RateLimit-Remaining",
        "RateLimit-Reset",
        "RateLimit-Limit",
      ],
    })
  );

  /**
   * Some express middlewares setup to make sure that it can parse
   * - json body
   * - cookies
   */
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());

  /**
   * Now using multiple routes
   */
  app.use("/api/v1/patient", patientRoutes); // for  managing user data
  app.use("/api/v1/health", healthRoutes); // for checking health of system
  app.use("/api/v1/notification", notificationRoutes); // for sending notifications

  return app;
}
