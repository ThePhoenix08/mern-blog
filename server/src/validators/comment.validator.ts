import { z } from "zod";
import { idSchema } from "./blog.validator";

const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  author: idSchema.shape.id,
  blog: idSchema.shape.id,
});

const addCommentSchema = commentSchema;

const updateCommentSchema = commentSchema.pick({ content: true });

const toggleCommentLikeSchema = z.object({
  commentId: idSchema.shape.id,
  like: z.boolean(),
});

export {
  commentSchema,
  addCommentSchema,
  updateCommentSchema,
  toggleCommentLikeSchema,
};
