import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="notfound-page">
      <div className="panel warm-panel">
        <h1>404</h1>
        <p>No encontramos esa página.</p>
        <Link to="/dashboard" className="primary-button">
          Volver al dashboard
        </Link>
      </div>
    </section>
  );
}
