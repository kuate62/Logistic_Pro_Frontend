import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ClientSidebar } from './ClientSidebar';
import { DashboardFooter } from './DashboardFooter';
import { Bell, Menu, ChevronDown, LogOut, User, House } from 'lucide-react';
import './ClientLayout.css';
import '../../pages/dashboard/client/ClientPortal.css';

export function ClientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const today = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date());

  return (
    <div className="cl-layout">
      <ClientSidebar sidebarOpen={sidebarOpen} />
      <div className="cl-layout__main">
        <header className="cl-topbar">
          <div className="cl-topbar__left">
            <button
              className="cl-topbar__menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Menu"
              type="button"
            >
              <Menu size={22} />
            </button>
            <div className="cl-topbar__greeting">
              <h2 className="cl-topbar__title">
                Bonjour, {user?.fullName || `${user?.firstName || user?.firstname || ''} ${user?.lastName || user?.lastname || ''}`.trim()}
              </h2>
              <p className="cl-topbar__date">{today}</p>
            </div>
          </div>

          <div className="cl-topbar__right">
            <button
              className="cl-topbar__icon-btn"
              type="button"
              aria-label="Aller à l'accueil"
              title="Retour au site"
              onClick={() => navigate('/')}
            >
              <House size={20} />
            </button>
            <button className="cl-topbar__icon-btn" type="button" aria-label="Notifications">
              <Bell size={20} />
            </button>

            <div className="cl-topbar__user-wrapper" ref={userMenuRef}>
              <button
                className="cl-topbar__user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                type="button"
                aria-expanded={userMenuOpen}
              >
                <div className="cl-topbar__avatar">
                  {user?.initials || `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`}
                </div>
                <ChevronDown size={14} className="cl-topbar__chevron" />
              </button>

              {userMenuOpen && (
                <div className="cl-topbar__dropdown">
                  <button className="cl-topbar__dropdown-item" onClick={() => { setUserMenuOpen(false); navigate('/dashboard/client/profil'); }}>
                    <User size={16} /> Mon profil
                  </button>
                  <div className="cl-topbar__dropdown-divider" />
                  <button className="cl-topbar__dropdown-item cl-topbar__dropdown-item--danger" onClick={handleLogout}>
                    <LogOut size={16} /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="cl-layout__content">
          <Outlet />
        </main>

        <DashboardFooter variant="client" />
      </div>

      {sidebarOpen && (
        <div className="cl-layout__overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}

export default ClientLayout;
