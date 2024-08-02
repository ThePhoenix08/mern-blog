import { Response } from "express";
import { IBlog } from "models/blog.model";
import { IUser } from "models/user.model";
import {
  deleteBlogsByQuery,
  formSearchQuery,
  getBlogsByQuery,
  getBlogTagsFromAllBlogs,
  handleBlogImagesUpload,
  incrementBlogViewCount,
} from "services/blog.service";
import {
  createNewDocument,
  getDocumentById,
  getUserFromRequest,
  updateDocumentById,
  validateZodSchema,
} from "services/common.service";
import AuthRequest from "types/express";
import ApiError from "utils/ApiError.util";
import ApiResponse from "utils/ApiResponse.util";
import asyncHandler from "utils/asyncHandler.util";
import {
  createBlogSchema,
  deleteBlogsSchema,
  getBlogsSchema,
  idSchema,
  toggleBlogSaveSchema,
  updateBlogSchema,
} from "validators/blog.validator";

const getBlogs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { options } = validateZodSchema(getBlogsSchema, req.body);
  const { query, sort, skip, limit, page } = await formSearchQuery(
    options as Record<string, any>
  );
  const { documents, total, pages } = await getBlogsByQuery(
    query,
    sort,
    skip,
    limit
  );

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        returnedBlogs: documents,
        pagination: { page, limit, total, pages },
      },
      message: "Blogs fetched successfully.",
    })
  );
});

const deleteBlogs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { ids } = validateZodSchema(deleteBlogsSchema, req.body);
  if (!ids || !Array.isArray(ids) || ids.length === 0)
    throw new ApiError({
      errorType: "RequestUndefinedError",
      message: "No blogs specified to delete",
    });

  const user = await getUserFromRequest(req);
  const role = user.role;
  if (role === "user")
    throw new ApiError({
      errorType: "UnauthorizedRequestError",
      message: "User attempted to delete blogs",
    });

  const deletedCount = await deleteBlogsByQuery(ids, role, user._id as string);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        deletedCount,
      },
      message: "Blogs deleted successfully.",
    })
  );
});

const createBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const blogData = validateZodSchema(createBlogSchema, req.body);
  const blogImages = req.files ? req.files : null;
  if (!blogData || !blogImages || !Array.isArray(blogImages))
    throw new ApiError({
      errorType: "RequestUndefinedError",
      message: "Request undefined",
    });

  const user = await getUserFromRequest(req);
  const role = user.role;

  if (role === "user")
    throw new ApiError({
      errorType: "UnauthorizedRequestError",
      message: "Non Blogger user attempted to create blog",
    });

  const blogImagesUrls = await handleBlogImagesUpload(blogImages);

  const userId = user._id;
  const blog = await createNewDocument<IBlog>("blog", {
    ...blogData,
    blogger: userId,
    images: blogImagesUrls,
  });

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: blog,
      message: "Blog created successfully.",
    })
  );
});

const getBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = validateZodSchema(idSchema, req.params);
  const blog = await getDocumentById<IBlog>("blog", id);
  const updatedBlog = await incrementBlogViewCount(blog._id as string);
  const returnBlog = updatedBlog.populate("blogger");

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: returnBlog,
      message: "Blog fetched successfully.",
    })
  );
});

const updateBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = validateZodSchema(updateBlogSchema, req.body);
  const { id: blogId } = validateZodSchema(idSchema, req.params);

  const user = await getUserFromRequest(req);
  const role = user.role;

  if (role === "user")
    throw new ApiError({
      errorType: "UnauthorizedRequestError",
      message: "Non Blogger user attempted to update blog",
    });

  const existingBlog = await getDocumentById<IBlog>("blog", blogId);

  if (existingBlog.blogger.toString() !== (user._id as string).toString())
    throw new ApiError({
      errorType: "UnauthorizedRequestError",
      message: "Non Blogger user attempted to update blog",
    });

  let newImagesUrls: string[] = [];
  if (req.files && Array.isArray(req.files)) {
    newImagesUrls = await handleBlogImagesUpload(
      req.files as Express.Multer.File[]
    );
  }

  const updateObject = {
    ...data,
    images: [...(existingBlog.images || []), ...newImagesUrls],
  };

  const updatedBlog = await updateDocumentById<IBlog>(
    "blog",
    blogId,
    updateObject
  );

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: updatedBlog,
      message: "Blog updated successfully.",
    })
  );
});

const deleteBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: blogId } = validateZodSchema(idSchema, req.params);
  const user = await getUserFromRequest(req);
  const role = user.role;

  const result = await deleteBlogsByQuery([blogId], role, user._id as string);
  if (!result || result === 1)
    throw new ApiError({
      errorType: "DeleteError",
      message: "Error while deleting singleblog",
    });

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Blog deleted successfully.",
    })
  );
});

const toggleBlogSave = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: blogId } = validateZodSchema(idSchema, req.params);
  const { _id: userId } = await getUserFromRequest(req);
  const { isSaved } = validateZodSchema(toggleBlogSaveSchema, req.body);

  const updateQuery = isSaved
    ? { $push: { savedBlogs: blogId } }
    : { $pull: { savedBlogs: blogId } };

  const savedBlogUpdateUser = await updateDocumentById<IUser>(
    "user",
    userId as string,
    updateQuery
  );

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: savedBlogUpdateUser,
      message: `Blog ${isSaved ? "added to saved" : "removed from saved"} successfully.`,
    })
  );
});

const getBlogTags = asyncHandler(async (req: AuthRequest, res: Response) => {
  // get distinct tags from all blog posts

  const blogTags: string[] = await getBlogTagsFromAllBlogs();
  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: blogTags,
      message: "Blog tags fetched successfully.",
    })
  );
});

export {
  createBlog,
  deleteBlog,
  deleteBlogs,
  getBlog,
  getBlogs,
  updateBlog,
  toggleBlogSave,
  getBlogTags,
};
