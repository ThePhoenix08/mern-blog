import type { Response } from "express";
import type { IBlog } from "models/blog.model";
import type { IComment } from "models/comment.model";
import type { INotif } from "models/notif.model";
import type { IReport } from "models/report.model";
import type AuthRequest from "types/express";

import {
  validateZodSchema,
  getPaginatedDocumentsByQuery,
  createNewDocument,
  getUserFromRequest,
  updateDocumentById,
  deleteDocumentsByQuery,
  orphanDocumentsOfModel,
  checkIfDocumentsExist,
} from "@services/common.service";

import ApiError from "@utils/ApiError.util";
import ApiResponse from "@utils/ApiResponse.util";
import asyncHandler from "@utils/asyncHandler.util";

import { idSchema } from "@validators/blog.validator";
import {
  addCommentSchema,
  updateCommentSchema,
} from "@validators/comment.validator";
import { paginationSchema } from "@validators/common.validator";

const getComments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: blogId } = validateZodSchema(idSchema, req.params);
  const data = validateZodSchema(paginationSchema, req.body);

  if (!data)
    throw ApiError.validation("Validation Error: Invalid request body", {
      slug: "VALIDATION_ERROR",
    });

  if (!data.page || !data.limit)
    throw ApiError.badRequest("Unsufficient request data", {
      slug: "REQUEST_INCOMPLETE",
    });

  const page = data.page || 1;
  const limit = data.limit || 10;
  const {
    documents: comments,
    total,
    pages,
  } = await getPaginatedDocumentsByQuery<IComment>(
    "comment",
    { blog: blogId },
    page,
    limit
  );

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        returnedComments: comments,
        pagination: { page, limit, total, pages },
      },
      message: "Comments fetched successfully.",
    })
  );
});

const addComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: blogId } = validateZodSchema(idSchema, req.params);
  const data = validateZodSchema(addCommentSchema, req.body);
  const { _id: userId } = await getUserFromRequest(req);

  const comment = await createNewDocument<IComment>("comment", {
    ...data,
    author: userId,
    blog: blogId,
  });

  await updateDocumentById<IBlog>("blog", blogId, {
    totalComments: { $inc: 1 },
    comments: { $push: comment._id },
  });

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: comment,
      message: "Comment created successfully.",
    })
  );
});

const updateComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: commentId } = validateZodSchema(idSchema, req.params);
  const data = validateZodSchema(updateCommentSchema, req.body);
  const { _id: userId } = await getUserFromRequest(req);
  if (!userId)
    throw ApiError.unauthorized("Unauthorized", {
      slug: "UNAUTHORIZED",
    });

  const comments = await checkIfDocumentsExist<IComment>("comment", [
    commentId,
  ]);
  if (!comments || !comments.length || comments.length != 1 || !comments[0])
    throw ApiError.notFound("Comment not found", {
      slug: "COMMENT_NOT_FOUND",
    });

  const comment = comments[0];
  if (comment.author.toString() !== userId.toString())
    throw ApiError.forbidden(
      "Insufficient permissions, you are not allowed to update this comment",
      {
        slug: "INSUFFICIENT_PERMISSIONS",
      }
    );

  const newComment = await updateDocumentById<IComment>(
    "comment",
    commentId,
    data
  );

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: newComment,
      message: "Comment updated successfully.",
    })
  );
});

const deleteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: commentId } = validateZodSchema(idSchema, req.params);
  const { id: blogId } = validateZodSchema(idSchema, req.params);
  const { _id: userId } = await getUserFromRequest(req);

  await deleteDocumentsByQuery<IComment>("comment", {
    _id: commentId,
    author: userId,
    blog: blogId,
  });

  await orphanDocumentsOfModel<IReport>("report", {
    relatedDocs: { comment: commentId },
  });

  await orphanDocumentsOfModel<INotif>("notif", {
    relatedItem: { comment: commentId },
  });

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Comment deleted successfully.",
    })
  );
});

const toggleCommentLike = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id: commentId } = validateZodSchema(idSchema, req.params);
    const { _id: userId } = await getUserFromRequest(req);

    const comment = await updateDocumentById<IComment>("comment", commentId, {
      $push: { likes: userId },
    });

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: comment,
        message: "Comment liked successfully.",
      })
    );
  }
);

export {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
};
