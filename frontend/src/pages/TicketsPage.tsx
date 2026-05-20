import { useEffect, useMemo, useState } from 'react';
import { createTicket, deleteTicket, getTickets, updateTicket } from '../services/api';
import { Ticket, TicketFormValues } from '../types';
import TicketCard from '../components/TicketCard';
import TicketForm from '../components/TicketForm';
import { GAME_TYPES, TICKET_STATUSES } from '../constants';

const initialFormValues: TicketFormValues = {
  title: '',
  gameType: GAME_TYPES[0],
  gameNumber: '',
  gameDate: '',
  amount: '',
  place: '',
  status: TICKET_STATUSES[0],
  notes: '',
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filter, setFilter] = useState({ status: '', gameType: '', q: '' });
  const pageSize = 5;

  const formValues = useMemo(() => {
    if (!selectedTicket) return initialFormValues;

    return {
      title: selectedTicket.title,
      gameType: selectedTicket.gameType,
      gameNumber: selectedTicket.gameNumber ?? '',
      gameDate: selectedTicket.gameDate.slice(0, 10),
      amount: selectedTicket.amount?.toString() ?? '',
      place: selectedTicket.place ?? '',
      status: selectedTicket.status,
      notes: selectedTicket.notes ?? '',
    };
  }, [selectedTicket]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await getTickets({ pageSize, page, ...filter });
      setTickets(response.data);
      setTotalPages(response.meta?.totalPages as number || 1);
      setTotalItems(response.meta?.total as number || 0);
    } catch (err) {
      setError((err as Error).message);
      setTickets([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [filter, page]);

  const handleSubmit = async (values: TicketFormValues) => {
    setError('');
    setSuccess('');
    try {
      if (selectedTicket) {
        await updateTicket(selectedTicket.id, {
          title: values.title,
          gameType: values.gameType,
          gameNumber: values.gameNumber || null,
          gameDate: values.gameDate,
          amount: values.amount ? Number(values.amount) : null,
          place: values.place || null,
          status: values.status,
          notes: values.notes || null,
        });
        setSuccess('Boleta actualizada con éxito');
      } else {
        await createTicket({
          title: values.title,
          gameType: values.gameType,
          gameNumber: values.gameNumber || null,
          gameDate: values.gameDate,
          amount: values.amount ? Number(values.amount) : null,
          place: values.place || null,
          status: values.status,
          notes: values.notes || null,
        });
        setSuccess('Boleta creada correctamente');
      }
      setSelectedTicket(null);
      setPage(1);
      await loadTickets();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async (ticket: Ticket) => {
    const confirmed = window.confirm('¿Eliminar esta boleta? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    try {
      await deleteTicket(ticket.id);
      await loadTickets();
      setSuccess('Boleta eliminada');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section className="tickets-page">
      <div className="grid-2">
        <div className="panel warm-panel">
          <div className="section-header">
            <h2>{selectedTicket ? 'Editar boleta' : 'Nueva boleta'}</h2>
            <p>Registra tus sorteos con datos claros y precisos.</p>
          </div>
          <TicketForm initialValues={formValues} onSubmit={handleSubmit} submitLabel={selectedTicket ? 'Actualizar boleta' : 'Crear boleta'} />
          {(error || success) && (
            <p className={error ? 'form-error' : 'form-success'}>{error || success}</p>
          )}
        </div>
        <div className="panel soft-panel">
          <div className="section-header">
            <h2>Mis boletas</h2>
            <p>Filtra y administra tus registros.</p>
          </div>
          <div className="filters-row">
            <select value={filter.status} onChange={(event) => {
              setFilter((prev) => ({ ...prev, status: event.target.value }));
              setPage(1);
            }}>
              <option value="">Todos los estados</option>
              {TICKET_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select value={filter.gameType} onChange={(event) => {
              setFilter((prev) => ({ ...prev, gameType: event.target.value }));
              setPage(1);
            }}>
              <option value="">Todos los tipos</option>
              {GAME_TYPES.map((gameType) => (
                <option key={gameType} value={gameType}>
                  {gameType}
                </option>
              ))}
            </select>
            <input
              placeholder="Buscar por nombre o número"
              value={filter.q}
              onChange={(event) => {
                setFilter((prev) => ({ ...prev, q: event.target.value }));
                setPage(1);
              }}
            />
          </div>
          {loading ? (
            <p>Cargando boletas...</p>
          ) : tickets.length === 0 ? (
            <p>No encontraste boletas. Prueba crear una nueva.</p>
          ) : (
            <>
              <div className="ticket-grid">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onEdit={() => setSelectedTicket(ticket)}
                    onDelete={() => handleDelete(ticket)}
                  />
                ))}
              </div>
              <div className="pagination-row">
                <button type="button" className="page-button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page <= 1}>
                  Anterior
                </button>
                <div className="page-indicators">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={`page-button small${pageNumber === page ? ' active' : ''}`}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
                <button type="button" className="page-button" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page >= totalPages}>
                  Siguiente
                </button>
              </div>
              <p className="pagination-summary">Mostrando {tickets.length} de {totalItems} boletas</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
