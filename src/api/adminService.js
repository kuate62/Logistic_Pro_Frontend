import apiClient from './axios';
import { mockAdminService } from './mockAdmin';
import { PLAN_LABELS, mapPlan } from './subscriptionsService';
import { partnerRequestsService } from './partnerRequestsService';

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 150);

const MOCK_TO_PLAN = { plan_1: 'starter', plan_2: 'pro', plan_3: 'enterprise' };

const normalizePlanCode = (id) => MOCK_TO_PLAN[id] || id || 'free';

const toApiStatus = (mockStatus) => (mockStatus === 'archived' ? 'inactive' : mockStatus);
const fromApiStatus = (apiStatus) => (apiStatus === 'inactive' ? 'archived' : apiStatus);

const generateAdminPassword = () =>
  `Admin@${String(Math.floor(100000 + Math.random() * 900000))}`;

const mapCompany = (c, extra = {}) => {
  const agencies = c.agencies || [];
  const clients = c.clients || [];
  const sub = extra.subscription || null;
  const stats = extra.stats || {};
  const agenciesCount = stats.agencies ?? agencies.length;
  const employeesCount = stats.employees ?? 0;

  return {
    id: c.id,
    name: c.name,
    tradeName: c.slug || c.name,
    email: c.email || '',
    phone: c.phone || '',
    city: c.city || '',
    address: c.address || '',
    siret: c.taxId || '',
    status: fromApiStatus(c.status),
    planId: sub ? sub.plan : null,
    employeesCount,
    agenciesCount,
    shipmentsThisMonth: stats.shipmentsThisMonth ?? 0,
    revenue: stats.revenue ?? 0,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    website: null,
    description: '',
    country: 'Cameroun',
    region: '',
    postalCode: '',
    responsible: null,
    subscription: sub
      ? {
          id: sub.id,
          planId: sub.plan,
          startDate: sub.startDate,
          endDate: sub.endDate,
          status: sub.status,
        }
      : null,
    quotas: {
      agencies: { used: agenciesCount, max: -1 },
      users: { used: employeesCount, max: -1 },
      storage: { used: 0, max: 50 },
    },
    stats: {
      employees: employeesCount,
      agencies: agenciesCount,
      clients: stats.clients ?? clients.length,
      shipments: stats.shipments ?? 0,
      packages: stats.packages ?? 0,
      volume: '0',
    },
    isTrial: false,
    trialEndsAt: null,
  };
};

const mapSubscriptionAdmin = (s) => {
  const detail = mapPlan(s.planDetail || null);
  return {
    id: s.id,
    companyId: s.companyId,
    planId: s.plan || 'free',
    plan: s.plan || 'free',
    planLabel: detail?.name || PLAN_LABELS[s.plan] || s.plan || 'free',
    planDetail: detail,
    status: s.status === 'cancelled' ? 'suspended' : s.status,
    startDate: s.startDate,
    endDate: s.endDate,
    renewalDate: s.endDate,
    paymentMethod: '',
    amount: detail?.price || 0,
    currency: detail?.currency || 'FCFA',
    autoRenew: s.autoRenew ?? false,
  };
};

const mapPlatformUser = (u) => ({
  id: u.id,
  firstName: u.firstname || '',
  lastName: u.lastname || '',
  email: u.email || '',
  role: 'super_admin',
  isActive: !!u.status,
  lastLogin: '',
  createdAt: u.createdAt,
});

const mapManager = (u, companyByUserId = {}, nameByCompany = {}) => {
  const comp = u.employeeProfile?.company || null;
  const companyId = comp?.id || companyByUserId[u.id] || '';
  const companyName = comp?.name || nameByCompany[companyId] || '';
  return {
    id: u.id,
    firstName: u.firstname || '',
    lastName: u.lastname || '',
    email: u.email || '',
    phone: u.phone || '',
    companyId: String(companyId),
    companyName: companyName,
    role: 'enterprise_admin',
    isActive: !!u.status,
    lastLogin: '',
    createdAt: u.createdAt,
  };
};

async function fetchCompanyDetail(companyId) {
  const [cRes, sRes, statsRes, eRes] = await Promise.all([
    apiClient.get(`/companies/${companyId}`),
    apiClient.get('/subscriptions', { params: { companyId, limit: 1 } }),
    apiClient.get('/shipments/stats', { params: { companyId } }),
    apiClient.get('/employees', { params: { companyId, limit: 1000 } }),
  ]);
  const company = cRes.data.company;
  if (!company) throw new Error('Entreprise introuvable');
  const sub = (sRes.data.subscriptions || [])[0] || null;
  const statsData = statsRes.data.stats || {};
  const stats = {
    employees: (eRes.data.employees || []).length,
    agencies: (company.agencies || []).length,
    clients: (company.clients || []).length,
    shipments: statsData.total || 0,
    packages: statsData.totalPackages || 0,
    revenue: statsData.totalRevenue || 0,
    shipmentsThisMonth: statsData.total || 0,
  };
  return mapCompany(company, { subscription: sub, stats });
}

export const adminService = {
  async getDashboardStats() {
    try {
      const res = await apiClient.get('/admin/stats');
      const data = res.data;
      return {
        stats: {
          totalEnterprises: data.stats?.totalEnterprises || 0,
          activeEnterprises: data.stats?.activeEnterprises || 0,
          suspendedEnterprises: data.stats?.suspendedEnterprises || 0,
          archivedEnterprises: data.stats?.archivedEnterprises || 0,
          totalPlatformUsers: data.stats?.totalPlatformUsers || 0,
          totalManagers: data.stats?.totalManagers || 0,
          pendingRequests: data.stats?.pendingRequests || 0,
          totalRevenue: data.stats?.totalRevenue || 0,
        },
        revenueChart: data.revenueChart || [],
        subscriptionsByStatus: data.subscriptionsByStatus || [],
        enterprisesByPlan: (data.enterprisesByPlan || []).map((p) => ({
          plan: PLAN_LABELS[p.plan] || p.plan || 'Free',
          count: p.count,
        })),
      };
    } catch {
      return mockAdminService.getDashboardStats();
    }
  },

  async getEnterprises(filters = {}) {
    try {
      const params = { limit: 1000 };
      if (filters.search) params.search = filters.search;
      if (filters.status && filters.status !== 'all') params.status = toApiStatus(filters.status);

      const [cRes, sRes] = await Promise.all([
        apiClient.get('/companies', { params }),
        apiClient.get('/subscriptions', { params: { limit: 1000 } }),
      ]);
      const subByCompany = {};
      (sRes.data.subscriptions || []).forEach((s) => {
        subByCompany[s.companyId] = s;
      });

      let list = (cRes.data.companies || []).map((c) =>
        mapCompany(c, { subscription: subByCompany[c.id] || null })
      );

      if (filters.planId && filters.planId !== 'all') {
        list = list.filter((e) => e.planId === filters.planId);
      }
      return list;
    } catch {
      return mockAdminService.getEnterprises(filters);
    }
  },

  async getEnterprise(id) {
    try {
      return await fetchCompanyDetail(id);
    } catch {
      return mockAdminService.getEnterprise(id);
    }
  },

  async createEnterprise(data) {
    const payload = {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      city: data.city || null,
      address: data.address || null,
      status: 'active',
    };
    if (data.tradeName) payload.slug = slugify(data.tradeName);

    const companyRes = await apiClient.post('/companies', payload);
    const company = companyRes.data.company;

    let adminUser = null;
    let adminPassword = '';
    if (data.responsible?.email && data.responsible?.firstName && data.responsible?.lastName) {
      adminPassword = generateAdminPassword();
      try {
        const userRes = await apiClient.post('/users', {
          firstname: data.responsible.firstName,
          lastname: data.responsible.lastName,
          email: data.responsible.email,
          phone: data.responsible.phone || null,
          password: adminPassword,
          roles: 'ROLE_ADMIN',
          status: true,
          verified: true,
        });
        adminUser = userRes.data.user;
        try {
          await apiClient.post('/employees', {
            userId: adminUser.id,
            companyId: company.id,
            firstName: data.responsible.firstName,
            lastName: data.responsible.lastName,
            email: data.responsible.email,
            phone: data.responsible.phone || null,
            role: 'manager',
          });
        } catch { /* employé non bloquant */ }
      } catch { /* user admin non bloquant */ }
    }

    try {
      await apiClient.post('/subscriptions', {
        companyId: company.id,
        plan: normalizePlanCode(data.planId),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      });
    } catch { /* abonnement non bloquant */ }

    const mapped = await this.getEnterprise(company.id);
    if (adminUser) {
      mapped.responsible = {
        firstName: adminUser.firstname,
        lastName: adminUser.lastname,
        email: adminUser.email,
        phone: adminUser.phone || '',
        position: data.responsible?.position || 'Administrateur',
      };
      mapped.tempAdminPassword = adminPassword;
    }
    return mapped;
  },

  async updateEnterprise(id, data) {
    const payload = {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      city: data.city || null,
      address: data.address || null,
    };
    if (data.tradeName) payload.slug = slugify(data.tradeName);
    await apiClient.patch(`/companies/${id}`, payload);
    return this.getEnterprise(id);
  },

  async updateEnterpriseStatus(id, status) {
    await apiClient.patch(`/companies/${id}`, { status: toApiStatus(status) });
    return this.getEnterprise(id);
  },

  async getEnterpriseStatistics(id) {
    try {
      const [cRes, statsRes, eRes, clRes] = await Promise.all([
        apiClient.get(`/companies/${id}`),
        apiClient.get('/shipments/stats', { params: { companyId: id } }),
        apiClient.get('/employees', { params: { companyId: id, limit: 1000 } }),
        apiClient.get('/clients', { params: { companyId: id, limit: 1000 } }),
      ]);
      const stats = statsRes.data.stats || {};
      const company = cRes.data.company || {};
      return {
        employees: (eRes.data.employees || []).length,
        agencies: (company.agencies || []).length,
        clients: (clRes.data.clients || []).length,
        shipments: stats.total || 0,
        packages: stats.totalPackages || 0,
        volume: String(stats.totalWeight || 0),
        revenue: stats.totalRevenue || 0,
        shipmentsThisMonth: stats.total || 0,
        shipmentsHistory: [],
        topAgencies: [],
      };
    } catch {
      return mockAdminService.getEnterpriseStatistics(id);
    }
  },

  async getSubscriptions(filters = {}) {
    try {
      const [sRes, cRes] = await Promise.all([
        apiClient.get('/subscriptions', { params: { limit: 1000 } }),
        apiClient.get('/companies', { params: { limit: 1000 } }),
      ]);
      const nameByCompany = {};
      (cRes.data.companies || []).forEach((c) => {
        nameByCompany[c.id] = c.name;
      });
      let list = (sRes.data.subscriptions || []).map((s) => ({
        ...mapSubscriptionAdmin(s),
        companyName: nameByCompany[s.companyId] || `Entreprise #${s.companyId}`,
      }));
      if (filters.status && filters.status !== 'all') {
        list = list.filter((s) => s.status === filters.status);
      }
      if (filters.companyId) {
        list = list.filter((s) => s.companyId === Number(filters.companyId));
      }
      return list;
    } catch {
      return mockAdminService.getSubscriptions(filters);
    }
  },

  async updateSubscription(id, data) {
    const payload = {};
    if (data.plan) payload.plan = normalizePlanCode(data.plan);
    if (data.status) payload.status = data.status === 'suspended' ? 'cancelled' : data.status;
    if (data.startDate) payload.startDate = data.startDate;
    if (data.endDate !== undefined) payload.endDate = data.endDate || null;
    if (data.autoRenew !== undefined) payload.autoRenew = data.autoRenew;
    const res = await apiClient.patch(`/subscriptions/${id}`, payload);
    return mapSubscriptionAdmin(res.data.subscription);
  },

  async getPlans(filters = {}) {
    try {
      const params = { limit: 100 };
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      const res = await apiClient.get('/plans', { params });
      return (res.data.plans || []).map(mapPlan);
    } catch {
      return mockAdminService.getPlans(filters);
    }
  },

  async createPlan(data) {
    const payload = {
      code: data.code,
      name: data.name,
      price: data.price,
      currency: data.currency || 'FCFA',
      billingCycle: data.billingCycle || 'monthly',
      status: data.status || 'active',
    };
    if (data.description) payload.description = data.description;
    if (data.maxAgencies !== undefined) payload.maxAgencies = data.maxAgencies;
    if (data.maxUsers !== undefined) payload.maxUsers = data.maxUsers;
    if (data.maxStorage !== undefined) payload.maxStorage = data.maxStorage;
    if (data.maxShipments !== undefined) payload.maxShipments = data.maxShipments;
    if (Array.isArray(data.features)) payload.features = data.features;
    const res = await apiClient.post('/plans', payload);
    return mapPlan(res.data.plan);
  },

  async updatePlan(id, data) {
    const payload = {};
    if (data.name) payload.name = data.name;
    if (data.price !== undefined) payload.price = data.price;
    if (data.currency) payload.currency = data.currency;
    if (data.billingCycle) payload.billingCycle = data.billingCycle;
    if (data.status) payload.status = data.status;
    if (data.description !== undefined) payload.description = data.description;
    if (data.maxAgencies !== undefined) payload.maxAgencies = data.maxAgencies;
    if (data.maxUsers !== undefined) payload.maxUsers = data.maxUsers;
    if (data.maxStorage !== undefined) payload.maxStorage = data.maxStorage;
    if (data.maxShipments !== undefined) payload.maxShipments = data.maxShipments;
    if (Array.isArray(data.features)) payload.features = data.features;
    const res = await apiClient.patch(`/plans/${id}`, payload);
    return mapPlan(res.data.plan);
  },

  async deletePlan(id) {
    const res = await apiClient.delete(`/plans/${id}`);
    return res.data;
  },

  async getRegistrationRequests(filters = {}) {
    try {
      const res = await partnerRequestsService.list(filters);
      return res.requests;
    } catch {
      return mockAdminService.getRegistrationRequests(filters);
    }
  },

  async getRequests(filters = {}) {
    return this.getRegistrationRequests(filters);
  },

  async reviewRequest(id, action, reason = '') {
    try {
      const status = action === 'approve' ? 'approved' : 'rejected';
      return await partnerRequestsService.review(id, status, reason);
    } catch {
      return mockAdminService.reviewRequest(id, action, reason);
    }
  },

  async getPlatformUsers() {
    try {
      const res = await apiClient.get('/users', { params: { roles: 'ROLE_ROOT', limit: 1000 } });
      return (res.data.users || []).map(mapPlatformUser);
    } catch {
      return mockAdminService.getPlatformUsers();
    }
  },

  async createSuperAdmin(data) {
    const res = await apiClient.post('/users', {
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      phone: data.phone || null,
      password: data.password,
      roles: 'ROLE_ROOT',
      status: true,
      verified: true,
    });
    return mapPlatformUser(res.data.user);
  },

  async getManagers(filters = {}) {
    try {
      const uRes = await apiClient.get('/users', { params: { roles: 'ROLE_ADMIN', limit: 1000 } });
      let list = (uRes.data.users || []).map((u) => mapManager(u));

      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (m) =>
            `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            (m.companyName || '').toLowerCase().includes(q)
        );
      }
      if (filters.isActive !== undefined) {
        list = list.filter((m) => m.isActive === filters.isActive);
      }
      return list;
    } catch {
      return mockAdminService.getManagers(filters);
    }
  },

  async getNotifications(filters = {}) {
    try {
      const params = {};
      if (filters.type && filters.type !== 'all') params.type = filters.type;
      if (filters.unread) params.unread = true;
      const res = await apiClient.get('/notifications', { params });
      return res.data.notifications || [];
    } catch {
      return mockAdminService.getNotifications(filters);
    }
  },

  async markNotificationRead(id) {
    try {
      const res = await apiClient.patch(`/notifications/${id}/read`);
      return res.data.notification;
    } catch {
      return mockAdminService.markNotificationRead(id);
    }
  },

  async markAllNotificationsRead() {
    try {
      const res = await apiClient.post('/notifications/mark-all-read');
      return res.data;
    } catch {
      return mockAdminService.markAllNotificationsRead();
    }
  },
};

export default adminService;
