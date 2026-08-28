import apiClient from './axios';

const ALLOCATED_CATEGORY_MAP = {
  standard: 'standard',
  'vêtements': 'vêtements',
  alimentation: 'alimentation',
  'électronique': 'électronique',
  documents: 'documents',
  bagages: 'bagages',
  'médicaments': 'médicaments',
  commerce: 'standard',
  'pièces': 'standard',
  mobilier: 'standard',
  autre: 'standard',
};

export const DEFAULT_MAX_WEIGHT = 100;

const normalizeCategory = (category) => ALLOCATED_CATEGORY_MAP[category] || 'standard';

const clientFullName = (client) => {
  if (!client) return '';
  return [client.firstName, client.lastName].filter(Boolean).join(' ');
};

export const mapParcel = (parcel, shipment = null) => {
  const totalWeight = shipment
    ? (shipment.parcels || []).reduce((sum, p) => sum + (p.weight || 0), 0)
    : (parcel.weight || 0);
  const ratio = shipment && totalWeight > 0
    ? (parcel.weight || 0) / totalWeight
    : 0;
  const amount = Math.round((shipment?.totalAmount || 0) * ratio);
  const clientName = [shipment?.client?.firstName, shipment?.client?.lastName].filter(Boolean).join(' ');

  return {
    ...parcel,
    trackingCode: parcel.trackingNumber,
    label: parcel.description || parcel.category || 'Colis',
    length: parcel.dimensions?.length || 0,
    width: parcel.dimensions?.width || 0,
    height: parcel.dimensions?.height || 0,
    fragile: false,
    insured: false,
    insuranceAmount: 0,
    transportAmount: amount,
    totalAmount: amount,
    senderName: clientName || shipment?.sender?.name || '',
    senderPhone: clientName ? shipment?.client?.phone : (shipment?.sender?.phone || ''),
    receiverName: shipment?.recipient?.name || '',
    receiverPhone: shipment?.recipient?.phone || '',
    originAgencyName: shipment?.originAgency?.name || '',
    destinationAgencyName: shipment?.destinationAgency?.name || '',
    originCity: shipment?.originAgency?.city || shipment?.origin || '',
    destinationCity: shipment?.destinationAgency?.city || shipment?.destination || '',
    observation: shipment?.note || '',
    shipmentNumber: shipment?.reference || '',
  };
};

export const mapShipment = (shipment) => {
  const parcels = (shipment.parcels || []).map((p) => mapParcel(p, shipment));
  const totalWeight = parcels.reduce((sum, p) => sum + (p.weight || 0), 0);
  const client = shipment.client;

  return {
    ...shipment,
    expediteur: shipment.sender,
    destinataire: shipment.recipient,
    paymentReference: shipment.payments?.[0]?.reference || null,
    notes: shipment.note,
    parcels,
    packages: parcels,
    shipmentNumber: shipment.reference,
    senderName: shipment.sender?.name || '',
    senderPhone: shipment.sender?.phone || '',
    receiverName: shipment.recipient?.name || '',
    receiverPhone: shipment.recipient?.phone || '',
    originAgencyId: shipment.agencyId,
    originAgencyName: shipment.originAgency?.name || '',
    originCity: shipment.originAgency?.city || shipment.origin || '',
    destinationAgencyId: shipment.destinationAgencyId,
    destinationAgencyName: shipment.destinationAgency?.name || '',
    destinationCity: shipment.destinationAgency?.city || shipment.destination || '',
    clientName: clientFullName(client) || shipment.sender?.name || '',
    clientPhone: client?.phone || shipment.sender?.phone || '',
    agentName: null,
    observation: shipment.note,
    totalWeight,
    maxWeight: DEFAULT_MAX_WEIGHT,
    packageCount: parcels.length,
    transportAmount: shipment.totalAmount || 0,
    insuranceAmount: 0,
    totalAmount: shipment.totalAmount || 0,
    routeId: shipment.routeId || null,
    route: shipment.route || null,
    paidAmount: shipment.paidAmount || 0,
    paymentStatus: shipment.paymentStatus || 'pending',
  };
};

const searchFilter = (items, search) => {
  if (!search) return items;
  const q = search.toLowerCase();
  return items.filter((s) =>
    (s.shipmentNumber || '').toLowerCase().includes(q) ||
    (s.senderName || '').toLowerCase().includes(q) ||
    (s.receiverName || '').toLowerCase().includes(q) ||
    (s.senderPhone || '').includes(q) ||
    (s.receiverPhone || '').includes(q) ||
    (s.originAgencyName || '').toLowerCase().includes(q) ||
    (s.destinationAgencyName || '').toLowerCase().includes(q) ||
    (s.status || '').toLowerCase().includes(q)
  );
};

const applyFilters = (items, filters = {}) => items.filter((s) => {
  if (filters.status && s.status !== filters.status) return false;
  if (filters.originAgencyId && s.originAgencyId !== Number(filters.originAgencyId) && s.originAgencyId !== filters.originAgencyId) return false;
  if (filters.destinationAgencyId && s.destinationAgencyId !== Number(filters.destinationAgencyId) && s.destinationAgencyId !== filters.destinationAgencyId) return false;
  if (filters.routeId && s.routeId !== filters.routeId) return false;
  if (filters.agentId && s.agentId !== Number(filters.agentId) && s.agentId !== filters.agentId) return false;
  if (filters.dateFrom && new Date(s.createdAt) < new Date(filters.dateFrom)) return false;
  if (filters.dateTo && new Date(s.createdAt) > new Date(filters.dateTo + 'T23:59:59')) return false;
  return true;
});

const applySort = (items, sort = {}) => {
  const { field = 'createdAt', direction = 'desc' } = sort;
  return [...items].sort((a, b) => {
    let va = a[field] ?? '';
    let vb = b[field] ?? '';
    if (typeof va === 'number' && typeof vb === 'number') return direction === 'asc' ? va - vb : vb - va;
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    if (va < vb) return direction === 'asc' ? -1 : 1;
    if (va > vb) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

const paginate = (items, page, perPage) => {
  const total = items.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  return { data: items.slice(start, start + perPage), page, perPage, total, totalPages };
};

export const shipmentsService = {
  async list({ clientId, status = '', page = 1, perPage = 100 } = {}) {
    const params = { page, limit: perPage };
    if (clientId) params.clientId = clientId;
    if (status) params.status = status;

    const response = await apiClient.get('/shipments', { params });

    return {
      shipments: (response.data.shipments || []).map(mapShipment),
      total: response.data.total || 0,
      page: response.data.page || page,
      limit: response.data.limit || perPage,
    };
  },

  async getById(idOrCompanyId, maybeId) {
    const id = maybeId ?? idOrCompanyId;
    const response = await apiClient.get(`/shipments/${id}`);
    return mapShipment(response.data.shipment);
  },

  async getAll(companyId, { search = '', filters = {}, sort = {}, page = 1, perPage = 10 } = {}) {
    const response = await apiClient.get('/shipments', { params: { companyId, page: 1, limit: 1000 } });
    let items = (response.data.shipments || []).map(mapShipment);
    items = searchFilter(items, search);
    items = applyFilters(items, filters);
    items = applySort(items, sort);
    return paginate(items, page, perPage);
  },

  async create(companyId, data) {
    const parcels = (data.packages || []).map((p) => ({
      weight: p.weight,
      dimensions: { length: p.length || undefined, width: p.width || undefined, height: p.height || undefined },
      category: normalizeCategory(p.category),
      description: p.label || p.description || '',
      declaredValue: p.declaredValue || 0,
    }));

    const payload = {
      clientId: data.senderId,
      companyId,
      agencyId: data.originAgencyId,
      destinationAgencyId: data.destinationAgencyId || undefined,
      routeId: data.routeId || undefined,
      agentId: data.agentId || undefined,
      origin: data.originCity,
      destination: data.destinationCity,
      sender: { name: data.senderName, phone: data.senderPhone, city: data.originCity },
      recipient: { name: data.receiverName, phone: data.receiverPhone, city: data.destinationCity },
      totalAmount: data.totalAmount,
      paidAmount: data.paidAmount || 0,
      note: data.observation || '',
      parcels,
    };

    const response = await apiClient.post('/shipments', payload);
    return mapShipment(response.data.shipment);
  },

  async update(companyId, id, data) {
    const payload = {
      note: data.observation || data.note,
      totalAmount: data.totalAmount,
      origin: data.originCity,
      destination: data.destinationCity,
      destinationAgencyId: data.destinationAgencyId,
      sender: { name: data.senderName, phone: data.senderPhone, city: data.originCity },
      recipient: { name: data.receiverName, phone: data.receiverPhone, city: data.destinationCity },
    };
    const response = await apiClient.patch(`/shipments/${id}`, payload);
    return mapShipment(response.data.shipment);
  },

  async cancel(companyId, id) {
    return this.updateStatus(companyId, id, 'cancelled');
  },

  async updateStatus(companyId, id, status) {
    const response = await apiClient.patch(`/shipments/${id}/status`, { status });
    return mapShipment(response.data.shipment);
  },

  async archive(companyId, id) {
    const response = await apiClient.get(`/shipments/${id}`);
    return mapShipment(response.data.shipment);
  },

  async getHistory(companyId, id) {
    const response = await apiClient.get(`/shipments/${id}/history`);
    return (response.data.events || []).map((e) => ({
      id: e.id,
      type: e.status,
      description: e.description || `Statut ${e.status}`,
      timestamp: e.date,
      userId: e.agentName,
    }));
  },

  async getStatistics(companyId) {
    const response = await apiClient.get('/shipments/stats', { params: { companyId } });
    const stats = response.data.stats || response.data || {};
    return {
      total: stats.total || 0,
      draft: 0,
      pending: 0,
      validated: stats.validated || 0,
      preparing: stats.preparing || 0,
      inTransit: stats.in_transit || 0,
      arrived: stats.arrived || 0,
      availablePickup: stats.available_pickup || 0,
      delivered: stats.delivered || 0,
      cancelled: stats.cancelled || 0,
      totalRevenue: stats.totalRevenue || 0,
      totalPaid: stats.totalPaid || 0,
      totalPackages: stats.totalPackages || 0,
      totalWeight: stats.totalWeight || 0,
    };
  },

  calculatePackage(pkg) {
    const baseRate = 1500;
    const transportAmount = Math.ceil((pkg.weight || 0) * baseRate * (pkg.declaredValue > 500000 ? 1.5 : 1));
    const insuranceAmount = pkg.insured ? Math.ceil((pkg.declaredValue || 0) * 0.05) : 0;
    return { ...pkg, transportAmount, insuranceAmount, totalAmount: transportAmount + insuranceAmount };
  },
};

export default shipmentsService;
