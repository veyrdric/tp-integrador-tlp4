import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { booksApi } from "../api/books.api";
import type { BookInput } from "../types";

const EMPTY: BookInput = { title: "", description: "", author: "", isbn: "" };

// Sirve para crear (/books/new) y para editar (/books/:id/edit).
export function BookFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<BookInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    booksApi
      .get(id)
      .then((book) => {
        if (active) setForm({ title: book.title, description: book.description, author: book.author, isbn: book.isbn ?? "" });
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : "No se pudo cargar el libro");
      });
    return () => {
      active = false;
    };
  }, [id]);

  const update = (field: keyof BookInput) => (value: string) => setForm((current) => ({ ...current, [field]: value }));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError(null);
    try {
      const book = id ? await booksApi.update(id, form) : await booksApi.create(form);
      navigate(`/books/${book.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar");
      setSending(false);
    }
  }

  return (
    <main className="pagina">
      <Link to={id ? `/books/${id}` : "/"}>← Volver</Link>
      <form className="tarjeta" onSubmit={handleSubmit}>
        <h1>{id ? "Editar libro" : "Nuevo libro"}</h1>
        <label>
          Título
          <input value={form.title} onChange={(e) => update("title")(e.target.value)} required />
        </label>
        <label>
          Autor
          <input value={form.author} onChange={(e) => update("author")(e.target.value)} required />
        </label>
        <label>
          ISBN (opcional)
          <input value={form.isbn ?? ""} onChange={(e) => update("isbn")(e.target.value)} />
        </label>
        <label>
          Descripción
          <textarea value={form.description} onChange={(e) => update("description")(e.target.value)} rows={4} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={sending}>
          {sending ? "Guardando…" : "Guardar"}
        </button>
      </form>
    </main>
  );
}
