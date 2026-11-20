import type { BookStatus } from "../types";

const LABELS: Record<BookStatus, string> = {
  DISPONIBLE: "Disponible",
  PRESTADO: "Prestado",
  EN_REPARACION: "En reparación",
};

export function StatusBadge({ status }: { status: BookStatus }) {
  return <span className={`estado-libro ${status.toLowerCase()}`}>{LABELS[status]}</span>;
}
