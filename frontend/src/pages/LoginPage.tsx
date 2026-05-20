import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const session = await loginUser(email, password);
      setUser(session.user);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="panel warm-panel">
        <h1>Iniciar sesión</h1>
        <p className="subtitle">Accede y administra tus boletas en un mismo lugar.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Contraseña
            <input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p className="hint">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </section>
  );
}
