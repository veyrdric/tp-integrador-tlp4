import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { booksApi } from "../api/books.api";
import { Can } from "../components/Can";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { BOOK_STATUSES, type BookDetail, type BookStatus } from "../types";

export function BookDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { can } = useAuth();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    booksApi
      .get(id)
      .then((data) => {
        if (active) setBook(data);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : "No se pudo cargar el libro");
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function run(action: () => Promise<void>, ok: string) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      setMessage(ok);
    } catch (e) {
      setError(e instanceof Error ? e.message : "La acción falló");
    } finally {
      setBusy(false);
    }
  }

  if (error && !book) return <main className="pagina"><p className="error">{error}</p></main>;
  if (!book) return <main className="pagina"><p className="estado">Cargando…</p></main>;

  const toggleSubscription = () =>
    run(async () => {
      if (book.subscribed) await booksApi.unsubscribe(book.id);
      else await booksApi.subscribe(book.id);
      setBook({ ...book, subscribed: !book.subscribed });
    }, book.subscribed ? "Te desuscribiste del libro" : "Te vas a enterar de cada cambio de estado");

  const changeStatus = (status: BookStatus) =>
    run(async () => {
      const updated = await booksApi.changeStatus(book.id, status);
      setBook({ ...book, ...updated });
    }, "Estado actualizado: se notificó a los suscriptores");

  const remove = () => {
    if (!confirm(`¿Eliminar "${book.title}"?`)) return;
    void run(async () => {
      await booksApi.remove(book.id);
      navigate("/");
    }, "Libro eliminado");
  };

  const canSubscribe = book.subscribed ? can("subscription:delete") : can("subscription:create");

  return (
    <main className="pagina">
      <Link to="/">← Volver</Link>
      <article className="tarjeta">
        <div className="encabezado">
          <h1>{book.title}</h1>
          <StatusBadge status={book.status} />
        </div>
        <p className="detalle">{book.author}{book.isbn ? ` · ISBN ${book.isbn}` : ""}</p>
        <p>{book.description}</p>

        {canSubscribe && (
          <button type="button" onClick={toggleSubscription} disabled={busy}>
            {book.subscribed ? "Desuscribirme" : "Suscribirme"}
          </button>
        )}

        <Can permission="book:change-status">
          <label>
            Cambiar estado
            <select value={book.status} onChange={(e) => void changeStatus(e.target.value as BookStatus)} disabled={busy}>
              {BOOK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </Can>

        <div className="acciones">
          <Can permission="book:update">
            <Link to={`/books/${book.id}/edit`} className="boton secundario">
              Editar
            </Link>
          </Can>
          <Can permission="book:delete">
            <button type="button" className="peligro" onClick={remove} disabled={busy}>
              Eliminar
            </button>
          </Can>
        </div>

        {message && <p className="ok">{message}</p>}
        {error && <p className="error">{error}</p>}
      </article>
    </main>
  );
}
