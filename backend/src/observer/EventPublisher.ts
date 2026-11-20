import type { IObserver } from "./IObserver.js";
import type { ISubject } from "./ISubject.js";

// Subject del patrón Observer, hecho a mano (sin EventEmitter de Node).
export class EventPublisher<TEvent> implements ISubject<TEvent> {
  private readonly observers = new Set<IObserver<TEvent>>();

  attach(observer: IObserver<TEvent>): void {
    this.observers.add(observer);
  }

  detach(observer: IObserver<TEvent>): void {
    this.observers.delete(observer);
  }

  // Avisa a todos los observers. Si uno falla, los demás igual reciben el evento.
  async notify(event: TEvent): Promise<void> {
    const results = await Promise.allSettled([...this.observers].map((observer) => observer.update(event)));
    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Un observer falló al procesar el evento", result.reason);
      }
    }
  }
}
