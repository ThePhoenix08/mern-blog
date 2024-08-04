import { z } from "zod";
import { idSchema } from "./blog.validator";
import { deleteManySchema, paginationSchema } from "./common.validator";

const getNotifsSchema = paginationSchema.extend({
  unread: z.boolean().default(false),
});

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

const deleteNotifSchema = deleteManySchema;

export { getNotifsSchema, deleteNotifSchema, notifSchema };
