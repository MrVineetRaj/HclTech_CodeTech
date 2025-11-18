import mongoose from "mongoose";
import { envConf } from "./envConf";
import logger, { loggerMetadata } from "./logger";

async function connectDB(): Promise<void> {
  try {
    const mongoUri = envConf.DATABASE_URL;
    
    await mongoose.connect(mongoUri);
    
    logger.info(
      "MongoDB connected successfully",
      loggerMetadata.system({ filePath: __filename })
    );
  } catch (error) {
    logger.error(
      `MongoDB connection failed: ${error instanceof Error ? error.message : String(error)}`,
      loggerMetadata.system({ filePath: __filename })
    );
    process.exit(1);
  }
}

export default connectDB;