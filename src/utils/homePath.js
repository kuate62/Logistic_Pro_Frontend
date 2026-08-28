import { ROLES } from '../config/constants';

export function getHomePath(user) {
  if (user?.role === ROLES.SUPER_ADMIN) return '/admin';
  if (user?.role === ROLES.CLIENT) return '/dashboard/client';
  if (user?.role === ROLES.DEPOT_AGENT || user?.role === 'depot_agent' || user?.employeeRole === 'depot_agent') return '/dashboard/depot';
  if (user?.role === ROLES.RETRAIT_AGENT || user?.role === 'retrait_agent' || user?.employeeRole === 'retrait_agent') return '/dashboard/retrait';
  return '/dashboard';
}

export default getHomePath;
