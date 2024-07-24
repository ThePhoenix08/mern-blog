import ENV_VARIABLES from "../constants";
import User, { IUser } from "models/user.model";
import jwt, { Jwt } from "jsonwebtoken";
import ApiError from "utils/ApiError.util";
import AuthRequest from "types/express";

const checkIfUserExists = async (
  username: string,
  email: string,
  errorCheck: boolean = true
): Promise<IUser | undefined> => {
  const user = await User.findOne({ $or: [{ email }, { username }] }).lean();
  if (errorCheck && !user)
    throw new ApiError({
      errorType: "UserNotFoundError",
      message: "User not found",
    });
  return user as IUser | undefined;
};

const checkIfUserIsVerified = async (email: string): Promise<void> => {
  const user = await User.findOne({ email }).lean();
  if (!user)
    throw new ApiError({
      errorType: "UserNotFoundError",
      message: "User not found",
    });
  if (!user.isEmailVerified)
    throw new ApiError({
      errorType: "UserEmailNotVerifiedError",
      message: "User email not verified",
    });
};

// TODO => get rid of any
const checkIfPasswordIsCorrect = async (
  userEnterPassword: string,
  user: IUser
) => {
  const isCorrect = await user.isPasswordCorrect(userEnterPassword);
  if (!isCorrect)
    throw new ApiError({
      errorType: "PasswordIncorrectError",
      message: "Password incorrect",
    });
};

const validateRequest = async (req: AuthRequest) => {
  if (!req.cookies && !req.body)
    throw new ApiError({
      errorType: "RequestUndefinedError",
      message: "Request undefined",
    });
  const { refreshToken } = req.cookies || req.body;
  if (!refreshToken)
    throw new ApiError({
      errorType: "UnauthorizedRequestError",
      message: "Unauthorized request",
    });
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
    throw new ApiError({
      errorType: "InvalidRefreshTokenError",
      message: "Decoded token is invalid",
    });
  }

  const user = await User.findById(decodedToken._id);
  if (!user)
    throw new ApiError({
      errorType: "UserNotFoundError",
      message: "Invalid refresh token, user not found",
    });

  if (refreshToken !== user.refreshToken) {
    throw new ApiError({
      errorType: "TokenExpiredError",
      message: "Refresh token is expired",
    });
  }
  return {
    user,
    refreshToken,
  };
};

export {
  checkIfUserExists,
  checkIfUserIsVerified,
  checkIfPasswordIsCorrect,
  validateRefreshToken,
  validateRequest,
};
