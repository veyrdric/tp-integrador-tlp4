export type BookStatus = "DISPONIBLE" | "PRESTADO" | "EN_REPARACION";

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