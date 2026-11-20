import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import type { PermissionCode } from "../types";

// Muestra los hijos solo si el usuario tiene el permiso. Es un complemento:
// la protección real está en el backend, que responde 403.
export function Can({ permission, children }: { permission: PermissionCode; children: ReactNode }) {
  const { can } = useAuth();
  return can(permission) ? children : null;
}
