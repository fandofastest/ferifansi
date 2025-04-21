import api from '@/lib/axios';

export interface SolarPrice {
  _id: string;
  price: number;
  effectiveDate: string;
  createdAt?: string;
  updatedAt?: string;
}

const solarPriceService = {
  async getAll() {
    const response = await api.get<SolarPrice[]>('/solar-prices');
    return response.data;
  },

  async create(data: {
    price: number;
    effectiveDate: string;
  }) {
    const response = await api.post('/solar-prices', data);
    return response.data;
  },

  async update(id: string, data: {
    price: number;
    effectiveDate: string;
  }) {
    const response = await api.put(`/solar-prices/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/solar-prices/${id}`);
    return response.data;
  },

  async getCurrent() {
    const response = await api.get<SolarPrice>('/solar-prices/current-price');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<SolarPrice>(`/solar-prices/${id}`);
    return response.data;
  }
};

export default solarPriceService;