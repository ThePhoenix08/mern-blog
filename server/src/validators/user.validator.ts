import { z } from "zod";

const validateBio = z.object({
  bio: z
    .string()
    .min(1, "Bio is invalid")
    .max(150, "Bio cannot be longer than 150 characters"),
});

export { validateBio };
