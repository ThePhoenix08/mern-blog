import { string, z } from "zod";
import { idSchema } from "./blog.validator";
import { deleteManySchema, paginationSchema } from "./common.validator";

const getNotifsSchema = paginationSchema;

const notifSchema = z.object({
  user: z.string().min(1, "User is required"),
  type: z.enum(["comment", "blog"]),
  relatedItem: z.object({
    comment: idSchema.shape.id.optional(),
    blog: idSchema.shape.id.optional(),
  }),
  content: z.string().min(1, "Content is required"),
  isRead: z.boolean().default(false),
});

const markNotifAsReadSchema = z.object({
  notificationId: idSchema.shape.id,
});

const deleteNotifSchema = deleteManySchema;

export {
  getNotifsSchema,
  markNotifAsReadSchema,
  deleteNotifSchema,
  notifSchema,
};
