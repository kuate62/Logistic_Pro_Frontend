export const formatCurrency = (val) => {
  if (val === null || val === undefined) return '—';
  return new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(val) + ' FCFA';
};

export const formatTime = (date) => {
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
};

export const formatDate = (date) => {
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
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return typeof date === 'string' ? date : '—';
  return `${formatDate(date)} à ${formatTime(date)}`;
};

export const timeAgo = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return typeof date === 'string' ? date : '—';
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'à l\'instant';
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days} j`;
  const months = Math.floor(days / 30);
  if (months < 12) return `il y a ${months} mois`;
  return `il y a ${Math.floor(months / 12)} an(s)`;
};

