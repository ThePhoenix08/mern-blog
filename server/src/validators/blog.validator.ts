import { z } from "zod";
import { deleteManySchema, idSchema, paginationSchema } from "./common.validator";

const blogSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  slug: z.string().min(1).max(100),
  banner: z.string().url(),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  links: z.array(z.string().url()).optional(),
  blogger: z.string(),
  isPublished: z.boolean().optional(),
});

const getBlogsSchema = z.object({
  options: paginationSchema
    .extend({
      sort: z
        .object({
          field: z.enum(["createdAt", "updatedAt", "title", "views", "likes"]),
          order: z.enum(["asc", "desc"]),
        })
        .optional(),
      searchTerm: z.string().min(1).max(100).optional(),
      filters: z
        .object({
          isPublished: z.boolean().optional(),
          tags: z.array(z.string()).optional(),
          blogger: z.string().optional(),
          slug: z.string().optional(),
          date: z
            .object({
              startDate: z.coerce.date().optional(),
              endDate: z.coerce.date().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
});

const createBlogSchema = blogSchema;

const updateBlogSchema = blogSchema.partial();

const deleteBlogsSchema = deleteManySchema;

const uploadManyImagesSchema = z.object({
  files: z.array(z.instanceof(File)),
});

export {
  getBlogsSchema,
  createBlogSchema,
  updateBlogSchema,
  idSchema,
  deleteBlogsSchema,
  uploadManyImagesSchema,
};
