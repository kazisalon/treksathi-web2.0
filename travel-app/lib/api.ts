import axios, { AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://travelguide-rttu.onrender.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
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
      const response: AxiosResponse = await apiClient.get(`/api/Tours/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tour');
    }
  }

  // Marketplace endpoints
  static async getMarketplaceAll(): Promise<any> {
    try {
      const response: AxiosResponse = await getWithRetry('/api/Marketplace/all', {}, 2, 1500);
      return response.data;
    } catch (error: any) {
      console.error('Get marketplace items error:', error);
      throw new Error(error.message || 'Failed to fetch marketplace items');
    }
  }

  static async getMarketplaceById(id: string): Promise<any> {
    try {
      const response: AxiosResponse = await getWithRetry(`/api/Marketplace/${id}`, {}, 2, 1500);
      return response.data;
    } catch (error: any) {
      console.error('Get marketplace item error:', error);
      throw new Error(error.message || 'Failed to fetch marketplace item');
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

  // Posts API methods
  static async getAllPosts(): Promise<any> {
    try {
      const response: AxiosResponse = await getWithRetry('/api/Post/all', {}, 2, 1500);
      return response.data;
    } catch (error) {
      console.error('Get posts error:', error);
      throw error;
    }
  }

  static async getPostsWithUserData(): Promise<any> {
    try {
      console.log('API: Getting posts with user-specific data');
      const response: AxiosResponse = await getWithRetry('/api/Post/all', {}, 2, 1500);
      console.log('Posts response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get posts with user data error:', error);
      throw error;
    }
  }

  static async getPostById(id: string): Promise<any> {
    try {
      const response: AxiosResponse = await getWithRetry(`/api/Post/${id}`, {}, 2, 1500);
      return response.data;
    } catch (error) {
      console.error('Get post by ID error:', error);
      throw error;
    }
  }

  static async getPostsByUser(userId: string): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.get(`/api/Post/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get posts by user error:', error);
      throw error;
    }
  }

  static async createPost(data: any): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.post('/api/Post/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  }

  static async updatePost(postId: string, data: any): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.put(`/api/Post/update/${postId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update post error:', error);
      throw error;
    }
  }

  static async deletePost(postId: string): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.delete(`/api/Post/delete/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  }

  static async likePost(postId: string): Promise<any> {
    try {
      console.log('API: Liking post via proxy', postId);
  
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
  
      const response: AxiosResponse = await axios.post(
        `/api/proxy/post/${encodeURIComponent(postId)}/like`,
        {}, // send empty JSON object instead of null
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(token ? { 'x-access-token': token } : {}),
            ...(token ? { token: token } : {}),
          },
        }
      );
  
      console.log('API: Like response (proxy):', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Like post error (proxy):', error);
      throw error;
    }
  }

  static async addComment(postId: string, comment: string): Promise<any> {
    try {
      console.log('API: Adding comment to post', postId);
      
      // Try different request body formats that the API might expect
      const possibleFormats = [
        { text: comment },           // Common format
        { content: comment },        // Alternative format
        { comment: comment },        // Current format
        { message: comment },        // Another alternative
        { body: comment },           // Body format
        comment                      // Just the string
      ];
      
      for (let i = 0; i < possibleFormats.length; i++) {
        try {
          const requestBody = possibleFormats[i];
          console.log(`Trying format ${i + 1}:`, requestBody);
          
          const response: AxiosResponse = await apiClient.post(`/api/Post/${postId}/comment`, requestBody);
          console.log('Comment API response:', response.data);
          return response.data;
        } catch (error: any) {
          console.log(`Format ${i + 1} failed:`, error.response?.status, error.response?.data);
          
          // If this is the last format, throw the error
          if (i === possibleFormats.length - 1) {
            throw error;
          }
          // Otherwise, continue to next format
        }
      }
    } catch (error: any) {
      console.error('Add comment error:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }



  static async getUserLikedPosts(): Promise<string[]> {
    // Note: This endpoint is not available in the current API documentation
    // Returning empty array to prevent 404 errors
    console.log('API: getUserLikedPosts - endpoint not available, returning empty array');
    return [];
  }
}

export default TravelGuideAPI;


// Simple retry helper for GET requests
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getWithRetry<T = any>(
  url: string,
  options: any = {},
  retries = 2,
  backoffMs = 1500
): Promise<AxiosResponse<T>> {
  let attempt = 0;
  let lastError: any;

  while (attempt <= retries) {
    try {
      return await apiClient.get<T>(url, options);
    } catch (err: any) {
      lastError = err;
      const isTimeout = err?.code === 'ECONNABORTED';
      const is5xx = err?.response?.status >= 500 && err?.response?.status < 600;
      const shouldRetry = isTimeout || is5xx;

      if (!shouldRetry || attempt === retries) throw err;

      await sleep(backoffMs * Math.pow(2, attempt));
      attempt++;
    }
  }

  throw lastError;
}