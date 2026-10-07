import { Router, type Response } from "express";
import { BookRepository } from "./book.repository.js";
import { BookService, BookServiceError } from "./book.service.js";
import type { BookStatus } from "./book.types.js";

const bookRouter = Router();
const bookService = new BookService(new BookRepository());

bookRouter.get("/", (_request, response) => {
  response.status(200).json(bookService.findAll());
});

bookRouter.get("/:id", (request, response) => {
  try {
    const book = bookService.findById(request.params.id);
    response.status(200).json(book);
  } catch (error) {
    sendError(response, error);
  }
});

bookRouter.post("/", (request, response) => {
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
    sendError(response, error);
  }
});

bookRouter.put("/:id", (request, response) => {
  try {
    const { title, description, author, isbn } = request.body as {
      title?: string;
      description?: string;
      author?: string;
      isbn?: string;
    };

    const book = bookService.update(
      request.params.id,
      title,
      description,
      author,
      isbn,
    );
    response.status(200).json(book);
  } catch (error) {
    sendError(response, error);
  }
});

bookRouter.patch("/:id/status", (request, response) => {
  try {
    const { status } = request.body as { status: BookStatus };
    const book = bookService.changeStatus(request.params.id, status);
    response.status(200).json(book);
  } catch (error) {
    sendError(response, error);
  }
});

bookRouter.delete("/:id", (request, response) => {
  try {
    bookService.delete(request.params.id);
    response.status(204).send();
  } catch (error) {
    sendError(response, error);
  }
});

function sendError(response: Response, error: unknown): void {
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

export default bookRouter;