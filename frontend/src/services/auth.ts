import { login as loginRequest, register as registerRequest } from './api';
import { AuthPayload } from '../types';

export const saveSession = (payload: AuthPayload) => {
  localStorage.setItem('mi-boleta-session', JSON.stringify(payload));
};

export const clearSession = () => {
  localStorage.removeItem('mi-boleta-session');
};

export const getSession = (): AuthPayload | null => {
  const item = localStorage.getItem('mi-boleta-session');
  return item ? JSON.parse(item) as AuthPayload : null;
};

export async function loginUser(email: string, password: string) {
  const response = await loginRequest(email, password);
  saveSession(response.data);
  return response.data;
}

export async function registerUser(name: string, email: string, password: string) {
  const response = await registerRequest(name, email, password);
  return response.data;
}
