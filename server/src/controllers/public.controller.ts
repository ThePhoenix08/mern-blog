import { Request, Response } from "express";

const healthCheck = async (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
  });
};

export { healthCheck };
