import { z } from "zod";
import { getBlogsSchema, idSchema } from "./blog.validator";
import { paginationSchema } from "./common.validator";

const updateUserRoleSchema = z.object({
  userId: idSchema.shape.id,
  role: z.enum(["user", "blogger"]),
});

const moderateBlogSchema = z.object({
  blogId: idSchema.shape.id,
  action: z.enum(["approve", "reject", "flag"]),
  reason: z.string().min(1, "Reason is required").optional(),
});

const getAllBlogsSchema = getBlogsSchema.extend({
  adminFilters: z.object({
    isPublished: z.boolean().optional(),
    adminStatus: z.enum(["approved", "rejected", "flagged"]).optional(),
  }),
});

const getAllUsersSchema = paginationSchema.extend({
  sort: z
    .object({
      field: z.enum([
        "createdAt",
        "updatedAt",
        "username",
        "email",
        "fullname",
      ]),
      order: z.enum(["asc", "desc"]),
    })
    .optional(),
  searchTerm: z.string().min(1).max(100).optional(),
  filters: z
    .object({
      isVerified: z.boolean().optional(),
      role: z.enum(["user", "blogger"]).optional(),
      username: z.string().optional(),
      email: z.string().optional(),
      fullname: z.string().optional(),
      date: z
        .object({
          startDate: z.coerce.date().optional(),
          endDate: z.coerce.date().optional(),
        })
        .optional(),
    })
    .optional(),
});

const getAllReportsSchema = paginationSchema.extend({
  sort: z
    .object({
      field: z.enum(["createdAt", "updatedAt", "reportedBy", "relatedDocs"]),
      order: z.enum(["asc", "desc"]),
    })
    .optional(),
  searchTerm: z.string().min(1).max(100).optional(),
  filters: z
    .object({
      reportedBy: z.string().optional(),
      relatedDocs: z.string().optional(),
    })
    .optional(),
});

const moderateReportSchema = z.object({
  action: z.enum(["resolve", "dismiss"]),
});

const getAllCommentsSchema = paginationSchema.extend({
  sort: z
    .object({
      field: z.enum(["createdAt", "updatedAt", "author", "blog"]),
      order: z.enum(["asc", "desc"]),
    })
    .optional(),
  searchTerm: z.string().min(1).max(100).optional(),
  filters: z
    .object({
      author: z.string().optional(),
      blog: z.string().optional(),
    })
    .optional(),
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
  moderateReportSchema,
  getAllUsersSchema,
  getAllReportsSchema,
  getAllCommentsSchema,
  getAllBlogsSchema,
};
