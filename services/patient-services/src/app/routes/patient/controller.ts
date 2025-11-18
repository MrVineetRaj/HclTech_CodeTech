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
  GoalTracking,
  IGoalTracking,
} from "../../models";

// Extend Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    _id?: Types.ObjectId;
    patientId?: string;
  };
}

class Controller {
  /**
   * Helper method to get patient ID from request
   * Assumes req.user is set by passport authentication
   */
  private getPatientId(req: Request): Types.ObjectId {
    const authReq = req as AuthenticatedRequest;
    if (authReq.user?.id) {
      return new Types.ObjectId(authReq.user.id);
    }
    if (authReq.user?._id) {
      const userId = authReq.user._id;
      return userId instanceof Types.ObjectId
        ? userId
        : new Types.ObjectId(String(userId));
    }
    if (authReq.user?.patientId) {
      return new Types.ObjectId(authReq.user.patientId);
    }
    // For development/testing, you can get from query params or body
    const patientId = (req.query.patientId as string) || (req.body.patientId as string);
    if (patientId) {
      return new Types.ObjectId(patientId);
    }
    throw new ErrorResponse({
      statusCode: 401,
      success: false,
      message: "Patient ID not found. Authentication required.",
    });
  }

  // ==================== Patient Profile Routes ====================
  
  public async getPatientProfile(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const patient = await Patient.findById(patientId)
        .populate("healthProviderId", "name email phone address city state pincode country")
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
          message: "Patient profile retrieved successfully",
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
        message: "Failed to retrieve patient profile",
        details: error,
      });
    }
  }

  public async putPatientProfile(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const updateData = req.body;

      // Remove fields that shouldn't be updated directly
      delete updateData._id;
      delete updateData.id;
      delete updateData.password; // Password should be updated via separate endpoint
      delete updateData.healthProviderId; // Health provider should not be changed by patient
      delete updateData.createdAt;
      delete updateData.updatedAt;

      const patient = await Patient.findByIdAndUpdate(
        patientId,
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
          message: "Patient profile updated successfully",
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
        message: "Failed to update patient profile",
        details: error,
      });
    }
  }


  public async getHealthProvider(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const patient = await Patient.findById(patientId).select("healthProviderId");

      if (!patient) {
        throw new ErrorResponse({
          statusCode: 404,
          success: false,
          message: "Patient not found",
        });
      }

      const healthProvider = await HealthProvider.findById(patient.healthProviderId)
        .select("-password")
        .lean();

      if (!healthProvider) {
        throw new ErrorResponse({
          statusCode: 404,
          success: false,
          message: "Health provider not found",
        });
      }

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Health provider information retrieved successfully",
          result: healthProvider,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to retrieve health provider information",
        details: error,
      });
    }
  }

  // ==================== Medical Conditions Routes ====================

  public async getMedicalConditions(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const conditions = await PatientMedicalConditions.find({ patientId })
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

  public async getMedicalConditionById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const { id } = req.params;

      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Invalid medical condition ID",
        });
      }

      const condition = await PatientMedicalConditions.findOne({
        _id: new Types.ObjectId(id),
        patientId,
      }).lean();

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
          message: "Medical condition retrieved successfully",
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
        message: "Failed to retrieve medical condition",
        details: error,
      });
    }
  }

  public async createMedicalCondition(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
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
        patientId,
        label,
        value,
      });

      await condition.save();

      res.status(201).json(
        new ApiResponse({
          statusCode: 201,
          message: "Medical condition created successfully",
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
        message: "Failed to create medical condition",
        details: error,
      });
    }
  }

  public async updateMedicalCondition(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const { id } = req.params;
      const updateData = req.body;

      if (!id || !Types.ObjectId.isValid(id)) {
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
        { _id: new Types.ObjectId(id), patientId },
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

  public async deleteMedicalCondition(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const { id } = req.params;

      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Invalid medical condition ID",
        });
      }

      const condition = await PatientMedicalConditions.findOneAndDelete({
        _id: new Types.ObjectId(id),
        patientId,
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

  public async getMedicalConditionsByCategory(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const { category } = req.params;

      const conditions = await PatientMedicalConditions.find({
        patientId,
        category,
      })
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: `Medical conditions for category ${category} retrieved successfully`,
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
        message: "Failed to retrieve medical conditions by category",
        details: error,
      });
    }
  }

  // ==================== User Goals Routes ====================

  public async getUserGoals(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const goals = await UserGoals.find({ patientId })
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

  public async getUserGoalById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const { id } = req.params;

      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Invalid user goal ID",
        });
      }

      const goal = await UserGoals.findOne({
        _id: new Types.ObjectId(id),
        patientId,
      })
        .populate("healthProviderId", "name email")
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
          message: "User goal retrieved successfully",
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
        message: "Failed to retrieve user goal",
        details: error,
      });
    }
  }

  public async createUserGoal(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const { healthProviderId, category, value } = req.body;

      if (!healthProviderId || !category || !value || !Array.isArray(value) || value.length === 0) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Health provider ID, category, and value (non-empty array) are required",
        });
      }

      // Validate category
      const validCategories = ["medication", "general", "healthcheckup"];
      if (!validCategories.includes(category)) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: `Category must be one of: ${validCategories.join(", ")}`,
        });
      }

      // Verify health provider exists
      const healthProvider = await HealthProvider.findById(healthProviderId);
      if (!healthProvider) {
        throw new ErrorResponse({
          statusCode: 404,
          success: false,
          message: "Health provider not found",
        });
      }

      const goal = new UserGoals({
        healthProviderId: new Types.ObjectId(healthProviderId),
        patientId,
        category,
        value,
      });

      await goal.save();

      const goalData = await UserGoals.findById(goal._id)
        .populate("healthProviderId", "name email")
        .lean();

      res.status(201).json(
        new ApiResponse({
          statusCode: 201,
          message: "User goal created successfully",
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
        message: "Failed to create user goal",
        details: error,
      });
    }
  }

  public async updateUserGoal(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const { id } = req.params;
      const updateData = req.body;

      if (!id || !Types.ObjectId.isValid(id)) {
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
        const validCategories = ["medication", "general", "healthcheckup"];
        if (!validCategories.includes(updateData.category)) {
          throw new ErrorResponse({
            statusCode: 400,
            success: false,
            message: `Category must be one of: ${validCategories.join(", ")}`,
          });
        }
      }

      const goal = await UserGoals.findOneAndUpdate(
        { _id: new Types.ObjectId(id), patientId },
        { $set: updateData },
        { new: true, runValidators: true }
      )
        .populate("healthProviderId", "name email")
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

  public async deleteUserGoal(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const { id } = req.params;

      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Invalid user goal ID",
        });
      }

      const goal = await UserGoals.findOneAndDelete({
        _id: new Types.ObjectId(id),
        patientId,
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

  public async getUserGoalsByCategory(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const { category } = req.params;

      if (!category) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Category parameter is required",
        });
      }

      const validCategories = ["medication", "general", "healthcheckup"];
      if (!validCategories.includes(category)) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: `Category must be one of: ${validCategories.join(", ")}`,
        });
      }

      const goals = await UserGoals.find({
        patientId,
        category,
      })
        .populate("healthProviderId", "name email")
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: `User goals for category ${category} retrieved successfully`,
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
        message: "Failed to retrieve user goals by category",
        details: error,
      });
    }
  }

  // ==================== Goal Tracking Routes ====================

  public async getGoalTracking(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const trackingRecords = await GoalTracking.find({ userId: patientId })
        .populate("healthProviderId", "name email")
        .populate("goalID", "category value")
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Goal tracking records retrieved successfully",
          result: trackingRecords,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to retrieve goal tracking records",
        details: error,
      });
    }
  }

  public async getGoalTrackingByGoalId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const { goalId } = req.params;

      if (!goalId || !Types.ObjectId.isValid(goalId)) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Invalid goal ID",
        });
      }

      const trackingRecords = await GoalTracking.find({
        userId: patientId,
        goalID: new Types.ObjectId(goalId),
      })
        .populate("healthProviderId", "name email")
        .populate("goalID", "category value")
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Goal tracking records retrieved successfully",
          result: trackingRecords,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to retrieve goal tracking records",
        details: error,
      });
    }
  }

  public async createGoalTracking(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const { healthProviderId, target, goalID, completed } = req.body;

      if (!healthProviderId || !target || !goalID) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Health provider ID, target, and goal ID are required",
        });
      }

      // Verify health provider exists
      const healthProvider = await HealthProvider.findById(healthProviderId);
      if (!healthProvider) {
        throw new ErrorResponse({
          statusCode: 404,
          success: false,
          message: "Health provider not found",
        });
      }

      // Verify goal exists and belongs to patient
      const goal = await UserGoals.findOne({
        _id: new Types.ObjectId(goalID),
        patientId,
      });
      if (!goal) {
        throw new ErrorResponse({
          statusCode: 404,
          success: false,
          message: "User goal not found",
        });
      }

      const tracking = new GoalTracking({
        userId: patientId,
        healthProviderId: new Types.ObjectId(healthProviderId),
        target,
        goalID: new Types.ObjectId(goalID),
        completed: completed || false,
      });

      await tracking.save();

      const trackingData = await GoalTracking.findById(tracking._id)
        .populate("healthProviderId", "name email")
        .populate("goalID", "category value")
        .lean();

      res.status(201).json(
        new ApiResponse({
          statusCode: 201,
          message: "Goal tracking entry created successfully",
          result: trackingData,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to create goal tracking entry",
        details: error,
      });
    }
  }

  public async updateGoalTracking(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const { id } = req.params;
      const updateData = req.body;

      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Invalid goal tracking ID",
        });
      }

      // Remove fields that shouldn't be updated
      delete updateData._id;
      delete updateData.userId;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      const tracking = await GoalTracking.findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: patientId },
        { $set: updateData },
        { new: true, runValidators: true }
      )
        .populate("healthProviderId", "name email")
        .populate("goalID", "category value")
        .lean();

      if (!tracking) {
        throw new ErrorResponse({
          statusCode: 404,
          success: false,
          message: "Goal tracking record not found",
        });
      }

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Goal tracking updated successfully",
          result: tracking,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to update goal tracking",
        details: error,
      });
    }
  }

  public async deleteGoalTracking(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const { id } = req.params;

      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ErrorResponse({
          statusCode: 400,
          success: false,
          message: "Invalid goal tracking ID",
        });
      }

      const tracking = await GoalTracking.findOneAndDelete({
        _id: new Types.ObjectId(id),
        userId: patientId,
      });

      if (!tracking) {
        throw new ErrorResponse({
          statusCode: 404,
          success: false,
          message: "Goal tracking record not found",
        });
      }

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Goal tracking record deleted successfully",
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to delete goal tracking record",
        details: error,
      });
    }
  }

  public async getCompletedGoals(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const trackingRecords = await GoalTracking.find({
        userId: patientId,
        completed: true,
      })
        .populate("healthProviderId", "name email")
        .populate("goalID", "category value")
        .sort({ updatedAt: -1 })
        .lean();

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Completed goals retrieved successfully",
          result: trackingRecords,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to retrieve completed goals",
        details: error,
      });
    }
  }

  public async getPendingGoals(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const patientId = this.getPatientId(req);
      const trackingRecords = await GoalTracking.find({
        userId: patientId,
        completed: false,
      })
        .populate("healthProviderId", "name email")
        .populate("goalID", "category value")
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "Pending goals retrieved successfully",
          result: trackingRecords,
        })
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse({
        statusCode: 500,
        success: false,
        message: "Failed to retrieve pending goals",
        details: error,
      });
    }
  }
}

export default Controller;
