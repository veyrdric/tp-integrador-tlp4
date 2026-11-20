import type { AuthResult, SessionUser } from "../types";
import { apiFetch } from "./client";

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthResult>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) =>
    apiFetch<AuthResult>("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  me: () => apiFetch<SessionUser>("/auth/me"),
};
