import { IUser } from "../models/user.model";
import * as multer from "multer";
import { Request } from "express";
import { Document } from "mongoose";

interface AuthRequest extends Request {
  user?: Document<unknown, {}, IUser> &
    IUser &
    Required<{
      _id: unknown;
    }>;
  files?:
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | Express.Multer.File[]
    | undefined;
}

export default AuthRequest;
