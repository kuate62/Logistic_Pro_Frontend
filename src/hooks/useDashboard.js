import { useEffect, useCallback } from 'react';
import useDashboardStore from '../store/useDashboardStore';
import { useAuth } from './useAuth';

export function useDashboard() {
  const store = useDashboardStore();
  const { user } = useAuth();
  const companyId = user?.companyId || 'default';

  useEffect(() => {
    store.fetchAll(companyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const refresh = useCallback(() => {
    store.fetchAll(companyId);
  }, [companyId, store]);

  const unreadCount = store.notifications.filter((n) => !n.read).length;
  const criticalAlerts = store.alerts.filter((a) => a.severity === 'danger' || a.severity === 'warning');

  const formatCurrency = useCallback((val) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(val) + ' FCFA';
  }, []);

  const formatDate = useCallback((date) => {
    if (!date) return '—';
    if (typeof date === 'string' && !date.includes('-') && !date.includes('/')) {
      return date;
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) return typeof date === 'string' ? date : '—';
    try {
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return typeof date === 'string' ? date : '—';
    }
  }, []);

  const formatTime = useCallback((date) => {
    if (!date) return '—';
    if (typeof date === 'string' && (date.includes(':') && date.length <= 8 || date.includes('min') || date.includes('h'))) {
      return date;
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) return typeof date === 'string' ? date : '—';
    try {
      return new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return typeof date === 'string' ? date : '—';
    }
  }, []);

  return {
    ...store,
    companyId,
    refresh,
    unreadCount,
    criticalAlerts,
    formatCurrency,
    formatDate,
    formatTime,
  };
}

export default useDashboard;
