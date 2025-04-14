import api from '@/lib/axios';

export interface Overtime {
  hari: string;
  overtimeRate: number;
  _id: string;
}

export interface ManpowerDetails {
  overtime: Overtime[];
}

export interface EquipmentDetails {
  fuelConsumptionPerHour?: number;
  gpsCostPerMonth?: number;
}

export interface MaterialDetails {
  materialUnit?: string; // Assuming this is an ObjectId reference
  pricePerUnit?: number;
}

export interface SecurityDetails {
  dailyCost?: number;
}

export interface ItemCostDetails {
  manpowerDetails?: ManpowerDetails;
  equipmentDetails?: EquipmentDetails;
  materialDetails?: MaterialDetails;
  securityDetails?: SecurityDetails;
}

export interface ItemCost {
  _id: string;
  nama: string;
  costPerMonth: number;
  costPerHour: number;
  kategori: 'manpower' | 'equipment' | 'material' | 'security'|'other'; // Updated enum
  details: ItemCostDetails;
  createdAt: string;
  updatedAt: string;
}

const itemCostService = {
  async create(data: Partial<ItemCost>) {
    const response = await api.post('/item-costs', data);
    return response.data;
  },

  async getAll() {
    const response = await api.get<ItemCost[]>('/item-costs');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/item-costs/${id}`);
    return response.data;
  },

  async update(id: string, data: Partial<ItemCost>) {
    const response = await api.put(`/item-costs/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/item-costs/${id}`);
    return response.data;
  }
};

export default itemCostService;