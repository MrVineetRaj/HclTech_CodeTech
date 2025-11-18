import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../lib/api.helper";
import logger, { loggerMetadata } from "../lib/logger";
import { verifyToken } from "../lib/jwt";

/**
 * It is a middleware to allow only authenticated requests
 * Checks both session-based auth (Passport) and JWT cookies
 * @param req Request imported from express
 * @param res Response imported from express
 * @param next NextFunction imported from express
 */
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const currTime = Date.now();
  
  // First, check if user is authenticated via session (Passport)
  if (req.isAuthenticated()) {
    return next();
  }

  // If not authenticated via session, check JWT cookie
  const token = req.cookies?.authToken;
  
  if (token) {
    const decoded = verifyToken(token);
    
    if (decoded) {
      // Attach user info to request object for consistency
      (req as any).user = {
        id: decoded.id,
        userType: decoded.userType,
      };
      return next();
    }
  }

  // No valid authentication found
  logger.api(
    req.originalUrl,
    loggerMetadata.user({
      statusCode: 401,
      timeTaken: Date.now() - currTime,
    })
  );
  res.status(401).json(
    new ApiResponse({
      statusCode: 401,
      message: "Authentication failed",
    })
  );
}

export { isAuthenticated };
