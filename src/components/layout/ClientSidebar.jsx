import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard, Package, Truck, CreditCard, Search, User, LogOut, House,
} from 'lucide-react';

const CLIENT_NAV = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/client/tableau-de-bord' },
  { key: 'expeditions', label: 'Expéditions', icon: Truck, path: '/dashboard/client/expeditions' },
  { key: 'colis', label: 'Colis', icon: Package, path: '/dashboard/client/colis' },
  { key: 'paiements', label: 'Paiements', icon: CreditCard, path: '/dashboard/client/paiements' },
  { key: 'suivi', label: 'Suivi', icon: Search, path: '/dashboard/client/suivi' },
  { key: 'profil', label: 'Profil', icon: User, path: '/dashboard/client/profil' },
];

export function ClientSidebar({ sidebarOpen = false }) {
  const { logout } = useAuth();

  return (
    <aside className={`cl-sidebar ${sidebarOpen ? 'cl-sidebar--open' : ''}`}>
      <div className="cl-sidebar__header">
        <div className="cl-sidebar__logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#863bff" />
            <g transform="translate(4 3.5)" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
              <path d="M12 22V12" />
              <polyline points="3.29 7 12 12 20.71 7" />
              <path d="m7.5 4.27 9 5.15" />
            </g>
          </svg>
          <span className="cl-sidebar__brand">LogisticPro</span>
        </div>
      </div>

      <nav className="cl-sidebar__nav">
        {CLIENT_NAV.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            end={item.key === 'dashboard'}
            className={({ isActive }) =>
              `cl-sidebar__link ${isActive ? 'cl-sidebar__link--active' : ''}`
            }
          >
            <item.icon size={20} className="cl-sidebar__link-icon" />
            <span className="cl-sidebar__link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="cl-sidebar__footer">
        <NavLink to="/" className="cl-sidebar__link cl-sidebar__link--logout">
          <House size={20} className="cl-sidebar__link-icon" />
          <span className="cl-sidebar__link-label">Retour au site</span>
        </NavLink>
        <button
          className="cl-sidebar__link cl-sidebar__link--logout"
          onClick={logout}
          type="button"
        >
          <LogOut size={20} className="cl-sidebar__link-icon" />
          <span className="cl-sidebar__link-label">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}

export default ClientSidebar;
