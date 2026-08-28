import { useEffect, useCallback, useMemo } from 'react';
import useRetraitStore from '../store/useRetraitStore';

export function useRetraitDashboard(user) {
  const store = useRetraitStore();

  useEffect(() => {
    if (user?.id) {
      store.fetchDashboard(user);
    }
  }, [user?.id, user?.employeeId, user?.agencyId]);

  const refresh = useCallback(() => {
    if (user?.id) store.fetchDashboard(user);
  }, [user?.id, user?.employeeId, user?.agencyId]);

  const filteredParcels = useMemo(() => {
    const { search, filters } = store;
    return store.availableParcels.filter((p) => {
      const matchSearch = !search
        || p.trackingNumber?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filters.status || p.status === filters.status;
      return matchSearch && matchStatus;
    });
  }, [store.availableParcels, store.search, store.filters]);

  const unreadCount = store.notifications.filter((n) => !n.read).length;

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
    filteredParcels,
    unreadCount,
    formatCurrency,
    formatTime,
    formatDate,
  };
}

export default useRetraitDashboard;
