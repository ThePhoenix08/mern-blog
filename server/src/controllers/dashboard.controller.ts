import asyncHandler from "utils/asyncHandler.util";
import AuthRequest from "types/express";
import { Response } from "express";
import { getUserFromRequest, validateZodSchema } from "services/common.service";
import {
  getAnalyticsOptionsSchema,
  getBloggerSpecificAnalyticsSchema,
  getSpecificAnalyticsSchema,
  getTopPerformersOptionsSchema,
} from "validators/dashboard.validator";
import { AnalyticsOptions, AnalyticsService } from "services/dashboard.service";
import Blog from "models/blog.model";
import Blogger from "models/blogger.model";
import Notif from "models/notif.model";
import User from "models/user.model";
import Comment from "models/comment.model";
import Report from "models/report.model";
import { FilterQuery, Model } from "mongoose";
import ApiResponse from "utils/ApiResponse.util";
import ApiError from "utils/ApiError.util";

/* 
  /dashboard
    /admin
      /overview GET -> getAdminOverview
      /users GET -> getUserAnalytics
      /blogs GET -> getBlogAnalytics
      /comments GET -> getCommentAnalytics
    /blogger
      /overview GET -> getBloggerOverview
      /blogs GET -> getBloggerBlogAnalytics
      /comments GET -> getBloggerCommentAnalytics
*/

const analyticsService = new AnalyticsService();

const populateOptions = (data: any) => {
  const { startDate, endDate, interval, entityId, format } = data;
  const options = {
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    interval:
      (interval as "hourly" | "daily" | "weekly" | "monthly" | "yearly") ||
      "daily",
    entityId: entityId || undefined,
    format: (format as "lineGraph" | "barGraph" | "pieGraph") || "lineGraph",
  };
  return options;
};

const Models = {
  user: User,
  blog: Blog,
  comment: Comment,
  report: Report,
  notif: Notif,
  blogger: Blogger,
};
const MODELS: Model<any>[] = Object.values(Models);
type metricsArray = { date: Date; count: number }[];
type growthRatesArray = { date: Date; growthRate: number }[];

// Admin controllers
export const getAdminTotals = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = await validateZodSchema(getAnalyticsOptionsSchema, req.body);
    const options: AnalyticsOptions = populateOptions(data);

    const totals = await Promise.all(
      MODELS.map((model) =>
        analyticsService.getTotalMetrics<InstanceType<typeof model>>(
          model,
          options
        )
      )
    );

    const totalMetrics: Record<string, number> = {};
    totals.forEach((total, index) => {
      totalMetrics[MODELS[index].modelName] = total;
    });

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Successfully fetched admin totals",
        data: totalMetrics,
      })
    );
  }
);

export const getAdminMetricsOverTime = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = await validateZodSchema(getAnalyticsOptionsSchema, req.body);
    const options: AnalyticsOptions = populateOptions(data);

    const metrics = await Promise.all(
      MODELS.map((model) =>
        analyticsService.getMetricsOverTime<InstanceType<typeof model>>(
          model,
          options
        )
      )
    );

    const metricsOverTime: Record<string, metricsArray> = {};
    metrics.forEach((metric, index) => {
      metricsOverTime[MODELS[index].modelName] = metric;
    });

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Successfully fetched admin metrics over time",
        data: metricsOverTime,
      })
    );
  }
);

export const getAdminGrowthRates = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = await validateZodSchema(getAnalyticsOptionsSchema, req.body);
    const options: AnalyticsOptions = populateOptions(data);

    const growthRatesArray = await Promise.all(
      MODELS.map((model) =>
        analyticsService.getGrowthRates<InstanceType<typeof model>>(
          model,
          options
        )
      )
    );

    const growthRates: Record<string, growthRatesArray> = {};
    growthRatesArray.forEach((metric, index) => {
      growthRates[MODELS[index].modelName] = metric;
    });

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Successfully fetched admin growth rates",
        data: growthRates,
      })
    );
  }
);

export const getAdminTopPerformers = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { queryChoice, sortOrder, limit, startDate, ...options } =
      validateZodSchema(getTopPerformersOptionsSchema, req.body);

    /* Permissible queries for top performers
      topBlogs = by [views, comments, savedBy]
      topComments = likes
      topActiveUsers = by [commentsByMe, savedBlogs]
      topBloggers = by commulative [blogsByMe, totalSavesOfMyBlogs, totalCommentsOnMyBlogs, totalViewsOfMyBlogs]
    */

    // TODO: Fix this casting and remove 'any' type
    const topPerformers = await analyticsService.getTopPerformers<any>(
      Models[queryChoice.model] as Model<any>,
      options,
      queryChoice.sortFields,
      sortOrder,
      limit
    );

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Successfully fetched admin top performers",
        data: topPerformers,
      })
    );
  }
);

export const getTopPerformersOptions = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const TopPerformersOptions = [
      {
        entity: "blog",
        name: "topBlogs",
        sortFields: [
          { views: "views" },
          { comments: "comments" },
          { saves: "savedBy" },
        ],
      },
      {
        entity: "comment",
        name: "topComments",
        sortFields: [{ likes: "likes" }],
      },
      {
        entity: "user",
        name: "topActiveUsers",
        sortFields: [{ comments: "commentsByMe" }, { saves: "savedBlogs" }],
      },
      {
        entity: "blogger",
        name: "topBloggers",
        sortFields: [
          { blogs: "blogsByMe" },
          { saves: "totalSavesOfMyBlogs" },
          { comments: "totalCommentsOnMyBlogs" },
          { views: "totalViewsOfMyBlogs" },
        ],
      },
    ] as const;

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Successfully fetched top performers options",
        data: TopPerformersOptions,
      })
    );
  }
);

export const getSpecificAnalytics = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { entity, type, options } = validateZodSchema(
      getSpecificAnalyticsSchema,
      req.body
    );

    const model: Model<any> = Models[entity];
    if (!Model) {
      throw new ApiError({
        statusCode: 400,
        message: "Invalid entity",
        errorType: "AnalyticsError",
      });
    }

    let message: string;
    let returnData: Record<string, any> = {};

    switch (type) {
      case "totals": {
        const totals = await analyticsService.getTotalMetrics<
          InstanceType<typeof model>
        >(model, options);
        message = "Successfully fetched totals";
        returnData = { totals };
        break;
      }
      case "metricsOverTime": {
        const metricsOverTime = await analyticsService.getMetricsOverTime<
          InstanceType<typeof Model>
        >(model, options);
        message = "Successfully fetched metrics over time";
        returnData = { metricsOverTime };
        break;
      }
      case "growthRates": {
        const growthRates = await analyticsService.getGrowthRates<
          InstanceType<typeof Model>
        >(model, options);
        message = "Successfully fetched growth rates";
        returnData = { growthRates };
        break;
      }
      default: {
        throw new ApiError({
          statusCode: 400,
          message: "Invalid type of specific analytics",
          errorType: "AnalyticsError",
        });
        break;
      }
    }

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message,
        data: returnData,
      })
    );
  }
);

export const getBloggerSpecificAnalytics = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = validateZodSchema(getBloggerSpecificAnalyticsSchema, req.body);
    const { entity, type, options } = data;
    const user = await getUserFromRequest(req);

    const model: Model<any> = Models[entity];
    if (!Model) {
      throw new ApiError({
        statusCode: 400,
        message: "Invalid entity",
        errorType: "AnalyticsError",
      });
    }

    let message: string;
    let returnData: Record<string, any> = {};
    let query: FilterQuery<any> = {};

    switch (entity) {
      case "blog": {
        query = { blogger: user._id as string };
        break;
      }
      case "comment": {
        query = { blogger: user._id as string };
        break;
      }
      case "user": {
        query = { subscribedTo: { $elemMatch: [user._id as string] } };
        break;
      }
      default: {
        throw new ApiError({
          statusCode: 400,
          message: "Invalid entity",
          errorType: "AnalyticsError",
        });
        break;
      }
    }

    switch (type) {
      case "totals": {
        const totals = await analyticsService.getTotalMetrics<
          InstanceType<typeof model>
        >(model, options, query);
        message = "Successfully fetched totals";
        returnData = { totals };
        break;
      }
      case "metricsOverTime": {
        const metricsOverTime = await analyticsService.getMetricsOverTime<
          InstanceType<typeof model>
        >(model, options, query);
        message = "Successfully fetched metrics over time";
        returnData = { metricsOverTime };
        break;
      }
      case "growthRates": {
        const growthRates = await analyticsService.getGrowthRates<
          InstanceType<typeof model>
        >(model, options, query);
        message = "Successfully fetched growth rates";
        returnData = { growthRates };
        break;
      }
      case "topPerformers": {
        const { sortOrder, limit, queryChoice } = data;
        const topPerformers = await analyticsService.getTopPerformers<
          InstanceType<typeof model>
        >(model, options, queryChoice.sortFields, sortOrder, limit, query);
        message = "Successfully fetched top performers";
        returnData = { topPerformers };
        break;
      }
      default: {
        throw new ApiError({
          statusCode: 400,
          message: "Invalid type of specific analytics",
          errorType: "AnalyticsError",
        });
      }
    }

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message,
        data: returnData,
      })
    );
  }
);
