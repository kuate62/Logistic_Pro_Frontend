import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NAV_ITEMS, SUPER_ADMIN_NAV, DEPOT_AGENT_NAV, RETRAIT_AGENT_NAV, NAV_FOOTER, SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED } from '../../config/navigation';
import { ChevronLeft, ChevronRight, ChevronDown, LayoutDashboard } from 'lucide-react';
import { AuthLogo } from '../auth';
import './Sidebar.css';

function isChildActive(children, pathname) {
  return children.some((child) => child.path && pathname.startsWith(child.path));
}

function SidebarItem({ item, collapsed, pathname }) {
  const hasChildren = item.children && item.children.length > 0;
  const [expanded, setExpanded] = useState(
    hasChildren && isChildActive(item.children, pathname)
  );

  if (!hasChildren) {
    return (
      <li>
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `lp-sidebar__link ${isActive ? 'lp-sidebar__link--active' : ''}`
          }
          title={collapsed ? item.label : undefined}
          end={item.key === 'admin_dashboard' || item.key === 'dashboard' || item.key === 'depot_dashboard' || item.key === 'retrait_dashboard'}
        >
          <item.icon size={20} className="lp-sidebar__icon" />
          {!collapsed && <span className="lp-sidebar__label">{item.label}</span>}
        </NavLink>
      </li>
    );
  }

  const anyChildActive = isChildActive(item.children, pathname);

  return (
    <li className={`lp-sidebar__group ${expanded ? 'lp-sidebar__group--expanded' : ''}`}>
      <button
        className={`lp-sidebar__link lp-sidebar__link--group ${anyChildActive ? 'lp-sidebar__link--active-parent' : ''}`}
        onClick={() => setExpanded(!expanded)}
        title={collapsed ? item.label : undefined}
        type="button"
      >
        <item.icon size={20} className="lp-sidebar__icon" />
        {!collapsed && (
          <>
            <span className="lp-sidebar__label">{item.label}</span>
            <ChevronDown
              size={14}
              className={`lp-sidebar__chevron ${expanded ? 'lp-sidebar__chevron--open' : ''}`}
            />
          </>
        )}
      </button>
      {!collapsed && expanded && (
        <ul className="lp-sidebar__sublist">
          {item.children.map((child) => (
            <li key={child.key}>
              <NavLink
                to={child.path}
                className={({ isActive }) =>
                  `lp-sidebar__link lp-sidebar__link--sub ${isActive ? 'lp-sidebar__link--active' : ''}`
                }
              >
                <child.icon size={16} className="lp-sidebar__icon" />
                <span className="lp-sidebar__label">{child.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isSuperAdmin = user?.role === 'super_admin';
  const roleKey = user?.employeeRole || user?.role;
  const isDepotAgent = roleKey === 'depot_agent';
  const isRetraitAgent = roleKey === 'retrait_agent';

  const navItems = isSuperAdmin
    ? SUPER_ADMIN_NAV
    : isDepotAgent
      ? DEPOT_AGENT_NAV
      : isRetraitAgent
        ? RETRAIT_AGENT_NAV
        : NAV_ITEMS;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAction = (item) => {
    if (item.action === 'logout') handleLogout();
    if (item.action === 'home') navigate('/');
  };

  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  return (
    <aside className="lp-sidebar" style={{ width }}>
      <div className="lp-sidebar__header">
        {!collapsed && <AuthLogo size="sm" />}
        {collapsed && (
          <div className="lp-sidebar__logo-collapsed">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#863bff" />
              <g transform="translate(4 3.5)" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                <path d="M12 22V12" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <path d="m7.5 4.27 9 5.15" />
              </g>
            </svg>
          </div>
        )}
        <button
          className="lp-sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Développer le menu' : 'Réduire le menu'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="lp-sidebar__nav" role="navigation" aria-label="Navigation principale">
        <ul className="lp-sidebar__list">
          {navItems.map((item) => (
            <SidebarItem key={item.key} item={item} collapsed={collapsed} pathname={pathname} />
          ))}
        </ul>
      </nav>

      <div className="lp-sidebar__footer">
        <ul className="lp-sidebar__list">
          {NAV_FOOTER.map((item) => (
            <li key={item.key}>
              <button
                className="lp-sidebar__link lp-sidebar__link--btn"
                onClick={() => handleAction(item)}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} className="lp-sidebar__icon" />
                {!collapsed && <span className="lp-sidebar__label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
