export const BOOK_STATUSES = ["DISPONIBLE", "PRESTADO", "EN_REPARACION"] as const;
export type BookStatus = (typeof BOOK_STATUSES)[number];

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

export interface BookInput {
  title: string;
  description: string;
  author: string;
  isbn?: string;
}

// Evento que publica BookService cuando un libro cambia de estado.
export interface BookStatusChangedEvent {
  bookId: string;
  bookTitle: string;
  previousStatus: BookStatus;
  newStatus: BookStatus;
  changedAt: Date;
}

export function isBookStatus(value: unknown): value is BookStatus {
  return typeof value === "string" && (BOOK_STATUSES as readonly string[]).includes(value);
}
