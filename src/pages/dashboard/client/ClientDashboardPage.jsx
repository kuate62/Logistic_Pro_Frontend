import { useMemo } from 'react';
import useClientDashboard from '../../../hooks/useClientDashboard';
import { useCurrentClient } from '../../../hooks/useCurrentClient';
import {
  DashboardStatCard, QuickActionCard,
} from '../../../components/agent';
import {
  Timeline, ActivityList, ProfileCard,
  FrequentDestinations, FrequentAgencies,
} from '../../../components/client';
import {
  Package, TrendingUp, Clock, CreditCard, MapPin,
  Send, Plus, Search, BarChart3, Phone, HelpCircle,
  ArrowUpRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ClientDashboard.css';

export default function ClientDashboardPage() {
  const navigate = useNavigate();
  const { clientId, loading: clientLoading } = useCurrentClient();
  const {
    client, company, preferredAgency, stats, payments,
    notifications, activities, frequentDestinations, frequentAgencies, timeline,
    loading, error, formatCurrency, formatDate,
  } = useClientDashboard(clientId);

  const statCards = useMemo(() => stats ? [
    { value: stats.totalShipments, label: 'Expéditions', icon: Package, color: 'primary' },
    { value: stats.inTransitParcels, label: 'En transit', icon: TrendingUp, color: 'info' },
    { value: stats.totalParcels, label: 'Colis', icon: Package, color: 'success' },
    { value: formatCurrency(stats.totalSpent), label: 'Dépensé total', icon: CreditCard, color: 'warning' },
    { value: payments.filter((p) => p.status === 'pending').length, label: 'Paiements en attente', icon: Clock, color: 'danger' },
    { value: frequentDestinations?.[0]?.city || '—', label: 'Dest. favorite', icon: MapPin, color: 'secondary' },
  ] : [], [stats, formatCurrency, payments, frequentDestinations]);

  const quickActions = useMemo(() => [
    { icon: Send, label: 'Nouvelle expédition', hint: 'Créer un envoi', color: 'primary' },
    { icon: Search, label: 'Suivre un colis', hint: 'Numéro de suivi', color: 'info' },
    { icon: BarChart3, label: 'Calculer le tarif', hint: 'Estimation du prix', color: 'success' },
    { icon: Plus, label: 'Recharger', hint: 'Ajouter des fonds', color: 'warning' },
    { icon: Phone, label: 'Contacter', hint: 'Support client', color: 'secondary' },
    { icon: HelpCircle, label: 'FAQ', hint: 'Questions fréquentes', color: 'danger' },
  ], []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const profileData = useMemo(() => client ? {
    firstName: client.firstName,
    lastName: client.lastName,
    email: client.email,
    phone: client.phone,
    city: client.city,
    company: typeof client.company === 'string'
      ? client.company
      : (client.company?.name || company?.name || ''),
    memberSince: client.memberSince,
  } : null, [client, company]);

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-danger)', fontSize: 18, marginBottom: 8 }}>Erreur</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="cl-db">
      <div className="cl-db__header">
        <div>
          <h1 className="cl-db__title">Tableau de bord</h1>
          <p className="cl-db__subtitle">Vue d&apos;ensemble de votre activité</p>
        </div>
        {stats && (
          <div className="cl-db__header-actions">
            <button className="cl-db__btn cl-db__btn--primary" type="button" onClick={() => navigate('/dashboard/client/expeditions')}>
              <Package size={16} />
              <span>Voir les expéditions</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        )}
      </div>

      {clientLoading || loading.dashboard ? (
        <div className="cl-db__loading">
          <div className="cl-db__spinner" />
          <p>Chargement du tableau de bord...</p>
        </div>
      ) : (
        <div className="cl-db__grid">
          <div className="cl-db__main">
            <div className="cl-db__section">
              <div className="cl-db__stats">
                {statCards.map((s, i) => (
                  <DashboardStatCard key={i} {...s} />
                ))}
              </div>
            </div>

            <div className="cl-db__section">
              <div className="cl-db__card">
                <div className="cl-db__card-head">
                  <h3 className="cl-db__card-title">Actions rapides</h3>
                </div>
                <div className="cl-db__card-body">
                  <div className="cl-db__quick-actions">
                    {quickActions.map((qa, i) => <QuickActionCard key={i} {...qa} />)}
                  </div>
                </div>
              </div>
            </div>

            <div className="cl-db__cols">
              <div className="cl-db__card">
                <div className="cl-db__card-head">
                  <h3 className="cl-db__card-title">
                    <span className="cl-db__card-icon cl-db__card-icon--timeline" />
                    Timeline
                  </h3>
                </div>
                <div className="cl-db__card-body cl-db__card-body--flush">
                  <Timeline items={timeline} />
                </div>
              </div>
              <div className="cl-db__card">
                <div className="cl-db__card-head">
                  <h3 className="cl-db__card-title">
                    <span className="cl-db__card-icon cl-db__card-icon--activity" />
                    Activité récente
                  </h3>
                  <button className="cl-db__card-link" type="button" onClick={() => navigate('/dashboard/client/expeditions')}>
                    Voir tout →
                  </button>
                </div>
                <div className="cl-db__card-body cl-db__card-body--flush">
                  <ActivityList activities={activities.slice(0, 5)} />
                </div>
              </div>
            </div>
          </div>

          <aside className="cl-db__sidebar">
            <div className="cl-db__card cl-db__card--flush">
              <ProfileCard client={profileData} company={company} formatDate={formatDate} />
            </div>

            <div className="cl-db__card">
              <div className="cl-db__card-head">
                <h3 className="cl-db__card-title">Destinations fréquentes</h3>
              </div>
              <div className="cl-db__card-body cl-db__card-body--flush">
                <FrequentDestinations destinations={frequentDestinations} />
              </div>
            </div>

            <div className="cl-db__card">
              <div className="cl-db__card-head">
                <h3 className="cl-db__card-title">Agences fréquentes</h3>
              </div>
              <div className="cl-db__card-body cl-db__card-body--flush">
                <FrequentAgencies agencies={frequentAgencies} />
              </div>
            </div>

            {preferredAgency && (
              <div className="cl-db__card">
                <div className="cl-db__card-head">
                  <h3 className="cl-db__card-title">
                    <MapPin size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    Agence préférée
                  </h3>
                </div>
                <div className="cl-db__card-body">
                  <div className="cl-db__agency-info">
                    <div className="cl-db__agency-icon">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="cl-db__agency-name">{preferredAgency.name}</p>
                      <p className="cl-db__agency-detail">{preferredAgency.address} · {preferredAgency.city}</p>
                      <p className="cl-db__agency-detail">{preferredAgency.phone}</p>
                      <div className="cl-db__agency-hours">
                        {(() => {
                          const h = preferredAgency.hours;
                          return Array.isArray(h)
                            ? h.map((x, i) => <span key={i} className="cl-db__hour-tag">{x}</span>)
                            : h ? <span className="cl-db__hour-tag">{h}</span> : null;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="cl-db__card cl-db__card--flush">
              <div className="cl-db__notif-inline">
                <div className="cl-db__notif-head">
                  <h3 className="cl-db__card-title">
                    Notifications
                    {unreadCount > 0 && <span className="cl-db__notif-badge">{unreadCount}</span>}
                  </h3>
                </div>
                <div className="cl-db__notif-list">
                  {notifications.length === 0 ? (
                    <div className="cl-db__notif-empty">Aucune notification</div>
                  ) : (
                    notifications.slice(0, 4).map((n) => (
                      <div key={n.id} className={`cl-db__notif-item ${!n.read ? 'cl-db__notif-item--unread' : ''}`}>
                        <div className={`cl-db__notif-dot cl-db__notif-dot--${n.type}`} />
                        <div className="cl-db__notif-content">
                          <p className="cl-db__notif-title">{n.title}</p>
                          {n.message && <p className="cl-db__notif-msg">{n.message}</p>}
                        </div>
                        <span className="cl-db__notif-time">{formatDate(n.time)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
