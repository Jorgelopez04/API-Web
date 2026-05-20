import { useEffect, useMemo, useState } from 'react';
import { getTickets } from '../services/api';
import { Ticket } from '../types';
import DonutChart from '../components/DonutChart';

type FilterOption = 'all' | 'pending' | 'upcoming';

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');

  useEffect(() => {
    async function load() {
      try {
        const response = await getTickets({ pageSize: 100 });
        setTickets(response.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const now = new Date();
  const upcoming = useMemo(
    () => tickets.filter((ticket) => new Date(ticket.gameDate) >= now),
    [tickets, now]
  );
  const pending = useMemo(
    () => tickets.filter((ticket) => ticket.status === 'Pendiente'),
    [tickets]
  );

  const pendingPercentage = tickets.length > 0 ? Math.round((pending.length / tickets.length) * 100) : 0;
  const upcomingPercentage = tickets.length > 0 ? Math.round((upcoming.length / tickets.length) * 100) : 0;

  const won = useMemo(
    () => tickets.filter((ticket) => ticket.status === 'Ganado'),
    [tickets]
  );
  const wonPercentage = tickets.length > 0 ? Math.round((won.length / tickets.length) * 100) : 0;
  const lost = useMemo(
    () => tickets.filter((ticket) => ticket.status === 'Perdido'),
    [tickets]
  );
  const lostPercentage = tickets.length > 0 ? Math.round((lost.length / tickets.length) * 100) : 0;

  const statusSegments = useMemo(
    () => [
      { label: 'Pendiente', value: pending.length, color: '#f7c66c' },
      { label: 'Ganado', value: won.length, color: '#8eceb9' },
      { label: 'Perdido', value: lost.length, color: '#f38a8a' },
    ],
    [pending.length, won.length, lost.length]
  );

  const selectedDonut = useMemo(() => {
    if (selectedFilter === 'pending') {
      return [
        { label: 'Pendiente', value: pending.length, color: '#f7c66c' },
        { label: 'Resto', value: tickets.length - pending.length, color: 'rgba(255,255,255,0.08)' },
      ];
    }
    if (selectedFilter === 'upcoming') {
      return [
        { label: 'Próximos', value: upcoming.length, color: '#f38a8a' },
        { label: 'Resto', value: tickets.length - upcoming.length, color: 'rgba(255,255,255,0.08)' },
      ];
    }
    return statusSegments;
  }, [selectedFilter, pending.length, upcoming.length, tickets.length, statusSegments]);

  const selectedTitle = useMemo(() => {
    if (selectedFilter === 'pending') return 'Estadística: Pendientes';
    if (selectedFilter === 'upcoming') return 'Estadística: Próximos sorteos';
    return 'Estadística: Total de boletas';
  }, [selectedFilter]);

  const selectedDescription = useMemo(() => {
    if (selectedFilter === 'pending') return 'Muestra el total y el porcentaje de boletas que aún no tienen resultado.';
    if (selectedFilter === 'upcoming') return 'Muestra el total y el porcentaje de sorteos que aún no han ocurrido.';
    return 'Muestra el total de boletas registradas y el estado general de tu cuenta.';
  }, [selectedFilter]);

  return (
    <section className="dashboard-page">
      <div className="panel warm-panel">
        <div className="hero-card">
          <h1>Bienvenido a Mi Boleta</h1>
          <p>Visualiza tus sorteos con claridad, estadísticas dinámicas e interacción inteligente.</p>
        </div>
        <div className="stats-grid">
          <div
            className={`stat-card ${selectedFilter === 'all' ? 'stat-card-active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedFilter('all')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') setSelectedFilter('all');
            }}
            aria-pressed={selectedFilter === 'all'}
          >
            <div className="stat-card-content">
              <span>{tickets.length}</span>
              <p>Total de boletas</p>
              <small>Todas tus boletas registradas en el sistema.</small>
            </div>
          </div>
          <div
            className={`stat-card ${selectedFilter === 'pending' ? 'stat-card-active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedFilter('pending')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') setSelectedFilter('pending');
            }}
            aria-pressed={selectedFilter === 'pending'}
          >
            <div className="stat-card-content">
              <span>{pending.length}</span>
              <p>Pendientes</p>
              <small>Boletas sin resultado definido.</small>
            </div>
          </div>
          <div
            className={`stat-card ${selectedFilter === 'upcoming' ? 'stat-card-active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedFilter('upcoming')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') setSelectedFilter('upcoming');
            }}
            aria-pressed={selectedFilter === 'upcoming'}
          >
            <div className="stat-card-content">
              <span>{upcoming.length}</span>
              <p>Próximos sorteos</p>
              <small>Sorteos que aún no se han jugado.</small>
            </div>
          </div>
        </div>
      </div>
      <div className="panel soft-panel">
        <div className="section-header">
          <h2>{selectedTitle}</h2>
          <p>{selectedDescription}</p>
        </div>
        <div className="selected-donut-panel">
          <DonutChart
            segments={selectedDonut}
            centerText={
              selectedFilter === 'all'
                ? '100%'
                : selectedFilter === 'pending'
                ? `${pendingPercentage}%`
                : `${upcomingPercentage}%`
            }
            centerLabel={selectedFilter === 'all' ? 'Total' : 'Porcentaje'}
            size={132}
            ringWidth={18}
          />
        </div>
        {loading ? (
          <p>Cargando tus boletas...</p>
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : (
          <table className="stat-table">
            <thead>
              <tr>
                <th>Indicador</th>
                <th>Cantidad</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {selectedFilter === 'all' ? (
                <>
                  <tr>
                    <td>Pendientes</td>
                    <td>{pending.length}</td>
                    <td>{pendingPercentage}%</td>
                  </tr>
                  <tr>
                    <td>Ganados</td>
                    <td>{tickets.filter((ticket) => ticket.status === 'Ganado').length}</td>
                    <td>{tickets.length > 0 ? Math.round((tickets.filter((ticket) => ticket.status === 'Ganado').length / tickets.length) * 100) : 0}%</td>
                  </tr>
                  <tr>
                    <td>Perdidos</td>
                    <td>{tickets.filter((ticket) => ticket.status === 'Perdido').length}</td>
                    <td>{tickets.length > 0 ? Math.round((tickets.filter((ticket) => ticket.status === 'Perdido').length / tickets.length) * 100) : 0}%</td>
                  </tr>
                  <tr>
                    <td>Próximos sorteos</td>
                    <td>{upcoming.length}</td>
                    <td>{upcomingPercentage}%</td>
                  </tr>
                  <tr className="summary-row">
                    <td>Total</td>
                    <td>{tickets.length}</td>
                    <td>100%</td>
                  </tr>
                </>
              ) : selectedFilter === 'pending' ? (
                <>
                  <tr>
                    <td>Pendientes</td>
                    <td>{pending.length}</td>
                    <td>{pendingPercentage}%</td>
                  </tr>
                  <tr>
                    <td>Resto de boletas</td>
                    <td>{tickets.length - pending.length}</td>
                    <td>{tickets.length > 0 ? 100 - pendingPercentage : 0}%</td>
                  </tr>
                  <tr className="summary-row">
                    <td>Total</td>
                    <td>{tickets.length}</td>
                    <td>100%</td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td>Próximos sorteos</td>
                    <td>{upcoming.length}</td>
                    <td>{upcomingPercentage}%</td>
                  </tr>
                  <tr>
                    <td>Sorteos ya jugados</td>
                    <td>{tickets.length - upcoming.length}</td>
                    <td>{tickets.length > 0 ? 100 - upcomingPercentage : 0}%</td>
                  </tr>
                  <tr className="summary-row">
                    <td>Total</td>
                    <td>{tickets.length}</td>
                    <td>100%</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

