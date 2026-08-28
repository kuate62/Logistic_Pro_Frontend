import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  Package, Truck, CreditCard, Users, Clock,
  Plus, UserPlus, DollarSign, Search, QrCode,
  Eye, EyeOff,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useDepotDashboard } from '../../../hooks/useDepotDashboard';
import {
  DashboardHeader, DashboardStatCard, QuickActionCard,
  StatusBadge, SearchBar, FilterBar, TablePagination,
  RecentActivity, NotificationPanel, EmptyState, LoadingState,
  AgentScanModal,
} from '../../../components/agent';
import '../../../components/agent/AgentDashboard.css';

const STATUS_OPTIONS = [
  { value: 'validated', label: 'Validée' },
  { value: 'preparing', label: 'En préparation' },
  { value: 'assigned', label: 'Affectée' },
  { value: 'in_transit', label: 'En transit' },
  { value: 'arrived', label: 'Arrivée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
];

const DEST_OPTIONS = [
  { value: 'Douala', label: 'Douala' },
  { value: 'Yaoundé', label: 'Yaoundé' },
  { value: 'Bamenda', label: 'Bamenda' },
  { value: 'Maroua', label: 'Maroua' },
  { value: 'Garoua', label: 'Garoua' },
  { value: 'Kribi', label: 'Kribi' },
];

export function DepotDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const d = useDepotDashboard(user);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showParcels, setShowParcels] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  const paginatedShipments = useMemo(() => {
    const { page, perPage } = d.pagination;
    const start = (page - 1) * perPage;
    return d.filteredShipments.slice(start, start + perPage);
  }, [d.filteredShipments, d.pagination]);

  const totalPages = Math.ceil(d.filteredShipments.length / d.pagination.perPage) || 1;

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
          value={d.stats?.shipmentsToday ?? '—'}
          label="Expéditions aujourd'hui"
          icon={Truck}
          color="primary"
          loading={d.loading.dashboard}
        />
        <DashboardStatCard
          value={d.stats?.parcelsToday ?? '—'}
          label="Colis enregistrés"
          icon={Package}
          color="info"
          loading={d.loading.dashboard}
        />
        <DashboardStatCard
          value={d.formatCurrency(d.stats?.amountCollected ?? 0)}
          label="Montant encaissé"
          icon={CreditCard}
          color="success"
          loading={d.loading.dashboard}
        />
        <DashboardStatCard
          value={d.stats?.clientsReceived ?? '—'}
          label="Clients reçus"
          icon={Users}
          color="warning"
          loading={d.loading.dashboard}
        />
        <DashboardStatCard
          value={d.stats?.pendingShipments ?? '—'}
          label="Expéditions en attente"
          icon={Clock}
          color="danger"
          loading={d.loading.dashboard}
        />
      </div>

      {/* Quick Actions */}
      <div className="ag-quick-actions ag-quick-actions--5">
        <QuickActionCard
          icon={Plus}
          label="Nouvelle expédition"
          hint="Enregistrer un envoi"
          color="primary"
          onClick={() => navigate('/shipments/new')}
        />
        <QuickActionCard
          icon={UserPlus}
          label="Ajouter un client"
          hint="Créer une fiche client"
          color="success"
          onClick={() => navigate('/clients')}
        />
        <QuickActionCard
          icon={DollarSign}
          label="Enregistrer paiement"
          hint="Saisir un règlement"
          color="warning"
          onClick={() => navigate('/payments')}
        />
        <QuickActionCard
          icon={Search}
          label="Rechercher"
          hint="Trouver une expédition"
          color="info"
          onClick={() => setShowScanModal(true)}
        />
        <QuickActionCard
          icon={QrCode}
          label="Scanner un code"
          hint="Lire un QR code"
          color="secondary"
          onClick={() => setShowScanModal(true)}
        />
      </div>

      {/* Main Grid */}
      <div className="ag-grid ag-grid--76">
        {/* Recent Activity */}
        <div className="ag-section">
          <div className="ag-section__header">
            <div className="ag-section__header-left">
              <h3 className="ag-section__title">Activité récente</h3>
            </div>
          </div>
          <div className="ag-section__body">
            <RecentActivity
              activities={d.recentActivities}
              loading={d.loading.dashboard}
              formatTime={d.formatTime}
            />
          </div>
        </div>

        {/* Recent Parcels Toggle */}
        <div className="ag-section">
          <div className="ag-section__header">
            <div className="ag-section__header-left">
              <h3 className="ag-section__title">Colis récents</h3>
              <span className="ag-section__count">{d.parcels.length}</span>
            </div>
            <button
              className="ag-filters__reset"
              onClick={() => setShowParcels(!showParcels)}
              type="button"
            >
              {showParcels ? <EyeOff size={14} /> : <Eye size={14} />}
              {showParcels ? 'Masquer' : 'Voir'}
            </button>
          </div>
          <div className="ag-section__body">
            {d.loading.dashboard ? (
              <LoadingState rows={4} />
            ) : d.parcels.length === 0 ? (
              <EmptyState title="Aucun colis" />
            ) : (
              <div className="ag-parcel-list">
                {(showParcels ? d.parcels : d.parcels.slice(0, 5)).map((pkg) => (
                  <div key={pkg.id} className="ag-parcel-card">
                    <div className="ag-parcel-card__tracking">{pkg.trackingNumber}</div>
                    <div className="ag-parcel-card__info">
                      <p className="ag-parcel-card__detail">{pkg.weight} kg · {pkg.category}</p>
                      <div className="ag-parcel-card__meta">
                        <span>Exp: {pkg.shipmentId}</span>
                      </div>
                    </div>
                    <StatusBadge status={pkg.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="ag-section">
        <div className="ag-section__header">
          <div className="ag-section__header-left">
            <h3 className="ag-section__title">Expéditions</h3>
            <span className="ag-section__count">{d.filteredShipments.length}</span>
          </div>
          <div className="ag-section__tools">
            <SearchBar
              value={d.search}
              onChange={d.setSearch}
              placeholder="Référence ou client..."
            />
            <FilterBar
              filters={d.filters}
              options={{
                status: { label: 'Statut', items: STATUS_OPTIONS },
                destination: { label: 'Destination', items: DEST_OPTIONS },
              }}
              onChange={d.setFilters}
              onReset={d.resetFilters}
            />
          </div>
        </div>
        <div className="ag-section__body">
          {d.loading.dashboard ? (
            <LoadingState rows={5} />
          ) : paginatedShipments.length === 0 ? (
            <EmptyState title="Aucune expédition" description="Aucun résultat trouvé pour votre recherche" />
          ) : (
            <>
              <table className="ag-table">
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Client</th>
                    <th>Destination</th>
                    <th>Colis</th>
                    <th className="ag-table__cell--right">Montant</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedShipments.map((s) => (
                    <tr key={s.id}>
                      <td data-label="Référence">
                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{s.reference}</span>
                      </td>
                      <td data-label="Client">{s.senderName}</td>
                      <td data-label="Destination">{s.destination}</td>
                      <td data-label="Colis">{s.packageCount}</td>
                      <td data-label="Montant" className="ag-table__cell--right">{d.formatCurrency(s.totalAmount)}</td>
                      <td data-label="Statut"><StatusBadge status={s.status} /></td>
                      <td data-label="Actions">
                        <div className="ag-actions-cell">
                          <button className="ag-action-btn" type="button" aria-label="Voir détails">
                            <Eye size={14} />
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
                total={d.filteredShipments.length}
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

      {/* Scan Modal */}
      {showScanModal && (
        <AgentScanModal
          user={user}
          onClose={() => setShowScanModal(false)}
        />
      )}
    </div>
  );
}

export default DepotDashboardPage;
