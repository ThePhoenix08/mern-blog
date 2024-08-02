import ApiError from "utils/ApiError.util";
import { Document } from "mongoose";
import User, { IUser } from "models/user.model";
import Report from "models/report.model";
import { FilterQuery, SortOrder } from "mongoose";
import { IReport } from "models/report.model";

export const checkIfActionIsAlreadyTaken = async <T extends Document>(
  document: T & {
    adminStatus: "approved" | "rejected" | "flagged" | "pending";
  },
  action: "approve" | "reject" | "flag"
) => {
  const actionToStatusMap = {
    approve: "approved",
    reject: "rejected",
    flag: "flagged",
  };

  const documentStatus = actionToStatusMap[action];
  if (document.adminStatus === documentStatus) {
    throw new ApiError({
      errorType: "RequestConflictError",
      message: `This action: ${documentStatus} is already taken by the admin`,
    });
  }

  return documentStatus;
};

export const formUserSearchQuery = async (options: Record<string, any>) => {
  const query: Record<string, any> = {};
  const sort: Record<string, any> = { createdAt: -1 };

  if (options?.sort) {
    sort[options.sort.field] = options.sort.order === "asc" ? 1 : -1;
  }

  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const skip = (page - 1) * limit;

  if (!options.filters) {
    const { username, email, fullname, role, isVerified, date } =
      options.filters;

    if (isVerified) query.isVerified = isVerified;
    if (role) query.role = role;
    if (username) query.username = username;
    if (email) query.email = email;
    if (fullname) query.fullname = fullname;

    if (date) {
      query.createdAt = {};
      if (date.startDate) query.createdAt.$gte = date.startDate;
      if (date.endDate) query.createdAt.$lte = date.endDate;
    }
  }

  if (options?.searchTerm) {
    query.$or = [
      { bio: { $regex: options.searchTerm, $options: "i" } },
      { fullname: { $regex: options.searchTerm, $options: "i" } },
      { email: { $regex: options.searchTerm, $options: "i" } },
      { username: { $regex: options.searchTerm, $options: "i" } },
      { role: { $regex: options.searchTerm, $options: "i" } },
    ];
  }

  return {
    query,
    sort,
    skip,
    limit,
    page,
  };
};

export const getUsersByQuery = async (
  query: FilterQuery<IUser>,
  sort: Record<string, SortOrder>,
  skip: number,
  limit: number
) => {
  const [users, total] = await Promise.all([
    User.find(query).sort(sort).skip(skip).limit(limit).lean(),
    User.countDocuments(query).lean(),
  ]);

  const returnedUsers: Object[] = users.map((user) => user.toObject());

  return {
    users: returnedUsers,
    total,
    pages: Math.ceil(total / limit),
  };
};

export const formReportSearchQuery = async (options: Record<string, any>) => {
  const query: Record<string, any> = {};
  const sort: Record<string, any> = { createdAt: -1 };

  if (options?.sort) {
    sort[options.sort.field] = options.sort.order === "asc" ? 1 : -1;
  }

  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const skip = (page - 1) * limit;

  if (!options.filters) {
    const { reportedBy, relatedDocs, date } = options.filters;

    if (reportedBy) query.reportedBy = reportedBy;
    if (relatedDocs) query.relatedDocs = relatedDocs;

    if (date) {
      query.createdAt = {};
      if (date.startDate) query.createdAt.$gte = date.startDate;
      if (date.endDate) query.createdAt.$lte = date.endDate;
    }
  }

  if (options?.searchTerm) {
    query.$or = [{ reason: { $regex: options.searchTerm, $options: "i" } }];
  }

  return {
    query,
    sort,
    skip,
    limit,
    page,
  };
};

export const getReportsByQuery = async (
  query: FilterQuery<IReport>,
  sort: Record<string, SortOrder>,
  skip: number,
  limit: number
) => {
  const [reports, total] = await Promise.all([
    Report.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Report.countDocuments(query).lean(),
  ]);

  const returnedReports: Object[] = reports.map((report) => report.toObject());

  return {
    documents: returnedReports,
    total,
    pages: Math.ceil(total / limit),
  };
};
