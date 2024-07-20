import { Response } from "express";
import Blog from "models/blog.model";
import Comment from "models/comment.model";
import Report from "models/report.model";
import AuthRequest from "types/express";
import { updateBloggerSchema } from "validators/blogger.validator";
import { updateProfileSchema } from "validators/user.validator";
import Blogger, { IBlogger } from "../models/blogger.model";
import User, { IUser } from "../models/user.model";
import ApiError from "../utils/ApiError.util";
import ApiResponse from "../utils/ApiResponse.util";
import asyncHandler from "../utils/asyncHandler.util";
import { deleteOldUpload, handleFileUpload } from "../utils/cloudinary.util";
import { omit } from "../utils/utilFunctions.util";

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user =
      req.user?.role === "blogger"
        ? await Blogger.findById(req.user?._id)
        : await User.findById(req.user?._id);

    if (!user) throw new ApiError(404, `${req.user?.role} not found`);

    const returnUser: Object = omit(user.toObject(), [
      "refreshToken",
      "password",
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          returnUser,
          `${req.user?.role} fetched successfully.`
        )
      );
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // 1. get role
    if (!req.user) throw new ApiError(400, "Unauthenticated Request");
    const isBlogger = req.user.role === "blogger";

    // 2: zod validation
    const updateSchema = isBlogger ? updateBloggerSchema : updateProfileSchema;
    const result = updateSchema.safeParse(req.body);
    if (!result.success) throw new ApiError(400, "", result.error);

    // 3: get model
    const user = isBlogger
      ? await Blogger.findById(req.user?._id)
      : await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, `${req.user?.role} not found`);

    // utility interface and function for uplaoding files
    interface IFile {
      identifier: string;
      path: string;
      url?: string;
      old_url?: string;
    }

    const uploadFiles = async (files: IFile[]): Promise<IFile[]> => {
      for (const file of files) {
        const uploadedFile = await handleFileUpload(file.path, file.identifier);
        if (!uploadedFile)
          throw new ApiError(
            500,
            `Error while uploading ${file.identifier} on cloudinary.`
          );
        file.url = uploadedFile;

        const oldFileUrl = file.old_url;
        if (typeof oldFileUrl === "string") {
          await deleteOldUpload(oldFileUrl);
        }
      }
      return files;
    };

    // 4: upload files
    let files: IFile[] = [];
    /* 
      determine model type
      create files[] of files
      upload files
      save files to model
    */
    if (isBlogger && req.files && !Array.isArray(req.files)) {
      const blogger = user as IBlogger;

      files.push({
        identifier: "avatars",
        path: req.files.avatar[0].path,
        old_url: blogger.avatar,
      });
      files.push({
        identifier: "covers",
        path: req.files.coverImage[0].path,
        old_url: blogger.coverImage,
      });

      files = await uploadFiles(files);

      blogger.avatar = files[0].url;
      blogger.coverImage = files[1].url;
    } else if (!isBlogger && req.file) {
      const normalUser = user as IUser;

      files.push({
        identifier: "avatars",
        path: req.file.path,
        old_url: normalUser.avatar,
      });
      files = await uploadFiles(files);
      normalUser.avatar = files[0].url;
    }

    // 5: assign textual data
    Object.assign(user, req.body);

    // 6. save model
    await user.save({ validateModifiedOnly: true });

    // 7. omit sensitive data
    const returnUser: Object = omit(user.toObject(), [
      "refreshToken",
      "password",
    ]);

    // 8. return successresponse
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          returnUser,
          "User Account details updated successfully."
        )
      );
  }
);

export const deleteAccount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    /* steps
    get user from req.user
    delete user
    delete user's [ comments reports blogs ]
    return success reponse */

    const user = await User.findByIdAndDelete(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    await Comment.deleteMany({ author: user._id });
    await Report.deleteMany({ reportedBy: user._id });

    if (user.role === "blogger") {
      await Blog.deleteMany({ author: user._id });
    }

    res
      .status(200)
      .json(new ApiResponse(200, {}, "User Account deleted successfully."));
  }
);

/** List all users, (Admin only) */
export const getUsers = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    /* steps
    get users from req.user
    return success reponse */

    const users = await User.find();
    if (!users) throw new ApiError(404, "Error while fetching users");

    const returnUsers: Object[] = users.map((user: IUser) =>
      omit(user.toObject(), ["refreshToken", "password"])
    );

    res
      .status(200)
      .json(new ApiResponse(200, returnUsers, "Users fetched successfully."));
  }
);
