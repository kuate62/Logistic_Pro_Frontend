import apiClient from './axios';

export function mapPrice(p) {
  if (!p) return null;
  const origin = p.agency?.name || '';
  return {
    id: p.id,
    companyId: p.companyId,
    agencyId: p.agencyId || '',
    code: `TAR-${String(p.id).padStart(3, '0')}`,
    name: origin ? `Tarif ${p.category || 'standard'} — ${origin}` : `Tarif ${p.category || 'standard'}`,
    originAgencyId: p.agencyId || '',
    originAgencyName: origin || 'Toutes',
    originCity: p.agency?.city || 'Toutes',
    destinationAgencyId: '',
    destinationAgencyName: 'Toutes',
    destinationCity: 'Toutes',
    category: p.category || 'standard',
    unit: p.unit || 'kg',
    minWeight: p.minWeight ?? 0,
    maxWeight: p.maxWeight ?? null,
    unitPrice: p.ratePerKg ?? 0,
    fixedPrice: p.fixedFee ?? 0,
    insuranceRate: 0,
    additionalFees: 0,
    currency: 'FCFA',
    effectiveFrom: '',
    effectiveTo: null,
    observation: '',
    status: p.status || 'active',
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export function toPricePayload(data) {
  const payload = {};
  if (data.originAgencyId) payload.agencyId = Number(data.originAgencyId);
  else if (data.destinationAgencyId) payload.agencyId = Number(data.destinationAgencyId);
  else if (data.agencyId) payload.agencyId = Number(data.agencyId);
  else payload.agencyId = null;
  if (data.category) payload.category = data.category;
  if (data.unit) payload.unit = data.unit;
  if (data.unitPrice !== undefined) payload.ratePerKg = data.unitPrice;
  if (data.minWeight !== undefined) payload.minWeight = data.minWeight;
  if (data.maxWeight !== undefined) payload.maxWeight = data.maxWeight;
  if (data.fixedPrice !== undefined) payload.fixedFee = data.fixedPrice;
  if (data.status) payload.status = data.status;
  return payload;
}

function toListResult(response, fallback) {
  const limit = response.data.limit || fallback;
  return {
    data: (response.data.prices || []).map(mapPrice),
    total: response.data.total || 0,
    page: response.data.page || 1,
    perPage: limit,
    totalPages: Math.ceil((response.data.total || 0) / limit),
  };
}

const LIST_LIMIT = 1000;

export const pricesService = {
  async getAll(companyId, { search = '', filters = {}, page = 1, perPage = 10 } = {}) {
    const params = { page, limit: perPage };
    if (companyId) params.companyId = companyId;
    if (search) params.search = search;
    if (filters?.status) params.status = filters.status;
    if (filters?.category) params.category = filters.category;

    const response = await apiClient.get('/prices', { params });

    return toListResult(response, perPage);
  },

  async getById(companyId, pricingId) {
    void companyId;
    const response = await apiClient.get(`/prices/${pricingId}`);
    return mapPrice(response.data.price);
  },

  async create(companyId, data) {
    const response = await apiClient.post('/prices', { ...toPricePayload(data), companyId });
    return mapPrice(response.data.price);
  },

  async update(companyId, pricingId, data) {
    void companyId;
    const response = await apiClient.patch(`/prices/${pricingId}`, toPricePayload(data));
    return mapPrice(response.data.price);
  },

  async activate(companyId, pricingId) {
    void companyId;
    const response = await apiClient.patch(`/prices/${pricingId}`, { status: 'active' });
    return mapPrice(response.data.price);
  },

  async deactivate(companyId, pricingId) {
    void companyId;
    const response = await apiClient.patch(`/prices/${pricingId}`, { status: 'inactive' });
    return mapPrice(response.data.price);
  },

  async duplicate(companyId, pricingId) {
    void companyId;
    const source = await this.getById(companyId, pricingId);
    if (!source) throw new Error('Tarif non trouvé');
    return this.create(companyId, { ...source, status: 'active' });
  },

  async calculate() {
    return { found: false, transportAmount: 0, insuranceAmount: 0, additionalFees: 0, totalAmount: 0 };
  },

  async getHistory() {
    return [];
  },

  async getStatistics(companyId) {
    const result = await this.getAll(companyId, { perPage: LIST_LIMIT });
    const active = result.data.filter((p) => p.status === 'active').length;
    return {
      total: result.data.length,
      active,
      inactive: result.data.length - active,
      categories: [...new Set(result.data.map((p) => p.category).filter(Boolean))].length,
      avgPrice: result.data.length ? Math.round(result.data.reduce((s, p) => s + (p.unitPrice || 0), 0) / result.data.length) : 0,
    };
  },
};

export default pricesService;
