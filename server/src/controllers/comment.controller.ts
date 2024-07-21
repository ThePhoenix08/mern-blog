import { Response } from "express";
import Comment from "models/comment.model";
import AuthRequest from "types/express";
import ApiError from "utils/ApiError.util";
import ApiResponse from "utils/ApiResponse.util";
import asyncHandler from "utils/asyncHandler.util";
import { idSchema } from "validators/blog.validator";
import {
  addCommentSchema,
  updateCommentSchema,
} from "validators/comment.validator";

const getComments = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
  validate request params - blogId
  get comments
  return comments
  */

  const result = idSchema.safeParse(req.params.blogId);
  if (!result.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const blogId = result.data.id;

  const comments = await Comment.find({ blog: blogId });
  if (!comments) throw new ApiError(404, "No comments found");

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully."));
});

const addComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
  validate request params - get postId
  get blogId
  validate request body
  get userId
  create comment
  return success response
  */

  const result1 = idSchema.safeParse(req.params.blogId);
  if (!result1.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const blogId = result1.data.id;

  const result2 = addCommentSchema.safeParse(req.body);
  if (!result2.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const commentData = result2.data;

  if (!req.user) throw new ApiError(401, "Unauthorized: No user found");
  const userId = req.user._id;

  const comment = Comment.create({
    ...commentData,
    author: userId,
    blog: blogId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment created successfully."));
});

const updateComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
  validate request params - get id
  validate request body - get update data
  get userId
  update comment
  return success response
  */

  const result1 = idSchema.safeParse(req.params.commentId);
  if (!result1.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const commentId = result1.data.id;

  const result2 = idSchema.safeParse(req.params.blogId);
  if (!result2.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const blogId = result2.data.id;

  const result3 = updateCommentSchema.safeParse(req.body);
  if (!result3.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const updateData = result3.data;

  if (!req.user) throw new ApiError(401, "Unauthorized: No user found");
  const userId = req.user._id;

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, author: userId, blog: blogId },
    updateData,
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );
  if (!comment) throw new ApiError(404, "Comment not found");

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully."));
});

const deleteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
  validate request params - get id
  get userId
  delete comment
  return success response
  */

  const result = idSchema.safeParse(req.params.commentId);
  if (!result.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const commentId = result.data.id;

  const result2 = idSchema.safeParse(req.params.blogId);
  if (!result2.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const blogId = result2.data.id;

  if (!req.user) throw new ApiError(401, "Unauthorized: No user found");
  const userId = req.user._id;

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    author: userId,
    blog: blogId,
  });
  if (!comment) throw new ApiError(404, "Comment not found");

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment deleted successfully."));
});

export { getComments, addComment, updateComment, deleteComment };
