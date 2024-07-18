import { Router } from "express";
import { getUser, setUserDetails } from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const userRouter = Router();
userRouter.route("/getUser").get(authMiddleware("user"), getUser);
userRouter
  .route("/setUserDetails")
  .post(authMiddleware("user"), upload.single("avatar"), setUserDetails);
userRouter.route("/updateAccount").post(authMiddleware("user"));
userRouter.route("/deleteAccount").post(authMiddleware("user"));

export default userRouter;
