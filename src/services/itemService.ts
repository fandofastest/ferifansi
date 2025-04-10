import api from '@/lib/axios';

export interface ItemData {
  itemCode: string;
  description: string;
  unitMeasurement: string;
  category: string;
  subCategory: string;
}

export interface Rate {
  rateCode: string;
  nonRemoteAreas: number;
  remoteAreas: number;
  isActive: {
    type: boolean,
    default: false
  };
}

export interface Category {
  _id: string;
  name: string;
  description: string;
}

export interface Item {
  _id: string;
  itemCode: string;
  description: string;
  unitMeasurement: string;
  category: Category;
  subCategory: Category | null;
  rates: Rate[];
  createdAt: string;
  updatedAt: string;
}

const itemService = {
  async create(data: ItemData) {
    const response = await api.post('/items', data);
    return response.data;
  },

  async getAll() {
    const response = await api.get<Item[]>('/items');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  async update(id: string, data: Partial<ItemData>) {
    const response = await api.put(`/items/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  }
};

export default itemService;