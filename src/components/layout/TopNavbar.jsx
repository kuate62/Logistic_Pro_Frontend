import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS, ROLES } from '../../config/constants';
import { Search, Bell, ChevronDown, User, Settings, LogOut, Menu, House } from 'lucide-react';
import './TopNavbar.css';

export function TopNavbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const today = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const profilePath = isSuperAdmin ? '/admin' : '/settings';
  const settingsPath = isSuperAdmin ? '/admin' : '/settings';
  const searchPlaceholder = isSuperAdmin ? 'Rechercher entreprises, abonnements...' : 'Rechercher colis, clients, expéditions...';

  return (
    <header className="lp-topnavbar">
      <div className="lp-topnavbar__left">
        <button
          className="lp-topnavbar__menu-btn"
          onClick={onToggleSidebar}
          aria-label="Ouvrir le menu"
        >
          <Menu size={22} />
        </button>
        <div className="lp-topnavbar__welcome">
          <h2 className="lp-topnavbar__greeting">
            {isSuperAdmin ? 'Panneau d\'administration' : `Bonjour, ${user?.firstName || user?.firstname || ''}`}
          </h2>
          <p className="lp-topnavbar__date">{today}</p>
        </div>
      </div>

      <div className="lp-topnavbar__center">
        <div className="lp-topnavbar__search">
          <Search size={18} className="lp-topnavbar__search-icon" />
          <input
            type="text"
            className="lp-topnavbar__search-input"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            aria-label="Recherche globale"
          />
        </div>
      </div>

      <div className="lp-topnavbar__right">
        <button
          className="lp-topnavbar__icon-btn"
          onClick={() => navigate('/')}
          aria-label="Aller à l'accueil"
          title="Retour au site"
        >
          <House size={20} />
        </button>

        <div className="lp-topnavbar__notif-wrapper" ref={notifRef}>
          <button
            className="lp-topnavbar__icon-btn"
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>

          {notifOpen && (
            <div className="lp-topnavbar__dropdown lp-topnavbar__dropdown--notif">
              <div className="lp-topnavbar__dropdown-header">
                <span className="lp-topnavbar__dropdown-title">Notifications</span>
              </div>
              <div className="lp-topnavbar__dropdown-list">
                <p className="lp-topnavbar__dropdown-empty">Aucune notification</p>
              </div>
            </div>
          )}
        </div>

        <div className="lp-topnavbar__user-wrapper" ref={userMenuRef}>
          <button
            className="lp-topnavbar__user-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            aria-expanded={userMenuOpen}
            aria-label="Menu utilisateur"
          >
            <div className="lp-topnavbar__avatar">
              {user?.initials || `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`}
            </div>
            <div className="lp-topnavbar__user-info">
              <span className="lp-topnavbar__user-name">
                {user?.fullName || `${user?.firstName || user?.firstname || ''} ${user?.lastName || user?.lastname || ''}`.trim()}
              </span>
              <span className="lp-topnavbar__user-role">{ROLE_LABELS[user?.role] || user?.role || 'Utilisateur'}</span>
            </div>
            <ChevronDown size={16} className="lp-topnavbar__chevron" />
          </button>

          {userMenuOpen && (
            <div className="lp-topnavbar__dropdown">
              <button className="lp-topnavbar__dropdown-item" onClick={() => { setUserMenuOpen(false); navigate(profilePath); }}>
                <User size={16} /> Mon profil
              </button>
              <button className="lp-topnavbar__dropdown-item" onClick={() => { setUserMenuOpen(false); navigate(settingsPath); }}>
                <Settings size={16} /> Paramètres
              </button>
              <div className="lp-topnavbar__dropdown-divider" />
              <button className="lp-topnavbar__dropdown-item lp-topnavbar__dropdown-item--danger" onClick={handleLogout}>
                <LogOut size={16} /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
