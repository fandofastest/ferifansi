import api from '@/lib/axios';

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Location {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  __v?: number;
}

const locationService = {
  async create(data: LocationData) {
    const response = await api.post('/locations', data);
    return response.data;
  },

  async getAll() {
    const response = await api.get<Location[]>('/locations');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/locations/${id}`);
    return response.data;
  },

  async update(id: string, data: Partial<LocationData>) {
    const response = await api.put(`/locations/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/locations/${id}`);
    return response.data;
  },
};

export default locationService;