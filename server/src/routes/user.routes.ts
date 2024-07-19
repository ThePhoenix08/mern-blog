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

// admin routes
userRouter.route('/')
.get(
  authenticate, 
  authoriseRole("admin"), 
  userController.getUsers
);

export default userRouter;

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

