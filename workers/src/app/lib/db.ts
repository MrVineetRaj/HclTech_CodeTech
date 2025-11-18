import mongoose from "mongoose";
import { envConf } from "./envConf";

/**
 * Establishes connection to MongoDB Atlas for worker
 */
class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("MongoDB connection already established");
      return;
    }

    try {
      mongoose.set("strictQuery", false);

      await mongoose.connect(envConf.DATABASE_URL, {
        maxPoolSize: 10,
        minPoolSize: 5,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
      });

      this.isConnected = true;
      console.log("✅ Worker: MongoDB Atlas connected successfully");

      mongoose.connection.on("error", (error) => {
        console.error(`MongoDB connection error: ${error.message}`);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected");
        this.isConnected = false;
      });
    } catch (error) {
      console.error(
        `❌ Failed to connect to MongoDB: ${(error as Error).message}`
      );
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("MongoDB disconnected successfully");
    } catch (error) {
      console.error(
        `Error disconnecting from MongoDB: ${(error as Error).message}`
      );
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const database = Database.getInstance();
export { mongoose };
