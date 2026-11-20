import type { ErrorRequestHandler } from "express";
import { AppError } from "../shared/AppError.js";

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.code, message: error.message });
    return;
  }
  if (error instanceof SyntaxError) {
    res.status(400).json({ error: "INVALID_JSON", message: "El body no es un JSON válido" });
    return;
  }
  console.error(error);
  res.status(500).json({ error: "INTERNAL_SERVER_ERROR", message: "Ocurrió un error inesperado" });
};
