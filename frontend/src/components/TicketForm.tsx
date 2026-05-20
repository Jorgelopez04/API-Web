import { FormEvent, useEffect, useState } from 'react';
import { GAME_TYPES, TICKET_STATUSES } from '../constants';
import { TicketFormValues } from '../types';

const defaultValues: TicketFormValues = {
  title: '',
  gameType: GAME_TYPES[0],
  gameNumber: '',
  gameDate: '',
  amount: '',
  place: '',
  status: TICKET_STATUSES[0],
  notes: '',
};

type Props = {
  initialValues?: TicketFormValues;
  onSubmit: (values: TicketFormValues) => void;
  submitLabel: string;
};

export default function TicketForm({ initialValues, onSubmit, submitLabel }: Props) {
  const [values, setValues] = useState<TicketFormValues>(initialValues ?? defaultValues);

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);

  const handleChange = (field: keyof TicketFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <label>
        Nombre del sorteo
        <input
          value={values.title}
          onChange={(event) => handleChange('title', event.target.value)}
          required
          placeholder="Ej. Rifa de navidad"
        />
      </label>
      <div className="grid-2">
        <label>
          Tipo de juego
          <select value={values.gameType} onChange={(event) => handleChange('gameType', event.target.value)}>
            {GAME_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label>
          Estado
          <select value={values.status} onChange={(event) => handleChange('status', event.target.value)}>
            {TICKET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid-2">
        <label>
          Fecha del sorteo
          <input type="date" value={values.gameDate} onChange={(event) => handleChange('gameDate', event.target.value)} required />
        </label>
        <label>
          Número jugado
          <input value={values.gameNumber} onChange={(event) => handleChange('gameNumber', event.target.value)} placeholder="Opcional" />
        </label>
      </div>
      <div className="grid-2">
        <label>
          Lugar de compra
          <input value={values.place} onChange={(event) => handleChange('place', event.target.value)} placeholder="Opcional" />
        </label>
        <label>
          Valor apostado
          <input type="number" min="0" value={values.amount} onChange={(event) => handleChange('amount', event.target.value)} placeholder="Opcional" />
        </label>
      </div>
      <label>
        Notas adicionales
        <textarea value={values.notes} onChange={(event) => handleChange('notes', event.target.value)} rows={4} placeholder="Ej. Premio de $5000" />
      </label>
      <button type="submit" className="primary-button">
        {submitLabel}
      </button>
    </form>
  );
}
