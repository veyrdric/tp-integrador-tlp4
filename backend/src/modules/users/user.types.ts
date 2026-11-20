import type { PermissionCode, RoleName } from "../roles/role.types.js";

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  createdAt: string;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}

// Lo que viaja en cada request autenticada: quién es y qué puede hacer.
export interface SessionUser extends User {
  permissions: PermissionCode[];
}

export interface NewUser {
  name: string;
  email: string;
  passwordHash: string;
  role: RoleName;
}
