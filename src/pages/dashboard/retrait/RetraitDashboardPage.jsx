import { useState, useMemo } from 'react';
import {
  Package, PackageCheck, Users, Clock, AlertTriangle,
  QrCode, Search, Handshake, History, FileWarning,
  Eye, CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useRetraitDashboard } from '../../../hooks/useRetraitDashboard';
import {
  DashboardHeader, DashboardStatCard, QuickActionCard,
  StatusBadge, SearchBar, FilterBar, TablePagination,
  NotificationPanel, AlertCard, EmptyState, LoadingState,
  WithdrawalModal, AnomalyModal, AgentScanModal,
} from '../../../components/agent';
import '../../../components/agent/AgentDashboard.css';

const STATUS_OPTIONS = [
  { value: 'available_pickup', label: 'Disponible' },
  { value: 'arrived', label: 'Arrivé' },
  { value: 'collected', label: 'Récupéré' },
  { value: 'damaged', label: 'Anomalie' },
];

export function RetraitDashboardPage() {
  const { user } = useAuth();
  const d = useRetraitDashboard(user);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [selectedWithdrawalParcel, setSelectedWithdrawalParcel] = useState(null);
  const [selectedAnomalyParcel, setSelectedAnomalyParcel] = useState(null);

  const paginatedParcels = useMemo(() => {
    const { page, perPage } = d.pagination;
    const start = (page - 1) * perPage;
    return d.filteredParcels.slice(start, start + perPage);
  }, [d.filteredParcels, d.pagination]);

  const totalPages = Math.ceil(d.filteredParcels.length / d.pagination.perPage) || 1;

  return (
    <div className="ag-db">
      <DashboardHeader
        agent={d.agent}
        agency={d.agency}
        company={d.company}
        unreadCount={d.unreadCount}
        onNotificationClick={() => setShowNotifications(true)}
      />

      {/* Stats */}
      <div className="ag-stats">
        <DashboardStatCard
          value={d.stats?.availableParcels ?? '—'}
          label="Colis disponibles"
          icon={Package}
          color="primary"
          loading={d.loading.dashboard}
        />
        <DashboardStatCard
          value={d.stats?.collectedToday ?? '—'}
          label="Remis aujourd'hui"
          icon={PackageCheck}
          color="success"
          loading={d.loading.dashboard}
        />
        <DashboardStatCard
          value={d.stats?.clientsServed ?? '—'}
          label="Clients servis"
          icon={Users}
          color="info"
          loading={d.loading.dashboard}
        />
        <DashboardStatCard
          value={d.stats?.pendingPickup ?? '—'}
          label="En attente de retrait"
          icon={Clock}
          color="warning"
          loading={d.loading.dashboard}
        />
        <DashboardStatCard
          value={d.stats?.anomalyParcels ?? '—'}
          label="Colis en anomalie"
          icon={AlertTriangle}
          color="danger"
          loading={d.loading.dashboard}
        />
      </div>

      {/* Quick Actions */}
      <div className="ag-quick-actions ag-quick-actions--5">
        <QuickActionCard
          icon={QrCode}
          label="Scanner un code"
          hint="Lire QR code colis"
          color="primary"
          onClick={() => setShowScanModal(true)}
        />
        <QuickActionCard
          icon={Search}
          label="Rechercher colis"
          hint="Trouver un colis"
          color="info"
          onClick={() => setShowScanModal(true)}
        />
        <QuickActionCard
          icon={Handshake}
          label="Valider retrait"
          hint="Remettre au client"
          color="success"
          onClick={() => setShowScanModal(true)}
        />
        <QuickActionCard
          icon={History}
          label="Historique"
          hint="Consulter l'historique"
          color="warning"
          onClick={() => d.setFilters({ ...d.filters, status: 'collected' })}
        />
        <QuickActionCard
          icon={FileWarning}
          label="Créer anomalie"
          hint="Signaler un problème"
          color="danger"
          onClick={() => {
            if (d.filteredParcels.length > 0) {
              setSelectedAnomalyParcel(d.filteredParcels[0]);
            } else {
              setShowScanModal(true);
            }
          }}
        />
      </div>

      {/* Main Grid */}
      <div className="ag-grid ag-grid--76">
        {/* Recent Activity */}
        <div className="ag-section">
          <div className="ag-section__header">
            <div className="ag-section__header-left">
              <h3 className="ag-section__title">Retraits récents</h3>
              <span className="ag-section__count">{d.recentWithdrawals.length}</span>
            </div>
          </div>
          <div className="ag-section__body">
            {d.loading.dashboard ? (
              <LoadingState rows={4} />
            ) : d.recentWithdrawals.length === 0 ? (
              <EmptyState title="Aucun retrait" description="Les retraits récents apparaîtront ici" />
            ) : (
              <div className="ag-withdrawal-list">
                {d.recentWithdrawals.map((w) => (
                  <div key={w.id} className="ag-withdrawal-item">
                    <div className="ag-withdrawal-item__left">
                      <div className="ag-withdrawal-item__avatar">
                        <CheckCircle size={18} />
                      </div>
                      <div className="ag-withdrawal-item__info">
                        <h4>{w.collectedBy || w.recipientName}</h4>
                        <span>{w.trackingNumber} · {d.formatDate(w.collectedAt)}</span>
                      </div>
                    </div>
                    <div className="ag-withdrawal-item__right">
                      <div>{d.formatTime(w.collectedAt)}</div>
                      <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
                        Agent: {d.agent?.firstName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="ag-section">
          <div className="ag-section__header">
            <div className="ag-section__header-left">
              <h3 className="ag-section__title">Alertes</h3>
              <span className="ag-section__count">{d.alerts.length}</span>
            </div>
          </div>
          <div className="ag-section__body">
            {d.loading.dashboard ? (
              <LoadingState rows={3} />
            ) : d.alerts.length === 0 ? (
              <EmptyState title="Aucune alerte" description="Tout est en ordre" />
            ) : (
              <div className="ag-alerts">
                {d.alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parcels Table */}
      <div className="ag-section">
        <div className="ag-section__header">
          <div className="ag-section__header-left">
            <h3 className="ag-section__title">Colis prêts au retrait</h3>
            <span className="ag-section__count">{d.filteredParcels.length}</span>
          </div>
          <div className="ag-section__tools">
            <SearchBar
              value={d.search}
              onChange={d.setSearch}
              placeholder="N° de suivi..."
            />
            <FilterBar
              filters={d.filters}
              options={{
                status: { label: 'Statut', items: STATUS_OPTIONS },
              }}
              onChange={d.setFilters}
              onReset={d.resetFilters}
            />
          </div>
        </div>
        <div className="ag-section__body">
          {d.loading.dashboard ? (
            <LoadingState rows={5} />
          ) : paginatedParcels.length === 0 ? (
            <EmptyState title="Aucun colis disponible" description="Aucun colis en attente de retrait" />
          ) : (
            <>
              <table className="ag-table">
                <thead>
                  <tr>
                    <th>N° de suivi</th>
                    <th>Catégorie</th>
                    <th>Poids</th>
                    <th>Date d'arrivée</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedParcels.map((pkg) => (
                    <tr key={pkg.id}>
                      <td data-label="N° de suivi">
                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{pkg.trackingNumber}</span>
                      </td>
                      <td data-label="Catégorie">{pkg.category}</td>
                      <td data-label="Poids">{pkg.weight} kg</td>
                      <td data-label="Date d'arrivée" className="ag-table__cell--muted">
                        {pkg.arrivalDate ? d.formatDate(pkg.arrivalDate) : '—'}
                      </td>
                      <td data-label="Statut"><StatusBadge status={pkg.status} /></td>
                      <td data-label="Actions">
                        <div className="ag-actions-cell">
                          <button
                            className="ag-action-btn text-success"
                            type="button"
                            title="Valider le retrait"
                            onClick={() => setSelectedWithdrawalParcel(pkg)}
                          >
                            <Handshake size={14} />
                          </button>
                          <button
                            className="ag-action-btn text-danger"
                            type="button"
                            title="Signaler un problème"
                            onClick={() => setSelectedAnomalyParcel(pkg)}
                          >
                            <FileWarning size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination
                page={d.pagination.page}
                perPage={d.pagination.perPage}
                total={d.filteredParcels.length}
                totalPages={totalPages}
                onPageChange={d.setPage}
              />
            </>
          )}
        </div>
      </div>

      {/* Notifications */}
      {showNotifications && (
        <NotificationPanel
          notifications={d.notifications}
          onClose={() => setShowNotifications(false)}
          onMarkRead={d.markNotificationRead}
          onMarkAllRead={d.markAllNotificationsRead}
        />
      )}

      {/* Withdrawal Modal */}
      {selectedWithdrawalParcel && (
        <WithdrawalModal
          parcel={selectedWithdrawalParcel}
          user={user}
          onClose={() => setSelectedWithdrawalParcel(null)}
          onSuccess={() => d.refresh()}
        />
      )}

      {/* Anomaly Modal */}
      {selectedAnomalyParcel && (
        <AnomalyModal
          parcel={selectedAnomalyParcel}
          user={user}
          onClose={() => setSelectedAnomalyParcel(null)}
          onSuccess={() => d.refresh()}
        />
      )}

      {/* Scan Modal */}
      {showScanModal && (
        <AgentScanModal
          user={user}
          onClose={() => setShowScanModal(false)}
          onSelectParcel={(parcel) => {
            setSelectedWithdrawalParcel(parcel);
          }}
        />
      )}
    </div>
  );
}

export default RetraitDashboardPage;
