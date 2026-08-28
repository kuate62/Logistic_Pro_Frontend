import apiClient from './axios';

export const mapClient = (client) => ({
  ...client,
  agencyId: client.preferredAgencyId,
  agencyName: client.preferredAgency?.name || '',
});

export const toClientPayload = (data) => ({
  companyId: data.companyId ? Number(data.companyId) : undefined,
  firstName: data.firstName?.trim() || '',
  lastName: data.lastName?.trim() || data.firstName?.trim() || '',
  email: data.email?.trim() ? data.email.trim().toLowerCase() : null,
  phone: data.phone?.trim() ? data.phone.trim() : null,
  city: data.city?.trim() ? data.city.trim() : null,
  address: data.address?.trim() ? data.address.trim() : null,
  idType: data.documentType || data.idType || null,
  idNumber: data.documentNumber || data.idNumber || null,
  preferredAgencyId: data.agencyId || data.preferredAgencyId ? Number(data.agencyId || data.preferredAgencyId) : undefined,
});

export const clientsService = {
  async getMe() {
    const response = await apiClient.get('/clients/me');
    return mapClient(response.data.client);
  },

  async list(companyId, { search = '', status = '', city = '', page = 1, limit = 100 } = {}) {
    const params = { page, limit };
    if (companyId) params.companyId = companyId;
    if (search) params.search = search;
    if (status) params.status = status;
    if (city) params.city = city;

    const response = await apiClient.get('/clients', { params });

    return {
      data: (response.data.clients || []).map(mapClient),
      total: response.data.total || 0,
      page: response.data.page || page,
      perPage: response.data.limit || limit,
      totalPages: Math.ceil((response.data.total || 0) / (response.data.limit || limit)),
    };
  },

  async getById(companyId, id) {
    const response = await apiClient.get(`/clients/${id}`);
    return mapClient(response.data.client);
  },

  async getCount(companyId) {
    const params = { limit: 1000 };
    if (companyId) params.companyId = companyId;
    const response = await apiClient.get('/clients', { params });
    const clients = response.data.clients || [];
    return {
      total: response.data.total || clients.length,
      active: clients.filter((c) => c.status === 'active').length,
      inactive: clients.filter((c) => c.status === 'inactive').length,
      blocked: clients.filter((c) => c.status === 'blocked').length,
    };
  },

  async create(companyId, data) {
    const response = await apiClient.post('/clients', toClientPayload({ ...data, companyId }));
    return mapClient(response.data.client);
  },

  async update(companyId, id, data) {
    const response = await apiClient.patch(`/clients/${id}`, toClientPayload({ ...data, companyId }));
    return mapClient(response.data.client);
  },

  async toggleStatus(companyId, id, status) {
    const response = await apiClient.patch(`/clients/${id}`, { status });
    return mapClient(response.data.client);
  },

  async updateMe(data) {
    const response = await apiClient.patch('/clients/me', data);
    return response.data.client;
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post('/clients/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default clientsService;
