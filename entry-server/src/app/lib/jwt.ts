import jwt from "jsonwebtoken";
import { envConf } from "./envConf";

export interface JWTPayload {
  id: string;
  userType: "patient" | "provider";
}

/**
 * Generate a JWT token for a user
 * @param payload - User ID and user type
 * @returns JWT token string
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, envConf.JWT_SECRET, {
    expiresIn: "1d",
  });
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, envConf.JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Get token from request cookies
 * @param cookieHeader - Cookie header string
 * @param cookieName - Name of the cookie to extract
 * @returns Token string or null
 */
export function getTokenFromCookie(
  cookieHeader: string | undefined,
  cookieName: string = "authToken"
): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const authCookie = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`));

  if (!authCookie) return null;

  return authCookie.split("=")[1] || null;
}

