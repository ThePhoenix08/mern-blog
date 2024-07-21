import { z } from "zod";
import { idSchema } from "./blog.validator";
import { deleteManySchema } from "./common.validator";

const createReportSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  reportedBy: idSchema.shape.id,
  target: idSchema.shape.id,
  targetType: z.enum(["blog", "comment"]),
});

const deleteReportsSchema = deleteManySchema;

const resolveReportSchema = z.object({
  reportId: idSchema.shape.id,
  resolution: z.string().min(1, "Resolution is required"),
});

export { createReportSchema, resolveReportSchema, deleteReportsSchema };
