import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Can } from "./Can";
import { NotificationBell } from "./NotificationBell";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/" className="marca">
        📚 Biblioteca
      </Link>
      <div className="navbar-links">
        <Link to="/">Libros</Link>
        <Can permission="user:read">
          <Link to="/admin/users">Usuarios</Link>
        </Can>
        <Can permission="notification:read">
          <NotificationBell />
        </Can>
        <span className="usuario">
          {user.name} · {user.role}
        </span>
        <button
          type="button"
          className="secundario"
          onClick={() => {
            logout();
            navigate("/login");
          }}>
          Salir
        </button>
      </div>
    </nav>
  );
}
