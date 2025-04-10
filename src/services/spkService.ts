import api from '@/lib/axios';

export interface SPKData {
  spkNo: string;
  spkTitle: string;
  projectStartDate: string;
  projectEndDate: string;
  items: {
    item: string;  // Item ID
    rateCode: string;
    estQty: {
      quantity: {
        nr: number;
        r: number;
      }
    }
  }[];
  status?: string;
}

// Response item structure
export interface SPKItem {
  estQty: {
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
  item: {
    _id: string;
    itemCode: string;
    description: string;
    unitMeasurement: string;
    category: {
      _id: string;
      name: string;
      description: string;
      createdAt?: string;
      updatedAt?: string;
      __v?: number;
    };
    subCategory: {
      _id: string;
      name: string;
      category: string;
      createdAt?: string;
      updatedAt?: string;
      __v?: number;
    } | null;
    rates: {
      rateCode: string;
      nonRemoteAreas: number;
      remoteAreas: number;
    }[];
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    id?: string;
  };
  rateCode: string;
}

export interface SPK {
  _id: string;
  spkNo: string;
  spkTitle: string;
  projectStartDate: string;
  projectEndDate: string;
  items: SPKItem[];
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  projectDuration: number;
  __v?: number;
  id?: string;
}


// Add this method to your spkService
const updateStatus = async (id: string, status: string): Promise<any> => {
  try {
    const response = await api.patch(`/spks/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Make sure it's included in your exports
export default {
  async create(data: SPKData) {
    const response = await api.post('/spks', data);
    return response.data;
  },

  async getAll() {
    const response = await api.get<SPK[]>('/spks');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/spks/${id}`);
    return response.data;
  },

  async update(id: string, data: Partial<SPKData>) {
    const response = await api.put(`/spks/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/spks/${id}`);
    return response.data;
  },
  updateStatus,
};
