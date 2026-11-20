import { useEffect, useState } from "react";
import { Link } from "react-router";
import { booksApi } from "../api/books.api";
import { Can } from "../components/Can";
import { StatusBadge } from "../components/StatusBadge";
import type { Book } from "../types";

export function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    booksApi
      .list()
      .then((data) => {
        if (active) setBooks(data);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : "No se pudieron cargar los libros");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="pagina">
      <div className="encabezado">
        <h1>Libros</h1>
        <Can permission="book:create">
          <Link to="/books/new" className="boton">
            Nuevo libro
          </Link>
        </Can>
      </div>
      {loading && <p className="estado">Cargando libros…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && books.length === 0 && <p className="estado">Todavía no hay libros cargados.</p>}
      <ul className="lista">
        {books.map((book) => (
          <li key={book.id}>
            <Link to={`/books/${book.id}`} className="tarjeta fila">
              <div>
                <strong>{book.title}</strong>
                <span className="detalle">{book.author}</span>
              </div>
              <StatusBadge status={book.status} />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
