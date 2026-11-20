import { AppError } from "../../shared/AppError.js";
import type { IBookRepository } from "../books/IBookRepository.js";
import type { ISubscriptionRepository } from "./ISubscriptionRepository.js";

export class SubscriptionService {
  constructor(
    private readonly subscriptions: ISubscriptionRepository,
    private readonly books: IBookRepository,
  ) {}

  async subscribe(userId: string, bookId: string): Promise<void> {
    if (!(await this.books.findById(bookId))) {
      throw new AppError(404, "BOOK_NOT_FOUND", "El libro no existe");
    }
    await this.subscriptions.subscribe(userId, bookId);
  }

  async unsubscribe(userId: string, bookId: string): Promise<void> {
    const removed = await this.subscriptions.unsubscribe(userId, bookId);
    if (!removed) throw new AppError(404, "SUBSCRIPTION_NOT_FOUND", "No estabas suscripto a este libro");
  }

  isSubscribed(userId: string, bookId: string): Promise<boolean> {
    return this.subscriptions.isSubscribed(userId, bookId);
  }
}
