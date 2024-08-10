import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import ENV_VARIABLES from "@constants";
import User from "@models/user.model";
import ApiError from "@utils/ApiError.util";
import asyncHandler from "@utils/asyncHandler.util";
import AuthRequest from "../types/express";

export const authenticate = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
      throw ApiError.badRequest(
        "Authentication failed, access token not found.",
        { slug: "ACCESS_TOKEN_NOT_FOUND" }
      );

    try {
      const decodedToken = jwt.verify(
        token,
        ENV_VARIABLES.accessTokenSecret as string
      ) as jwt.JwtPayload;

      if (
        !decodedToken ||
        !decodedToken.exp ||
        Date.now() >= decodedToken.exp * 1000
      ) {
        throw ApiError.unauthorized(
          "Authentication failed, invalid access token: Expired",
          {
            slug: "ACCESS_TOKEN_EXPIRED",
          }
        );
      }

      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );
      if (!user)
        throw ApiError.unauthorized(
          "Authentication failed, invalid access token: User not found",
          {
            slug: "ACCESS_TOKEN_INVALID",
          }
        );

      req.user = user;
      next();
    } catch (error: any) {
      throw ApiError.unauthorized(
        "Authentication failed, invalid or expired access token",
        {
          slug: "ACCESS_TOKEN_INVALID",
        },
        [error]
      );
    }
  }
);

const authoriseRoleClosure = (requiredRole: "user" | "blogger" | "admin") => {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      throw ApiError.badRequest("Authorization failed: User role undefined", {
        slug: "USER_ROLE_UNDEFINED",
      });
    }

    const roleHierarchy = {
      user: 2,
      blogger: 1,
      admin: 0,
    };
    const requestMakerRole: number = roleHierarchy[req.user.role];
    const requiredRoleLevel: number = roleHierarchy[requiredRole];

    if (requestMakerRole > requiredRoleLevel) {
      throw ApiError.forbidden(
        "Authorization failed: Insufficient permissions",
        {
          slug: "INSUFFICIENT_PERMISSIONS",
        }
      );
    }

    next();
  };
};

export const authoriseRole = (role: "user" | "blogger" | "admin") =>
  asyncHandler(authoriseRoleClosure(role));
