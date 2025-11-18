import {
  Patient,
  HealthProvider,
  IPatient,
  IHealthProvider,
} from "../../models";

export interface CreatePatientData {
  fullname: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: number;
  country?: string;
  healthProviderID?: string;
}

export interface CreateProviderData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: number;
  country?: string;
}

class AuthRepository {
  private handleError(error: unknown, operation: string): Error {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Error(`${operation}: ${message}`);
  }

  // Patient related operations
  async findPatientByEmail(email: string): Promise<IPatient | null> {
    try {
      return await Patient.findOne({ email });
    } catch (error) {
      throw this.handleError(error, "Failed to find patient by email");
    }
  }

  async findPatientByEmailWithPassword(
    email: string
  ): Promise<IPatient | null> {
    try {
      return await Patient.findOne({ email }).select("+password");
    } catch (error) {
      throw this.handleError(
        error,
        "Failed to find patient by email with password"
      );
    }
  }

  async findPatientById(id: string): Promise<IPatient | null> {
    try {
      return await Patient.findById(id);
    } catch (error) {
      throw this.handleError(error, "Failed to find patient by ID");
    }
  }

  async findPatientByIdWithProvider(id: string): Promise<IPatient | null> {
     console.log({id})
    try {
      return await Patient.findById(id)
    } catch (error) {
      throw this.handleError(
        error,
        "Failed to find patient by ID with provider"
      );
    }
  }

  async createPatient(patientData: CreatePatientData): Promise<IPatient> {
    try {
      const newPatient = new Patient(patientData);
      return await newPatient.save();
    } catch (error) {
      throw this.handleError(error, "Failed to create patient");
    }
  }

  // HealthProvider related operations
  async findProviderByEmail(email: string): Promise<IHealthProvider | null> {
    try {
      return await HealthProvider.findOne({ email });
    } catch (error) {
      throw this.handleError(error, "Failed to find provider by email");
    }
  }

  async findProviderByEmailWithPassword(
    email: string
  ): Promise<IHealthProvider | null> {
    try {
      return await HealthProvider.findOne({ email }).select("+password");
    } catch (error) {
      throw this.handleError(
        error,
        "Failed to find provider by email with password"
      );
    }
  }

  async findProviderById(id: string): Promise<IHealthProvider | null> {
    try {
      return await HealthProvider.findById(id);
    } catch (error) {
      throw this.handleError(error, "Failed to find provider by ID");
    }
  }

  async createProvider(
    providerData: CreateProviderData
  ): Promise<IHealthProvider> {
    try {
      const newProvider = new HealthProvider(providerData);
      return await newProvider.save();
    } catch (error) {
      throw this.handleError(error, "Failed to create provider");
    }
  }

  // Combined operations for checking user existence
  async checkUserExistsByEmail(
    email: string
  ): Promise<{ exists: boolean; userType?: string }> {
    try {
      const [existingPatient, existingProvider] = await Promise.all([
        this.findPatientByEmail(email),
        this.findProviderByEmail(email),
      ]);

      if (existingPatient) {
        return { exists: true, userType: "patient" };
      }
      if (existingProvider) {
        return { exists: true, userType: "provider" };
      }

      return { exists: false };
    } catch (error) {
      throw this.handleError(error, "Failed to check user existence");
    }
  }

  // Validate health provider exists
  async validateHealthProvider(healthProviderID: string): Promise<boolean> {
    try {
      const provider = await this.findProviderById(healthProviderID);
      return !!provider;
    } catch (error) {
      throw this.handleError(error, "Failed to validate health provider");
    }
  }

  // Get user profile by ID and type
  async getUserProfile(
    id: string,
    userType: string
  ): Promise<IPatient | IHealthProvider | null> {
    try {
      if (userType === "patient") {
        return await this.findPatientByIdWithProvider(id);
      } else if (userType === "provider") {
        return await this.findProviderById(id);
      }
      return null;
    } catch (error) {
      throw this.handleError(error, "Failed to get user profile");
    }
  }
}

export default AuthRepository;
