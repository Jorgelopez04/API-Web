import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type Props = {
  children: JSX.Element;
  requireAdmin?: boolean;
};

export default function ProtectedRoute({ children, requireAdmin }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
