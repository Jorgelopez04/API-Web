export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
};

export type AuthPayload = {
  token: string;
  user: User;
};

export type ApiResponse<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

export type Ticket = {
  id: string;
  userId: string;
  title: string;
  gameType: string;
  gameNumber?: string | null;
  gameDate: string;
  amount?: number | null;
  place?: string | null;
  status: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TicketFormValues = {
  title: string;
  gameType: string;
  gameNumber: string;
  gameDate: string;
  amount: string;
  place: string;
  status: string;
  notes: string;
};
