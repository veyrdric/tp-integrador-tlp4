import { useEffect, useState } from "react";
import { Link } from "react-router";
import { NOTIFICATIONS_CHANGED, notificationsApi } from "../api/notifications.api";

const POLLING_MS = 5000;

// Contador de no leídas, actualizado por polling cada pocos segundos.
export function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      notificationsApi
        .unreadCount()
        .then(({ count }) => {
          if (active) setCount(count);
        })
        .catch(() => undefined);
    };
    refresh();
    const timer = setInterval(refresh, POLLING_MS);
    window.addEventListener(NOTIFICATIONS_CHANGED, refresh);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener(NOTIFICATIONS_CHANGED, refresh);
    };
  }, []);

  return (
    <Link to="/notifications" className="campana" aria-label={`Notificaciones: ${count} sin leer`}>
      🔔 {count > 0 && <span className="contador">{count}</span>}
    </Link>
  );
}
