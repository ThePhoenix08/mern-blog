import { z } from "zod";

const idSchema = z.object({
  id: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: "Invalid ObjectId format",
  }),
});

const paginationSchema = z.object({
  page: z.number().min(1).max(100).default(1),
  limit: z.number().min(1).max(100).default(10),
});

const deleteManySchema = z.object({
  ids: z.array(idSchema.shape.id).min(1).max(100),
});

export { idSchema, paginationSchema, deleteManySchema };
