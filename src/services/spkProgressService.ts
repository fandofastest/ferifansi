import api from '@/lib/axios';

export interface SPKProgressItem {
  workQty: {
    quantity: {
      nr: number;
      r: number;
    };
    amount: number;
  };
  unitRate: {
    nonRemoteAreas: number;
    remoteAreas: number;
  };
  spkItemSnapshot: {
    item: string;
    description: string;
  };
}

export interface CostUsedDetail {
  details: {
    manpower: {
      jumlahOrang: number;
      jamKerja: number;
      costPerHour: number;
    };
    equipment: {
      jumlah: number;
      jumlahUnit: number;
      jamKerja: number;
      jamPakai: number;
      jumlahSolar: number;
      costPerHour: number;
      fuelUsage: number;
      fuelPrice: number;
    };
    material: {
      jumlahUnit: number;
      pricePerUnit: number;
    };
    security: {
      nominal: number;
      jumlahOrang: number;
      dailyCost: number;
    };
    other: {
      nominal: number;
    };
  };
  itemCost: {
    details: {
      manpowerDetails?: {
        overtime: any[];
      };
      equipmentDetails?: {
        fuelConsumptionPerHour: number;
        gpsCostPerMonth: number;
      };
    };
    _id: string;
    kategori: string;
  };
  itemCostDetails: {
    id: string;
    nama: string;
    category: string;
    costPerHour?: number;
  };
  totalCost: number;
}

export interface SPKProgress {
  _id: string;
  spk: {
    _id: string;
    spkNo: string;
    spkTitle: string;
    projectStartDate: string;
    projectEndDate: string;
    status: string;
    totalAmount: number;
    location: {
      _id: string;
      name: string; 
    }
  };
  mandor: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  progressItems: SPKProgressItem[];
  progressDate: string;
  costUsed: CostUsedDetail[];  // Updated from CostUsedDetail[] to match new interface
  timeDetails: {
    startTime: string;
    endTime: string;
    dcuTime: string;
  };
  images: {
    startImage: string;
    endImage: string;
    dcuImage: string;
  };
}

const spkProgressService = {
  async getAll() {
    try {
      const response = await api.get<SPKProgress[]>('/spk-progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching SPK progress:', error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const response = await api.get<SPKProgress>(`/spk-progress/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching SPK progress with id ${id}:`, error);
      throw error;
    }
  },

  async create(data: Partial<SPKProgress>) {
    const response = await api.post('/spk-progress', data);
    return response.data;
  },

  async update(id: string, data: Partial<SPKProgress>) {
    const response = await api.put(`/spk-progress/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/spk-progress/${id}`);
    return response.data;
  },

  async getProgressBySpkId(spkId: string) {
    try {
      const response = await api.get<SPKProgress[]>(`/spk-progress/spk/${spkId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching SPK progress for SPK ${spkId}:`, error);
      throw error;
    }
  },
};

export default spkProgressService;