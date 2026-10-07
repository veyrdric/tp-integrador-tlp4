import { randomUUID } from "node:crypto";
import type { Book, BookStatus } from "./book.types.js";

export class BookRepository {
  private readonly books = new Map<string, Book>([
    [
      "book-1",
      {
        id: "book-1",
        title: "Don Quijote de la Mancha",
        description: "Novela clásica de la literatura española.",
        author: "Miguel de Cervantes",
        isbn: "9788420412146",
        status: "DISPONIBLE",
        createdAt: "2026-09-29T12:00:00.000Z",
        updatedAt: "2026-09-29T12:00:00.000Z",
      },
    ],
    [
      "book-2",
      {
        id: "book-2",
        title: "El principito",
        description: "Relato sobre la amistad y la responsabilidad.",
        author: "Antoine de Saint-Exupery",
        status: "PRESTADO",
        createdAt: "2026-09-29T12:00:00.000Z",
        updatedAt: "2026-09-29T12:00:00.000Z",
      },
    ],
  ]);

  findAll(): Book[] {
    return [...this.books.values()];
  }

  findById(id: string): Book | undefined {
    return this.books.get(id);
  }

  create(
    title: string,
    description: string,
    author: string,
    isbn?: string,
  ): Book {
    const now = new Date().toISOString();
    const book: Book = {
      id: `book-${randomUUID()}`,
      title,
      description,
      author,
      ...(isbn === undefined ? {} : { isbn }),
      status: "DISPONIBLE",
      createdAt: now,
      updatedAt: now,
    };

    this.books.set(book.id, book);
    return book;
  }

  update(
    id: string,
    title?: string,
    description?: string,
    author?: string,
    isbn?: string,
  ): Book | undefined {
    const currentBook = this.books.get(id);
    if (!currentBook) {
      return undefined;
    }

    const updatedBook: Book = {
      ...currentBook,
      ...(title === undefined ? {} : { title }),
      ...(description === undefined ? {} : { description }),
      ...(author === undefined ? {} : { author }),
      ...(isbn === undefined ? {} : { isbn }),
      updatedAt: new Date().toISOString(),
    };

    this.books.set(id, updatedBook);
    return updatedBook;
  }

  updateStatus(id: string, status: BookStatus): Book | undefined {
    const currentBook = this.books.get(id);
    if (!currentBook) {
      return undefined;
    }

    const updatedBook: Book = {
      ...currentBook,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.books.set(id, updatedBook);
    return updatedBook;
  }

  delete(id: string): boolean {
    return this.books.delete(id);
  }
}