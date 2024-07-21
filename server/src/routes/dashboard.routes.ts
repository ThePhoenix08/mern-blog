import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { authenticate, authoriseRole } from "middlewares/auth.middleware";

const dashboardRouter = Router();

dashboardRouter
  .route("/overview")
  .get(
    authenticate,
    authoriseRole("blogger"),
    dashboardController.getOverviewAnalytics
  );

dashboardRouter
  .route("/posts")
  .get(
    authenticate,
    authoriseRole("blogger"),
    dashboardController.getPostAnalytics
  );

dashboardRouter
  .route("/audience")
  .get(
    authenticate,
    authoriseRole("blogger"),
    dashboardController.getAudienceAnalytics
  );

export default dashboardRouter;
