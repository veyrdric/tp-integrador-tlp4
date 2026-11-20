import { Router, type RequestHandler } from "express";
import { authorize } from "../../middlewares/authorize.js";
import type { UserController } from "./UserController.js";

export function createUserRoutes(controller: UserController, authenticate: RequestHandler): Router {
  const router = Router();
  router.use(authenticate);
  router.get("/", authorize("user:read"), controller.findAll);
  router.get("/roles", authorize("user:assign-role"), controller.findRoles);
  router.patch("/:id/role", authorize("user:assign-role"), controller.assignRole);
  return router;
}
