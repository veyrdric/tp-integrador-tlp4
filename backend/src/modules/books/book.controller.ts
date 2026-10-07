import type { Request, Response } from "express";
import { BookRepository } from "./book.repository.js";
import { BookService, BookServiceError } from "./book.service.js";
import type { BookStatus } from "./book.types.js";

const bookService = new BookService(new BookRepository());

export class BookController {
  findAll = (_request: Request, response: Response): void => {
    response.status(200).json(bookService.findAll());
  };

  findById = (request: Request, response: Response): void => {
    try {
      const book = bookService.findById(this.getId(request));
      response.status(200).json(book);
    } catch (error) {
      this.sendError(response, error);
    }
  };

  create = (request: Request, response: Response): void => {
    try {
      const { title, description, author, isbn } = request.body as {
        title: string;
        description: string;
        author: string;
        isbn?: string;
      };

      const book = bookService.create(title, description, author, isbn);
      response.status(201).json(book);
    } catch (error) {
      this.sendError(response, error);
    }
  };

  update = (request: Request, response: Response): void => {
    try {
      const { title, description, author, isbn } = request.body as {
        title?: string;
        description?: string;
        author?: string;
        isbn?: string;
      };

      const book = bookService.update(
        this.getId(request),
        title,
        description,
        author,
        isbn,
      );
      response.status(200).json(book);
    } catch (error) {
      this.sendError(response, error);
    }
  };

  changeStatus = (request: Request, response: Response): void => {
    try {
      const { status } = request.body as { status: BookStatus };
      const book = bookService.changeStatus(this.getId(request), status);
      response.status(200).json(book);
    } catch (error) {
      this.sendError(response, error);
    }
  };

  delete = (request: Request, response: Response): void => {
    try {
      bookService.delete(this.getId(request));
      response.status(204).send();
    } catch (error) {
      this.sendError(response, error);
    }
  };

  private sendError(response: Response, error: unknown): void {
    if (error instanceof BookServiceError) {
      response.status(error.statusCode).json({
        error: error.error,
        message: error.message,
        statusCode: error.statusCode,
      });
      return;
    }

    response.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Ocurrió un error inesperado",
      statusCode: 500,
    });
  }

  private getId(request: Request): string {
    const { id } = request.params;

    if (typeof id !== "string") {
      throw new BookServiceError(
        "INVALID_BOOK_ID",
        "El identificador del libro no es válido",
        400,
      );
    }

    return id;
  }
}

export const bookController = new BookController();
