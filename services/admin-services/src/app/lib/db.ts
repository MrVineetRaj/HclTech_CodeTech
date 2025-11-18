import mongoose from "mongoose";
import { envConf } from "./envConf";
import logger, { loggerMetadata } from "./logger";

/**
 * Establishes connection to MongoDB Atlas
 * Implements retry logic and proper error handling
 */
class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {}

  /**
   * Get singleton instance of Database class
   */
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Connect to MongoDB Atlas
   * @returns Promise<void>
   */
  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info(
        "MongoDB connection already established",
        loggerMetadata.system({ filePath: __filename })
      );
      return;
    }

    try {
      // Configure mongoose connection options
      mongoose.set("strictQuery", false);

      // Connect to MongoDB Atlas
      await mongoose.connect(envConf.DATABASE_URL, {
        maxPoolSize: 10,
        minPoolSize: 5,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
      });

      this.isConnected = true;

      logger.info(
        "✅ MongoDB Atlas connected successfully",
        loggerMetadata.system({ filePath: __filename })
      );

      // Handle connection events
      mongoose.connection.on("error", (error) => {
        logger.error(
          `MongoDB connection error: ${error.message}`,
          loggerMetadata.system({ filePath: __filename })
        );
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn(
          "MongoDB disconnected. Attempting to reconnect...",
          loggerMetadata.system({ filePath: __filename })
        );
        this.isConnected = false;
      });

      mongoose.connection.on("reconnected", () => {
        logger.info(
          "MongoDB reconnected successfully",
          loggerMetadata.system({ filePath: __filename })
        );
        this.isConnected = true;
      });
    } catch (error) {
      logger.error(
        `❌ Failed to connect to MongoDB: ${(error as Error).message}`,
        loggerMetadata.system({ filePath: __filename })
      );
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   * @returns Promise<void>
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info(
        "MongoDB disconnected successfully",
        loggerMetadata.system({ filePath: __filename })
      );
    } catch (error) {
      logger.error(
        `Error disconnecting from MongoDB: ${(error as Error).message}`,
        loggerMetadata.system({ filePath: __filename })
      );
      throw error;
    }
  }

  /**
   * Get connection status
   * @returns boolean
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const database = Database.getInstance();

// Export mongoose for model creation
export { mongoose };

