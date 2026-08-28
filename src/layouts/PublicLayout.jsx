import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Package, Menu, X, User, LogIn, UserPlus, Mail, Phone, MapPin } from 'lucide-react';
import useEntrepriseStore from '../store/useEntrepriseStore';
import { useAuth } from '../hooks/useAuth';
import { PublicUserMenu } from '../components/layout/PublicUserMenu';
import './PublicLayout.css';

export default function PublicLayout() {
  const { idEntreprise } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const company = useEntrepriseStore((s) => s.selectedCompany);
  const selectCompany = useEntrepriseStore((s) => s.selectCompany);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);

  const basePath = `/entreprises/${idEntreprise}`;

  const navLinks = [
    { to: basePath, label: 'Accueil' },
    { to: `${basePath}/suivi`, label: 'Suivre un colis' },
    { to: `${basePath}/services`, label: 'Services' },
    { to: `${basePath}/agences`, label: 'Agences' },
    { to: `${basePath}/tarif`, label: 'Tarif' },
    { to: `${basePath}/faq`, label: 'FAQ' },
    { to: `${basePath}/contact`, label: 'Contact' },
  ];

  useEffect(() => {
    if (idEntreprise && (!company || company.id !== idEntreprise)) {
      selectCompany(idEntreprise);
    }
  }, [idEntreprise, company, selectCompany]);

  const isActive = (path) => {
    if (path === basePath) return location.pathname === basePath;
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserNav = (path) => { setUserOpen(false); navigate(path); };

  const displayName = company ? company.tradeName : 'LogisticPro';
  const brandColor = company ? company.color : '#863bff';

  return (
    <div className="pp-landing-layout">
      <nav className={`pp-nav ${scrolled ? 'pp-nav--scrolled' : ''}`}>
        <div className="pp-nav__inner">
          <Link to={basePath} className="pp-nav__brand">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill={brandColor} />
              <g transform="translate(4 3.5)" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                <path d="M12 22V12" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <path d="m7.5 4.27 9 5.15" />
              </g>
            </svg>
            <span className="pp-nav__name">{displayName}</span>
          </Link>

          <div className="pp-nav__links">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`pp-nav__link ${isActive(link.to) ? 'pp-nav__link--active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pp-nav__right">
            <Link to={`${basePath}/suivi`} className="pp-nav__track">
              <Package size={16} />
              Suivre mon colis
            </Link>
            {user ? (
              <PublicUserMenu />
            ) : (
              <div className="pp-nav__user-wrap" ref={userRef}>
                <button
                  className="pp-nav__user"
                  onClick={() => setUserOpen(!userOpen)}
                  aria-label="Menu utilisateur"
                >
                  <User size={20} />
                </button>
                <div className={`pp-nav__dropdown ${userOpen ? 'pp-nav__dropdown--open' : ''}`}>
                  <button className="pp-nav__dropdown-item" onClick={() => handleUserNav('/login')}>
                    <LogIn size={16} /> Connexion
                  </button>
                  <button className="pp-nav__dropdown-item" onClick={() => handleUserNav('/register')}>
                    <UserPlus size={16} /> S'inscrire
                  </button>
                </div>
              </div>
            )}
            <button
              className="pp-nav__hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`pp-nav__mobile ${mobileOpen ? 'pp-nav__mobile--open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`pp-nav__mobile-link ${isActive(link.to) ? 'pp-nav__mobile-link--active' : ''} ${link.to === `${basePath}/suivi` ? 'pp-nav__mobile-link--primary' : ''}`}
            onClick={closeMobile}
          >
            {link.label}
          </Link>
        ))}
        <div className="pp-nav__mobile-divider" />
        {user ? (
          <PublicUserMenu />
        ) : (
          <>
            <Link to="/login" className="pp-nav__mobile-link" onClick={closeMobile}>
              Connexion
            </Link>
            <Link to="/register" className="pp-nav__mobile-link pp-nav__mobile-link--primary" onClick={closeMobile}>
              S'inscrire
            </Link>
          </>
        )}
      </div>

      <main className="pp-landing-main">
        <Outlet />
      </main>

      <footer className="lp-footer">
        <div className="lp-footer__inner">
          <div className="lp-footer__brand">
            <div className="lp-footer__logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill={brandColor} />
                <g transform="translate(4 3.5)" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                  <path d="M12 22V12" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <path d="m7.5 4.27 9 5.15" />
                </g>
              </svg>
              <span>{displayName}</span>
            </div>
            <p className="lp-footer__desc">
              Portail officiel de transport de colis au Cameroun.
            </p>
          </div>

          <div className="lp-footer__col">
            <h4>Liens rapides</h4>
            <Link to={basePath}>Accueil</Link>
            <Link to={`${basePath}/services`}>Services</Link>
            <Link to={`${basePath}/suivi`}>Suivre un colis</Link>
            <Link to={`${basePath}/faq`}>FAQ</Link>
          </div>

          <div className="lp-footer__col">
            <h4>Services</h4>
            <Link to={`${basePath}/services`}>Suivi de colis</Link>
            <Link to={`${basePath}/agences`}>Agences</Link>
            <Link to={`${basePath}/tarif`}>Tarifs</Link>
            <Link to={`${basePath}/contact`}>Contact</Link>
          </div>

          <div className="lp-footer__col">
            <h4>Contact</h4>
            <span className="lp-footer__address">
              <Mail size={14} /> {company?.email || 'info@logisticpro.com'}
            </span>
            <span className="lp-footer__address">
              <Phone size={14} /> {company?.phone || '+237 699 123 456'}
            </span>
            <span className="lp-footer__address">
              <MapPin size={14} /> {company ? `${company.city}, ${company.country}` : 'Douala, Cameroun'}
            </span>
          </div>
        </div>

        <div className="lp-footer__bottom">
          <p>&copy; 2026 LogisticPro. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
