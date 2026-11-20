import type { RequestHandler } from "express";
import { AppError } from "../shared/AppError.js";
import type { AuthService } from "../modules/auth/AuthService.js";

// Verifica el JWT del header Authorization y deja el usuario con sus permisos en req.user.
export function createAuthenticate(authService: AuthService): RequestHandler {
  return async (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new AppError(401, "UNAUTHENTICATED", "Tenés que iniciar sesión");
    }
    req.user = await authService.verify(header.slice("Bearer ".length));
    next();
  };
}
