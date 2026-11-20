import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { PermissionCode } from "../types";

interface Props {
  children: ReactNode;
  permission?: PermissionCode;
}

// Sin sesión manda al login. Si se pide un permiso y no lo tiene, vuelve al listado.
export function ProtectedRoute({ children, permission }: Props) {
  const { user, loading, can } = useAuth();
  if (loading) return <p className="estado">Cargando…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (permission && !can(permission)) return <Navigate to="/" replace />;
  return children;
}
