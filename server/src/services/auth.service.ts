import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { IUser } from "@models/user.model";
import type AuthRequest from "types/express";
import User from "@models/user.model";
import ApiError from "@utils/ApiError.util";
import ENV_VARIABLES from "../constants";

const checkIfUserExists = async (
  username: string,
  email: string,
  errorCheck: boolean = true
): Promise<IUser> => {
  const user = await User.findOne({ $or: [{ email }, { username }] }).lean();
  if (errorCheck && !user)
    throw ApiError.notFound("User not found", {
      slug: "USER_NOT_FOUND",
    });
  return user as IUser;
};

const checkIfUserIsVerified = async (email: string): Promise<void> => {
  const user = await User.findOne({ email }).lean();
  if (!user)
    throw ApiError.notFound("User not found", {
      slug: "USER_NOT_FOUND",
    });

  // EMAIL VERIFICATION IS DISABLED FOR NOW
  /* if (!user.isEmailVerified)
    throw ApiError.unauthorized("User email not verified", {
      slug: "USER_EMAIL_NOT_VERIFIED",
    }); */
};

// TODO => get rid of any
const checkIfPasswordIsCorrect = async (
  userEnterPassword: string,
  user: IUser
) => {
  const isCorrect = await isPasswordCorrect(user.password, userEnterPassword);
  if (!isCorrect)
    throw ApiError.unauthorized("Password incorrect", {
      slug: "PASSWORD_INCORRECT",
    });
};

const validateRequest = async (req: AuthRequest) => {
  if (!req.cookies && !req.body)
    throw ApiError.badRequest("Request doesnt not provide required data", {
      slug: "REQUEST_INCOMPLETE",
    });
  const { refreshToken } = req.cookies || req.body;
  if (!refreshToken)
    throw ApiError.unauthorized(
      "Unauthorized request, refresh token is missing",
      {
        slug: "UNAUTHORIZED_REQUEST",
      }
    );
  return refreshToken;
};

const validateRefreshToken = async (
  refreshToken: string
): Promise<{
  user: IUser;
  refreshToken: string;
}> => {
  const decodedToken = jwt.verify(
    refreshToken,
    ENV_VARIABLES.refreshTokenSecret as string
  );
  if (!decodedToken || typeof decodedToken !== "object" || !decodedToken._id) {
    throw ApiError.unauthorized("Invalid refresh token, token is invalid", {
      slug: "INVALID_REFRESH_TOKEN",
    });
  }

  const user = await User.findById(decodedToken._id);
  if (!user)
    throw ApiError.notFound("Invalid refresh token, user not found", {
      slug: "USER_NOT_FOUND",
    });

  if (refreshToken !== user.refreshToken) {
    throw ApiError.unauthorized("Refresh token is expired", {
      slug: "REFRESH_TOKEN_EXPIRED",
    });
  }
  return {
    user,
    refreshToken,
  };
};

const generateAccessToken = async (user: IUser): Promise<string> => {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    ENV_VARIABLES.accessTokenSecret as string,
    {
      expiresIn: ENV_VARIABLES.accessTokenExpiry,
    }
  );
};

const generateRefreshToken = async (user: IUser): Promise<string> => {
  return jwt.sign(
    { _id: user._id },
    ENV_VARIABLES.refreshTokenSecret as string,
    {
      expiresIn: ENV_VARIABLES.refreshTokenExpiry,
    }
  );
};

const isPasswordCorrect = async (
  userPassword: string,
  userEnterPassword: string
): Promise<boolean> => {
  return bcrypt.compare(userEnterPassword, userPassword);
};

export {
  checkIfPasswordIsCorrect,
  checkIfUserExists,
  checkIfUserIsVerified,
  generateAccessToken,
  generateRefreshToken,
  validateRefreshToken,
  validateRequest,
};
