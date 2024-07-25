import { z } from "zod";

const updateSettingsSchema = z.object({
  language: z.enum(["en"]),
  emailNotifications: z.boolean().optional(),
  darkMode: z.boolean().optional(),
  publiclyVisibleInfo: z
    .object({
      email: z.boolean().optional(),
      fullname: z.boolean().optional(),
      savedBlogs: z.boolean().optional(),
      subscribedTo: z.boolean().optional(),
    })
    .optional(),
});

export { updateSettingsSchema };
