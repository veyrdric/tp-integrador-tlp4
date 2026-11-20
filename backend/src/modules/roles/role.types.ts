export const ROLE_NAMES = ["admin", "operador", "usuario"] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export const PERMISSIONS = [
  "book:read",
  "book:create",
  "book:update",
  "book:change-status",
  "book:delete",
  "subscription:create",
  "subscription:delete",
  "notification:read",
  "user:read",
  "user:assign-role",
] as const;
export type PermissionCode = (typeof PERMISSIONS)[number];

export interface Role {
  name: RoleName;
  permissions: PermissionCode[];
}

export function isRoleName(value: unknown): value is RoleName {
  return typeof value === "string" && (ROLE_NAMES as readonly string[]).includes(value);
}
