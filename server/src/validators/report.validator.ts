import { z } from "zod";
import { idSchema } from "./blog.validator";
import { deleteManySchema } from "./common.validator";

const createReportSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  reportedBy: idSchema.shape.id,
  relatedDocs: z.discriminatedUnion("targetType", [
    z.object({
      targetType: z.literal("blog"),
      blog: idSchema.shape.id,
    }),
    z.object({
      targetType: z.literal("comment"),
      comment: idSchema.shape.id,
    }),
    z.object({
      targetType: z.literal("user"),
      user: idSchema.shape.id,
    }),
  ]),
});

const deleteReportsSchema = deleteManySchema;

const resolveReportSchema = z.object({
  reportId: idSchema.shape.id,
  resolution: z.string().min(1, "Resolution is required"),
});

export { createReportSchema, resolveReportSchema, deleteReportsSchema };
