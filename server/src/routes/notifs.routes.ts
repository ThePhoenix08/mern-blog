import { Router } from "express";
import * as notifController from "../controllers/notif.controller";
import { authenticate, authoriseRole } from "middlewares/auth.middleware";

const notifRouter = Router();
notifRouter.use(authenticate, authoriseRole("user"));
notifRouter.route("/").get(notifController.getNotifs);
notifRouter
  .route("/:notifId")
  .patch(notifController.markAsRead)
  .delete(notifController.deleteNotif);

export default notifRouter;
