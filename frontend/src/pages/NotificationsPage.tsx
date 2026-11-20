import { useEffect, useState } from "react";
import { notificationsApi } from "../api/notifications.api";
import type { AppNotification } from "../types";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    notificationsApi
      .list()
      .then((data) => {
        if (active) setNotifications(data);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : "No se pudieron cargar las notificaciones");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function markAsRead(id: string) {
    await notificationsApi.markAsRead(id);
    setNotifications((current) => current.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  async function markAll() {
    await notificationsApi.markAllAsRead();
    setNotifications((current) => current.map((n) => ({ ...n, read: true })));
  }

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <main className="pagina">
      <div className="encabezado">
        <h1>Notificaciones</h1>
        {unread > 0 && (
          <button type="button" className="secundario" onClick={() => void markAll()}>
            Marcar todas como leídas
          </button>
        )}
      </div>
      {loading && <p className="estado">Cargando…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && notifications.length === 0 && (
        <p className="estado">No tenés notificaciones. Suscribite a un libro para enterarte de sus cambios.</p>
      )}
      <ul className="lista">
        {notifications.map((n) => (
          <li key={n.id} className={`tarjeta fila ${n.read ? "leida" : "no-leida"}`}>
            <div>
              <strong>{n.message}</strong>
              <span className="detalle">{new Date(n.createdAt).toLocaleString("es-AR")}</span>
            </div>
            {!n.read && (
              <button type="button" className="secundario" onClick={() => void markAsRead(n.id)}>
                Marcar como leída
              </button>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
