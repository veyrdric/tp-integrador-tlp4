import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError(null);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear la cuenta");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="auth">
      <form className="tarjeta" onSubmit={handleSubmit}>
        <h1>Crear cuenta</h1>
        <label>
          Nombre
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={sending}>
          {sending ? "Creando…" : "Crear cuenta"}
        </button>
        <p>
          ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
        </p>
      </form>
    </main>
  );
}
