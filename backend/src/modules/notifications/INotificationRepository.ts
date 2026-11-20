import type { Notification, StoredNotification } from "./notification.types.js";

// Separadas para que InAppNotifier dependa solo de lo que usa: guardar.
export interface INotificationWriter {
  save(notification: Notification): Promise<void>;
}

export interface INotificationReader {
  findByUser(userId: string): Promise<StoredNotification[]>;
  countUnread(userId: string): Promise<number>;
  markAsRead(id: string, userId: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<void>;
}

export interface INotificationRepository extends INotificationWriter, INotificationReader {}
