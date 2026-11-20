import cors from "cors";
import express, { type Express, type Router } from "express";
import { errorHandler } from "./middlewares/errorHandler.js";

export type RouteDefinition = {
  path: string;
  router: Router;
};

export function createApp(routes: RouteDefinition[]): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  for (const { path, router } of routes) {
    app.use(path, router);
  }
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "NOT_FOUND", message: "La ruta no existe" });
  });
  app.use(errorHandler);

  return app;
}
