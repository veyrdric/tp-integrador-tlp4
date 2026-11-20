import { BookModel } from "./Book.js";
import type { IBookRepository } from "./IBookRepository.js";
import type { Book, BookInput, BookStatus } from "./book.types.js";

function toBook(model: BookModel): Book {
  return {
    id: model.id,
    title: model.title,
    description: model.description,
    author: model.author,
    ...(model.isbn ? { isbn: model.isbn } : {}),
    status: model.status,
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export class BookRepository implements IBookRepository {
  async findAll(): Promise<Book[]> {
    const books = await BookModel.findAll({ order: [["title", "ASC"]] });
    return books.map(toBook);
  }

  async findById(id: string): Promise<Book | null> {
    const book = await BookModel.findByPk(id);
    return book ? toBook(book) : null;
  }

  async create(input: BookInput): Promise<Book> {
    const book = await BookModel.create({ ...input, isbn: input.isbn ?? null });
    return toBook(book);
  }

  async update(id: string, changes: Partial<BookInput>): Promise<Book | null> {
    const book = await BookModel.findByPk(id);
    if (!book) return null;
    await book.update(changes);
    return toBook(book);
  }

  async updateStatus(id: string, status: BookStatus): Promise<Book | null> {
    const book = await BookModel.findByPk(id);
    if (!book) return null;
    await book.update({ status });
    return toBook(book);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await BookModel.destroy({ where: { id } });
    return deleted > 0;
  }
}
