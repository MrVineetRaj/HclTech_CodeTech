import "dotenv/config";
import { z } from "zod";

/**
 * Thi schema validates all the required env variables
 */
const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  BASE_URL: z.string().min(1, "BASE_URL is required"),
  VALID_ORIGINS: z.string().min(1, "VALID_ORIGINS is required"),
  FRONTEND_URL: z.string().min(1, "FRONTEND_URL is required"),
  ENCRYPTION_KEY: z.string().min(1, "ENCRYPTION_KEY is required"),
  PRIVATE_IP: z.string().min(1, "PRIVATE_IP is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET is required"),
  SESSION_SECRET: z.string().min(1, "SESSION_SECRET is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  PATIENT_SERVICE_URL: z.string().default("http://localhost:8082"),
  REDIS_HOST: z.string().min(1, "REDIS_HOST is required"),
  REDIS_PORT: z.string().min(1, "REDIS_PORT is required"),
});

/**
 * this function to get env variables
 * - validate them
 * - if validated then return an object containing all env variables
 * - if fails crashes the whole system
 * @param env
 * @returns
 */
function createEnvConf(env: NodeJS.ProcessEnv) {
  
  const validateEnv = envSchema.safeParse(env);

  if (!validateEnv.success) {
    console.error("❌ Invalid environment variables:\n", {
      ...validateEnv.error.flatten().fieldErrors,
    });
    throw new Error(validateEnv.error.message);
  }
  return validateEnv.data;
}

export const envConf = createEnvConf(process.env);
