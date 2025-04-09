import api from '@/lib/axios';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'admin' | 'mandor';
}

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
  };
}

const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    if (response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(data: ProfileData) {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  async getAllUsers() {
    const response = await api.get('/auth/users');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;