import { useEffect, useState } from 'react';
import { getAllTickets } from '../services/api';
import { Ticket } from '../types';
import TicketCard from '../components/TicketCard';
import { GAME_TYPES, TICKET_STATUSES } from '../constants';

export default function AdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState({ status: '', gameType: '', q: '', page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });

  const loadTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllTickets({ ...filter, page: filter.page, pageSize: 10 });
      setTickets(response.data);
      setMeta({ page: (response.meta?.page as number) || filter.page, totalPages: (response.meta?.totalPages as number) || 1 });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const handlePage = (delta: number) => {
    setFilter((prev) => ({ ...prev, page: Math.max(1, prev.page + delta) }));
  };

  return (
    <section className="dashboard-page">
      <div className="panel warm-panel">
        <div className="hero-card">
          <h1>Panel de administrador</h1>
          <p>Revisa las boletas del sistema, busca por número, nombre y filtra por estado o tipo.</p>
        </div>
        <div className="filters-row">
          <input
            placeholder="Buscar por nombre, número o usuario"
            value={filter.q}
            onChange={(event) => setFilter((prev) => ({ ...prev, q: event.target.value, page: 1 }))}
          />
          <select value={filter.status} onChange={(event) => setFilter((prev) => ({ ...prev, status: event.target.value, page: 1 }))}>
            <option value="">Todos los estados</option>
            {TICKET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select value={filter.gameType} onChange={(event) => setFilter((prev) => ({ ...prev, gameType: event.target.value, page: 1 }))}>
            <option value="">Todos los tipos</option>
            {GAME_TYPES.map((gameType) => (
              <option key={gameType} value={gameType}>
                {gameType}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="panel soft-panel">
        {error && <p className="form-error">{error}</p>}
        {loading ? (
          <p>Cargando tickets del sistema...</p>
        ) : tickets.length === 0 ? (
          <p>No hay tickets para mostrar con esos filtros.</p>
        ) : (
          <>
            <div className="ticket-grid">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
            <div className="pagination-row">
              <button type="button" onClick={() => handlePage(-1)} disabled={filter.page <= 1}>
                Anterior
              </button>
              <span>
                Página {filter.page} de {meta.totalPages}
              </span>
              <button type="button" onClick={() => handlePage(1)} disabled={filter.page >= meta.totalPages}>
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
