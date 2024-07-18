import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@]{8,}$/;
const passwordInvalidMsg =
  "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and can only contain @ as a special character";
const ROLES = ["user", "blogger"] as const;

const registerSchema = z.object({
  username: z.string().min(1, "Username is required").toLowerCase(),
  email: z.string().email("Email is invalid"),
  fullname: z.string().min(1, "Full name is required"),
  password: z.string().regex(passwordRegex, passwordInvalidMsg),
  role: z.enum(ROLES, { message: "Role has to be either USER or BLOGGER" }),
});

const loginSchema = z
  .object({
    username: z.string().min(3, "Username must be atleast 3 chars").optional(),
    email: z.string().email("Email is invalid").optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.email || data.username, {
    message: "Either username or email must be provided",
    path: ["username", "email"],
  });

const forgetPasswordSchema = z.object({
  username: z.string().min(3, "Username must be atleast 3 chars"),
  email: z.string().email("Email is invalid"),
  password: z.string().regex(passwordRegex, passwordInvalidMsg),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().regex(passwordRegex, passwordInvalidMsg),
  oldPassword: z.string().regex(passwordRegex, passwordInvalidMsg),
});

/* const blogCreationSchema = z.object({
  title: z.string().min(1, "Blog Title is required"),
  content: z.string().min(1, "Blog Content is required"),
  slug: z.string().min(1, "Blog slug is required"),
  tags: z.array(z.string()),
  banner: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  links: z.array(z.string().url()).optional(),
  isPublished: z.boolean(),
});

const commentCreationSchema = z.object({
  content: z.string().min(1, "Comment must have content"),
  author: z.string().min(1, "Author is required"),
  blog: z.string().min(1, "Blog is required"),
}); */

export { registerSchema, loginSchema, forgetPasswordSchema, resetPasswordSchema };
