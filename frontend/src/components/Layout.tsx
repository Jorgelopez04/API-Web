import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-container">
        <Outlet />
        {children}
      </main>
    </div>
  );
}
