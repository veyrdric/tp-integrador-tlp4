import type { Book, BookInput, BookStatus } from "./book.types.js";

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findById(id: string): Promise<Book | null>;
  create(input: BookInput): Promise<Book>;
  update(id: string, changes: Partial<BookInput>): Promise<Book | null>;
  updateStatus(id: string, status: BookStatus): Promise<Book | null>;
  delete(id: string): Promise<boolean>;
}
