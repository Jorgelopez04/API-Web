import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/auth';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(name, email, password);
      const session = await loginUser(email, password);
      setUser(session.user);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="panel warm-panel">
        <h1>Crear cuenta</h1>
        <p className="subtitle">Regístrate y empieza a controlar tus boletas.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Nombre completo
            <input required minLength={2} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
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
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>
        <p className="hint">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}
