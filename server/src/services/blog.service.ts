import Blog, { IBlog } from "models/blog.model";
import { IBlogger } from "models/blogger.model";
import { FilterQuery, SortOrder, Types } from "mongoose";
import {
  getDocumentByQuery,
  deleteDocumentsByQuery,
  IFile,
  uploadFiles,
  updateDocumentById,
  getDocumentsByQuery,
  checkIfDocumentsExist,
  orphanDocumentsOfModel,
} from "services/common.service";
import ApiError from "utils/ApiError.util";
import { FileRequest } from "./user.service";
import User from "models/user.model";
import { IComment } from "models/comment.model";
import { IReport } from "models/report.model";
import { INotif } from "models/notif.model";

export const formSearchQuery = async (options: Record<string, any>) => {
  // populating query filters
  const query: Record<string, any> = {};
  const sort: Record<string, any> = { createdAt: -1 };

  if (options?.sort) {
    sort[options.sort.field] = options.sort.order === "asc" ? 1 : -1;
  }

  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const skip = (page - 1) * limit;

  if (!options.filters) {
    const { isPublished, tags, blogger, slug, date } = options.filters;

    if (isPublished) query.isPublished = isPublished;

    if (tags) query.tags = { $in: tags };

    if (blogger) {
      const bloggerUser = await getDocumentByQuery<IBlogger>("blogger", {
        username: blogger,
      });
      if (bloggerUser) query.blogger = bloggerUser._id;
    }

    if (slug) query.slug = slug;

    if (date) {
      query.createdAt = {};
      if (date.startDate) query.createdAt.$gte = date.startDate;
      if (date.endDate) query.createdAt.$lte = date.endDate;
    }
  }

  if (options?.searchTerm) {
    query.$or = [
      { title: { $regex: options.searchTerm, $options: "i" } },
      { content: { $regex: options.searchTerm, $options: "i" } },
      { tags: { $regex: options.searchTerm, $options: "i" } },
      { slug: { $regex: options.searchTerm, $options: "i" } },
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

export const getBlogsByQuery = async (
  query: FilterQuery<IBlog>,
  sort: Record<string, SortOrder>,
  skip: number,
  limit: number
) => {
  const [blogs, total] = await Promise.all([
    Blog.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Blog.countDocuments(query).lean(),
  ]);

  const returnedBlogs: Object[] = blogs.map((blog) => blog.toObject());

  return {
    documents: returnedBlogs,
    total,
    pages: Math.ceil(total / limit),
  };
};

export const deleteBlogsByQuery = async (
  ids: string[],
  role: string,
  userId: string
) => {
  // steps
  // check if user is blogger - if not throw error
  // validate all ids - get blogs to delete - if not throw error
  // delete blogs
  // orphan related docs [ comments, reports, notifs ]
  // return deletedCount

  const query: Record<string, any> = { _id: { $in: ids } };
  if (role === "blogger") {
    query.blogger = userId;
  }

  await checkIfDocumentsExist("blog", undefined, query);

  const deletedDocumentsCount = await deleteDocumentsByQuery("blog", {
    _id: { $in: ids },
  });

  orphanDocumentsOfModel<IComment>("comment", { blog: { $in: ids } });
  orphanDocumentsOfModel<IReport>("report", {
    relatedDocs: { blog: { $in: ids } },
  });
  orphanDocumentsOfModel<INotif>("notif", {
    relatedItem: { blog: { $in: ids } },
  });

  return deletedDocumentsCount;
};

export const handleBlogImagesUpload = async (
  blogImages: Express.Multer.File[]
): Promise<string[]> => {
  const files: IFile[] = blogImages.map((file) => ({
    identifier: "blogImages",
    path: file.path,
    old_url: null,
  }));

  const uploadedFiles = await uploadFiles(files);
  if (!uploadedFiles)
    throw new ApiError({
      errorType: "UploadError",
      message: "Error while uploading files, recieved null",
    });

  const blogImagesUrls = uploadedFiles.map((file) => {
    if (!file || !file.url)
      throw new ApiError({
        errorType: "UploadError",
        message: "Error while uploading files, url missing",
      });
    return file.url;
  });
  return blogImagesUrls;
};

export const incrementBlogViewCount = async (blogId: string) => {
  const blog = await updateDocumentById<IBlog>("blog", blogId, {
    views: { $inc: 1 },
  });
  if (!blog)
    throw new ApiError({
      errorType: "UpdateError",
      message: "Error while updating blog views",
    });
  return blog;
};

export const getBlogTagsFromAllBlogs = async () => {
  const blogs = await getDocumentsByQuery<IBlog>("blog", {});
  const blogTags: string[] = blogs.flatMap((blog) => blog.tags);
  const uniqueBlogTags = [...new Set(blogTags)];
  return uniqueBlogTags;
};
