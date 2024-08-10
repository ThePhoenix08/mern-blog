import type { IUser } from "../models/user.model";
import type { Request } from "express";
import type { Document } from "mongoose";
import * as multer from "multer";

interface AuthRequest extends Express.Request, Request {
  user?: Document<unknown, {}, IUser> &
    IUser &
    Required<{
      _id: unknown;
    }>;
  files?:
    | Record<string, Express.Multer.File[]>
    | Express.Multer.File[]
    | undefined;
  file?: Express.Multer.File | undefined;
}

export default AuthRequest;
