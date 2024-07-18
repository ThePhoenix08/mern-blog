import { Response } from "express";
import AuthRequest from "types/express";
import { deleteOldUpload, handleFileUpload } from "../utils/cloudinary.util";
import { omit } from "../utils/utilFunctions.util";
import User from "../models/user.model";
import ApiError from "../utils/ApiError.util";
import ApiResponse from "../utils/ApiResponse.util";
import asyncHandler from "../utils/asyncHandler.util";
import { validateBio } from "../validators/user.validator";

const getUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully."));
});

const setUserDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
    validate bio input
    handle avatar file
      get localPath of avatar
      check localPath
      upload on cloudinary
    add result.url to the User
    save user
    return success reponse*/

  const result = validateBio.safeParse(req.body);
  if (!result.success) throw new ApiError(400, "", result.error);
  const { bio } = result.data;

  const avatar_localPath = req.file?.path;
  if (!avatar_localPath) throw new ApiError(400, "Avatar file is required");

  const avatar = await handleFileUpload(avatar_localPath, "avatars");
  if (!avatar)
    throw new ApiError(500, "Error while uploading avatar on cloudinary.");

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, "User not found");

  const oldAvatarUrl = user.avatar;

  user.avatar = avatar;
  user.bio = bio;
  await user.save({ validateModifiedOnly: true });

  const returnUser = omit(user.toObject(), ["refreshToken", "password"]);

  if (oldAvatarUrl) await deleteOldUpload(oldAvatarUrl);

  res
    .status(200)
    .json(new ApiResponse(200, returnUser, "User details added successfully"));
});

const updateAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
    
    return success reponse*/

  res
    .status(200)
    .json(
      new ApiResponse(200, {}, "User Account details updated successfully.")
    );
});

export { getUser, setUserDetails };
