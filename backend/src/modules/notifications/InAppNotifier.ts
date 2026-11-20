import type { INotificationWriter } from "./INotificationRepository.js";
import type { INotifier } from "./INotifier.js";
import type { Notification } from "./notification.types.js";

// Canal in-app: guarda la notificación en la base, sin leer, para la bandeja del usuario.
export class InAppNotifier implements INotifier {
  constructor(private readonly writer: INotificationWriter) {}

  async send(notification: Notification): Promise<void> {
    await this.writer.save(notification);
  }
}
