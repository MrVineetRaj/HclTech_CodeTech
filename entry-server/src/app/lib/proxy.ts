import { Request, Response } from "express";
import { envConf } from "./envConf";
import logger, { loggerMetadata } from "./logger";

/**
 * Proxy utility to forward requests to patient-service
 * @param req Express request object
 * @param res Express response object
 * @param targetPath Target path on patient-service (e.g., "/api/v1/patient/profile")
 * @param method HTTP method (defaults to req.method)
 */
export async function proxyToPatientService(
  req: Request,
  res: Response,
  targetPath: string,
  method?: string
): Promise<void> {
  const startTime = Date.now();
  const httpMethod = method || req.method;
  const baseUrl = envConf.PATIENT_SERVICE_URL;
  
  // Get patient ID from req.user (set by isPatient middleware)
  const user = (req as any).user as { id: string; userType: string } | undefined;
  const patientId = user?.id;

  // Build the full URL with query parameters
  const queryString = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
  const url = new URL(`${baseUrl}${targetPath}${queryString}`);
  
  // Add patientId to query params if available (patient-service uses this as fallback)
  if (patientId) {
    url.searchParams.set("patientId", patientId);
  }

  try {
    // Prepare headers - forward important headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward cookies for authentication
    if (req.headers.cookie) {
      headers["Cookie"] = req.headers.cookie;
    }

    // Forward authorization header if present
    if (req.headers.authorization) {
      headers["Authorization"] = req.headers.authorization;
    }

    // Forward user-agent
    if (req.headers["user-agent"]) {
      headers["User-Agent"] = req.headers["user-agent"];
    }

    // Prepare request options
    const options: RequestInit = {
      method: httpMethod,
      headers,
    };

    // Add body for POST, PUT, PATCH requests
    let requestBody = req.body;
    if (["POST", "PUT", "PATCH"].includes(httpMethod) && requestBody) {
      // Add patientId to body if not already present (patient-service uses this as fallback)
      if (patientId && typeof requestBody === "object" && !requestBody.patientId) {
        requestBody = { ...requestBody, patientId };
      }
      if (Object.keys(requestBody).length > 0) {
        options.body = JSON.stringify(requestBody);
      }
    }

    // Make request to patient-service using fetch (Node.js 18+)
    const response = await fetch(url.toString(), options);
    
    // Get response data
    let responseData: any;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Forward status code and response
    res.status(response.status).json(responseData);

    // Log the proxy request
    const timeTaken = Date.now() - startTime;
    logger.info(
      `Proxied ${httpMethod} ${req.originalUrl} -> ${url.toString()} [${response.status}] (${timeTaken}ms)`,
      loggerMetadata.system({ filePath: __filename })
    );
  } catch (error) {
    const timeTaken = Date.now() - startTime;
    logger.error(
      `Proxy error for ${httpMethod} ${req.originalUrl}: ${error instanceof Error ? error.message : String(error)}`,
      loggerMetadata.system({ filePath: __filename })
    );

    res.status(502).json({
      statusCode: 502,
      success: false,
      message: "Failed to connect to patient service",
      timeTaken,
    });
  }
}

