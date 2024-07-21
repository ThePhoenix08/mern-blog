import { z } from "zod";
import { idSchema } from "./blog.validator";
import { deleteManySchema } from "./common.validator";

const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  author: idSchema.shape.id,
  blog: idSchema.shape.id,
});

const addCommentSchema = commentSchema;

const updateCommentSchema = commentSchema.partial();

const deleteCommentsSchema = deleteManySchema;

const toggleCommentLikeSchema = z.object({
  commentId: idSchema.shape.id,
  like: z.boolean(),
});

export {
  commentSchema,
  addCommentSchema,
  updateCommentSchema,
  deleteCommentsSchema,
  toggleCommentLikeSchema,
};
