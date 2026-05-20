import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header-bar">
      <div className="brand">
        <NavLink
          to={user ? '/dashboard' : '/'}
          className="brand-mark"
          aria-label="Ir al dashboard"
        >
          🎫
        </NavLink>
        <div>
          <strong>Mi Boleta</strong>
          <span>Rastrea tus sorteos</span>
        </div>
      </div>
      <nav className="nav-links">
        {user ? (
          <>
            <NavLink to="/tickets" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Mis boletas
            </NavLink>
            {user.role === 'admin' && (
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Admin
              </NavLink>
            )}
            <button className="ghost-button" type="button" onClick={logout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Login
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Registro
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
