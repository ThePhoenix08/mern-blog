import { Request, Response, NextFunction } from "express";
import logger from "./logger.middleware";
import ApiError from "../utils/ApiError.util";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      menubar: err.message,
      errors: err.errors,
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
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
