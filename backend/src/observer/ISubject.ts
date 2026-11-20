import type { IObserver } from "./IObserver.js";

export interface ISubject<TEvent> {
  attach(observer: IObserver<TEvent>): void;
  detach(observer: IObserver<TEvent>): void;
  notify(event: TEvent): Promise<void>;
}
