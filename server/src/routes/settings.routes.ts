import { Router } from "express";
import * as settingsController from "../controllers/settings.controller";
import { authenticate, authoriseRole } from "middlewares/auth.middleware";

const settingsRouter = Router();

settingsRouter.use(authenticate, authoriseRole("user"));
settingsRouter
  .route("/")
  .get(settingsController.getUserSettings)
  .patch(settingsController.updateUserSettings);

export default settingsRouter;
