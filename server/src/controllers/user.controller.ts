import { Response } from "express";
import { IBlogger } from "models/blogger.model";
import { IComment } from "models/comment.model";
import {
  deleteDocumentById,
  deleteDocumentsByQuery,
  getDocumentById,
  getPaginatedDocumentsByQuery,
  getUserFromRequest,
  orphanDocumentsOfModel,
  updateDocumentById,
  validateZodSchema,
} from "services/common.service";
import {
  FileRequest,
  handleRequestFilesUpload,
  handleSingleFileUpload,
  UserWithOptionalBloggerFields,
} from "services/user.service";
import AuthRequest from "types/express";
import { paginationSchema } from "validators/common.validator";
import { updateProfileSchema } from "validators/user.validator";
import { IUser } from "../models/user.model";
import ApiError from "../utils/ApiError.util";
import ApiResponse from "../utils/ApiResponse.util";
import asyncHandler from "../utils/asyncHandler.util";
import { omit } from "../utils/utilFunctions.util";
import { IReport } from "models/report.model";
import { INotif } from "models/notif.model";
import { IBlog } from "models/blog.model";

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    let user: IUser = await getUserFromRequest(req);
    const role = user.role;

    user =
      role === "blogger"
        ? await getDocumentById("blogger", user._id as string)
        : await getDocumentById("user", user._id as string);

    if (!user)
      throw new ApiError({
        message: `${role} not found`,
        errorType: "UserNotFoundError",
      });

    const returnUser: Object = omit(user.toObject(), [
      "refreshToken",
      "password",
    ]);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: returnUser,
        message: `${role} fetched successfully.`,
      })
    );
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = validateZodSchema(updateProfileSchema, req.body);
    let user = await getUserFromRequest(req);
    const isBlogger = user.role === "blogger";

    const modelName = isBlogger ? "blogger" : "user";
    const fullUser = await getDocumentById<UserWithOptionalBloggerFields>(
      modelName,
      user._id as string
    );

    const uploadedFileUrls = await handleRequestFilesUpload(
      req as FileRequest,
      fullUser,
      isBlogger
    );
    if (!uploadedFileUrls)
      throw new ApiError({
        errorType: "UploadError",
        message: "Error while uploading files, recieved null",
      });

    const updatedData = {
      ...data,
      ...(uploadedFileUrls || {}),
    };
    const updatedUser = await updateDocumentById(
      "user",
      fullUser._id as string,
      updatedData
    );

    const returnUser: Object = omit(updatedUser.toObject(), [
      "refreshToken",
      "password",
    ]);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: returnUser,
        message: "User Account details updated successfully.",
      })
    );
  }
);

export const deleteAccount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await getUserFromRequest(req);
    const fullUser = await getDocumentById<UserWithOptionalBloggerFields>(
      "user",
      user._id as string
    );
    const deletedUser = await deleteDocumentById("user", user._id as string);

    const deletedComments = await orphanDocumentsOfModel<IComment>("comment", {
      author: user._id as string,
    });
    const deletedReports = await orphanDocumentsOfModel<IReport>("report", {
      reportedBy: user._id as string,
      relatedDocs: { user: user._id as string },
    });
    const deletedNotifs = await orphanDocumentsOfModel<INotif>("notif", {
      user: user._id as string,
    });

    let deletedBlogs = 0;
    if (fullUser.role === "blogger") {
      deletedBlogs = await orphanDocumentsOfModel<IBlog>("blog", {
        author: user._id as string,
      });
    }

    const returnUser = omit(deletedUser.toObject(), [
      "refreshToken",
      "password",
    ]);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: {
          deletedUser: returnUser,
          deletedComments,
          deletedReports,
          deletedNotifs,
          deletedBlogs,
        },
        message: "User Account deleted successfully.",
      })
    );
  }
);

export const getUserPublicProfile = asyncHandler(async (req, res) => {
  /*   1. Get userId from request params
  2. Fetch public profile data from database
  3. Return success response with public profile data */

  if (!req.params || !req.params.userId) {
    throw new ApiError({
      errorType: "RequestUndefinedError",
      message: "Request undefined",
    });
  }
  const userId = req.params.userId;

  const user = await getDocumentById<IUser>("user", userId);

  const userPublicVisibleInfoPreferences =
    user.userSettings.publiclyVisibleInfo;

  const PropsToOmitPublicly: string[] = [
    "refreshToken",
    "password",
    "userSettings",
    "isEmailVerified",
    "emailVerificationToken",
    "commentsByMe",
    userPublicVisibleInfoPreferences.email ? "email" : "",
    userPublicVisibleInfoPreferences.fullname ? "fullname" : "",
    userPublicVisibleInfoPreferences.savedBlogs ? "savedBlogs" : "",
    userPublicVisibleInfoPreferences.subscribedTo ? "subscribedTo" : "",
  ];

  const returnUser: Object = omit(user.toObject(), PropsToOmitPublicly);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: returnUser,
      message: "User fetched successfully.",
    })
  );
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  // 1. Validate uploaded file
  // 2. Upload file to Cloudinary
  // 3. Update user's avatar URL in database
  // 4. Return success response with updated avatar URL

  const uploadedFileUrl = await handleSingleFileUpload(
    req as FileRequest,
    "avatars"
  );
  if (!uploadedFileUrl)
    throw new ApiError({
      errorType: "UploadError",
      message: "Error while uploading file, recieved null",
    });

  const user = await getUserFromRequest(req);
  const updatedUser = await updateDocumentById("user", user._id as string, {
    avatar: uploadedFileUrl,
  });
  const returnUser = omit(updatedUser.toObject(), ["refreshToken", "password"]);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: returnUser,
      message: "Avatar uploaded successfully.",
    })
  );
});

export const uploadCoverImage = asyncHandler(async (req, res) => {
  // 1. Validate uploaded file
  // 2. Upload file to Cloudinary
  // 3. Update user's coverImage URL in database
  // 4. Return success response with updated coverImage URL

  const uploadedFileUrl = await handleSingleFileUpload(
    req as FileRequest,
    "covers"
  );
  if (!uploadedFileUrl)
    throw new ApiError({
      errorType: "UploadError",
      message: "Error while uploading file, recieved null",
    });

  const user = await getUserFromRequest(req);
  const updatedUser = await updateDocumentById("user", user._id as string, {
    coverImage: uploadedFileUrl,
  });
  const returnUser = omit(updatedUser.toObject(), ["refreshToken", "password"]);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: returnUser,
      message: "Cover image uploaded successfully.",
    })
  );
});

/** /subscribe/:bloggerId POST -> ToggleSubscribeToBlogger */
const toggleSubscribeToBlogger = asyncHandler(async (req, res) => {
  // 1. Get bloggerId from request params
  // 2. Get user id from authenticated request
  // 3. Toggle subscription status in database
  // 4. Return success response with updated subscription status

  if (!req.params || !req.params.bloggerId) {
    throw new ApiError({
      errorType: "RequestUndefinedError",
      message: "Request undefined",
    });
  }

  const user = await getUserFromRequest(req);
  const blogger = await getDocumentById<IBlogger>(
    "blogger",
    req.params.bloggerId
  );

  const updatedUser = await updateDocumentById("user", user._id as string, {
    $push: {
      subscribedTo: blogger._id as string,
    },
  });

  const returnUser = omit(updatedUser.toObject(), ["refreshToken", "password"]);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: returnUser,
      message: "Blogger subscribed successfully.",
    })
  );
});

/** /myComments GET -> getUserComments */
export const getUserComments = asyncHandler(async (req, res) => {
  // 1. Get user id from authenticated request
  // 2. Fetch user's comments from database
  // 3. Implement pagination if needed
  // 4. Return success response with user's comments

  const user = await getUserFromRequest(req);
  const data = validateZodSchema(paginationSchema, req.body);
  const page = data.page || 1;
  const limit = data.limit || 10;

  const {
    documents: comments,
    total,
    pages,
  } = await getPaginatedDocumentsByQuery<IComment>(
    "comment",
    { author: user._id as string },
    page,
    limit
  );

  const returnedComments: Object[] = comments.map((comment) =>
    comment.toObject()
  );

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        returnedComments,
        pagination: { page, limit, total, pages },
      },
      message:
        total == 0
          ? "User has no comments"
          : "User comments fetched successfully.",
    })
  );
});
