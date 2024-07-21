import { Request, Response, NextFunction } from "express";
import AuthRequest from "types/express";

// takes a function, caLls a async version of it,
// works like a async await try catch wrapper
const asyncHandler = <T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        errorType: error.errorType,
        errors: error.errors || null,
        data: error.data || null,
      });
      next(error);
    });
  };
};

export default asyncHandler;

/* const asyncHandler = (requestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
}; */
