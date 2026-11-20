import { Router, type RequestHandler } from "express";
import { authorize } from "../../middlewares/authorize.js";
import type { SubscriptionController } from "./SubscriptionController.js";

export function createSubscriptionRoutes(controller: SubscriptionController, authenticate: RequestHandler): Router {
  const router = Router();
  router.use(authenticate);
  router.post("/", authorize("subscription:create"), controller.subscribe);
  router.delete("/:bookId", authorize("subscription:delete"), controller.unsubscribe);
  return router;
}
