import { Response } from "express";
import AuthRequest from "types/express";
import { deleteOldUpload, handleFileUpload } from "../utils/cloudinary.util";
import { omit } from "../utils/utilFunctions.util";
import ApiError from "../utils/ApiError.util";
import ApiResponse from "../utils/ApiResponse.util";
import asyncHandler from "../utils/asyncHandler.util";
import { updateBloggerSchema } from "../validators/blogger.validator";
import User from "../models/user.model";

const getBlogger = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
  
  */

  res
    .status(200)
    .json(new ApiResponse(200, req.user, "Blogger fetched successfully."));
});

const updateBlogger = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
  
  */

  res
    .status(200)
    .json(new ApiResponse(200, req.user, "Blogger updated successfully."));
});

const deleteBlogger = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
  
  */

  res
    .status(200)
    .json(new ApiResponse(200, req.user, "Blogger deleted successfully."));
});

export { deleteBlogger, getBlogger, updateBlogger };
