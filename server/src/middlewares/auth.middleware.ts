import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.util";
import ApiError from "../utils/ApiError.util";
import ENV_VARIABLES from "../constants";
import User from "../models/user.model";
import AuthRequest from "types/express";

const roleHierarchy: { [key: string]: number } = {
  user: 2,
  blogger: 1,
  admin: 0,
};

export const authenticate = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Authentication required");

    try {
      const decodedToken = jwt.verify(
        token,
        ENV_VARIABLES.accessTokenSecret as string
      ) as jwt.JwtPayload;

      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );
      if (!user) throw new ApiError(401, "Invalid token: User not found");

      req.user = user;
      next();
    } catch (error: any) {
      throw new ApiError(401, "Invalid or expired token", {
        error: error.message,
      });
    }
  }
);

export const authoriseRole = (requiredRole: "user" | "blogger" | "admin") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      throw new ApiError(403, "User role undefined");
    }

    if (roleHierarchy[req.user.role as string] > roleHierarchy[requiredRole]) {
      throw new ApiError(403, "Insufficient permissions");
    }

    next();
  };
};