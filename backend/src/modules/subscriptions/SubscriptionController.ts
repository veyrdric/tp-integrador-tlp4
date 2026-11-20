import type { Request, Response } from "express";
import { asBody, currentUserId, param, requiredString } from "../../shared/validation.js";
import type { SubscriptionService } from "./SubscriptionService.js";

export class SubscriptionController {
  constructor(private readonly subscriptions: SubscriptionService) {}

  subscribe = async (req: Request, res: Response): Promise<void> => {
    const bookId = requiredString(asBody(req.body), "bookId");
    await this.subscriptions.subscribe(currentUserId(req.user), bookId);
    res.status(201).json({ bookId, subscribed: true });
  };

  unsubscribe = async (req: Request, res: Response): Promise<void> => {
    const bookId = param(req.params.bookId, "bookId");
    await this.subscriptions.unsubscribe(currentUserId(req.user), bookId);
    res.json({ bookId, subscribed: false });
  };
}
