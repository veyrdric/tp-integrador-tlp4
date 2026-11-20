import { Router, type RequestHandler } from "express";
import { authorize } from "../../middlewares/authorize.js";
import type { BookController } from "./BookController.js";

export function createBookRoutes(controller: BookController, authenticate: RequestHandler): Router {
  const router = Router();
  router.use(authenticate);
  router.get("/", authorize("book:read"), controller.findAll);
  router.get("/:id", authorize("book:read"), controller.findById);
  router.post("/", authorize("book:create"), controller.create);
  router.put("/:id", authorize("book:update"), controller.update);
  router.patch("/:id/status", authorize("book:change-status"), controller.changeStatus);
  router.delete("/:id", authorize("book:delete"), controller.delete);
  return router;
}
