import { Response } from "express";
import { IReport } from "models/report.model";
import {
  checkIfDocumentsExist,
  createNewDocument,
  getUserFromRequest,
  validateZodSchema,
} from "services/common.service";
import AuthRequest from "types/express";
import ApiError from "utils/ApiError.util";
import ApiResponse from "utils/ApiResponse.util";
import asyncHandler from "utils/asyncHandler.util";
import { createReportSchema } from "validators/report.validator";

export const createReport = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = validateZodSchema(createReportSchema, req.body);
    const { _id: userId } = await getUserFromRequest(req);

    if (data.reportedBy !== userId)
      throw new ApiError({
        errorType: "RequestUndefinedError",
        message: "Unsufficient request data, please provide a valid reportedBy",
      });

    const { targetType } = data.relatedDocs;
    const targetId =
      data.relatedDocs[targetType as keyof typeof data.relatedDocs];

    await checkIfDocumentsExist(targetType, [targetId]);

    const report = createNewDocument<IReport>("report", {
      ...data,
      relatedDocs: {
        targetType,
        [targetType]: targetId,
      },
    });

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Report created successfully.",
        data: report,
      })
    );
  }
);