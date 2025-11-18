// import { type Request, type Response } from "express";
// import { Types } from "mongoose";
// import { ApiResponse, ErrorResponse } from "../../lib/api.helper";
// import {
//   Patient,
//   IPatient,
//   HealthProvider,
//   IHealthProvider,
//   PatientMedicalConditions,
//   IPatientMedicalConditions,
//   UserGoals,
//   IUserGoals,
// } from "../../models";
// import bcrypt from "bcryptjs";

// // Extend Request type to include user
// interface AuthenticatedRequest extends Request {
//   user?: {
//     id?: string;
//     userType?: string;
//   };
// }

// /**
//  * Hash password utility
//  */
// async function hashPassword(password: string): Promise<string> {
//   try {
//     const saltRounds = 12;
//     return await bcrypt.hash(password, saltRounds);
//   } catch (error) {
//     console.error("Password hashing error:", error);
//     throw new Error("Failed to hash password");
//   }
// }

// class Controller {
//   /**
//    * Helper method to get provider ID from request
//    * Assumes req.user is set by passport authentication
//    */
//   private getProviderId(req: Request): Types.ObjectId {
//     const authReq = req as AuthenticatedRequest;
//     if (authReq.user?.id) {
//       return new Types.ObjectId(authReq.user.id);
//     }
//     // For proxy requests, check query params or body
//     const providerId = (req.query.providerId as string) || (req.body.providerId as string);
//     if (providerId) {
//       return new Types.ObjectId(providerId);
//     }
//     throw new ErrorResponse({
//       statusCode: 401,
//       success: false,
//       message: "Provider ID not found. Authentication required.",
//     });
//   }

//   /**
//    * Helper method to validate patient exists
//    */
//   private async validatePatientExists(patientId: string): Promise<IPatient> {
//     if (!Types.ObjectId.isValid(patientId)) {
//       throw new ErrorResponse({
//         statusCode: 400,
//         success: false,
//         message: "Invalid patient ID",
//       });
//     }

//     const patient = await Patient.findById(patientId);
//     if (!patient) {
//       throw new ErrorResponse({
//         statusCode: 404,
//         success: false,
//         message: "Patient not found",
//       });
//     }
//     return patient;
//   }

//   // ==================== Patient Management Routes ====================

//   /**
//    * Get all patients
//    * GET /patients
//    */
//   public async getAllPatients(req: Request, res: Response): Promise<void> {
//     try {
//       const providerId = this.getProviderId(req);

//       // Get all patients, optionally filter by provider
//       const patients = await Patient.find({ healthProviderId: providerId })
//         .select("-password")
//         .populate("healthProviderId", "name email")
//         .sort({ createdAt: -1 })
//         .lean();

//       res.status(200).json(
//         new ApiResponse({
//           statusCode: 200,
//           message: "Patients retrieved successfully",
//           result: patients,
//         })
//       );
//     } catch (error) {
//       if (error instanceof ErrorResponse) {
//         throw error;
//       }
//       throw new ErrorResponse({
//         statusCode: 500,
//         success: false,
//         message: "Failed to retrieve patients",
//         details: error,
//       });
//     }
//   }

//   /**
//    * Get patient by ID
//    * GET /patients/:id
//    */
//   public async getPatientById(req: Request, res: Response): Promise<void> {
//     try {
//       const { id } = req.params;
//       const patient = await this.validatePatientExists(id);

//       const patientData = await Patient.findById(id)
//         .select("-password")
//         .populate("healthProviderId", "name email phone address city state pincode country")
//         .lean();

//       res.status(200).json(
//         new ApiResponse({
//           statusCode: 200,
//           message: "Patient retrieved successfully",
//           result: patientData,
//         })
//       );
//     } catch (error) {
//       if (error instanceof ErrorResponse) {
//         throw error;
//       }
//       throw new ErrorResponse({
//         statusCode: 500,
//         success: false,
//         message: "Failed to retrieve patient",
//         details: error,
//       });
//     }
//   }

//   /**
//    * Update patient information
//    * PUT /patients/:id
//    */
//   public async updatePatient(req: Request, res: Response): Promise<void> {
//     try {
//       const { id } = req.params;
//       await this.validatePatientExists(id);
//       const updateData = req.body;

//       // Remove fields that shouldn't be updated directly
//       delete updateData._id;
//       delete updateData.id;
//       delete updateData.password; // Password should be updated via separate endpoint
//       delete updateData.createdAt;
//       delete updateData.updatedAt;

//       const patient = await Patient.findByIdAndUpdate(
//         id,
//         { $set: updateData },
//         { new: true, runValidators: true }
//       )
//         .select("-password")
//         .lean();

//       if (!patient) {
//         throw new ErrorResponse({
//           statusCode: 404,
//           success: false,
//           message: "Patient not found",
//         });
//       }

//       res.status(200).json(
//         new ApiResponse({
//           statusCode: 200,
//           message: "Patient updated successfully",
//           result: patient,
//         })
//       );
//     } catch (error) {
//       if (error instanceof ErrorResponse) {
//         throw error;
//       }
//       throw new ErrorResponse({
//         statusCode: 500,
//         success: false,
//         message: "Failed to update patient",
//         details: error,
//       });
//     }
//   }

//   /**
//    * Invite patient (create patient account)
//    * POST /patients/invite
//    */
//   public async invitePatient(req: Request, res: Response): Promise<void> {
//     try {
//       const providerId = this.getProviderId(req);
//       const {
//         fullname,
//         email,
//         password,
//         phone,
//         address,
//         city,
//         state,
//         pincode,
//         country,
//       } = req.body;

//       const requiredParameters = ["fullname", "email", "password"];

//       // Validate required parameters
//       for (const param of requiredParameters) {
//         if (!req.body[param]) {
//           throw new ErrorResponse({
//             statusCode: 400,
//             message: `${param} is required`,
//             success: false,
//           });
//         }
//       }

//       // Check if patient already exists
//       const existingPatient = await Patient.findOne({ email });
//       if (existingPatient) {
//         throw new ErrorResponse({
//           statusCode: 400,
//           message: "Patient already exists with this email",
//           success: false,
//         });
//       }

//       // Hash password
//       const hashedPassword = await hashPassword(password);

//       // Create new patient with provider ID
//       const newPatient = new Patient({
//         fullname,
//         email,
//         password: hashedPassword,
//         phone,
//         address,
//         city,
//         state,
//         pincode,
//         country,
//         healthProviderId: providerId,
//       });

//       const savedPatient = await newPatient.save();

//       // Return patient data without password
//       const patientData = await Patient.findById(savedPatient._id)
//         .select("-password")
//         .populate("healthProviderId", "name email")
//         .lean();

//       res.status(201).json(
//         new ApiResponse({
//           statusCode: 201,
//           message: "Patient invited successfully",
//           result: patientData,
//         })
//       );
//     } catch (error) {
//       if (error instanceof ErrorResponse) {
//         throw error;
//       }
//       throw new ErrorResponse({
//         statusCode: 500,
//         success: false,
//         message: "Failed to invite patient",
//         details: error,
//       });
//     }
//   }

//   // ==================== Medical Conditions Routes ====================

//   /**
//    * Add medical condition for a patient
//    * POST /patients/:patientId/medical-conditions
//    */
//   public async addMedicalCondition(req: Request, res: Response): Promise<void> {
//     try {
//       const { patientId } = req.params;
//       await this.validatePatientExists(patientId);
//       const { category, label, value } = req.body;

//       if (!category || !label || !value) {
//         throw new ErrorResponse({
//           statusCode: 400,
//           success: false,
//           message: "Category, label, and value are required",
//         });
//       }

//       const condition = new PatientMedicalConditions({
//         category,
//         patientId: new Types.ObjectId(patientId),
//         label,
//         value,
//       });

//       await condition.save();

//       res.status(201).json(
//         new ApiResponse({
//           statusCode: 201,
//           message: "Medical condition added successfully",
//           result: condition.toObject(),
//         })
//       );
//     } catch (error) {
//       if (error instanceof ErrorResponse) {
//         throw error;
//       }
//       throw new ErrorResponse({
//         statusCode: 500,
//         success: false,
//         message: "Failed to add medical condition",
//         details: error,
//       });
//     }
//   }

//   /**
//    * Get all medical conditions for a patient
//    * GET /patients/:patientId/medical-conditions
//    */
//   public async getPatientMedicalConditions(
//     req: Request,
//     res: Response
//   ): Promise<void> {
//     try {
//       const { patientId } = req.params;
//       await this.validatePatientExists(patientId);

//       const conditions = await PatientMedicalConditions.find({
//         patientId: new Types.ObjectId(patientId),
//       })
//         .sort({ createdAt: -1 })
//         .lean();

//       res.status(200).json(
//         new ApiResponse({
//           statusCode: 200,
//           message: "Medical conditions retrieved successfully",
//           result: conditions,
//         })
//       );
//     } catch (error) {
//       if (error instanceof ErrorResponse) {
//         throw error;
//       }
//       throw new ErrorResponse({
//         statusCode: 500,
//         success: false,
//         message: "Failed to retrieve medical conditions",
//         details: error,
//       });
//     }
//   }

//   /**
//    * Update medical condition
//    * PUT /patients/:patientId/medical-conditions/:id
//    */
//   public async updateMedicalCondition(
//     req: Request,
//     res: Response
//   ): Promise<void> {
//     try {
//       const { patientId, id } = req.params;
//       await this.validatePatientExists(patientId);
//       const updateData = req.body;

//       if (!Types.ObjectId.isValid(id)) {
//         throw new ErrorResponse({
//           statusCode: 400,
//           success: false,
//           message: "Invalid medical condition ID",
//         });
//       }

//       // Remove fields that shouldn't be updated
//       delete updateData._id;
//       delete updateData.patientId;
//       delete updateData.createdAt;
//       delete updateData.updatedAt;

//       const condition = await PatientMedicalConditions.findOneAndUpdate(
//         {
//           _id: new Types.ObjectId(id),
//           patientId: new Types.ObjectId(patientId),
//         },
//         { $set: updateData },
//         { new: true, runValidators: true }
//       ).lean();

//       if (!condition) {
//         throw new ErrorResponse({
//           statusCode: 404,
//           success: false,
//           message: "Medical condition not found",
//         });
//       }

//       res.status(200).json(
//         new ApiResponse({
//           statusCode: 200,
//           message: "Medical condition updated successfully",
//           result: condition,
//         })
//       );
//     } catch (error) {
//       if (error instanceof ErrorResponse) {
//         throw error;
//       }
//       throw new ErrorResponse({
//         statusCode: 500,
//         success: false,
//         message: "Failed to update medical condition",
//         details: error,
//       });
//     }
//   }

//   /**
//    * Delete medical condition
//    * DELETE /patients/:patientId/medical-conditions/:id
//    */
//   public async deleteMedicalCondition(
//     req: Request,
//     res: Response
//   ): Promise<void> {
//     try {
//       const { patientId, id } = req.params;
//       await this.validatePatientExists(patientId);

//       if (!Types.ObjectId.isValid(id)) {
//         throw new ErrorResponse({
//           statusCode: 400,
//           success: false,
//           message: "Invalid medical condition ID",
//         });
//       }

//       const condition = await PatientMedicalConditions.findOneAndDelete({
//         _id: new Types.ObjectId(id),
//         patientId: new Types.ObjectId(patientId),
//       });

//       if (!condition) {
//         throw new ErrorResponse({
//           statusCode: 404,
//           success: false,
//           message: "Medical condition not found",
//         });
//       }

//       res.status(200).json(
//         new ApiResponse({
//           statusCode: 200,
//           message: "Medical condition deleted successfully",
//         })
//       );
//     } catch (error) {
//       if (error instanceof ErrorResponse) {
//         throw error;
//       }
//       throw new ErrorResponse({
//         statusCode: 500,
//         success: false,
//         message: "Failed to delete medical condition",
//         details: error,
//       });
//     }
//   }

//   // ==================== User Goals Routes ====================

//   /**
//    * Add user goal for a patient
//    * POST /patients/:patientId/goals
//    */
//   public async addUserGoal(req: Request, res: Response): Promise<void> {
//     try {
//       const providerId = this.getProviderId(req);
//       const { patientId } = req.params;
//       await this.validatePatientExists(patientId);
//       const { category, value } = req.body;

//       if (!category || !value || !Array.isArray(value) || value.length === 0) {
//         throw new ErrorResponse({
//           statusCode: 400,
//           success: false,
//           message: "Category and value (non-empty array) are required",
//         });
//       }

//       // Validate category
//       const validCategories = ["medication", "general", "diet"];
//       if (!validCategories.includes(category)) {
//         throw new ErrorResponse({
//           statusCode: 400,
//           success: false,
//           message: `Category must be one of: ${validCategories.join(", ")}`,
//         });
//       }

//       const goal = new UserGoals({
//         healthProviderId: providerId,
//         patientId: new Types.ObjectId(patientId),
//         category,
//         value,
//       });

//       await goal.save();

//       const goalData = await UserGoals.findById(goal._id)
//         .populate("healthProviderId", "name email")
//         .populate("patientId", "fullname email")
//         .lean();

//       res.status(201).json(
//         new ApiResponse({
//           statusCode: 201,
//           message: "User goal added successfully",
//           result: goalData,
//         })
//       );
//     } catch (error) {
//       if (error instanceof ErrorResponse) {
//         throw error;
//       }
//       throw new ErrorResponse({
//         statusCode: 500,
//         success: false,
//         message: "Failed to add user goal",
//         details: error,
//       });
//     }
//   }

//   /**
//    * Get all goals for a patient
//    * GET /patients/:patientId/goals
//    */
//   public async getPatientGoals(req: Request, res: Response): Promise<void> {
//     try {
//       const { patientId } = req.params;
//       await this.validatePatientExists(patientId);

//       const goals = await UserGoals.find({
//         patientId: new Types.ObjectId(patientId),
//       })
//         .populate("healthProviderId", "name email")
//         .sort({ createdAt: -1 })
//         .lean();

//       res.status(200).json(
//         new ApiResponse({
//           statusCode: 200,
//           message: "User goals retrieved successfully",
//           result: goals,
//         })
//       );
//     } catch (error) {
//       if (error instanceof ErrorResponse) {
//         throw error;
//       }
//       throw new ErrorResponse({
//         statusCode: 500,
//         success: false,
//         message: "Failed to retrieve user goals",
//         details: error,
//       });
//     }
//   }

//   /**
//    * Update user goal
//    * PUT /patients/:patientId/goals/:id
//    */
//   public async updateUserGoal(req: Request, res: Response): Promise<void> {
//     try {
//       const { patientId, id } = req.params;
//       await this.validatePatientExists(patientId);
//       const updateData = req.body;

//       if (!Types.ObjectId.isValid(id)) {
//         throw new ErrorResponse({
//           statusCode: 400,
//           success: false,
//           message: "Invalid user goal ID",
//         });
//       }

//       // Remove fields that shouldn't be updated
//       delete updateData._id;
//       delete updateData.patientId;
//       delete updateData.healthProviderId;
//       delete updateData.createdAt;
//       delete updateData.updatedAt;

//       // Validate category if provided
//       if (updateData.category) {
//         const validCategories = ["medication", "general", "diet"];
//         if (!validCategories.includes(updateData.category)) {
//           throw new ErrorResponse({
//             statusCode: 400,
//             success: false,
//             message: `Category must be one of: ${validCategories.join(", ")}`,
//           });
//         }
//       }

//       const goal = await UserGoals.findOneAndUpdate(
//         {
//           _id: new Types.ObjectId(id),
//           patientId: new Types.ObjectId(patientId),
//         },
//         { $set: updateData },
//         { new: true, runValidators: true }
//       )
//         .populate("healthProviderId", "name email")
//         .populate("patientId", "fullname email")
//         .lean();

//       if (!goal) {
//         throw new ErrorResponse({
//           statusCode: 404,
//           success: false,
//           message: "User goal not found",
//         });
//       }

//       res.status(200).json(
//         new ApiResponse({
//           statusCode: 200,
//           message: "User goal updated successfully",
//           result: goal,
//         })
//       );
//     } catch (error) {
//       if (error instanceof ErrorResponse) {
//         throw error;
//       }
//       throw new ErrorResponse({
//         statusCode: 500,
//         success: false,
//         message: "Failed to update user goal",
//         details: error,
//       });
//     }
//   }

//   /**
//    * Delete user goal
//    * DELETE /patients/:patientId/goals/:id
//    */
//   public async deleteUserGoal(req: Request, res: Response): Promise<void> {
//     try {
//       const { patientId, id } = req.params;
//       await this.validatePatientExists(patientId);

//       if (!Types.ObjectId.isValid(id)) {
//         throw new ErrorResponse({
//           statusCode: 400,
//           success: false,
//           message: "Invalid user goal ID",
//         });
//       }

//       const goal = await UserGoals.findOneAndDelete({
//         _id: new Types.ObjectId(id),
//         patientId: new Types.ObjectId(patientId),
//       });

//       if (!goal) {
//         throw new ErrorResponse({
//           statusCode: 404,
//           success: false,
//           message: "User goal not found",
//         });
//       }

//       res.status(200).json(
//         new ApiResponse({
//           statusCode: 200,
//           message: "User goal deleted successfully",
//         })
//       );
//     } catch (error) {
//       if (error instanceof ErrorResponse) {
//         throw error;
//       }
//       throw new ErrorResponse({
//         statusCode: 500,
//         success: false,
//         message: "Failed to delete user goal",
//         details: error,
//       });
//     }
//   }
// }

// export default Controller;

import { type Request, type Response } from "express";
import { Types } from "mongoose";
import { ApiResponse, ErrorResponse } from "../../lib/api.helper";
import {
  Patient,
  IPatient,
  HealthProvider,
  IHealthProvider,
  PatientMedicalConditions,
  IPatientMedicalConditions,
  UserGoals,
  IUserGoals,
} from "../../models";
import bcrypt from "bcryptjs";

// Extend Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    userType?: string;
  };
}

/**
 * Hash password utility
 */
async function hashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Failed to hash password");
  }
}

class Controller {
  /**
   * Helper method to get provider ID from request
   * Assumes req.user is set by passport authentication
   */
  private getProviderId(req: Request): Types.ObjectId {
    const authReq = req as AuthenticatedRequest;
    if (authReq.user?.id) {
      return new Types.ObjectId(authReq.user.id);
    }
    // For proxy requests, check query params or body
    const providerId =
      (req.query.providerId as string) || (req.body.providerId as string);
    if (providerId) {
      return new Types.ObjectId(providerId);
    }
    throw new ErrorResponse({
      statusCode: 401,
      success: false,
      message: "Provider ID not found. Authentication required.",
    });
  }

  /**
   * Helper method to validate patient exists
   */
  private async validatePatientExists(patientId: string): Promise<IPatient> {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new ErrorResponse({
        statusCode: 400,
        success: false,
        message: "Invalid patient ID",
      });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new ErrorResponse({
        statusCode: 404,
        success: false,
        message: "Patient not found",
      });
    }
    return patient;
  }

  // ==================== Patient Management Routes ====================

  /**
   * Get all patients
   * GET /patients
   */
  public async getAllPatients(req: Request, res: Response): Promise<void> {
    try {
      const providerId = this.getProviderId(req);

      // Get all patients, optionally filter by provider
      const patients = await Patient.find({ healthProviderId: providerId })
        .select("-password")
        .populate("healthProviderId", "name email")
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Patients retrieved successfully",
          result: patients,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to retrieve patients",
        details: error,
      });
    }
  }

  /**
   * Get patient by ID
   * GET /patients/:id
   */
  public async getPatientById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const patient = await this.validatePatientExists(id!);

      const patientData = await Patient.findById(id)
        .select("-password")
        .populate(
          "healthProviderId",
          "name email phone address city state pincode country"
        )
        .lean();

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Patient retrieved successfully",
          result: patientData,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to retrieve patient",
        details: error,
      });
    }
  }

  /**
   * Update patient information
   * PUT /patients/:id
   */
  public async updatePatient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.validatePatientExists(id!);
      const updateData = req.body;

      // Remove fields that shouldn't be updated directly
      delete updateData._id;
      delete updateData.id;
      delete updateData.password; // Password should be updated via separate endpoint
      delete updateData.createdAt;
      delete updateData.updatedAt;

      const patient = await Patient.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      )
        .select("-password")
        .lean();

      if (!patient) {
        throw new ErrorResponse({
          statusCode: 404,
          success: false,
          message: "Patient not found",
        });
      }

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Patient updated successfully",
          result: patient,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to update patient",
        details: error,
      });
    }
  }

  /**
   * Invite patient (create patient account)
   * POST /patients/invite
   */
  public async invitePatient(req: Request, res: Response): Promise<void> {
    try {
      const providerId = this.getProviderId(req);
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
      } = req.body;

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
      const existingPatient = await Patient.findOne({ email });
      if (existingPatient) {
        throw new ErrorResponse({
          statusCode: 400,
          message: "Patient already exists with this email",
          success: false,
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create new patient with provider ID
      const newPatient = new Patient({
        fullname,
        email,
        password: hashedPassword,
        phone,
        address,
        city,
        state,
        pincode,
        country,
        healthProviderId: providerId,
      });

      const savedPatient = await newPatient.save();

      // Return patient data without password
      const patientData = await Patient.findById(savedPatient._id)
        .select("-password")
        .populate("healthProviderId", "name email")
        .lean();

      res.status(201).json(
        new ApiResponse({
          statusCode: 201,
          message: "Patient invited successfully",
          result: patientData,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to invite patient",
        details: error,
      });
    }
  }

  // ==================== Medical Conditions Routes ====================

  /**
   * Add medical condition for a patient
   * POST /patients/:patientId/medical-conditions
   */
  public async addMedicalCondition(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      await this.validatePatientExists(patientId!);
      const { category, label, value } = req.body;

      if (!category || !label || !value) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Category, label, and value are required",
        });
      }

      const condition = new PatientMedicalConditions({
        category,
        patientId: new Types.ObjectId(patientId),
        label,
        value,
      });

      await condition.save();

      res.status(201).json(
        new ApiResponse({
          statusCode: 201,
          message: "Medical condition added successfully",
          result: condition.toObject(),
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to add medical condition",
        details: error,
      });
    }
  }

  /**
   * Get all medical conditions for a patient
   * GET /patients/:patientId/medical-conditions
   */
  public async getPatientMedicalConditions(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { patientId } = req.params;
      await this.validatePatientExists(patientId!);

      const conditions = await PatientMedicalConditions.find({
        patientId: new Types.ObjectId(patientId),
      })
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Medical conditions retrieved successfully",
          result: conditions,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to retrieve medical conditions",
        details: error,
      });
    }
  }

  /**
   * Update medical condition
   * PUT /patients/:patientId/medical-conditions/:id
   */
  public async updateMedicalCondition(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { patientId, id } = req.params;
      await this.validatePatientExists(patientId!);
      const updateData = req.body;

      if (!Types.ObjectId.isValid(id!)) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Invalid medical condition ID",
        });
      }

      // Remove fields that shouldn't be updated
      delete updateData._id;
      delete updateData.patientId;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      const condition = await PatientMedicalConditions.findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          patientId: new Types.ObjectId(patientId),
        },
        { $set: updateData },
        { new: true, runValidators: true }
      ).lean();

      if (!condition) {
        throw new ErrorResponse({
          statusCode: 404,
          success: false,
          message: "Medical condition not found",
        });
      }

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Medical condition updated successfully",
          result: condition,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to update medical condition",
        details: error,
      });
    }
  }

  /**
   * Delete medical condition
   * DELETE /patients/:patientId/medical-conditions/:id
   */
  public async deleteMedicalCondition(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { patientId, id } = req.params;
      await this.validatePatientExists(patientId!);

      if (!Types.ObjectId.isValid(id!)) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Invalid medical condition ID",
        });
      }

      const condition = await PatientMedicalConditions.findOneAndDelete({
        _id: new Types.ObjectId(id),
        patientId: new Types.ObjectId(patientId),
      });

      if (!condition) {
        throw new ErrorResponse({
          statusCode: 404,
          success: false,
          message: "Medical condition not found",
        });
      }

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Medical condition deleted successfully",
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to delete medical condition",
        details: error,
      });
    }
  }

  // ==================== User Goals Routes ====================

  /**
   * Add user goal for a patient
   * POST /patients/:patientId/goals
   */
  public async addUserGoal(req: Request, res: Response): Promise<void> {
    try {
      const providerId = this.getProviderId(req);
      const { patientId } = req.params;
      await this.validatePatientExists(patientId!);
      const { category, value } = req.body;

      if (!category || !value || !Array.isArray(value) || value.length === 0) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Category and value (non-empty array) are required",
        });
      }

      // Validate category
      const validCategories = ["medication", "general", "diet"];
      if (!validCategories.includes(category)) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: `Category must be one of: ${validCategories.join(", ")}`,
        });
      }

      const goal = new UserGoals({
        healthProviderId: providerId,
        patientId: new Types.ObjectId(patientId),
        category,
        value,
      });

      await goal.save();

      const goalData = await UserGoals.findById(goal._id)
        .populate("healthProviderId", "name email")
        .populate("patientId", "fullname email")
        .lean();

      res.status(201).json(
        new ApiResponse({
          statusCode: 201,
          message: "User goal added successfully",
          result: goalData,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to add user goal",
        details: error,
      });
    }
  }

  /**
   * Get all goals for a patient
   * GET /patients/:patientId/goals
   */
  public async getPatientGoals(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      await this.validatePatientExists(patientId!);

      const goals = await UserGoals.find({
        patientId: new Types.ObjectId(patientId),
      })
        .populate("healthProviderId", "name email")
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "User goals retrieved successfully",
          result: goals,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to retrieve user goals",
        details: error,
      });
    }
  }

  /**
   * Update user goal
   * PUT /patients/:patientId/goals/:id
   */
  public async updateUserGoal(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, id } = req.params;
      await this.validatePatientExists(patientId!);
      const updateData = req.body;

      if (!Types.ObjectId.isValid(id!)) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Invalid user goal ID",
        });
      }

      // Remove fields that shouldn't be updated
      delete updateData._id;
      delete updateData.patientId;
      delete updateData.healthProviderId;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      // Validate category if provided
      if (updateData.category) {
        const validCategories = ["medication", "general", "diet"];
        if (!validCategories.includes(updateData.category)) {
          throw new ErrorResponse({
            statusCode: 400,
            success: false,
            message: `Category must be one of: ${validCategories.join(", ")}`,
          });
        }
      }

      const goal = await UserGoals.findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          patientId: new Types.ObjectId(patientId),
        },
        { $set: updateData },
        { new: true, runValidators: true }
      )
        .populate("healthProviderId", "name email")
        .populate("patientId", "fullname email")
        .lean();

      if (!goal) {
        throw new ErrorResponse({
          statusCode: 404,
          success: false,
          message: "User goal not found",
        });
      }

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "User goal updated successfully",
          result: goal,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to update user goal",
        details: error,
      });
    }
  }

  /**
   * Delete user goal
   * DELETE /patients/:patientId/goals/:id
   */
  public async deleteUserGoal(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, id } = req.params;
      await this.validatePatientExists(patientId!);

      if (!Types.ObjectId.isValid(id!)) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Invalid user goal ID",
        });
      }

      const goal = await UserGoals.findOneAndDelete({
        _id: new Types.ObjectId(id),
        patientId: new Types.ObjectId(patientId),
      });

      if (!goal) {
        throw new ErrorResponse({
          statusCode: 404,
          success: false,
          message: "User goal not found",
        });
      }

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "User goal deleted successfully",
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to delete user goal",
        details: error,
      });
    }
  }
}

export default Controller;
