import { z } from "zod";

const updateSettingsSchema = z.object({
  theme: z.enum(["light", "dark"]),
  language: z.enum(["en"]),
  emailNotifications: z.boolean().optional(),
  darkMode: z.boolean().optional(),
});

export { updateSettingsSchema };
