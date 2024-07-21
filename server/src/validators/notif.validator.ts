import { z } from "zod";
import { idSchema } from "./blog.validator";
import { deleteManySchema, paginationSchema } from "./common.validator";

const getNotifsSchema = paginationSchema;

const markNotifAsReadSchema = z.object({
  notificationId: idSchema.shape.id,
});

const deleteNotifSchema = deleteManySchema;

export { getNotifsSchema, markNotifAsReadSchema, deleteNotifSchema };
