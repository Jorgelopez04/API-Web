import { Ticket } from '../types';

type Props = {
  ticket: Ticket;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function TicketCard({ ticket, onEdit, onDelete }: Props) {
  return (
    <article className="ticket-card">
      <div className="ticket-header">
        <div>
          <h3>{ticket.title}</h3>
          <p className="meta-text">{ticket.gameType} · {new Date(ticket.gameDate).toLocaleDateString('es-ES')}</p>
        </div>
        <span className={`status-pill status-${ticket.status.toLowerCase()}`}>{ticket.status}</span>
      </div>
      <div className="ticket-details">
        <p>{ticket.place || 'Lugar no definido'}</p>
        <p>{ticket.gameNumber ? `Número: ${ticket.gameNumber}` : 'Número no registrado'}</p>
        <p>{ticket.amount ? `Valor: $${ticket.amount}` : 'Valor no definido'}</p>
      </div>
      {ticket.notes && <p className="notes">{ticket.notes}</p>}
      <div className="ticket-actions">
        {onEdit && <button onClick={onEdit}>Editar</button>}
        {onDelete && <button className="danger" onClick={onDelete}>Eliminar</button>}
      </div>
    </article>
  );
}
