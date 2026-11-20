export type BookStatus = "DISPONIBLE" | "PRESTADO" | "EN_REPARACION";
export const BOOK_STATUSES: BookStatus[] = ["DISPONIBLE", "PRESTADO", "EN_REPARACION"];

export type RoleName = "admin" | "operador" | "usuario";
export const ROLE_NAMES: RoleName[] = ["admin", "operador", "usuario"];

export type PermissionCode =
  | "book:read"
  | "book:create"
  | "book:update"
  | "book:change-status"
  | "book:delete"
  | "subscription:create"
  | "subscription:delete"
  | "notification:read"
  | "user:read"
  | "user:assign-role";

export interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  isbn?: string;
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookDetail extends Book {
  subscribed: boolean;
}

export interface BookInput {
  title: string;
  description: string;
  author: string;
  isbn?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  createdAt: string;
}

export interface SessionUser extends User {
  permissions: PermissionCode[];
}

export interface AuthResult {
  token: string;
  user: SessionUser;
}

export interface AppNotification {
  id: string;
  bookId: string | null;
  bookTitle: string;
  previousStatus: BookStatus;
  newStatus: BookStatus;
  message: string;
  read: boolean;
  createdAt: string;
}
