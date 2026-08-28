import { create } from 'zustand';
import { adminService } from '../api/adminService';

const useAdminStore = create((set) => ({
  enterprises: [],
  selectedEnterprise: null,
  plans: [],
  subscriptions: [],
  requests: [],
  platformUsers: [],
  managers: [],
  notifications: [],

  loading: false,
  error: null,

  search: '',
  filters: { status: 'all', plan: 'all' },
  currentPage: 1,
  pageSize: 10,

  setSearch: (search) => set({ search, currentPage: 1 }),
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters }, currentPage: 1 })),
  setCurrentPage: (currentPage) => set({ currentPage }),

  fetchEnterprises: async () => {
    set({ loading: true, error: null });
    try {
      const enterprises = await adminService.getEnterprises();
      set({ enterprises, loading: false });
    } catch (err) { set({ loading: false, error: err.message }); }
  },

  fetchEnterprise: async (id) => {
    set({ loading: true, error: null });
    try {
      const selectedEnterprise = await adminService.getEnterprise(id);
      set({ selectedEnterprise, loading: false });
    } catch (err) { set({ loading: false, error: err.message }); }
  },

  createEnterprise: async (data) => {
    set({ loading: true, error: null });
    try {
      const enterprise = await adminService.createEnterprise(data);
      set((s) => ({ enterprises: [...s.enterprises, enterprise], loading: false }));
      return enterprise;
    } catch (err) { set({ loading: false, error: err.message }); throw err; }
  },

  updateEnterprise: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const enterprise = await adminService.updateEnterprise(id, data);
      set((s) => ({
        enterprises: s.enterprises.map((e) => (e.id === id ? enterprise : e)),
        selectedEnterprise: s.selectedEnterprise?.id === id ? enterprise : s.selectedEnterprise,
        loading: false,
      }));
      return enterprise;
    } catch (err) { set({ loading: false, error: err.message }); throw err; }
  },

  updateEnterpriseStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const enterprise = await adminService.updateEnterpriseStatus(id, status);
      set((s) => ({
        enterprises: s.enterprises.map((e) => (e.id === id ? enterprise : e)),
        selectedEnterprise: s.selectedEnterprise?.id === id ? enterprise : s.selectedEnterprise,
        loading: false,
      }));
      return enterprise;
    } catch (err) { set({ loading: false, error: err.message }); throw err; }
  },

  fetchPlans: async () => {
    set({ loading: true, error: null });
    try {
      const plans = await adminService.getPlans();
      set({ plans, loading: false });
    } catch (err) { set({ loading: false, error: err.message }); }
  },

  createPlan: async (data) => {
    set({ loading: true, error: null });
    try {
      const plan = await adminService.createPlan(data);
      set((s) => ({ plans: [...s.plans, plan], loading: false }));
      return plan;
    } catch (err) { set({ loading: false, error: err.message }); throw err; }
  },

  updatePlan: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const plan = await adminService.updatePlan(id, data);
      set((s) => ({ plans: s.plans.map((p) => (p.id === id ? plan : p)), loading: false }));
      return plan;
    } catch (err) { set({ loading: false, error: err.message }); throw err; }
  },

  deletePlan: async (id) => {
    set({ loading: true, error: null });
    try {
      await adminService.deletePlan(id);
      set((s) => ({ plans: s.plans.filter((p) => p.id !== id), loading: false }));
    } catch (err) { set({ loading: false, error: err.message }); throw err; }
  },

  fetchSubscriptions: async () => {
    set({ loading: true, error: null });
    try {
      const subscriptions = await adminService.getSubscriptions();
      set({ subscriptions, loading: false });
    } catch (err) { set({ loading: false, error: err.message }); }
  },

  updateSubscription: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const subscription = await adminService.updateSubscription(id, data);
      set((s) => ({ subscriptions: s.subscriptions.map((s) => (s.id === id ? subscription : s)), loading: false }));
      return subscription;
    } catch (err) { set({ loading: false, error: err.message }); throw err; }
  },

  fetchRequests: async () => {
    set({ loading: true, error: null });
    try {
      const requests = await adminService.getRequests();
      set({ requests, loading: false });
    } catch (err) { set({ loading: false, error: err.message }); }
  },

  reviewRequest: async (id, action, reason = '') => {
    set({ loading: true, error: null });
    try {
      const request = await adminService.reviewRequest(id, action, reason);
      set((s) => ({ requests: s.requests.map((r) => (r.id === id ? request : r)), loading: false }));
      return request;
    } catch (err) { set({ loading: false, error: err.message }); throw err; }
  },

  fetchPlatformUsers: async () => {
    set({ loading: true, error: null });
    try {
      const platformUsers = await adminService.getPlatformUsers();
      set({ platformUsers, loading: false });
    } catch (err) { set({ loading: false, error: err.message }); }
  },

  createSuperAdmin: async (data) => {
    set({ loading: true, error: null });
    try {
      const user = await adminService.createSuperAdmin(data);
      set((s) => ({ platformUsers: [...s.platformUsers, user], loading: false }));
      return user;
    } catch (err) { set({ loading: false, error: err.message }); throw err; }
  },

  fetchManagers: async () => {
    set({ loading: true, error: null });
    try {
      const managers = await adminService.getManagers();
      set({ managers, loading: false });
    } catch (err) { set({ loading: false, error: err.message }); }
  },

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const notifications = await adminService.getNotifications();
      set({ notifications, loading: false });
    } catch (err) { set({ loading: false, error: err.message }); }
  },

  markNotificationRead: async (id) => {
    try {
      await adminService.markNotificationRead(id);
      set((s) => ({
        notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      }));
    } catch (err) { set({ error: err.message }); }
  },

  markAllNotificationsRead: async () => {
    try {
      await adminService.markAllNotificationsRead();
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      }));
    } catch (err) { set({ error: err.message }); }
  },
}));

export default useAdminStore;
