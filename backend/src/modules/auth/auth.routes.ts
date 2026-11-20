import { Router, type RequestHandler } from "express";
import type { AuthController } from "./AuthController.js";

export function createAuthRoutes(controller: AuthController, authenticate: RequestHandler): Router {
  const router = Router();
  router.post("/register", controller.register);
  router.post("/login", controller.login);
  router.get("/me", authenticate, controller.me);
  return router;
}
