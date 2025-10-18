import axios, { AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://travelguide-rttu.onrender.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    // Handle different response formats
    if (response.data && typeof response.data === 'object') {
      // If the API returns data in a nested format, extract it
      if (response.data.data) {
        response.data = response.data.data;
      }
      // Handle success/error flags
      if (response.data.success === false) {
        throw new Error(response.data.message || 'API request failed');
      }
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/auth/signin';
      }
    }
    
    // Extract error message from different response formats
    let errorMessage = 'An error occurred';
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.data.errors) {
        errorMessage = Array.isArray(error.response.data.errors) 
          ? error.response.data.errors.join(', ')
          : error.response.data.errors;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    error.message = errorMessage;
    return Promise.reject(error);
  }
);

// Types for API requests and responses
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  gender: string;
  phoneNumber: string;
  alias: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    username: string;
    email: string;
    alias: string;
  };
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    username: string;
    email: string;
    alias: string;
  };
  token?: string;
}

// API Service Class
export class TravelGuideAPI {
  // Authentication endpoints
  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response: AxiosResponse<RegisterResponse> = await apiClient.post('/api/Authentication/register', data);
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  static async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await apiClient.post('/api/Authentication/login', data);
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post('/api/Authentication/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
    }
  }

  // User profile endpoints
  static async getProfile(): Promise<any> {
    try {
      const response = await apiClient.get('/api/User/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  }

  static async updateProfile(data: any): Promise<any> {
    try {
      const response = await apiClient.put('/api/User/profile', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  // Destinations endpoints
  static async getDestinations(params?: any): Promise<any> {
    try {
      const response = await apiClient.get('/api/Destinations', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch destinations');
    }
  }

  static async getDestinationById(id: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/Destinations/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch destination');
    }
  }

  // Tours endpoints
  static async getTours(params?: any): Promise<any> {
    try {
      const response = await apiClient.get('/api/Tours', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tours');
    }
  }

  static async getTourById(id: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/Tours/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tour');
    }
  }

  // Bookings endpoints
  static async createBooking(data: any): Promise<any> {
    try {
      const response = await apiClient.post('/api/Bookings', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  }

  static async getBookings(): Promise<any> {
    try {
      const response = await apiClient.get('/api/Bookings');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
}

export default TravelGuideAPI;