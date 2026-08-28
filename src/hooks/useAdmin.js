import { useMemo } from 'react';
import useAdminStore from '../store/useAdminStore';

export function useEnterprises() {
  const {
    enterprises, loading, error, search, filters, currentPage, pageSize,
    fetchEnterprises, setSearch, setFilters, setCurrentPage,
  } = useAdminStore();

  const filtered = useMemo(() => {
    let list = enterprises;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.name?.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q));
    }
    if (filters.status !== 'all') {
      list = list.filter((e) => e.status === filters.status);
    }
    if (filters.plan !== 'all') {
      list = list.filter((e) => e.planId === filters.plan);
    }
    return list;
  }, [enterprises, search, filters]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const totalPages = useMemo(() => Math.ceil(filtered.length / pageSize), [filtered, pageSize]);

  return {
    enterprises: paginated,
    allEnterprises: enterprises,
    total: filtered.length,
    totalPages,
    loading,
    error,
    search,
    filters,
    currentPage,
    pageSize,
    setSearch,
    setFilters,
    setCurrentPage,
    fetchEnterprises,
  };
}

export function useEnterprise() {
  const {
    selectedEnterprise, loading, error,
    fetchEnterprise, updateEnterprise, updateEnterpriseStatus,
  } = useAdminStore();

  return {
    enterprise: selectedEnterprise,
    loading,
    error,
    fetch: fetchEnterprise,
    update: updateEnterprise,
    updateStatus: updateEnterpriseStatus,
  };
}

export function usePlans() {
  const { plans, loading, error, fetchPlans, createPlan, updatePlan, deletePlan } = useAdminStore();

  return {
    plans,
    loading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
  };
}

export function useSubscriptions() {
  const { subscriptions, loading, error, fetchSubscriptions, updateSubscription } = useAdminStore();

  return {
    subscriptions,
    loading,
    error,
    fetchSubscriptions,
    updateSubscription,
  };
}

export function useRequests() {
  const { requests, loading, error, fetchRequests, reviewRequest } = useAdminStore();

  return {
    requests,
    loading,
    error,
    fetchRequests,
    reviewRequest,
  };
}

export function usePlatformUsers() {
  const { platformUsers, loading, error, fetchPlatformUsers, createSuperAdmin } = useAdminStore();

  return {
    platformUsers,
    loading,
    error,
    fetchPlatformUsers,
    createSuperAdmin,
  };
}

export function useManagers() {
  const { managers, loading, error, fetchManagers } = useAdminStore();

  return {
    managers,
    loading,
    error,
    fetchManagers,
  };
}

export function useNotifications() {
  const {
    notifications, loading, error,
    fetchNotifications, markNotificationRead, markAllNotificationsRead,
  } = useAdminStore();

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
  };
}

export default useAdminStore;
