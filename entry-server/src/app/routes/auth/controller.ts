import { type Request, type Response } from "express";
import { ApiResponse, ErrorResponse } from "../../lib/api.helper";
import { hashPassword } from "./utils";
import AuthRepository from "./repository";

class Controller {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }
  public async signupUser(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;

    const requiredParameters = ["name", "email", "password"];

    // Validate required parameters
    for (const param of requiredParameters) {
      if (!req.body[param]) {
        throw new ErrorResponse({
          statusCode: 400,
          message: `${param} is required`,
          success: false,
        });
      }
    }

    // Check if user already exists
    const userExists = await this.authRepository.checkUserExistsByEmail(email);
    if (userExists.exists) {
      throw new ErrorResponse({
        statusCode: 400,
        message: "User already exists with this email",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Default to creating a patient (you can modify this logic)
    const savedUser = await this.authRepository.createPatient({
      fullname: name,
      email,
      password: hashedPassword,
    });

    res.json(
      new ApiResponse({
        statusCode: 201,
        message: "User registered successfully",
        data: {
          id: savedUser._id,
          fullname: savedUser.fullname,
          email: savedUser.email,
        },
      })
    );
  }

  public async signupPatient(req: Request, res: Response): Promise<void> {
    const {
      fullname,
      email,
      password,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      healthProviderID,
    } = req.body;

    console.log(req.body);
    const requiredParameters = ["fullname", "email", "password"];

    // Validate required parameters
    for (const param of requiredParameters) {
      if (!req.body[param]) {
        throw new ErrorResponse({
          statusCode: 400,
          message: `${param} is required`,
          success: false,
        });
      }
    }

    // Check if patient already exists
    const existingPatient = await this.authRepository.findPatientByEmail(email);
    if (existingPatient) {
      throw new ErrorResponse({
        statusCode: 400,
        message: "Patient already exists with this email",
        success: false,
      });
    }

    // Validate healthProviderID if provided
    if (healthProviderID) {
      const isValidProvider = await this.authRepository.validateHealthProvider(
        healthProviderID
      );
      if (!isValidProvider) {
        throw new ErrorResponse({
          statusCode: 400,
          message: "Invalid health provider ID",
          success: false,
        });
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new patient
    const savedPatient = await this.authRepository.createPatient({
      fullname,
      email,
      password: hashedPassword,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      healthProviderID,
    });

    console.log(healthProviderID);
    res.json(
      new ApiResponse({
        statusCode: 201,
        message: "Patient registered successfully",
        data: {
          id: savedPatient._id,
          fullname: savedPatient.fullname,
          email: savedPatient.email,
          phone: savedPatient.phone,
          userType: "patient",
        },
      })
    );
  }

  public async signupProvider(req: Request, res: Response): Promise<void> {
    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      pincode,
      country,
    } = req.body;

    const requiredParameters = ["name", "email", "password"];

    // Validate required parameters
    for (const param of requiredParameters) {
      if (!req.body[param]) {
        throw new ErrorResponse({
          statusCode: 400,
          message: `${param} is required`,
          success: false,
        });
      }
    }

    // Check if provider already exists
    const existingProvider = await this.authRepository.findProviderByEmail(
      email
    );
    if (existingProvider) {
      throw new ErrorResponse({
        statusCode: 400,
        message: "Health provider already exists with this email",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new health provider
    const savedProvider = await this.authRepository.createProvider({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      city,
      state,
      pincode,
      country,
    });

    res.json(
      new ApiResponse({
        statusCode: 201,
        message: "Health provider registered successfully",
        data: {
          id: savedProvider._id,
          name: savedProvider.name,
          email: savedProvider.email,
          phone: savedProvider.phone,
          userType: "provider",
        },
      })
    );
  }

  public async getProfile(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ErrorResponse({
        statusCode: 401,
        message: "User not authenticated",
        success: false,
      });
    }

    const user = req.user as any;

    try {
      const profileData = await this.authRepository.getUserProfile(
        user.id,
        user.userType
      );

      if (!profileData) {
        throw new ErrorResponse({
          statusCode: 404,
          message: "User profile not found",
          success: false,
        });
      }

      res.json(
        new ApiResponse({
          statusCode: 200,
          message: "Profile retrieved successfully",
          data: {
            ...profileData.toObject(),
            userType: user.userType,
          },
        })
      );
    } catch (error) {
      throw new ErrorResponse({
        statusCode: 500,
        message: "Failed to retrieve profile",
        success: false,
      });
    }
  }

  /**
   * Simple route to logout logged in user
   * @param req
   * @param res
   */
  public async logout(req: Request, res: Response): Promise<void> {
    req.logout((err) => {
      if (err) {
        throw new ErrorResponse({
          statusCode: 400,
          message: "Failed to logout",
          success: false,
        });
      }

      // Clear JWT cookie
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      res.json(
        new ApiResponse({
          statusCode: 200,
          message: "Logged out successfully",
        })
      );
    });
  }
}

export default Controller;
