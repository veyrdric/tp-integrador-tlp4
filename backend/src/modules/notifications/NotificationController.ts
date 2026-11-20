import type { Request, Response } from "express";
import { currentUserId, param } from "../../shared/validation.js";
import type { NotificationService } from "./NotificationService.js";

export class NotificationController {
  constructor(private readonly notifications: NotificationService) {}

  findMine = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.notifications.findByUser(currentUserId(req.user)));
  };

  unreadCount = async (req: Request, res: Response): Promise<void> => {
    res.json({ count: await this.notifications.countUnread(currentUserId(req.user)) });
  };

  markAsRead = async (req: Request, res: Response): Promise<void> => {
    await this.notifications.markAsRead(param(req.params.id, "id"), currentUserId(req.user));
    res.status(204).send();
  };

  markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    await this.notifications.markAllAsRead(currentUserId(req.user));
    res.status(204).send();
  };
}
