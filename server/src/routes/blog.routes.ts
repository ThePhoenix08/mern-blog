import { Router } from "express";
import { authenticate, authoriseRole } from "middlewares/auth.middleware";
import * as blogController from "controllers/blog.controller";

const blogRouter = Router();

blogRouter
  .route("/")
  .get(authenticate, authoriseRole("user"), blogController.getBlogs)
  .post(authenticate, authoriseRole("blogger"), blogController.createBlog)
  .delete(authenticate, authoriseRole("blogger"), blogController.deleteBlogs);

blogRouter
  .route("/:id")
  .get(authenticate, authoriseRole("user"), blogController.getBlog)
  .patch(authenticate, authoriseRole("blogger"), blogController.updateBlog)
  .delete(authenticate, authoriseRole("blogger"), blogController.deleteBlog);

export default blogRouter;
