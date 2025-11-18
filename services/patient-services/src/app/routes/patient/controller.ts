import { type Request, type Response } from "express";
import { ApiResponse, ErrorResponse } from "../../lib/api.helper";

class Controller {
  public async getPatientProfile(
    req: RequestDestination,
    res: Response
  ): Promise<void> {
    // todo
    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Server is up and running",
      })
    );
  }
}

export default Controller;
