import type { Response } from "express";
import type { IBlog } from "@models/blog.model";
import type { IComment } from "@models/comment.model";
import type { IReport } from "@models/report.model";
import type { IUser } from "@models/user.model";
import type AuthRequest from "types/express";

import {
  checkIfActionIsAlreadyTaken,
  formReportSearchQuery,
  formUserSearchQuery,
  getReportsByQuery,
  getUsersByQuery,
} from "@services/admin.service";
import { formSearchQuery, getBlogsByQuery } from "@services/blog.service";
import {
  checkIfDocumentsExist,
  deleteDocumentById,
  getDocumentById,
  sendNotification,
  updateDocumentById,
  validateZodSchema,
} from "@services/common.service";

import ApiError from "@utils/ApiError.util";
import ApiResponse from "@utils/ApiResponse.util";
import asyncHandler from "@utils/asyncHandler.util";
import { omit } from "@utils/utilFunctions.util";

import {
  getAllBlogsSchema,
  getAllReportsSchema,
  getAllUsersSchema,
  moderateBlogSchema,
  moderateCommentSchema,
  moderateReportSchema,
  moderateUserSchema,
  updateUserRoleSchema,
} from "@validators/admin.validator";
import { idSchema } from "@validators/common.validator";

export const getAllUsers = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const options = validateZodSchema(getAllUsersSchema, req.body);
    const { query, sort, skip, limit, page } = await formUserSearchQuery(
      options as Record<string, any>
    );
    const { users, total, pages } = await getUsersByQuery(
      query,
      sort,
      skip,
      limit
    );

    const returnUsers = users.map((user) =>
      omit(user, ["refreshToken", "password"])
    );

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: {
          returnedUsers: returnUsers,
          pagination: { page, limit, total, pages },
        },
        message: "All Users fetched successfully.",
      })
    );
  }
);

export const updateUserRole = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id: userId } = validateZodSchema(idSchema, req.params);
    const { role } = validateZodSchema(updateUserRoleSchema, req.body);

    await checkIfDocumentsExist("user", [userId]);

    const user = await updateDocumentById<IUser>("user", userId, { role });

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: user,
        message: "User role updated successfully.",
      })
    );
  }
);

export const banUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = validateZodSchema(idSchema, req.params);
  const { action } = validateZodSchema(moderateUserSchema, req.body);

  await checkIfDocumentsExist("user", [userId]);

  if (action === "ban") {
    deleteDocumentById("user", userId);
  }

  // TODO => Implement better unban ban logic and new collection for unbans

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {},
      message: "User role updated successfully.",
    })
  );
});

export const getAllBlogs = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const options = validateZodSchema(getAllBlogsSchema, req.body);
    const { query, sort, skip, limit, page } = await formSearchQuery(
      options as Record<string, any>
    );
    const {
      documents: blogs,
      total,
      pages,
    } = await getBlogsByQuery(query, sort, skip, limit);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: {
          returnedBlogs: blogs,
          pagination: { page, limit, total, pages },
        },
        message: "All Blogs fetched successfully.",
      })
    );
  }
);

export const moderateBlog = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id: blogId } = validateZodSchema(idSchema, req.params);
    const { action } = validateZodSchema(moderateBlogSchema, req.body);

    await checkIfDocumentsExist("blog", [blogId]);

    let blog = await getDocumentById<IBlog>("blog", blogId);

    const blogStatus = checkIfActionIsAlreadyTaken<IBlog>(blog, action);

    switch (action) {
      case "approve": {
        blog = await updateDocumentById<IBlog>("blog", blogId, {
          isPublished: true,
          adminStatus: blogStatus,
        });
        break;
      }
      case "reject": {
        blog = await updateDocumentById<IBlog>("blog", blogId, {
          isPublished: false,
          adminStatus: blogStatus,
        });
        break;
      }
      case "flag": {
        blog = await updateDocumentById<IBlog>("blog", blogId, {
          adminStatus: blogStatus,
        });
        break;
      }
      default: {
        throw ApiError.badRequest("Invalid action provided", {
          slug: "ACTION_INVALID",
        });
      }
    }

    // TODO => create and send notification to blogger about moderation
    await sendNotification(blog.blogger.toString(), "", "blog", blogId);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: blog,
        message: "Blog moderated successfully.",
      })
    );
  }
);

export const adminDeleteBlog = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id: blogId } = validateZodSchema(idSchema, req.params);

    await checkIfDocumentsExist("blog", [blogId]);

    await deleteDocumentById("blog", blogId);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Blog deleted successfully.",
      })
    );
  }
);

export const getAllReports = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const options = validateZodSchema(getAllReportsSchema, req.body);
    const { query, sort, skip, limit, page } = await formReportSearchQuery(
      options as Record<string, any>
    );
    const {
      documents: reports,
      total,
      pages,
    } = await getReportsByQuery(query, sort, skip, limit);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: {
          returnedReports: reports,
          pagination: { page, limit, total, pages },
        },
        message: "All Reports fetched successfully.",
      })
    );
  }
);

export const resolveReport = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id: reportId } = validateZodSchema(idSchema, req.params);
    const { action } = validateZodSchema(moderateReportSchema, req.body);

    await checkIfDocumentsExist("report", [reportId]);

    const report = await updateDocumentById<IReport>("report", reportId, {
      status: action === "resolve" ? "resolved" : "dismissed",
    });

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: report,
        message: "Report resolved successfully.",
      })
    );
  }
);

export const deleteReport = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id: reportId } = validateZodSchema(idSchema, req.params);

    await checkIfDocumentsExist("report", [reportId]);

    await deleteDocumentById("report", reportId);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Report deleted successfully.",
      })
    );
  }
);

export const moderateComment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id: commentId } = validateZodSchema(idSchema, req.params);
    const { action } = validateZodSchema(moderateCommentSchema, req.body);

    await checkIfDocumentsExist("comment", [commentId]);

    let comment = await getDocumentById<IComment>("comment", commentId);

    const commentStatus = checkIfActionIsAlreadyTaken<IComment>(
      comment,
      action
    );

    if (["approve", "reject", "flag"].includes(action)) {
      comment = await updateDocumentById<IComment>("blog", commentId, {
        adminStatus: commentStatus,
      });
    } else {
      throw ApiError.badRequest("Invalid action provided", {
        slug: "ACTION_INVALID",
      });
    }

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: comment,
        message: "Comment moderated successfully.",
      })
    );
  }
);

export const adminDeleteComment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id: commentId } = validateZodSchema(idSchema, req.params);

    await checkIfDocumentsExist("comment", [commentId]);

    await deleteDocumentById("comment", commentId);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Comment deleted successfully.",
      })
    );
  }
);
