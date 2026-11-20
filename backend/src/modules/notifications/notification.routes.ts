import { Router, type RequestHandler } from "express";
import { authorize } from "../../middlewares/authorize.js";
import type { NotificationController } from "./NotificationController.js";

export function createNotificationRoutes(controller: NotificationController, authenticate: RequestHandler): Router {
  const router = Router();
  router.use(authenticate, authorize("notification:read"));
  router.get("/", controller.findMine);
  router.get("/unread-count", controller.unreadCount);
  router.patch("/read-all", controller.markAllAsRead);
  router.patch("/:id/read", controller.markAsRead);
  return router;
}
