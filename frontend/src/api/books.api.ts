import type { Book, BookDetail, BookInput, BookStatus } from "../types";
import { apiFetch } from "./client";

export const booksApi = {
  list: () => apiFetch<Book[]>("/books"),
  get: (id: string) => apiFetch<BookDetail>(`/books/${id}`),
  create: (input: BookInput) => apiFetch<Book>("/books", { method: "POST", body: JSON.stringify(input) }),
  update: (id: string, input: BookInput) =>
    apiFetch<Book>(`/books/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  changeStatus: (id: string, status: BookStatus) =>
    apiFetch<Book>(`/books/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  remove: (id: string) => apiFetch<void>(`/books/${id}`, { method: "DELETE" }),
  subscribe: (bookId: string) =>
    apiFetch<void>("/subscriptions", { method: "POST", body: JSON.stringify({ bookId }) }),
  unsubscribe: (bookId: string) => apiFetch<void>(`/subscriptions/${bookId}`, { method: "DELETE" }),
};
