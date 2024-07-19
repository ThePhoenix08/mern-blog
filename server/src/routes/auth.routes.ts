import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import upload from "../middlewares/multer.middleware";
import { authenticate, authoriseRole } from "middlewares/auth.middleware";

const authRouter = Router();

authRouter
  .route("/register")
  .post(upload.none(), authController.registerUser);

authRouter
  .route("/login")
  .post(upload.none(), authController.loginUser);

authRouter
  .route("/forgetPassword")
  .post(upload.none(), authController.handleForgetPassword);

authRouter
  .route("/refreshUser")
  .post(authController.handleRefreshUser);

authRouter
  .route("/resetPassword")
  .post(
    authenticate,
    authoriseRole("user"),
    upload.none(),
    authController.handleResetPassword
  );

authRouter
  .route("/logout")
  .post(authenticate, authoriseRole("user"), authController.logoutUser);

export default authRouter;
