import { Response } from "express";
import { IBlog } from "models/blog.model";
import Comment, { IComment } from "models/comment.model";
import { INotif } from "models/notif.model";
import { IReport } from "models/report.model";
import {
  validateZodSchema,
  getDocumentsByQuery,
  getPaginatedDocumentsByQuery,
  ValidationError,
  createNewDocument,
  getUserFromRequest,
  updateDocumentById,
  deleteDocumentsByQuery,
  orphanDocumentsOfModel,
} from "services/common.service";
import AuthRequest from "types/express";
import ApiError from "utils/ApiError.util";
import ApiResponse from "utils/ApiResponse.util";
import asyncHandler from "utils/asyncHandler.util";
import { idSchema } from "validators/blog.validator";
import {
  addCommentSchema,
  updateCommentSchema,
} from "validators/comment.validator";
import { paginationSchema } from "validators/common.validator";

const getComments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: blogId } = validateZodSchema(idSchema, req.params);
  const data = validateZodSchema(paginationSchema, req.query);

  if (!data)
    throw new ValidationError("Validation Error: Invalid request body");

  if (!data.page || !data.limit)
    throw new ApiError({
      errorType: "RequestUndefinedError",
      message: "Unsufficient request data",
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
  const { _id: userId, role } = await getUserFromRequest(req);

  const comment = await updateDocumentById<IComment>(
    "comment",
    commentId,
    data
  );

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: comment,
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
