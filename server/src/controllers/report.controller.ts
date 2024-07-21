import { Response } from "express";
import Blog from "models/blog.model";
import User from "models/user.model";
import AuthRequest from "types/express";
import ApiError from "utils/ApiError.util";
import ApiResponse from "utils/ApiResponse.util";
import asyncHandler from "utils/asyncHandler.util";
import {
  createReportSchema,
  deleteReportsSchema,
  getReportsSchema,
} from "validators/report.validator";
import Comment from "models/comment.model";
import Report from "models/report.model";

const createReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
  validate request body
  get reportedBy - check if user exists
  get target and targetType - check if target exists
  create report
  return success response
  */

  const result = createReportSchema.safeParse(req.body);
  if (!result.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const reportData = result.data;

  const reportedBy = await User.findById(reportData.reportedBy);
  if (!reportedBy) throw new ApiError(404, "Reporting user not found");

  const target = await (reportData.targetType === "blog"
    ? Blog.findById(reportData.target)
    : Comment.findById(reportData.target));
  if (!target)
    throw new ApiError(404, `Target ${reportData.targetType} not found`);

  const report = Report.create({
    ...reportData,
    reportedBy: reportedBy._id,
    target: target._id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, report, "Report created successfully."));
});

const getReports = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
  validate request params - get page and limit
  get reports
  return reports
  */

  const result = getReportsSchema.safeParse(req.query);
  if (!result.success)
    throw new ApiError(400, "Validation Error: Invalid request body");

  const page = result.data?.page || 1;
  const limit = result.data?.limit || 10;
  const skip = (page - 1) * limit;

  const Reports = await Report.find({}).skip(skip).limit(limit);

  const total = await Report.countDocuments({});

  const returnedReports: Object[] = Reports.map((report) => report.toObject());

  res.status(200).json(
    new ApiResponse(
      200,
      {
        returnedReports,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Blogs fetched successfully."
    )
  );

  const reports = await Report.find({});
  if (!reports) throw new ApiError(404, "No reports found");

  res
    .status(200)
    .json(new ApiResponse(200, reports, "Reports fetched successfully."));
});

const deleteReports = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
  validate request params - get ids
  get userId
  delete reports
  return success response
  */

  const result = deleteReportsSchema.safeParse(req.body);
  if (!result.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const reportData = result.data;

  if (!req.user) throw new ApiError(401, "Unauthorized: No user found");
  const userId = req.user._id;

  const reports = await Report.find({
    _id: { $in: reportData.ids },
  });
  if (!reports) throw new ApiError(404, "No reports found");

  const deletedReports = await Report.deleteMany({
    _id: { $in: reportData.ids },
  });
  if (!deletedReports) throw new ApiError(404, "No reports found");

  res
    .status(200)
    .json(
      new ApiResponse(200, deletedReports, "Reports deleted successfully.")
    );
});

export { createReport, getReports, deleteReports };
