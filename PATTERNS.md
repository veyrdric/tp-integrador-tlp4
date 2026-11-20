# Patrones de diseño y principios SOLID

Los cuatro patrones participan del mismo flujo: el cambio de estado de un libro.

```
BookService.changeStatus()
   └─> EventPublisher.notify(evento)                     ← Observer (Subject)
         └─> NotificationService.update(evento)          ← Observer (Observer)
               ├─ SubscriptionRepository.findSubscribers ← usa DatabaseConnection (Singleton)
               └─ notifiers creados por NotifierFactory  ← Factory
                     ├─ InAppNotifier                    → guarda en la base
                     └─ ConsoleNotifierAdapter           ← Adapter → console.log
```

---

## Singleton — `DatabaseConnection`

**Archivo:** `backend/src/database/DatabaseConnection.ts`

**Problema que resuelve:** toda la aplicación tiene que trabajar sobre una única conexión a
PostgreSQL. Si cada modelo o repositorio creara su propia instancia de `Sequelize`, se abrirían
varios pools de conexiones y los modelos quedarían registrados en instancias distintas. El
constructor privado impide crear otra, y `getInstance()` devuelve siempre la misma.

```ts
export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  readonly sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, { /* … */ });
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}
```

Todos los modelos se registran sobre esa instancia, por ejemplo en `backend/src/modules/books/Book.ts`:
`{ sequelize: DatabaseConnection.getInstance().sequelize, tableName: "books" }`.

---

## Observer — `ISubject`, `IObserver`, `EventPublisher`, `NotificationService`

**Archivos:**
- `backend/src/observer/ISubject.ts`
- `backend/src/observer/IObserver.ts`
- `backend/src/observer/EventPublisher.ts` (Subject)
- `backend/src/modules/notifications/NotificationService.ts` (Observer)
- `backend/src/modules/books/BookService.ts` (publica el evento)
- `backend/src/main.ts` (registra el observer)

**Problema que resuelve:** `BookService` tiene que avisar que un libro cambió de estado, pero no
debería saber quién reacciona ni cómo. Con el Observer, el servicio solo llama a `notify()` y el
`EventPublisher` reparte el evento entre los observers registrados. Se pueden sumar reacciones
nuevas, como registrar un historial, sin tocar `BookService`. La implementación es propia, sin
`EventEmitter`.

```ts
// backend/src/observer/EventPublisher.ts
export class EventPublisher<TEvent> implements ISubject<TEvent> {
  private readonly observers = new Set<IObserver<TEvent>>();

  attach(observer: IObserver<TEvent>): void { this.observers.add(observer); }
  detach(observer: IObserver<TEvent>): void { this.observers.delete(observer); }

  async notify(event: TEvent): Promise<void> {
    const results = await Promise.allSettled([...this.observers].map((o) => o.update(event)));
    // si un observer falla, se registra el error y los demás igual reciben el evento
  }
}
```

```ts
// backend/src/modules/books/BookService.ts
await this.publisher.notify({ bookId: updated.id, bookTitle: updated.title,
  previousStatus: current.status, newStatus, changedAt: new Date() });

// backend/src/main.ts
const bookEvents = new EventPublisher<BookStatusChangedEvent>();
bookEvents.attach(notificationService);
```

Los observers son objetos del backend; las suscripciones son datos en la tabla `subscriptions`.
`NotificationService.update()` consulta esas suscripciones para saber a quién avisar.

---

## Factory — `NotifierFactory`

**Archivos:**
- `backend/src/modules/notifications/INotifier.ts`
- `backend/src/modules/notifications/NotifierFactory.ts`
- `backend/src/modules/notifications/InAppNotifier.ts`

**Problema que resuelve:** `NotificationService` necesita varios canales, pero no tiene que saber
qué clase implementa cada uno ni qué dependencias necesita: `InAppNotifier` necesita el
repositorio y la consola no. La Factory concentra ese conocimiento, y el servicio pide los canales
por nombre sin hacer `new`.

```ts
// backend/src/modules/notifications/NotifierFactory.ts
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

// backend/src/modules/notifications/NotificationService.ts
this.notifiers = channels.map((channel) => factory.create(channel));
```

---

## Adapter — `ConsoleNotifierAdapter`

**Archivo:** `backend/src/modules/notifications/ConsoleNotifierAdapter.ts`

**Problema que resuelve:** la aplicación espera que todo canal cumpla `INotifier`: recibe un objeto
`Notification` y devuelve una promesa. `console.log` recibe texto y no devuelve nada. El adapter
traduce de una forma a la otra, y así `NotificationService` nunca llama a `console.log` directamente.

```ts
export class ConsoleNotifierAdapter implements INotifier {
  constructor(private readonly log: (line: string) => void = console.log) {}

  async send(notification: Notification): Promise<void> {
    this.log(
      `[NOTIFICACIÓN] Para: ${notification.userEmail} | Libro "${notification.bookTitle}" | ` +
        `Estado: ${notification.previousStatus} → ${notification.newStatus}`,
    );
  }
}
```

Salida en `docker compose logs backend`:

```
[NOTIFICACIÓN] Para: usuario@tp.com | Libro "Ficciones" | Estado: DISPONIBLE → PRESTADO
```

---

## S — Responsabilidad única

**Archivos:** cada módulo de `backend/src/modules/`, por ejemplo `books/BookController.ts`,
`books/BookService.ts` y `books/BookRepository.ts`.

**Problema que resuelve:** cada capa cambia por un motivo distinto. El controller valida la
entrada y arma la respuesta HTTP; el service tiene la regla de negocio y no conoce Express; el
repositorio es el único que habla con Sequelize. Si mañana cambia la base, solo se toca el
repositorio.

```ts
// Controller: entrada y respuesta
changeStatus = async (req: Request, res: Response) => {
  const { status } = asBody(req.body);
  if (!isBookStatus(status)) throw new AppError(400, "INVALID_STATUS", "…");
  res.json(await this.books.changeStatus(param(req.params.id, "id"), status));
};

// Service: regla de negocio, sin req ni res
if (current.status === newStatus) throw new AppError(400, "SAME_STATUS", "…");
```

---

## O — Abierto/cerrado

**Archivos:** `backend/src/modules/notifications/NotificationService.ts`,
`backend/src/modules/notifications/NotifierFactory.ts` y `backend/src/main.ts`.

**Problema que resuelve:** agregar un canal nuevo, por ejemplo un log en archivo, no requiere
modificar `NotificationService`. Se crea una clase que implemente `INotifier`, se agrega su caso
en la Factory y se suma el nombre a la lista de canales en `main.ts`.

```ts
// backend/src/main.ts
const notificationService = new NotificationService(
  subscriptionRepository,
  notificationRepository,
  notifierFactory,
  ["inapp", "console"], // agregar un canal es sumar su nombre acá
);
```

---

## L — Sustitución de Liskov

**Archivos:** `backend/src/modules/notifications/InAppNotifier.ts` y
`backend/src/modules/notifications/ConsoleNotifierAdapter.ts`.

**Problema que resuelve:** `NotificationService` trata a todos los canales como `INotifier` y los
recorre igual. Cualquiera puede reemplazar a otro sin que el servicio note la diferencia: los dos
reciben la misma `Notification` y devuelven una promesa.

```ts
await Promise.all(this.notifiers.map((notifier) => notifier.send(notification)));
```

---

## I — Segregación de interfaces

**Archivos:** `backend/src/modules/notifications/INotificationRepository.ts` y
`backend/src/modules/subscriptions/ISubscriptionRepository.ts`.

**Problema que resuelve:** cada clase depende solo de lo que usa. `InAppNotifier` solo guarda,
así que depende de `INotificationWriter` y no de los métodos de lectura de la bandeja.
`NotificationService` solo necesita saber a quién avisar, así que depende de `ISubscriberFinder`
y no de suscribir o desuscribir.

```ts
export interface INotificationWriter {
  save(notification: Notification): Promise<void>;
}

export interface INotificationReader {
  findByUser(userId: string): Promise<StoredNotification[]>;
  countUnread(userId: string): Promise<number>;
  markAsRead(id: string, userId: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<void>;
}

export interface ISubscriberFinder {
  findSubscribers(bookId: string): Promise<Subscriber[]>;
}
```

---

## D — Inversión de dependencias

**Archivos:** los services de `backend/src/modules/*/` y `backend/src/main.ts`.

**Problema que resuelve:** los services dependen de interfaces, no de las clases que usan
Sequelize. Reciben sus dependencias por constructor y `main.ts` decide qué implementación pasar.
Así se puede probar un service con un repositorio falso, o cambiar de base, sin tocarlo.

```ts
// backend/src/modules/books/BookService.ts
export class BookService {
  constructor(
    private readonly books: IBookRepository,
    private readonly publisher: ISubject<BookStatusChangedEvent>,
  ) {}
}

// backend/src/main.ts
const bookService = new BookService(bookRepository, bookEvents);
```
