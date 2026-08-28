import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AUTH_STATUS, ROLES } from '../../config/constants';
import { getHomePath } from '../../utils/homePath';

const OPERATIONAL_ROLES = [
  ROLES.DEPOT_AGENT, 'depot_agent',
  ROLES.RETRAIT_AGENT, 'retrait_agent',
  'manager', 'supervisor', 'accountant', 'delivery_driver',
];

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === AUTH_STATUS.LOADING) {
    return (
      <div className="lp-loading-screen">
        <div className="lp-loading-screen__spinner" />
      </div>
    );
  }

  if (status !== AUTH_STATUS.AUTHENTICATED || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role === ROLES.SUPER_ADMIN && location.pathname === '/dashboard') {
    return <Navigate to="/admin" replace />;
  }

  // Operational agents trying to access admin-only routes → redirect to their own dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is an operational agent, send them home instead of /login loop
    const home = getHomePath(user);
    if (location.pathname !== home) {
      return <Navigate to={home} replace />;
    }
    // Prevent redirect loop: if already at home and still not allowed, show nothing
    return null;
  }

  return children;
}

export default ProtectedRoute;
