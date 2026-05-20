import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthPayload, User } from '../types';

type AuthContextState = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

const SESSION_KEY = 'mi-boleta-session';

const loadSession = (): AuthPayload | null => {
  const item = localStorage.getItem(SESSION_KEY);
  return item ? JSON.parse(item) as AuthPayload : null;
};

const saveSession = (payload: AuthPayload) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => loadSession()?.user ?? null);

  useEffect(() => {
    const handleStorage = () => {
      setUserState(loadSession()?.user ?? null);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      const current = loadSession();
      if (current) {
        saveSession({ ...current, user });
      }
    } else {
      clearSession();
    }
  };

  const logout = () => {
    clearSession();
    setUserState(null);
    window.location.href = '/login';
  };

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
