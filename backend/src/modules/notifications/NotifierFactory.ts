import { ConsoleNotifierAdapter } from "./ConsoleNotifierAdapter.js";
import { InAppNotifier } from "./InAppNotifier.js";
import type { INotificationWriter } from "./INotificationRepository.js";
import type { INotifier } from "./INotifier.js";
import type { NotifierChannel } from "./notification.types.js";

// Factory: el único lugar que sabe qué clase corresponde a cada canal.
export class NotifierFactory {
  constructor(private readonly writer: INotificationWriter) {}

  create(channel: NotifierChannel): INotifier {
    switch (channel) {
      case "inapp":
        return new InAppNotifier(this.writer);
      case "console":
        return new ConsoleNotifierAdapter();
    }
  }
}
