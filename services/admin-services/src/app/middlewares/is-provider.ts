import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../lib/api.helper";
import logger, { loggerMetadata } from "../lib/logger";

/**
 * Middleware to allow only authenticated providers
 * Checks session-based auth (Passport)
 * Verifies that the user is a provider (not a patient)
 * @param req Request imported from express
 * @param res Response imported from express
 * @param next NextFunction imported from express
 */
function isProvider(req: Request, res: Response, next: NextFunction) {
  const currTime = Date.now();
  
  // Check if user is authenticated via session (Passport)
  if (!req.isAuthenticated() || !req.user) {
    logger.api(
      req.originalUrl,
      loggerMetadata.user({
        statusCode: 401,
        timeTaken: Date.now() - currTime,
      })
    );
    return res.status(401).json(
      new ApiResponse({
        statusCode: 401,
        message: "Authentication required",
      })
    );
  }

  const user = req.user as { id: string; userType: string };

  // Check if user is a provider
  if (user.userType !== "provider") {
    logger.api(
      req.originalUrl,
      loggerMetadata.user({
        statusCode: 403,
        timeTaken: Date.now() - currTime,
      })
    );
    return res.status(403).json(
      new ApiResponse({
        statusCode: 403,
        message: "Access denied. Provider access required.",
      })
    );
  }

  // User is authenticated and is a provider
  return next();
}

export { isProvider };

