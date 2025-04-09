import api from '@/lib/axios';

export interface MeasureUnit {
  _id: string;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeasureUnitData {
  code: string;
  name: string;
}

const measureUnitService = {
  async create(data: MeasureUnitData) {
    const response = await api.post('/material-units', data);
    return response.data;
  },

  async getAll() {
    const response = await api.get<MeasureUnit[]>('/material-units');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/material-units/${id}`);
    return response.data;
  },

  async update(id: string, data: Partial<MeasureUnitData>) {
    const response = await api.put(`/material-units/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/material-units/${id}`);
    return response.data;
  }
};

export default measureUnitService;