import { Router } from "express";
import {
  handleForgetPassword,
  handleResetPassword,
  loginUser,
  registerUser,
  handleRefreshUser,
  logoutUser,
} from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const authRouter = Router();
authRouter.route("/register").post(upload.none(), registerUser);
authRouter.route("/login").post(upload.none(), loginUser);
authRouter.route("/forgetPassword").post(upload.none(), handleForgetPassword);
authRouter.route("/refreshUser").post(handleRefreshUser);
authRouter
  .route("/resetPassword")
  .post(authMiddleware("user"), upload.none(), handleResetPassword);
authRouter.route("/logout").post(authMiddleware("user"), logoutUser);

export default authRouter;
