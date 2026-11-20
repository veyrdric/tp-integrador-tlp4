import { useEffect, useState } from "react";
import { usersApi } from "../api/users.api";
import { useAuth } from "../context/AuthContext";
import { ROLE_NAMES, type RoleName, type User } from "../types";

export function AdminUsersPage() {
  const { user: me, can } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    usersApi
      .list()
      .then((data) => {
        if (active) setUsers(data);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : "No se pudieron cargar los usuarios");
      });
    return () => {
      active = false;
    };
  }, []);

  async function assignRole(user: User, role: RoleName) {
    setError(null);
    try {
      const updated = await usersApi.assignRole(user.id, role);
      setUsers((current) => current.map((u) => (u.id === updated.id ? updated : u)));
      setMessage(`${updated.name} ahora es ${updated.role}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo asignar el rol");
    }
  }

  return (
    <main className="pagina">
      <h1>Usuarios</h1>
      {message && <p className="ok">{message}</p>}
      {error && <p className="error">{error}</p>}
      <table className="tarjeta tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  disabled={!can("user:assign-role") || user.id === me?.id}
                  onChange={(e) => void assignRole(user, e.target.value as RoleName)}>
                  {ROLE_NAMES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
