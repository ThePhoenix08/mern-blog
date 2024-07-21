import { z } from "zod";
import { idSchema } from "./blog.validator";

const updateUserRoleSchema = z.object({
  userId: idSchema.shape.id,
  role: z.enum(["user", "blogger"]),
});

const moderateBlogSchema = z.object({
  blogId: idSchema.shape.id,
  action: z.enum(["approve", "reject", "flag"]),
  reason: z.string().min(1, "Reason is required").optional(),
});

const moderateCommentSchema = z.object({
  commentId: idSchema.shape.id,
  action: z.enum(["approve", "reject", "flag"]),
  reason: z.string().min(1, "Reason is required").optional(),
});

const moderateUserSchema = z.object({
  userId: idSchema.shape.id,
  action: z.enum(["ban", "unban"]),
});

export {
  updateUserRoleSchema,
  moderateBlogSchema,
  moderateCommentSchema,
  moderateUserSchema,
};
