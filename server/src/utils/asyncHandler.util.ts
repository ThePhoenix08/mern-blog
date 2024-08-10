import AuthRequest from "../types/express";
import { Request, Response, NextFunction } from "express";

// takes a function, caLls a async version of it,
// works like a async await try catch wrapper
const asyncHandler = (
  fn: (
    req: AuthRequest | Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: AuthRequest | Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
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
