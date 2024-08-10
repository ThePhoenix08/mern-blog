import type { Request, Response } from "express";
import type AuthRequest from "types/express";
import type { IUser } from "@models/user.model";

import {
  checkIfPasswordIsCorrect,
  checkIfUserExists,
  checkIfUserIsVerified,
  generateAccessToken,
  generateRefreshToken,
  validateRefreshToken,
  validateRequest,
} from "@services/auth.service";
import {
  createNewDocument,
  getDocumentById,
  getDocumentByQuery,
  getUserFromRequest,
  updateDocumentById,
  validateZodSchema,
} from "@services/common.service";

import { omit } from "@utils/utilFunctions.util";
import ApiError from "@utils/ApiError.util";
import ApiResponse from "@utils/ApiResponse.util";
import asyncHandler from "@utils/asyncHandler.util";

import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@validators/auth.validator";

// BOOKMARK => using { sameSite: true }
const options: {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict";
} = { httpOnly: true, secure: true, sameSite: "strict" };

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  /* steps
  validation
  check if user already exists
  create User object
  check if user created successfully
  filter {password, refreshToken} from Response
  generate access and refresh tokens
  save refresh token into user document
  return success response with cookies */

  const data: Record<string, any> = validateZodSchema(registerSchema, req.body);

  let user = await checkIfUserExists(data.username, data.email, false);
  if (user)
    throw ApiError.conflict("User already exists", {
      slug: "USER_ALREADY_EXISTS",
    });

  user = await createNewDocument<IUser>("user", data);
  user = await getDocumentById<IUser>("user", user._id as string);

  // TODO => Send verification email
  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  user = await updateDocumentById<IUser>("user", user._id as string, {
    refreshToken,
  });
  const newUser = omit(user, ["password", "refreshToken"]);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse({
        statusCode: 200,
        data: newUser,
        message: "User registered successfully",
      })
    );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  /* steps 
  validation
  check if user exists
  check if user is verified
  check if password is correct
  generate access and refresh tokens
  save refresh token into user document
  send response with cookies */

  const data: Record<string, any> = validateZodSchema(loginSchema, req.body);

  let user = await checkIfUserExists(data.username, data.email, true);
  if (!user)
    throw ApiError.notFound("Invalid Credentials, User not found", {
      slug: "USER_NOT_FOUND",
    });

  checkIfUserIsVerified(user.email);
  await checkIfPasswordIsCorrect(data.password, user);

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  user = await updateDocumentById<IUser>("user", user._id as string, {
    refreshToken,
  });
  const returnUser = omit(user, ["password", "refreshToken"]);

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse({
        statusCode: 200,
        data: returnUser,
        message: "User logged in successfully",
      })
    );
});

const handleRefreshUser = asyncHandler(async (req: Request, res: Response) => {
  /* steps 
  validate request
  validate refresh token
  generate access token
  return success response with new accessToken*/

  const clientRefreshToken = await validateRequest(req);
  const { user } = await validateRefreshToken(clientRefreshToken);
  const accessToken = await generateAccessToken(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse({
        statusCode: 200,
        message: "Access Token Refresh",
      })
    );
});

const handleForgetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    /* steps 
    validate request
    get user using credentials
    update user password
    generate access token
    return success response with cookie */

    const data = validateZodSchema(forgetPasswordSchema, req.body);

    let user = await getDocumentByQuery<IUser>("user", {
      email: data.email,
      username: data.username,
    });

    user = await updateDocumentById<IUser>("user", user._id as string, {
      password: data.password,
    });

    const accessToken = await generateAccessToken(user);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse({
          statusCode: 200,
          message: "Password updated successfully",
        })
      );
  }
);

const handleResetPassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    /* steps 
    validate request
    get user from request
    check if password is correct
    update user password
    return success response */

    const data = validateZodSchema(resetPasswordSchema, req.body);

    let user = await getUserFromRequest(req);

    await checkIfPasswordIsCorrect(data.oldPassword, user);

    user = await updateDocumentById<IUser>("user", user._id as string, {
      password: data.newPassword,
    });

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Password updated successfully",
      })
    );
  }
);

const logoutUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps 
    remove refreshToken from db[user]
    clear client side cookies
    return success response */

  let user = await getUserFromRequest(req);

  user = await updateDocumentById<IUser>("user", user._id as string, {
    $unset: { refreshToken: 1 }, // removes refresh token property
  });

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse({
        statusCode: 200,
        message: "User logged out successfully",
      })
    );
});

// TODO => add email verification
const handleVerifyUser = asyncHandler(
  async (_req: AuthRequest, _res: Response) => {}
);

export {
  handleForgetPassword,
  handleRefreshUser,
  handleResetPassword,
  loginUser,
  logoutUser,
  registerUser,
  handleVerifyUser,
};
