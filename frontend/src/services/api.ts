import { AuthPayload, ApiResponse, Ticket } from '../types';

const remoteBaseUrl = 'https://mi-boleta-api-y9dv.onrender.com/api/v1';
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? remoteBaseUrl;

const getSession = () => {
  const item = localStorage.getItem('mi-boleta-session');
  return item ? JSON.parse(item) as AuthPayload : null;
};

const getHeaders = (withAuth = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (withAuth) {
    const session = getSession();
    if (session?.token) {
      headers.Authorization = `Bearer ${session.token}`;
    }
  }

  return headers;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const response = await fetch(`${baseUrl}${path}`, options);

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error || 'Error en la API');
  }

  return body as ApiResponse<T>;
}

export async function login(email: string, password: string) {
  return request<AuthPayload>('/auth/login', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string) {
  return request<{ id: string; name: string; email: string; role: string; createdAt: string }>('/auth/register', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getTickets(query: Record<string, string | number | undefined> = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.append(key, String(value));
  });
  return request<Ticket[]>(`/tickets?${params.toString()}`, {
    headers: getHeaders(true),
  });
}

export async function createTicket(payload: Partial<Ticket>) {
  return request<Ticket>('/tickets', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });
}

export async function updateTicket(id: string, payload: Partial<Ticket>) {
  return request<Ticket>(`/tickets/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });
}

export async function deleteTicket(id: string) {
  return fetch(`${baseUrl}/tickets/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((body) => {
        throw new Error(body?.error || 'Error eliminando boleta');
      });
    }
  });
}

export async function getAllTickets(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.append(key, String(value));
  });
  return request<Ticket[]>(`/admin/tickets?${query.toString()}`, {
    headers: getHeaders(true),
  });
}
