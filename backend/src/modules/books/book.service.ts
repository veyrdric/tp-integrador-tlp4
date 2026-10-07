import { BookRepository } from "./book.repository.js";
import type { Book, BookStatus } from "./book.types.js";

export class BookService {
  constructor(private readonly repository: BookRepository) {}

  findAll(): Book[] {
    return this.repository.findAll();
  }

  findById(id: string): Book {
    const book = this.repository.findById(id);

    if (!book) {
      throw new BookServiceError(
        "BOOK_NOT_FOUND",
        "El libro no existe",
        404,
      );
    }

    return book;
  }

  create(
    title: string,
    description: string,
    author: string,
    isbn?: string,
  ): Book {
    this.validateRequiredText(title, "title");
    this.validateRequiredText(description, "description");
    this.validateRequiredText(author, "author");
    this.validateOptionalText(isbn, "isbn");

    return this.repository.create(title, description, author, isbn);
  }

  update(
    id: string,
    title?: string,
    description?: string,
    author?: string,
    isbn?: string,
  ): Book {
    this.findById(id);

    if (title !== undefined) {
      this.validateRequiredText(title, "title");
    }
    if (description !== undefined) {
      this.validateRequiredText(description, "description");
    }
    if (author !== undefined) {
      this.validateRequiredText(author, "author");
    }
    this.validateOptionalText(isbn, "isbn");

    const updatedBook = this.repository.update(
      id,
      title,
      description,
      author,
      isbn,
    );

    if (!updatedBook) {
      throw new BookServiceError(
        "BOOK_NOT_FOUND",
        "El libro no existe",
        404,
      );
    }

    return updatedBook;
  }

  changeStatus(id: string, status: BookStatus): Book {
    this.findById(id);

    const validStatuses: BookStatus[] = [
      "DISPONIBLE",
      "PRESTADO",
      "EN_REPARACION",
    ];

    if (!validStatuses.includes(status)) {
      throw new BookServiceError(
        "INVALID_BOOK_STATUS",
        "El estado del libro no es válido",
        400,
      );
    }

    const updatedBook = this.repository.updateStatus(id, status);
    if (!updatedBook) {
      throw new BookServiceError(
        "BOOK_NOT_FOUND",
        "El libro no existe",
        404,
      );
    }

    return updatedBook;
  }

  delete(id: string): void {
    this.findById(id);
    this.repository.delete(id);
  }

  private validateRequiredText(value: string, field: string): void {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new BookServiceError(
        "INVALID_BOOK_DATA",
        `El campo ${field} es obligatorio`,
        400,
      );
    }
  }

  private validateOptionalText(value: string | undefined, field: string): void {
    if (value !== undefined && value.trim().length === 0) {
      throw new BookServiceError(
        "INVALID_BOOK_DATA",
        `El campo ${field} no puede estar vacío`,
        400,
      );
    }
  }
}

export class BookServiceError extends Error {
  constructor(
    public readonly error: string,
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}