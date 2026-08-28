import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS, ROLES } from '../../config/constants';
import { getHomePath } from '../../utils/homePath';
import './PublicUserMenu.css';

export function PublicUserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const homePath = getHomePath(user);
  const profilePath =
    user.role === ROLES.SUPER_ADMIN
      ? '/admin'
      : user.role === ROLES.CLIENT
        ? '/dashboard/client/profil'
        : '/settings';

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <div className="pum" ref={ref}>
      <button
        type="button"
        className="pum__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Menu utilisateur"
      >
        <span className="pum__avatar">{user.initials || '?'}</span>
        <span className="pum__meta">
          <span className="pum__name">{user.fullName || user.email || 'Mon compte'}</span>
          <span className="pum__role">{ROLE_LABELS[user.role] || user.role || 'Utilisateur'}</span>
        </span>
        <ChevronDown size={14} className="pum__chevron" />
      </button>

      {open && (
        <div className="pum__dropdown">
          <div className="pum__header">
            <span className="pum__header-name">{user.fullName || user.email}</span>
            <span className="pum__header-role">{ROLE_LABELS[user.role] || user.role || 'Utilisateur'}</span>
          </div>
          <button type="button" className="pum__item" onClick={() => go(homePath)}>
            <LayoutDashboard size={16} /> Tableau de bord
          </button>
          <button type="button" className="pum__item" onClick={() => go(profilePath)}>
            <UserCircle size={16} /> Mon profil
          </button>
          <div className="pum__divider" />
          <button type="button" className="pum__item pum__item--danger" onClick={handleLogout}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}

export default PublicUserMenu;
