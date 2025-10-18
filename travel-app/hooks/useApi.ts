import { useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import axios, { AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://travelguide-rttu.onrender.com';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>() {
  const { data: session } = useSession();
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const makeRequest = useCallback(async (
    endpoint: string,
    options: AxiosRequestConfig = {}
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const config: AxiosRequestConfig = {
        baseURL: API_BASE_URL,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      // Add auth token if available
      const token = session?.accessToken || localStorage.getItem('authToken');
      if (token) {
        config.headers!.Authorization = `Bearer ${token}`;
      }

      const response = await axios(endpoint, config);
      const data = response.data.data || response.data;

      setState(prev => ({ ...prev, data, loading: false }));
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'An error occurred';
      
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      
      // Handle 401 errors
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        toast.error('Session expired. Please login again.');
        window.location.href = '/auth/signin';
      }
      
      return null;
    }
  }, [session?.accessToken]);

  // Convenience methods
  const get = useCallback((endpoint: string, params?: any) => {
    return makeRequest(endpoint, { method: 'GET', params });
  }, [makeRequest]);

  const post = useCallback((endpoint: string, data?: any) => {
    return makeRequest(endpoint, { method: 'POST', data });
  }, [makeRequest]);

  const put = useCallback((endpoint: string, data?: any) => {
    return makeRequest(endpoint, { method: 'PUT', data });
  }, [makeRequest]);

  const del = useCallback((endpoint: string) => {
    return makeRequest(endpoint, { method: 'DELETE' });
  }, [makeRequest]);

  return useMemo(() => ({
    ...state,
    get,
    post,
    put,
    delete: del,
    makeRequest,
  }), [state, get, post, put, del, makeRequest]);
}

// Specific API hooks
export function useDestinations() {
  const api = useApi();
  
  const getDestinations = useCallback((params?: any) => {
    return api.get('/api/Destinations', params);
  }, [api.get]);

  const getDestination = useCallback((id: string) => {
    return api.get(`/api/Destinations/${id}`);
  }, [api.get]);

  return useMemo(() => ({
    ...api,
    getDestinations,
    getDestination,
  }), [api, getDestinations, getDestination]);
}

export function useTours() {
  const api = useApi();
  
  const getTours = useCallback((params?: any) => {
    return api.get('/api/Tours', params);
  }, [api.get]);

  const getTour = useCallback((id: string) => {
    return api.get(`/api/Tours/${id}`);
  }, [api.get]);

  return useMemo(() => ({
    ...api,
    getTours,
    getTour,
  }), [api, getTours, getTour]);
}

export function useBookings() {
  const api = useApi();
  
  const getBookings = useCallback(() => {
    return api.get('/api/Bookings');
  }, [api.get]);

  const createBooking = useCallback((bookingData: any) => {
    return api.post('/api/Bookings', bookingData);
  }, [api.post]);

  const getBooking = useCallback((id: string) => {
    return api.get(`/api/Bookings/${id}`);
  }, [api.get]);

  return useMemo(() => ({
    ...api,
    getBookings,
    createBooking,
    getBooking,
  }), [api, getBookings, createBooking, getBooking]);
}

export function useProfile() {
  const api = useApi();
  
  const getProfile = useCallback(() => {
    return api.get('/api/User/profile');
  }, [api.get]);

  const updateProfile = useCallback((profileData: any) => {
    return api.put('/api/User/profile', profileData);
  }, [api.put]);

  return useMemo(() => ({
    ...api,
    getProfile,
    updateProfile,
  }), [api, getProfile, updateProfile]);
}