import { ROLES } from '../config/constants';

const BACKEND_ROLE_TO_FRONTEND = {
  ROLE_ROOT: ROLES.SUPER_ADMIN,
  ROLE_ADMIN: ROLES.COMPANY_ADMIN,
  ROLE_USER: ROLES.CLIENT,
  user: ROLES.CLIENT,
};

export function normalizeUser(raw = {}) {
  const firstName = raw.firstName || raw.firstname || '';
  const lastName = raw.lastName || raw.lastname || '';

  let role = raw.role;
  if (!role || !Object.values(ROLES).includes(role)) {
    if (raw.roles === 'ROLE_ROOT') {
      role = ROLES.SUPER_ADMIN;
    } else if (raw.roles === 'ROLE_ADMIN') {
      role = ROLES.COMPANY_ADMIN;
    } else if (raw.employeeRole && (ROLES[raw.employeeRole.toUpperCase()] || Object.values(ROLES).includes(raw.employeeRole))) {
      role = raw.employeeRole;
    } else if (raw.profile === 'employee') {
      role = raw.employeeRole || ROLES.COMPANY_ADMIN;
    } else if (raw.profile === 'client' || raw.roles === 'ROLE_USER' || raw.roles === 'user') {
      role = ROLES.CLIENT;
    } else {
      role = BACKEND_ROLE_TO_FRONTEND[raw.roles] || ROLES.CLIENT;
    }
  }

  return {
    ...raw,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim() || raw.email || 'Utilisateur',
    initials: `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'LP',
    role,
    employeeRole: raw.employeeRole || role,
  };
}

export default normalizeUser;
