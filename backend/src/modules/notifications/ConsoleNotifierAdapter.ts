import type { INotifier } from "./INotifier.js";
import type { Notification } from "./notification.types.js";

// Adapter: la app espera un INotifier que recibe un objeto y devuelve una promesa;
// console.log recibe texto y no devuelve nada. Esta clase traduce de una forma a la otra.
export class ConsoleNotifierAdapter implements INotifier {
  constructor(private readonly log: (line: string) => void = console.log) {}

  async send(notification: Notification): Promise<void> {
    this.log(
      `[NOTIFICACIÓN] Para: ${notification.userEmail} | Libro "${notification.bookTitle}" | ` +
        `Estado: ${notification.previousStatus} → ${notification.newStatus}`,
    );
  }
}
