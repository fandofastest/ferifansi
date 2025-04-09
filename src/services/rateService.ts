import api from '@/lib/axios';

export interface Rate {
  _id: string;
  rateCode: string;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

const rateService = {
  async getAll() {
    const response = await api.get<Rate[]>('/rates');
    return response.data;
  },

  async create(data: {
    rateCode: string;
    effectiveDate: string;
  }) {
    const response = await api.post('/rates', data);
    return response.data;
  },

  async update(id: string, data: {
    rateCode: string;
    effectiveDate: string;
  }) {
    const response = await api.put(`/rates/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/rates/${id}`);
    return response.data;
  },

  async addItemRate(itemId: string, data: {
    rateCode: string;
    nonRemoteAreas: number;
    remoteAreas: number;
  }) {
    const response = await api.post(`/items/${itemId}/rates`, data);
    return response.data;
  }
};

export default rateService;