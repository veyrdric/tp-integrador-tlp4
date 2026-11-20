import type { Notification } from "./notification.types.js";

export interface INotifier {
  send(notification: Notification): Promise<void>;
}
