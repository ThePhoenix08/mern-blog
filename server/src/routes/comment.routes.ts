import { Router } from "express";
import { authenticate, authoriseRole } from "middlewares/auth.middleware";
import * as commentController from "controllers/comment.controller";

const commentRouter = Router();
commentRouter
  .route("/:blogId")
  .get(authenticate, authoriseRole("user"), commentController.getComments)
  .post(authenticate, authoriseRole("user"), commentController.addComment);
commentRouter
  .route("/:blogId/:commentId")
  .put(authenticate, authoriseRole("user"), commentController.updateComment)
  .delete(authenticate, authoriseRole("user"), commentController.deleteComment);

export default commentRouter;
