import { z } from "zod";

const updateSettingsSchema = z.object({
  language: z.enum(["en"]),
  emailNotifications: z.boolean().optional(),
  darkMode: z.boolean().optional(),
});

export { updateSettingsSchema };
