import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "../api/auth.api";
import { tokenStorage } from "../api/client";
import type { AuthResult, PermissionCode, SessionUser } from "../types";

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  can: (permission: PermissionCode) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(() => tokenStorage.get() !== null);

  // Si quedó un token guardado, se recupera el usuario y sus permisos actuales.
  useEffect(() => {
    if (!tokenStorage.get()) return;
    let active = true;
    authApi
      .me()
      .then((me) => {
        if (active) setUser(me);
      })
      .catch(() => tokenStorage.clear())
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function startSession(result: AuthResult) {
    tokenStorage.set(result.token);
    setUser(result.user);
  }

  const value: AuthContextValue = {
    user,
    loading,
    login: async (email, password) => startSession(await authApi.login(email, password)),
    register: async (name, email, password) => startSession(await authApi.register(name, email, password)),
    logout: () => {
      tokenStorage.clear();
      setUser(null);
    },
    can: (permission) => user?.permissions.includes(permission) ?? false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth tiene que usarse dentro de AuthProvider");
  return context;
}
