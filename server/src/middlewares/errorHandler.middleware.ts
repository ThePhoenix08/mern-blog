import { NextFunction, Request, Response } from "express";
import { logger } from "@middlewares/logger.middleware";
import ApiError from "@utils/ApiError.util";
import ENV_VARIABLES from "@constants";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  const NODE_ENV = ENV_VARIABLES.nodeEnv;

  // known error
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: err.success || false,
      errorType: err.errorType,
      message: err.message,

      ...(NODE_ENV && {
        data: err.data,
        errors: err.errors,
      }),
    });
    next();
    return;
  }

  // unknown error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    errorType: "UnknownError",
    message: "Internal server error",
    ...(NODE_ENV && { stack: err.stack }),
  });

  next(err);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(err);
};
