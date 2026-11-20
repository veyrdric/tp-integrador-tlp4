import type { AppNotification } from "../types";
import { apiFetch } from "./client";

// Avisa a la campana que cambió la bandeja, para no esperar al próximo polling.
export const NOTIFICATIONS_CHANGED = "notificaciones-actualizadas";
const announce = () => window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));

export const notificationsApi = {
  list: () => apiFetch<AppNotification[]>("/notifications"),
  unreadCount: () => apiFetch<{ count: number }>("/notifications/unread-count"),
  markAsRead: (id: string) => apiFetch<void>(`/notifications/${id}/read`, { method: "PATCH" }).then(announce),
  markAllAsRead: () => apiFetch<void>("/notifications/read-all", { method: "PATCH" }).then(announce),
};
