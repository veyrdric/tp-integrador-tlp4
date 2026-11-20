import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { defineAssociations } from "./database/associations.js";
import { DatabaseConnection } from "./database/DatabaseConnection.js";
import { seed } from "./database/seed.js";
import { createAuthenticate } from "./middlewares/authenticate.js";
import { AuthController } from "./modules/auth/AuthController.js";
import { AuthService } from "./modules/auth/AuthService.js";
import { createAuthRoutes } from "./modules/auth/auth.routes.js";
import { BookController } from "./modules/books/BookController.js";
import { BookRepository } from "./modules/books/BookRepository.js";
import { BookService } from "./modules/books/BookService.js";
import { createBookRoutes } from "./modules/books/book.routes.js";
import type { BookStatusChangedEvent } from "./modules/books/book.types.js";
import { NotificationController } from "./modules/notifications/NotificationController.js";
import { NotificationRepository } from "./modules/notifications/NotificationRepository.js";
import { NotificationService } from "./modules/notifications/NotificationService.js";
import { NotifierFactory } from "./modules/notifications/NotifierFactory.js";
import { createNotificationRoutes } from "./modules/notifications/notification.routes.js";
import { RoleRepository } from "./modules/roles/RoleRepository.js";
import { SubscriptionController } from "./modules/subscriptions/SubscriptionController.js";
import { SubscriptionRepository } from "./modules/subscriptions/SubscriptionRepository.js";
import { SubscriptionService } from "./modules/subscriptions/SubscriptionService.js";
import { createSubscriptionRoutes } from "./modules/subscriptions/subscription.routes.js";
import { UserController } from "./modules/users/UserController.js";
import { UserRepository } from "./modules/users/UserRepository.js";
import { UserService } from "./modules/users/UserService.js";
import { createUserRoutes } from "./modules/users/user.routes.js";
import { EventPublisher } from "./observer/EventPublisher.js";

// Composition root: el único lugar donde se crean los objetos y se conectan entre sí.
async function main(): Promise<void> {
  defineAssociations();
  const database = DatabaseConnection.getInstance();
  await database.connect();
  await seed();
  console.log("Base de datos conectada y seed aplicado");

  // Repositorios
  const userRepository = new UserRepository();
  const roleRepository = new RoleRepository();
  const bookRepository = new BookRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const notificationRepository = new NotificationRepository();

  // Observer: el publisher avisa a NotificationService cada vez que un libro cambia de estado
  const bookEvents = new EventPublisher<BookStatusChangedEvent>();
  const notifierFactory = new NotifierFactory(notificationRepository);
  const notificationService = new NotificationService(
    subscriptionRepository,
    notificationRepository,
    notifierFactory,
    ["inapp", "console"],
  );
  bookEvents.attach(notificationService);

  // Services
  const authService = new AuthService(userRepository, env.jwt.secret, env.jwt.expiresIn);
  const userService = new UserService(userRepository, roleRepository);
  const bookService = new BookService(bookRepository, bookEvents);
  const subscriptionService = new SubscriptionService(subscriptionRepository, bookRepository);

  // Controllers y rutas
  const authenticate = createAuthenticate(authService);
  const app = createApp([
    { path: "/api/auth", router: createAuthRoutes(new AuthController(authService), authenticate) },
    { path: "/api/users", router: createUserRoutes(new UserController(userService), authenticate) },
    {
      path: "/api/books",
      router: createBookRoutes(new BookController(bookService, subscriptionService), authenticate),
    },
    {
      path: "/api/subscriptions",
      router: createSubscriptionRoutes(new SubscriptionController(subscriptionService), authenticate),
    },
    {
      path: "/api/notifications",
      router: createNotificationRoutes(new NotificationController(notificationService), authenticate),
    },
  ]);

  app.listen(env.apiPort, () => {
    console.log(`API escuchando en http://localhost:${env.apiPort}/api`);
  });
}

main().catch((error: unknown) => {
  console.error("No se pudo iniciar el servidor", error);
  process.exit(1);
});
