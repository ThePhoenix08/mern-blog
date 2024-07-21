import { z } from "zod";

const getAnalyticsSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  type: z.enum(["overview", "posts", "audience"]),
});

export { getAnalyticsSchema };
