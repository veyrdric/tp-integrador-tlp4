import type { ISubject } from "../../observer/ISubject.js";
import { AppError } from "../../shared/AppError.js";
import type { IBookRepository } from "./IBookRepository.js";
import type { Book, BookInput, BookStatus, BookStatusChangedEvent } from "./book.types.js";

const notFound = () => new AppError(404, "BOOK_NOT_FOUND", "El libro no existe");

export class BookService {
  constructor(
    private readonly books: IBookRepository,
    private readonly publisher: ISubject<BookStatusChangedEvent>,
  ) {}

  findAll(): Promise<Book[]> {
    return this.books.findAll();
  }

  async findById(id: string): Promise<Book> {
    const book = await this.books.findById(id);
    if (!book) throw notFound();
    return book;
  }

  create(input: BookInput): Promise<Book> {
    return this.books.create(input);
  }

  async update(id: string, changes: Partial<BookInput>): Promise<Book> {
    const book = await this.books.update(id, changes);
    if (!book) throw notFound();
    return book;
  }

  // Cambia el estado y avisa al publisher: él se encarga de que lleguen las notificaciones.
  async changeStatus(id: string, newStatus: BookStatus): Promise<Book> {
    const current = await this.findById(id);
    if (current.status === newStatus) {
      throw new AppError(400, "SAME_STATUS", `El libro ya está en estado ${newStatus}`);
    }

    const updated = await this.books.updateStatus(id, newStatus);
    if (!updated) throw notFound();

    await this.publisher.notify({
      bookId: updated.id,
      bookTitle: updated.title,
      previousStatus: current.status,
      newStatus,
      changedAt: new Date(),
    });
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.books.delete(id);
    if (!deleted) throw notFound();
  }
}
