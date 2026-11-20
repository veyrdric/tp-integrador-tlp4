import type { INotificationRepository } from "./INotificationRepository.js";
import { NotificationModel } from "./Notification.js";
import type { Notification, StoredNotification } from "./notification.types.js";

function toStored(model: NotificationModel): StoredNotification {
  return {
    id: model.id,
    bookId: model.bookId,
    bookTitle: model.bookTitle,
    previousStatus: model.previousStatus,
    newStatus: model.newStatus,
    message: model.message,
    read: model.read,
    createdAt: model.createdAt.toISOString(),
  };
}

export class NotificationRepository implements INotificationRepository {
  async save(notification: Notification): Promise<void> {
    await NotificationModel.create({
      userId: notification.userId,
      bookId: notification.bookId,
      bookTitle: notification.bookTitle,
      previousStatus: notification.previousStatus,
      newStatus: notification.newStatus,
      message: notification.message,
    });
  }

  async findByUser(userId: string): Promise<StoredNotification[]> {
    const notifications = await NotificationModel.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
    return notifications.map(toStored);
  }

  async countUnread(userId: string): Promise<number> {
    return NotificationModel.count({ where: { userId, read: false } });
  }

  async markAsRead(id: string, userId: string): Promise<boolean> {
    const [updated] = await NotificationModel.update({ read: true }, { where: { id, userId } });
    return updated > 0;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.update({ read: true }, { where: { userId, read: false } });
  }
}
