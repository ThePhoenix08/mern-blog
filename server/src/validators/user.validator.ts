import { z } from "zod";

const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username is too short")
    .max(30, "Username is too long"),
  fullname: z
    .string()
    .min(3, "Fullname is too short")
    .max(30, "Fullname is too long"),
  bio: z
    .string()
    .min(1, "Bio is invalid")
    .max(150, "Bio cannot be longer than 150 characters"),
  socialLinks: z
    .object({
      facebook: z.string().url().optional(),
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
    })
    .optional(),
});

export { updateProfileSchema };
