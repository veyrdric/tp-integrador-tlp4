import type { RoleName, User } from "../types";
import { apiFetch } from "./client";

export const usersApi = {
  list: () => apiFetch<User[]>("/users"),
  assignRole: (id: string, role: RoleName) =>
    apiFetch<User>(`/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
};
