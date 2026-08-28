import { useEffect, useCallback, useMemo } from 'react';
import useClientStore from '../store/useClientStore';

export function useClientDashboard(clientId) {
  const store = useClientStore();

  useEffect(() => {
    if (clientId) store.fetchDashboard(clientId);
  }, [clientId]);

  const refresh = useCallback(() => {
    if (clientId) store.fetchDashboard(clientId);
  }, [clientId]);

  const filteredShipments = useMemo(() => {
    const { search, filters } = store;
    return store.shipments.filter((s) => {
      const matchSearch = !search
        || s.reference?.toLowerCase().includes(search.toLowerCase())
        || s.destination?.toLowerCase().includes(search.toLowerCase())
        || s.receiverName?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filters.status || s.status === filters.status;
      const matchDest = !filters.destination || s.destination === filters.destination;
      return matchSearch && matchStatus && matchDest;
    });
  }, [store.shipments, store.search, store.filters]);

  const formatCurrency = useCallback((val) => {
    return new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(val) + ' FCFA';
  }, []);

  const formatTime = useCallback((date) => {
    if (!date) return '—';
    return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(date));
  }, []);

  const formatDate = useCallback((date) => {
    if (!date) return '—';
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
  }, []);

  const formatDateTime = useCallback((date) => {
    if (!date) return '—';
    return `${formatDate(date)} à ${formatTime(date)}`;
  }, [formatDate, formatTime]);

  return {
    ...store,
    refresh,
    filteredShipments,
    formatCurrency,
    formatTime,
    formatDate,
    formatDateTime,
  };
}

export default useClientDashboard;
