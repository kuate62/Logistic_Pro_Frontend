import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ArrowUpRight, House, LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react';
import { AuthLogo } from '../components/auth';
import SaasFooter from '../components/saas/SaasFooter';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../config/constants';
import { getHomePath } from '../utils/homePath';
import './SaaSLayout.css';

const NAV_ITEMS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/entreprises', label: 'Entreprises' },
  { to: '/suivi', label: 'Suivi de colis' },
];

function HeaderLink({ to, end, label, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) => `saas-nav__link${isActive ? ' is-active' : ''}`}
    >
      {label}
    </NavLink>
  );
}

function getProfilePath(user) {
  if (user?.role === ROLES.SUPER_ADMIN) return '/admin';
  if (user?.role === ROLES.CLIENT) return '/dashboard/client/profil';
  return '/settings';
}

function getUserPaths(user) {
  return {
    dashboard: getHomePath(user),
    profile: getProfilePath(user),
  };
}

export function SaaSLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userMenuRef = useRef(null);
  const close = () => setOpen(false);

  const connected = !!user || isAuthenticated;
  const paths = getUserPaths(user);
  const fullName = user?.fullName || `${user?.firstName || user?.firstname || ''} ${user?.lastName || user?.lastname || ''}`.trim();
  const initials = user?.initials || `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.trim() || 'U';

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setUserOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <div className="saas-layout">
      <header className="saas-layout__header">
        <div className="saas-layout__bar">
          <NavLink to="/" className="saas-layout__brand" aria-label="LogisticPro — Accueil">
            <AuthLogo />
          </NavLink>

          <nav className="saas-layout__links" aria-label="Navigation principale">
            {NAV_ITEMS.map((item) => <HeaderLink key={item.to} {...item} />)}
          </nav>

          <div className="saas-layout__actions">
            {connected ? (
              <div className="saas-layout__user" ref={userMenuRef}>
                <button
                  type="button"
                  className="saas-layout__avatar"
                  onClick={() => setUserOpen((v) => !v)}
                  aria-expanded={userOpen}
                  aria-label="Menu utilisateur"
                  title={fullName || 'Mon compte'}
                >
                  {initials}
                </button>
                {userOpen && (
                  <div className="saas-layout__dropdown">
                    {user && (
                      <>
                        <button type="button" className="saas-layout__dropdown-item" onClick={() => { setUserOpen(false); navigate(paths.dashboard); }}>
                          <LayoutDashboard size={16} /> Tableau de bord
                        </button>
                        <button type="button" className="saas-layout__dropdown-item" onClick={() => { setUserOpen(false); navigate(paths.profile); }}>
                          <User size={16} /> Mon profil
                        </button>
                      </>
                    )}
                    <button type="button" className="saas-layout__dropdown-item" onClick={() => { setUserOpen(false); navigate('/'); }}>
                      <House size={16} /> Accueil
                    </button>
                    <div className="saas-layout__dropdown-divider" />
                    <button type="button" className="saas-layout__dropdown-item saas-layout__dropdown-item--danger" onClick={handleLogout}>
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink to="/login" className="saas-layout__login">Se connecter</NavLink>
                <NavLink to="/devenir-partenaire" className="saas-layout__cta">
                  Devenir partenaire <ArrowUpRight size={14} />
                </NavLink>
              </>
            )}
          </div>

          <button
            type="button"
            className="saas-layout__burger"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="saas-layout__mobile">
            <nav aria-label="Navigation mobile">
              {NAV_ITEMS.map((item) => <HeaderLink key={item.to} {...item} onClick={close} />)}
            </nav>
            <div className="saas-layout__mobile-actions">
              {connected ? (
                <>
                  {fullName && <span className="saas-layout__mobile-user">{fullName}</span>}
                  {user && (
                    <>
                      <NavLink to={paths.dashboard} className="saas-layout__cta" onClick={close}>Tableau de bord</NavLink>
                      <NavLink to={paths.profile} className="saas-layout__login" onClick={close}>Mon profil</NavLink>
                    </>
                  )}
                  <NavLink to="/" className="saas-layout__login" onClick={close}>Accueil</NavLink>
                  <button type="button" className="saas-layout__login saas-layout__login--logout" onClick={handleLogout}>
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="saas-layout__login" onClick={close}>Se connecter</NavLink>
                  <NavLink to="/devenir-partenaire" className="saas-layout__cta" onClick={close}>
                    Devenir partenaire <ArrowUpRight size={14} />
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="saas-layout__main">
        <Outlet />
      </main>

      <SaasFooter />
    </div>
  );
}

export default SaaSLayout;
