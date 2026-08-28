import { useEffect, useCallback, useMemo } from 'react';
import useDepotStore from '../store/useDepotStore';

export function useDepotDashboard(user) {
  const store = useDepotStore();

  useEffect(() => {
    if (user?.id) {
      store.fetchDashboard(user);
    }
  }, [user?.id, user?.employeeId, user?.agencyId]);

  const refresh = useCallback(() => {
    if (user?.id) store.fetchDashboard(user);
  }, [user?.id, user?.employeeId, user?.agencyId]);

  const filteredShipments = useMemo(() => {
    const { search, filters } = store;
    return store.shipments.filter((s) => {
      const matchSearch = !search
        || s.reference?.toLowerCase().includes(search.toLowerCase())
        || s.senderName?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filters.status || s.status === filters.status;
      const matchDest = !filters.destination || s.destination === filters.destination;
      return matchSearch && matchStatus && matchDest;
    });
  }, [store.shipments, store.search, store.filters]);

  const unreadCount = store.notifications.filter((n) => !n.read).length;
  const recentActivities = store.activities.slice(0, 10);

  const formatCurrency = useCallback((val) => {
    return new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(val) + ' FCFA';
  }, []);

  const formatTime = useCallback((date) => {
    if (!date) return '—';
    if (typeof date === 'string' && (date.includes(':') && date.length <= 8 || date.includes('min') || date.includes('h'))) {
      return date;
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) return typeof date === 'string' ? date : '—';
    try {
      return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(d);
    } catch {
      return typeof date === 'string' ? date : '—';
    }
  }, []);

  const formatDate = useCallback((date) => {
    if (!date) return '—';
    if (typeof date === 'string' && !date.includes('-') && !date.includes('/')) {
      return date;
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) return typeof date === 'string' ? date : '—';
    try {
      return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
    } catch {
      return typeof date === 'string' ? date : '—';
    }
  }, []);

  return {
    ...store,
    refresh,
    filteredShipments,
    unreadCount,
    recentActivities,
    formatCurrency,
    formatTime,
    formatDate,
  };
}

export default useDepotDashboard;
