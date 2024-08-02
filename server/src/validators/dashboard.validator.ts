import { z } from "zod";

const getAnalyticsOptionsSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  interval: z
    .enum(["hourly", "daily", "weekly", "monthly", "yearly"])
    .optional(),
  format: z.enum(["lineGraph", "barGraph", "pieGraph"]).optional(),
});

const commonOptions = getAnalyticsOptionsSchema.extend({
  sortOrder: z.enum(["asc", "desc"]),
  limit: z.number().min(1).max(50).optional().default(10),
});

const getTopPerformersOptionsSchema = commonOptions.extend({
  queryChoice: z.discriminatedUnion("name", [
    z.object({
      name: z.literal("topBlogs"),
      model: z.literal("blog"),
      sortFields: z.enum(["views", "comments", "savedBy"]),
    }),
    z.object({
      name: z.literal("topComments"),
      model: z.literal("comment"),
      sortFields: z.enum(["likes"]),
    }),
    z.object({
      name: z.literal("topActiveUsers"),
      model: z.literal("user"),
      sortFields: z.enum(["commentsByMe", "savedBlogs"]),
    }),
    z.object({
      name: z.literal("topBloggers"),
      model: z.literal("blogger"),
      sortFields: z.enum([
        "blogsByMe",
        "totalSavesOfMyBlogs",
        "totalCommentsOnMyBlogs",
        "totalViewsOfMyBlogs",
      ]),
    }),
  ]),
});

const getSpecificAnalyticsSchema = z.object({
  entity: z.enum(["blog", "comment", "user", "blogger"]),
  type: z.enum(["totals", "metricsOverTime", "growthRates"]),
  options: getAnalyticsOptionsSchema,
});

const getBloggerSpecificAnalyticsSchema = z.object({
  entity: z.enum(["blog", "comment", "user"]),
  type: z.enum(["totals", "metricsOverTime", "growthRates", "topPerformers"]),
  options: getAnalyticsOptionsSchema,
  queryChoice: z.discriminatedUnion("name", [
    z.object({
      name: z.literal("topBlogs"),
      model: z.literal("blog"),
      sortFields: z.enum(["views", "comments", "savedBy"]),
    }),
    z.object({
      name: z.literal("topComments"),
      model: z.literal("comment"),
      sortFields: z.enum(["likes"]),
    }),
  ]),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  limit: z.number().min(1).max(50).optional().default(10),
});

export {
  getAnalyticsOptionsSchema,
  getTopPerformersOptionsSchema,
  getSpecificAnalyticsSchema,
  getBloggerSpecificAnalyticsSchema,
};
