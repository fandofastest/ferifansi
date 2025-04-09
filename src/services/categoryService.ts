import api from '@/lib/axios';

export interface Category {
  _id: string;
  name: string;
}

const categoryService = {
  async create(data: { name: string; description: string }) {
    const response = await api.post('/categories', data);
    return response.data;
  },

  async createSubCategory(data: { name: string; category: string }) {
    const response = await api.post('/subcategories', data);
    return response.data;
  },

  async getAll() {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  async getSubCategories() {
    const response = await api.get<Category[]>('/subcategories');
    return response.data;
  },

  async getSubCategoriesByCategory(categoryId: string) {
    const response = await api.get(`/subcategories/category/${categoryId}`);
    return response.data;
  },
};

export default categoryService;