import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { authenticate, authoriseRole } from "middlewares/auth.middleware";

const adminRouter = Router();

adminRouter.use(authenticate, authoriseRole("admin"));

adminRouter.route("/users").get(adminController.getAllUsers);
adminRouter
  .route("/users/:userId")
  .patch(adminController.updateUserRole)
  .delete(adminController.banUser);

adminRouter.route("/blogs").get(adminController.getAllBlogs);
adminRouter
  .route("/blogs/:blogId")
  .patch(adminController.moderateBlog)
  .delete(adminController.deleteBlog);

adminRouter.route("/reports").get(adminController.getAllReports);
adminRouter
  .route("/reports/:reportId")
  .patch(adminController.resolveReport)
  .delete(adminController.deleteReport);

adminRouter
  .route("/comments/:commentId")
  .patch(adminController.moderateComment)
  .delete(adminController.deleteComment);

export default adminRouter;
