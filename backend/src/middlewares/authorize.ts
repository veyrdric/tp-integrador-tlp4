import type { RequestHandler } from "express";
import type { PermissionCode } from "../modules/roles/role.types.js";
import { AppError } from "../shared/AppError.js";

// La validación de permisos vive en el backend: sin el permiso, 403 aunque se llame desde curl.
export function authorize(permission: PermissionCode): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) throw new AppError(401, "UNAUTHENTICATED", "Tenés que iniciar sesión");
    if (!req.user.permissions.includes(permission)) {
      throw new AppError(403, "FORBIDDEN", `No tenés permiso para esta acción (${permission})`);
    }
    next();
  };
}
