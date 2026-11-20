import type { BookStatus } from "../books/book.types.js";

// Lo que recibe cualquier canal de notificación (INotifier).
export interface Notification {
  userId: string;
  userEmail: string;
  bookId: string;
  bookTitle: string;
  previousStatus: BookStatus;
  newStatus: BookStatus;
  message: string;
}

// Una notificación guardada en la bandeja de un usuario.
export interface StoredNotification {
  id: string;
  bookId: string | null;
  bookTitle: string;
  previousStatus: BookStatus;
  newStatus: BookStatus;
  message: string;
  read: boolean;
  createdAt: string;
}

export type NotifierChannel = "inapp" | "console";
