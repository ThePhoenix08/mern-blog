import type { Model, Document, FilterQuery, SortOrder } from "mongoose";
import ApiError from "utils/ApiError.util";

export interface AnalyticsOptions {
  startDate?: Date;
  endDate?: Date;
  interval?: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
  format?: "lineGraph" | "barGraph" | "pieGraph";
}

export class AnalyticsService {
  fieldToTypeMap = {
    views: "number",
    comments: "array",
    savedBy: "array",
    likes: "number",
    commentsByMe: "array",
    savedBlogs: "array",
    blogsByMe: "array",
    totalSavesOfMyBlogs: "undefined",
    totalCommentsOnMyBlogs: "undefined",
    totalViewsOfMyBlogs: "undefined",
  };

  private readonly intervalToMs = {
    hourly: 60 * 60 * 1000,
    daily: 24 * 60 * 60 * 1000,
    weekly: 7 * 24 * 60 * 60 * 1000,
    monthly: 30 * 24 * 60 * 60 * 1000,
    yearly: 365 * 24 * 60 * 60 * 1000,
  };

  private calculateGrowthRate = (current: number, previous: number): number => {
    /* 
      if current is 0, 
        if previous is 0, return 0%
        else return 100%
    */
    if (current < 0 || previous < 0)
      throw ApiError.internal("Invalid values for current and previous", {
        slug: "ANALYTICS_ERROR",
      });

    if (current === 0) {
      return previous === 0 ? 0 : -100;
    }
    return ((current - previous) / previous) * 100;
  };

  private formQuery(
    startDate?: Date,
    endDate?: Date,
    additionalQuery?: FilterQuery<any>
  ): FilterQuery<any> {
    const query: FilterQuery<any> = {};
    if (startDate) query.createdAt = { $gte: startDate };
    if (endDate) query.createdAt = { ...query.createdAt, $lte: endDate };
    if (additionalQuery) Object.assign(query, additionalQuery);

    return query;
  }

  async getTotalMetrics<T extends Document>(
    Model: Model<T>,
    options: AnalyticsOptions,
    additionalQuery?: FilterQuery<T>
  ): Promise<number> {
    const query = this.formQuery(
      options.startDate,
      options.endDate,
      additionalQuery
    );

    const docsCount = await Model.countDocuments(query).lean();
    if (!docsCount) {
      throw ApiError.internal("Error in getting document counts", {
        slug: "ANALYTICS_ERROR",
      });
    }

    return docsCount;
  }

  async getMetricsOverTime<T extends Document>(
    model: Model<T>,
    options: AnalyticsOptions,
    additionalQuery?: FilterQuery<T>
  ): Promise<{ date: Date; count: number }[]> {
    const query = this.formQuery(
      options.startDate,
      options.endDate,
      additionalQuery
    );

    if (!options.interval) options.interval = "daily";
    const intervalMs = this.intervalToMs[options.interval];

    const result = await model.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            // createdAt - (createdAt % interval)
            // flattening or compiling the document dates into indexes defined by the interval
            /*
              assume interval = monthly 
              assume date = 25th May 2021
              [startDate, endDate] = [1 Jan 2021, 31 Dec 2021]
              diff = 25 May % month = 25 days
              index = date - diff = 1 May
              thus we get docs indexed by the months 1st day
            */

            $toDate: {
              $subtract: [
                { $toLong: { $toDate: "$createdAt" } },
                { $mod: [{ $toLong: "$createdAt" }, intervalMs] },
              ],
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    if (!result) {
      throw ApiError.internal("Error in getting document metrics over time", {
        slug: "ANALYTICS_ERROR",
      });
    }
    if (result.length === 0) return [];

    return result.map((item) => ({ date: item._id, count: item.count }));
  }

  async getGrowthRates<T extends Document>(
    model: Model<T>,
    options: AnalyticsOptions,
    additionalQuery?: FilterQuery<T>
  ): Promise<{ date: Date; growthRate: number }[]> {
    const metricsOverTime = await this.getMetricsOverTime(
      model,
      options,
      additionalQuery
    );
    const growthRates = [];

    for (let i = 0; i < metricsOverTime.length - 1; i++) {
      if (!metricsOverTime[i] || !metricsOverTime[i + 1]) break;

      const current = metricsOverTime[i].count;
      const date = metricsOverTime[i].date;
      const previous = metricsOverTime[i + 1].count;
      const growthRate = this.calculateGrowthRate(current, previous);
      growthRates.push({ date, growthRate });
    }
    return growthRates;
  }

  async getTopPerformers<T extends Document>(
    model: Model<T>,
    options: Omit<AnalyticsOptions, "interval">,
    sortField: string,
    sortOrder: SortOrder = "desc",
    limit: number = 10,
    additionalQuery?: FilterQuery<T>
  ) {
    const query = this.formQuery(
      options.startDate,
      options.endDate,
      additionalQuery
    );

    const result = await model
      .find(query)
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .lean();
    if (!result) {
      throw ApiError.internal("Error in getting top performers", {
        slug: "ANALYTICS_ERROR",
      });
    }

    return result;
  }
}
