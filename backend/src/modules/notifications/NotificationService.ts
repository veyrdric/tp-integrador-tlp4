import type { IObserver } from "../../observer/IObserver.js";
import { AppError } from "../../shared/AppError.js";
import type { BookStatusChangedEvent } from "../books/book.types.js";
import type { ISubscriberFinder } from "../subscriptions/ISubscriptionRepository.js";
import type { INotificationReader } from "./INotificationRepository.js";
import type { INotifier } from "./INotifier.js";
import type { NotifierFactory } from "./NotifierFactory.js";
import type { NotifierChannel, StoredNotification } from "./notification.types.js";

// Observer: se registra en el EventPublisher desde main.ts y reacciona a cada cambio de estado.
export class NotificationService implements IObserver<BookStatusChangedEvent> {
  private readonly notifiers: INotifier[];

  constructor(
    private readonly subscribers: ISubscriberFinder,
    private readonly reader: INotificationReader,
    factory: NotifierFactory,
    channels: NotifierChannel[],
  ) {
    // Los canales los crea la Factory: este servicio nunca hace new de un notificador.
    this.notifiers = channels.map((channel) => factory.create(channel));
  }

  async update(event: BookStatusChangedEvent): Promise<void> {
    const subscribers = await this.subscribers.findSubscribers(event.bookId);

    for (const subscriber of subscribers) {
      const notification = {
        userId: subscriber.userId,
        userEmail: subscriber.email,
        bookId: event.bookId,
        bookTitle: event.bookTitle,
        previousStatus: event.previousStatus,
        newStatus: event.newStatus,
        message: `“${event.bookTitle}” pasó de ${event.previousStatus} a ${event.newStatus}.`,
      };
      await Promise.all(this.notifiers.map((notifier) => notifier.send(notification)));
    }
  }

  findByUser(userId: string): Promise<StoredNotification[]> {
    return this.reader.findByUser(userId);
  }

  countUnread(userId: string): Promise<number> {
    return this.reader.countUnread(userId);
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    const updated = await this.reader.markAsRead(id, userId);
    if (!updated) throw new AppError(404, "NOTIFICATION_NOT_FOUND", "La notificación no existe");
  }

  markAllAsRead(userId: string): Promise<void> {
    return this.reader.markAllAsRead(userId);
  }
}
