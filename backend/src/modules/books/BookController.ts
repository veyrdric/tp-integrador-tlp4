import type { Request, Response } from "express";
import { AppError } from "../../shared/AppError.js";
import { asBody, currentUserId, optionalString, param, requiredString } from "../../shared/validation.js";
import type { SubscriptionService } from "../subscriptions/SubscriptionService.js";
import type { BookService } from "./BookService.js";
import { isBookStatus, type BookInput } from "./book.types.js";

export class BookController {
  constructor(
    private readonly books: BookService,
    private readonly subscriptions: SubscriptionService,
  ) {}

  findAll = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.books.findAll());
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    const id = param(req.params.id, "id");
    const book = await this.books.findById(id);
    const subscribed = await this.subscriptions.isSubscribed(currentUserId(req.user), id);
    res.json({ ...book, subscribed });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const body = asBody(req.body);
    const isbn = optionalString(body, "isbn");
    const input: BookInput = {
      title: requiredString(body, "title"),
      description: requiredString(body, "description"),
      author: requiredString(body, "author"),
      ...(isbn ? { isbn } : {}),
    };
    res.status(201).json(await this.books.create(input));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const body = asBody(req.body);
    const changes: Partial<BookInput> = {};
    for (const field of ["title", "description", "author", "isbn"] as const) {
      if (body[field] === undefined) continue;
      changes[field] = field === "isbn" ? (optionalString(body, field) ?? "") : requiredString(body, field);
    }
    res.json(await this.books.update(param(req.params.id, "id"), changes));
  };

  changeStatus = async (req: Request, res: Response): Promise<void> => {
    const { status } = asBody(req.body);
    if (!isBookStatus(status)) {
      throw new AppError(400, "INVALID_STATUS", "El estado tiene que ser DISPONIBLE, PRESTADO o EN_REPARACION");
    }
    res.json(await this.books.changeStatus(param(req.params.id, "id"), status));
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.books.delete(param(req.params.id, "id"));
    res.status(204).send();
  };
}
