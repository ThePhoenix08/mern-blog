import { Router } from "express";

import { authenticate, authoriseRole } from "@middlewares/auth.middleware";
import upload from "@middlewares/multer.middleware";
import * as authController from "@controllers/auth.controller";
import * as userController from "@controllers/user.controller";
import * as blogController from "@controllers/blog.controller";
import * as commentController from "@controllers/comment.controller";
import * as dashboardController from "@controllers/dashboard.controller";
import * as notifController from "@controllers/notif.controller";
import * as reportController from "@controllers/report.controller";
import * as settingsController from "@controllers/settings.controller";
import * as adminController from "@controllers/admin.controller";
import * as publicController from "@controllers/public.controller";
import ENV_VARIABLES from "@constants";

// public routes
/**
 * publicRouter - routes that are accessible to everyone,
 * includes [ healthCheck, registerUser, loginUser, handleForgetPassword ]
 */
const publicRouter = Router();
publicRouter.route("/health").get(publicController.healthCheck);
// upload.none() is used to populate form Data
publicRouter.use(upload.none());
publicRouter.route("/register").post(authController.registerUser);
publicRouter.route("/login").post(authController.loginUser);
publicRouter.route("/forgetPassword").post(authController.handleForgetPassword);

/** auth/account routes - account related routes */
const accountRouter = Router();
accountRouter.use(authenticate);
accountRouter.use(authoriseRole("user"));
accountRouter.route("/refreshUser").post(authController.handleRefreshUser);
accountRouter.route("/resetPassword").post(authController.handleResetPassword);
accountRouter.route("/logout").post(authController.logoutUser);

/** user role routes - user and above can access */
const userRouter = Router();
userRouter.use(authoriseRole("user"));
userRouter
  .route("/profile")
  .get(userController.getProfile)
  .patch(upload.single("avatar"), userController.updateProfile)
  .delete(userController.deleteAccount);
userRouter
  .route("/avatar")
  .post(upload.single("avatar"), userController.uploadAvatar);
userRouter
  .route("/subscribe/:bloggerId")
  .put(userController.toggleSubscribeToBlogger);
userRouter.route("/myComments").post(userController.getUserComments);
userRouter
  .route("/publicProfile/:userId")
  .get(userController.getUserPublicProfile);
userRouter
  .route("/settings")
  .get(settingsController.getUserSettings)
  .patch(settingsController.updateUserSettings);

/** blogger role routes - blogger and above can access */
const bloggerRouter = Router();
bloggerRouter.use(authoriseRole("blogger"));
bloggerRouter
  .route("/posts")
  .delete(blogController.deleteBlogs)
  .post(
    upload.array("blogImages", ENV_VARIABLES.blogImagesLimit || 5),
    blogController.createBlog
  );
bloggerRouter
  .route("/blog/:id")
  .get(blogController.getBlog)
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);
bloggerRouter.route("/updateProfile").patch(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userController.updateProfile
);
bloggerRouter
  .route("/cover")
  .post(upload.single("cover"), userController.uploadCoverImage);
bloggerRouter
  .route("/specificAnalytics")
  .get(dashboardController.getBloggerSpecificAnalytics);

/** postsAndCommentsRouter - posts and comments related routes */
const postsAndCommentsRouter = Router();
postsAndCommentsRouter.use(authoriseRole("user"));
postsAndCommentsRouter.route("/posts").get(blogController.getBlogs);
postsAndCommentsRouter.route("/tags").get(blogController.getBlogTags);
postsAndCommentsRouter
  .route("/blog/:id")
  .get(blogController.getBlog)
  .put(blogController.toggleBlogSave);
postsAndCommentsRouter
  .route("/comments/:blogId")
  .get(commentController.getComments)
  .post(commentController.addComment);
postsAndCommentsRouter
  .route("/comments/:blogId/:commentId")
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

/** reportsAndNotifsRouter - reports and notifs related routes */
const reportsAndNotifsRouter = Router();
reportsAndNotifsRouter.use(authoriseRole("user"));
reportsAndNotifsRouter.route("/new").post(reportController.createReport);
reportsAndNotifsRouter.route("/notifs").get(notifController.getNotifs);
reportsAndNotifsRouter
  .route("/notifs/:notifId")
  .put(notifController.markAsRead)
  .delete(notifController.deleteNotif);

/** adminRouter - admin only routes */
const adminRouter = Router();
adminRouter.use(authoriseRole("admin"));
adminRouter.route("/users").get(adminController.getAllUsers);
adminRouter
  .route("/user/:userId")
  .patch(adminController.updateUserRole)
  .delete(adminController.banUser);
adminRouter.route("/blogs").get(adminController.getAllBlogs);
adminRouter
  .route("/blog/:blogId")
  .patch(adminController.moderateBlog)
  .delete(adminController.adminDeleteBlog);
adminRouter.route("/reports").get(adminController.getAllReports);
adminRouter
  .route("/report/:reportId")
  .patch(adminController.resolveReport)
  .delete(adminController.deleteReport);
adminRouter
  .route("/comment/:commentId")
  .patch(adminController.moderateComment)
  .delete(adminController.adminDeleteComment);
adminRouter.route("/dashboard/totals").get(dashboardController.getAdminTotals);
adminRouter
  .route("/dashboard/metrics-over-time")
  .get(dashboardController.getAdminMetricsOverTime);
adminRouter
  .route("/dashboard/growth-rates")
  .get(dashboardController.getAdminGrowthRates);
adminRouter
  .route("/dashboard/top-performers")
  .get(dashboardController.getAdminTopPerformers);
adminRouter
  .route("/top-performers-options")
  .get(dashboardController.getTopPerformersOptions);
adminRouter
  .route("/specific-analytics")
  .get(dashboardController.getSpecificAnalytics);

// authenticated routes
/**
 * authRouter - routes that are accessible only to authenticated users,
 * includes [ accountRouter, userRouter, bloggerRouter, postsAndCommentsRouter, reportsAndNotifsRouter, adminRouter ]
 */
const authRouter = Router();
authRouter.use(authenticate);
authRouter.use("/account", accountRouter);
authRouter.use("/users", userRouter);
authRouter.use("/blogger", bloggerRouter);
authRouter.use("/content", postsAndCommentsRouter);
authRouter.use("/reports", reportsAndNotifsRouter);
authRouter.use("/admin", adminRouter);

export { authRouter, publicRouter };
