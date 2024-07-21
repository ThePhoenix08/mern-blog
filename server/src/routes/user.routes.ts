import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticate, authoriseRole } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

/* 
  GET PATCH DELETE /api/users/profile
  GET /api/users (Admin only)
*/

const userRouter = Router();

const setupRoutes = (
  router: Router,
  uploadMiddleware: any
) => {
  router
    .route("/profile")
    .get(authenticate, userController.getProfile)
    .patch(authenticate, uploadMiddleware, userController.updateProfile) 
    .delete(authenticate, userController.deleteAccount);
};

setupRoutes(
  userRouter.use(authoriseRole("user")),
  upload.single("avatar")
);

setupRoutes(
  userRouter.use(authoriseRole("blogger")),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ])
);

userRouter
  .route("/:userId")
  .get(
    authenticate,
    authoriseRole("user"),
    userController.getUserPublicProfile
  );

userRouter
  .route("/avatar")
  .post(
    authenticate,
    authoriseRole("user"),
    upload.single("avatar"),
    userController.updateAvatar
  );

userRouter
  .route("/cover")
  .post(
    authenticate,
    authoriseRole("user"),
    upload.single("coverImage"),
    userController.updateCoverImage
  );

userRouter
  .route("/subscribe/:bloggerId")
  .post(
    authenticate,
    authoriseRole("user"),
    userController.ToggleSubscribeToBlogger
  );

userRouter
  .route("/myComments")
  .post(authenticate, authoriseRole("user"), userController.getUserComments);

// admin routes
userRouter.route('/')
.get(
  authenticate, 
  authoriseRole("admin"), 
  userController.getUsers
);

export default userRouter;

/* 
// admin routes
userRouter.route('/:id')
  .get(authenticate, authoriseRole("admin"), userController.getProfile)
  .patch(authenticate, authoriseRole("admin"), userController.updateProfile) 
  .delete(authenticate, authoriseRole("admin"), userController.deleteAccount);
*/

/*
userRouter.route("/notifications")
.get(authenticate, userController.getNotifications)
.delete(authenticate, userController.deleteNotifications)
*/

/*
userRouter.route("/settings")
.get(authenticate, userController.getSettings)
.patch(authenticate, userController.updateSettings)
*/

