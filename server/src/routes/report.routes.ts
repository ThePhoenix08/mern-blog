import { Router } from "express";
import { authenticate, authoriseRole } from "middlewares/auth.middleware";
import * as reportController from "controllers/report.controller";

const reportRouter = Router();
reportRouter
  .route("/new")
  .post(authenticate, authoriseRole("user"), reportController.createReport);

reportRouter
  .route("/list")
  .get(authenticate, authoriseRole("admin"), reportController.getReports)
  .delete(authenticate, authoriseRole("admin"), reportController.deleteReports);

export default reportRouter;
