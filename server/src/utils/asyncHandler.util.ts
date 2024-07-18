import { Request, Response, NextFunction } from "express";
import AuthRequest from "types/express";

// takes a function, caLls a async version of it,
// works like a async await try catch wrapper
const asyncHandler =
  (fn: Function) =>
  async (req: Request | AuthRequest, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      const jsonPayload = {
        success: false,
        message: error.message,
        data: error.data || null,
      };
      res.status(error.statusCode || error.code || 500).json(jsonPayload);
    }
  };

export default asyncHandler;

/* const asyncHandler = (requestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
}; */
