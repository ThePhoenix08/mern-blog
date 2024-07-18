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

const authMiddleware = (authoriseRole: "user" | "blogger" | "admin" = "user") =>
  asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
      if (!accessToken) throw new ApiError(401, "Unauthorised request");

      const decodedToken = jwt.verify(
        accessToken,
        ENV_VARIABLES.accessTokenSecret as string
      );
      if (
        !decodedToken ||
        typeof decodedToken !== "object" ||
        !decodedToken._id
      ) {
        console.error("Error in decoded token");
        throw new ApiError(401, "Invalid access token");
      }

      if (
        roleHierarchy[decodedToken.role as string] <
        roleHierarchy[authoriseRole]
      ) {
        console.log(
          `Error role underprivelged: ${roleHierarchy[decodedToken.role]} against ${roleHierarchy[authoriseRole]}`
        );
        throw new ApiError(401, "Access Denied to Unauthorised role");
      }

      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );
      if (!user)
        throw new ApiError(401, "Invalid access token, user not found");

      req.user = user;
      next();
    } catch (error: any) {
      console.error("Token verification failed:", error);
      throw new ApiError(401, "Invalid access token", { error: error.message });
    }
  });

export default authMiddleware;
