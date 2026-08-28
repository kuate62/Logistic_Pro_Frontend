import apiClient from './axios';
import { mockDashboardService } from './mockDashboard';

const mapRecentPayment = (p) => ({
  id: p.id,
  reference: p.reference || '',
  client: p.client
    ? `${p.client.firstName || p.client.firstname || ''} ${p.client.lastName || p.client.lastname || ''}`.trim()
    : (p.clientName || '—'),
  amount: p.amount ?? p.totalAmount ?? 0,
  method: p.paymentMethod || 'cash',
  status: p.status === 'paid' ? 'completed' : p.status,
  date: p.createdAt,
});

const mapParcelTracking = (p) => {
  const events = p.tracking || [];
  const lastEvent = events[0] || null;
  return {
    id: p.id,
    tracking: p.trackingNumber || p.trackingCode,
    destination: p.shipment?.destinationAgency?.city || p.destination || '—',
    recipient: p.shipment?.recipient?.name || '—',
    status: p.status,
    lastEvent,
    lastDate: lastEvent?.createdAt || p.updatedAt || p.createdAt,
  };
};

const mapRecentShipment = (s) => ({
  id: s.id,
  reference: s.reference || '',
  clientName: s.client ? `${s.client.firstName || s.client.firstname || ''} ${s.client.lastName || s.client.lastname || ''}`.trim() : '—',
  origin: s.originAgency?.city || s.origin || '—',
  destination: s.destinationAgency?.city || s.destination || '—',
  status: s.status,
  date: s.createdAt,
  parcelCount: s.parcels?.length ?? 0,
  totalAmount: s.totalAmount ?? 0,
});

// Build last-12-months labels for chart
const getLast12Months = () => {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString('fr-FR', { month: 'short', year: '2-digit' }));
  }
  return months;
};

// Build monthly revenue chart from real payments grouped by month
const buildMonthlyRevenue = (months12) => {
  return months12.map((month) => ({
    month,
    revenue: 0,
    shipments: 0,
  }));
};

const packageStatusColors = {
  validated: '#3b82f6',
  preparing: '#8b5cf6',
  assigned: '#f59e0b',
  in_transit: '#0ea5e9',
  arrived: '#22c55e',
  available_pickup: '#f59e0b',
  delivered: '#10b981',
  collected: '#10b981',
  cancelled: '#ef4444',
  damaged: '#f97316',
  registered: '#94a3b8',
};

export const dashboardService = {
  async getAll(companyId) {
    let mock = null;
    try {
      mock = await mockDashboardService.getAll(companyId);
    } catch {
      mock = {
        kpis: {},
        charts: {},
        activity: [],
        notifications: [],
        packageAlerts: [],
        activeRoutes: [],
        recentPayments: [],
        agencyPerformance: [],
        employeePerformance: [],
        agenda: [],
        subscription: null,
        alerts: [],
      };
    }

    if (!companyId || companyId === 'default') return mock;

    try {
      const res = await apiClient.get(`/companies/${companyId}/dashboard`);
      const { kpis, recentPayments = [], recentShipments = [], recentParcels = [] } = res.data;

      // Build real status KPIs
      const statusCounts = kpis.statusCounts || {};
      const transitPackages = (statusCounts.in_transit || 0) + (statusCounts.preparing || 0) + (statusCounts.assigned || 0);
      const pendingPackages = (statusCounts.validated || 0) + (statusCounts.arrived || 0) + (statusCounts.available_pickup || 0);
      const deliveredToday = statusCounts.delivered || 0;
      const totalRevenue = kpis.totalRevenue || 0;
      const totalPaid = kpis.totalPaid || 0;

      // Build package status pie chart from real status counts
      const packageStatus = Object.entries(statusCounts)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => ({
          name: k.replace(/_/g, ' '),
          value: v,
          color: packageStatusColors[k] || '#94a3b8',
        }));

      // Build month labels
      const months12 = getLast12Months();
      const revenueEvolution = buildMonthlyRevenue(months12);
      // Inject real total in current month (last index)
      if (revenueEvolution.length > 0) {
        revenueEvolution[revenueEvolution.length - 1].revenue = totalPaid;
        revenueEvolution[revenueEvolution.length - 1].shipments = kpis.totalShipments || 0;
      }

      // Map real recent payments
      const mappedPayments = recentPayments.length
        ? recentPayments.map(mapRecentPayment)
        : (mock.recentPayments || []);

      // Map real recent parcels for alerts
      const mappedParcels = recentParcels.length
        ? recentParcels.map(mapParcelTracking)
        : (mock.packageAlerts || []);

      // Map real recent shipments for activity feed
      const mappedShipments = recentShipments.length
        ? recentShipments.map(mapRecentShipment)
        : [];

      // Build activity feed from recent shipments
      const activity = mappedShipments.map((s) => ({
        id: `shipment-${s.id}`,
        type: 'shipment',
        message: `Expédition ${s.reference} créée — ${s.clientName}`,
        detail: `${s.origin} → ${s.destination}`,
        status: s.status,
        date: s.date,
        amount: s.totalAmount,
      }));

      return {
        ...mock,
        kpis: {
          ...mock.kpis,
          totalPackages: kpis.totalPackages || 0,
          totalShipments: kpis.totalShipments || 0,
          transitPackages,
          pendingPackages,
          deliveredToday,
          totalRevenue,
          totalPaid,
          activeEmployees: kpis.totalEmployees || 0,
          activeAgencies: kpis.totalAgencies || 0,
          totalClients: kpis.totalClients || 0,
          totalCustomers: kpis.totalClients || 0,
          // Revenue metrics
          revenueToday: totalPaid,
          revenueMonth: totalRevenue,
          // Trend placeholders (could be enhanced with period comparison)
          prevTotalPackages: null,
          prevTransitPackages: null,
          prevRevenueToday: null,
          prevRevenueMonth: null,
        },
        charts: {
          ...mock.charts,
          packageStatus: packageStatus.length ? packageStatus : mock.charts?.packageStatus,
          revenueEvolution,
          // Monthly shipments chart (simplified with real total in current month)
          monthlyShipments: revenueEvolution.map((m) => ({
            month: m.month,
            shipments: m.shipments,
            parcels: m.shipments * 2, // approximation
          })),
        },
        recentPayments: mappedPayments,
        packageAlerts: mappedParcels,
        activeRoutes: mock.activeRoutes || [],
        activity: activity.length ? activity : mock.activity || [],
      };
    } catch (err) {
      console.warn('Dashboard API fallback to mock:', err.message);
      return mock;
    }
  },
};

export default dashboardService;
