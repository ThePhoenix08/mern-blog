import { z } from "zod";

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
  options: z
    .object({
      page: z.number().min(1).max(100).default(1),
      limit: z.number().min(1).max(100).default(10),
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

const idSchema = z.object({
  id: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: "Invalid ObjectId format",
  }),
});

const deleteBlogsSchema = z.object({
  ids: z.array(idSchema.shape.id).min(1).max(100),
});

export {
  getBlogsSchema,
  createBlogSchema,
  updateBlogSchema,
  idSchema,
  deleteBlogsSchema,
};
