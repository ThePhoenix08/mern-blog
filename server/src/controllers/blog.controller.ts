import Blog from "models/blog.model";
import { Response } from "express";
import AuthRequest from "types/express";
import ApiError from "utils/ApiError.util";
import ApiResponse from "utils/ApiResponse.util";
import asyncHandler from "utils/asyncHandler.util";
import {
  getBlogsSchema,
  deleteBlogsSchema,
  createBlogSchema,
  idSchema,
  updateBlogSchema,
} from "validators/blog.validator";
import User from "models/user.model";
import { formSearchQuery } from "services/blog.service";

const getBlogs = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
    validate request body
    get options
    populate query with filters
    populate sort with sort options
    handle pagination
    get blogs
    get total count
    convert blogs to object
    return blogsObject and pagination details
  */

  const result = getBlogsSchema.safeParse(req.body);
  if (!result.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const { options } = result.data;

  const sort: Record<string, any> = { createdAt: -1 }; // mongoose sort

  // formSearchQuery
  if(options && options.filters)
  const query: Record<string, any> = formSearchQuery(options as Record<string, any>);

    if (options?.sort) {
      sort[options.sort.field] = options.sort.order === "asc" ? 1 : -1;
    }

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query).sort(sort).skip(skip).limit(limit);

    const total = await Blog.countDocuments(query);

    const returnedBlogs: Object[] = blogs.map((blog) => blog.toObject());

    res.status(200).json(
      new ApiResponse(
        200,
        {
          returnedBlogs,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
        "Blogs fetched successfully."
      )
    );
  }
});

const deleteBlogs = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
    validate request body
    get userId and userRole
    populate query
    if userRole is blogger
      filter blogs by userId
    delete blogs
    return success response
  */

  const result = deleteBlogsSchema.safeParse(req.body);
  if (!result.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const { ids } = result.data;

  if (!ids || !Array.isArray(ids) || ids.length === 0)
    throw new ApiError(
      400,
      "Validation Error: Invalid ID format, No blogs to delete"
    );

  if (!req.user) throw new ApiError(401, "Unauthorized: No user found");
  const userId = req.user._id;
  const userRole = req.user.role;

  const query: Record<string, any> = { _id: { $in: ids } };

  if (userRole === "blogger") {
    query.blogger = userId;
  }

  const deletedBlogs = await Blog.deleteMany(query);
  if (
    !deletedBlogs ||
    deletedBlogs.deletedCount === 0 ||
    deletedBlogs.deletedCount !== ids.length
  )
    throw new ApiError(400, "Error while deleting blogs");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedCount: deletedBlogs.deletedCount },
        "Blogs deleted successfully."
      )
    );
});

const createBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
    validate request body
    get userId
    create blog
    return success response
  */

  const result = createBlogSchema.safeParse(req.body);
  if (!result.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const blogData = result.data;

  if (!req.user) throw new ApiError(401, "Unauthorized: No user found");
  const userId = req.user._id;

  const blog = Blog.create({ ...blogData, blogger: userId });

  res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog created successfully."));
});

const getBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
  validate request body
  get blogId
  get blog
  return blog
  */

  const result = idSchema.safeParse(req.params.id);
  if (!result.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const blogId = result.data.id;

  const blog = await Blog.findById(blogId).populate("blogger");
  if (!blog) throw new ApiError(404, "Blog not found");

  res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog fetched successfully."));
});

const updateBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
  validate request params - get id
  validate request body - get update data
  get userId
  update blog
  return success response
  */

  const result = idSchema.safeParse(req.params.id);
  if (!result.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const blogId = result.data.id;

  const result2 = updateBlogSchema.safeParse(req.body);
  if (!result2.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const updateData = result2.data;

  if (!req.user) throw new ApiError(401, "Unauthorized: No user found");
  const userId = req.user._id;

  const blog = await Blog.findOneAndUpdate({ _id: blogId }, updateData, {
    new: true,
    runValidators: true,
    context: "query",
  });
  if (!blog) throw new ApiError(404, "Blog not found");

  res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog updated successfully."));
});

const deleteBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  /* steps
  validate request params - get id
  get userId
  delete blog
  return success response
  */

  const result = idSchema.safeParse(req.params.id);
  if (!result.success)
    throw new ApiError(400, "Validation Error: Invalid request body");
  const blogId = result.data.id;

  if (!req.user) throw new ApiError(401, "Unauthorized: No user found");
  const userId = req.user._id;

  const blog = await Blog.findOneAndDelete({ _id: blogId, blogger: userId });
  if (!blog) throw new ApiError(404, "Blog not found");

  res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog deleted successfully."));
});

export { getBlog, getBlogs, deleteBlogs, deleteBlog, createBlog, updateBlog };
