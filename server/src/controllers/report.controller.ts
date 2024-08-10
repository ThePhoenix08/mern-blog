import type { Response } from "express";
import type { IReport } from "@models/report.model";
import type AuthRequest from "types/express";
import {
  checkIfDocumentsExist,
  createNewDocument,
  getUserFromRequest,
  validateZodSchema,
} from "@services/common.service";
import ApiError from "@utils/ApiError.util";
import ApiResponse from "@utils/ApiResponse.util";
import asyncHandler from "@utils/asyncHandler.util";
import { createReportSchema } from "@validators/report.validator";
import { logger } from "@middlewares/logger.middleware";

export const createReport = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = validateZodSchema(createReportSchema, req.body);
    const { _id: userId } = await getUserFromRequest(req);

    if (data.reportedBy !== userId) {
      logger.warn(`
        Report request made by ${userId}\n
        Reported by ${data.reportedBy}\n
        Request maker and reportedBy are not the same\n
      `);
      throw ApiError.conflict("Request maker and reportedBy are not the same", {
        slug: "REQUEST_FLAWED",
      });
    }

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
