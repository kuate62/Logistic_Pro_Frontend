import apiClient from './axios';

export function mapRoute(r) {
  if (!r) return null;
  const origin = r.originAgency?.name || '';
  const dest = r.destinationAgency?.name || '';
  const originCity = r.originAgency?.city || '';
  const destCity = r.destinationAgency?.city || '';
  const name = r.name || (origin && dest ? `${origin} → ${dest}` : (originCity && destCity ? `${originCity} → ${destCity}` : 'Trajet'));

  return {
    id: r.id,
    companyId: r.companyId,
    code: r.code || `RT-${String(r.id).padStart(4, '0')}`,
    name,
    description: r.description || '',
    originAgencyId: r.originAgencyId || '',
    originAgencyName: origin,
    originCity,
    departureCity: originCity,
    destinationAgencyId: r.destinationAgencyId || '',
    destinationAgencyName: dest,
    destinationCity: destCity,
    arrivalCity: destCity,
    status: r.status || 'planned',
    distance: r.distance || 0,
    estimatedDuration: r.estimatedDuration || 0,
    price: r.price || 0,
    departureDate: r.departureDate || '',
    departureTime: '',
    arrivalDate: r.arrivalDate || '',
    arrivalTime: '',
    vehicle: r.vehicle || '',
    driver: r.driver || '',
    note: r.note || '',
    observation: r.note || '',
    maxWeight: 100,
    maxPackages: 50,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

function combineDateTime(date, time) {
  if (!date) return null;
  if (time) return `${date}T${time}`;
  return date;
}

export function toRoutePayload(data) {
  const payload = {};
  if (data.name) payload.name = data.name;
  if (data.code) payload.code = data.code;
  if (data.originAgencyId) payload.originAgencyId = Number(data.originAgencyId);
  if (data.destinationAgencyId) payload.destinationAgencyId = Number(data.destinationAgencyId);
  if (data.distance !== undefined) payload.distance = Number(data.distance);
  if (data.estimatedDuration !== undefined) payload.estimatedDuration = Number(data.estimatedDuration);
  if (data.price !== undefined) payload.price = Number(data.price);
  if (data.status) payload.status = data.status;
  if (data.departureDate) payload.departureDate = combineDateTime(data.departureDate, data.departureTime) || null;
  if (data.arrivalDate) payload.arrivalDate = combineDateTime(data.arrivalDate, data.arrivalTime) || null;
  if (data.vehicle) payload.vehicle = data.vehicle;
  if (data.driver) payload.driver = data.driver;
  payload.note = data.observation || data.note || '';
  return payload;
}

function toListResult(response, fallback) {
  const limit = response.data.limit || fallback;
  return {
    data: (response.data.routes || []).map(mapRoute),
    total: response.data.total || 0,
    page: response.data.page || 1,
    perPage: limit,
    totalPages: Math.ceil((response.data.total || 0) / limit),
  };
}

const LIST_LIMIT = 1000;

export const routesService = {
  async getAll(companyId, { search = '', filters = {}, page = 1, perPage = 10 } = {}) {
    const params = { page, limit: perPage };
    if (companyId) params.companyId = companyId;
    if (search) params.search = search;
    if (filters?.status) params.status = filters.status;
    if (filters?.originAgencyId) params.originAgencyId = filters.originAgencyId;
    if (filters?.destinationAgencyId) params.destinationAgencyId = filters.destinationAgencyId;

    const response = await apiClient.get('/routes', { params });

    return toListResult(response, perPage);
  },

  async getById(companyId, routeId) {
    void companyId;
    const response = await apiClient.get(`/routes/${routeId}`);
    return mapRoute(response.data.route);
  },

  async create(companyId, data) {
    const response = await apiClient.post('/routes', { ...toRoutePayload(data), companyId });
    return mapRoute(response.data.route);
  },

  async update(companyId, routeId, data) {
    void companyId;
    const response = await apiClient.patch(`/routes/${routeId}`, toRoutePayload(data));
    return mapRoute(response.data.route);
  },

  async cancel(companyId, routeId) {
    void companyId;
    const response = await apiClient.patch(`/routes/${routeId}`, { status: 'cancelled' });
    return mapRoute(response.data.route);
  },

  async getHistory() {
    return [];
  },

  async getStatistics(companyId) {
    const result = await this.getAll(companyId, { perPage: LIST_LIMIT });
    const byStatus = {};
    result.data.forEach((r) => { byStatus[r.status] = (byStatus[r.status] || 0) + 1; });
    return {
      total: result.data.length,
      byStatus,
      active: byStatus.planned || 0,
      completed: byStatus.completed || 0,
    };
  },

  async assignShipment(companyId, routeId) {
    return this.getById(companyId, routeId);
  },

  async removeShipment(companyId, routeId) {
    return this.getById(companyId, routeId);
  },
};

export default routesService;
