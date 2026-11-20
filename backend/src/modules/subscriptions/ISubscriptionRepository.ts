export interface ISubscriptionRepository {
  subscribe(userId: string, bookId: string): Promise<void>;
  unsubscribe(userId: string, bookId: string): Promise<boolean>;
  isSubscribed(userId: string, bookId: string): Promise<boolean>;
}

export interface Subscriber {
  userId: string;
  email: string;
}

// Interfaz chica aparte: NotificationService solo necesita saber a quién avisar.
export interface ISubscriberFinder {
  findSubscribers(bookId: string): Promise<Subscriber[]>;
}
