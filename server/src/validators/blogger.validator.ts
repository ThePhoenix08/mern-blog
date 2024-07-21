import { z } from "zod";

const updateBloggerSchema = z.object({
  bloggerId: z.string().min(1, "Blogger ID is required"),
  fullname: z.string().min(1, "Fullname is required"),
  bio: z.string().min(1, "Bio is required"),
  socialLinks: z
    .object({
      facebook: z.string().url().optional(),
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
    })
    .optional(),
});

export { updateBloggerSchema };
