import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.util";
import jwt from "jsonwebtoken";
import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/auth.validator";
import User from "../models/user.model";
import ApiError from "../utils/ApiError.util";
import ApiResponse from "../utils/ApiResponse.util";
import ENV_VARIABLES from "../constants";
import AuthRequest from "types/express";

// BOOKMARK => using { sameSite: true }
const options: {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict";
} = { httpOnly: true, secure: true, sameSite: "strict" };

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  /* steps
  validation - (not empty)(appropriate)(formatter) - zod
  get essentials { username, email, password, fullname, role }
  check if user already exists ?
  create User object - save
  check if user created successfully
  filter {password, refreshToken} from Response 
  return success response with cookies */

  const result = registerSchema.safeParse(req.body);
  if (!result.success) throw new ApiError(400, "", result.error);
  const { username, email, password, fullname, role } = result.data;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) throw new ApiError(409, "User already exists");

  const user = await User.create({ username, password, email, fullname, role });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) throw new ApiError(500, "User registration failed!");

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  /* steps 
  validation - (not empty)(appropriate)(formatter) - zod
  get essentials { email, password }
  check if user exists - get user ?
  check if password is correct
  generate access and refresh tokens
  save refresh token into db
  filter {password, refreshToken} from Response 
  return success response with cookies */

  const result = loginSchema.safeParse(req.body);
  if (!result.success) throw new ApiError(400, "", result.error);
  const { username, email, password } = result.data;

  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) throw new ApiError(404, "User not found");

  const isValidPassword = await user.isPasswordCorrect(password);
  if (!isValidPassword) throw new ApiError(401, "Invalid credentials");

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateModifiedOnly: true });

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {}, "User logged in successfully"));
});

const handleRefreshUser = asyncHandler(async (req: Request, res: Response) => {
  /* steps 
  validation - (not empty)(appropriate)(formatter) - zod
  get refreshToken from request
  verify refresh token using jwt
  decode refresh token to get _id
  get user from db using _id
  compare with refreshToken one stored in db
  return success response with new accessToken*/

  if (!(req.cookies || req.body)) throw new ApiError(400, "Request Undefined");
  const { refreshToken: clientRefreshToken } = req.cookies || req.body;
  if (!clientRefreshToken) throw new ApiError(401, "Unauthorized request");

  const decodedToken = jwt.verify(
    clientRefreshToken,
    ENV_VARIABLES.refreshTokenSecret as string
  );
  if (!decodedToken || typeof decodedToken !== "object" || !decodedToken._id) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decodedToken._id);
  if (!user) throw new ApiError(401, "Invalid refresh token");

  if (clientRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired");
  }

  const accessToken = await user.generateAccessToken();

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, {}, "Access Token Refresh"));
});

const handleForgetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    /* steps 
    get email and username from user
    validate
    check if user exists
    get new password
    save new password
    return success response */

    const result = forgetPasswordSchema.safeParse(req.body);
    if (!result.success) throw new ApiError(400, "", result.error);
    const { username, email, password } = result.data;

    const user = await User.findOne({ $and: [{ email }, { username }] });
    if (!user) throw new ApiError(404, "Invalid credentials, user not found");

    user.password = password;
    await user.save({ validateModifiedOnly: true });

    const accessToken = await user.generateAccessToken();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, {}, "Password updated successfully"));
  }
);

const handleResetPassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    /* steps 
    validate
    get email and username from user
    check if user exists
    get new password
    save new password
    return success response */

    const result = resetPasswordSchema.safeParse(req.body);
    if (!result.success) throw new ApiError(400, "", result.error);
    const { newPassword, oldPassword } = req.body;

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(401, "Invalid Credentials");

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password");

    user.password = newPassword;
    await user.save({ validateModifiedOnly: true });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password updated successfully"));
  }
);

const logoutUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps 
    remove refreshToken from db[user]
    clear client side cookies
    return success response */

  const user = await User.findByIdAndUpdate(req.user?._id, {
    $unset: { refreshToken: 1 }, // removes refresh token property
  });

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export {
  registerUser,
  loginUser,
  handleForgetPassword,
  handleResetPassword,
  handleRefreshUser,
  logoutUser,
};
