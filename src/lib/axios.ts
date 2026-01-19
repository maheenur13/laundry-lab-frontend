import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../constants/api';
import { storage } from './storage';
import { ApiError } from '../types/api';

/**
 * Axios instance with interceptors for auth and error handling.
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - inject auth token and log requests.
 */
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging in development
    if (__DEV__) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      if (config.data) {
        console.log('📦 Request data:', JSON.stringify(config.data, null, 2));
      }
    }
    
    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error('❌ Request error:', error);
    }
    return Promise.reject(error);
  },
);

/**
 * Response interceptor - extract data and handle errors.
 */
axiosInstance.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      console.log('📦 Response data:', JSON.stringify(response.data, null, 2));
    }
    
    // Check if response has standard wrapper format { success: boolean, data: T }
    const responseData = response.data;
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      // Extract data from standard response wrapper
      return { ...response, data: responseData.data };
    }
    
    // Return as-is if no wrapper
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (__DEV__) {
      console.error('❌ API Error:', error.message);
      console.error('📍 URL:', error.config?.url);
      console.error('📊 Status:', error.response?.status);
      console.error('📦 Error data:', JSON.stringify(error.response?.data, null, 2));
    }
    
    if (error.response?.data) {
      const apiError = error.response.data;
      return Promise.reject(new Error(apiError.message || 'Request failed'));
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out'));
    }

    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Network error - please check your connection'));
    }

    return Promise.reject(new Error('An unexpected error occurred'));
  },
);

// API helper functions using axios
export const api = {
  get: <T>(url: string, params?: Record<string, string>) =>
    axiosInstance.get<T>(url, { params }).then((res) => res.data),

  post: <T>(url: string, data?: unknown) =>
    axiosInstance.post<T>(url, data).then((res) => res.data),

  patch: <T>(url: string, data?: unknown) =>
    axiosInstance.patch<T>(url, data).then((res) => res.data),

  delete: <T>(url: string) =>
    axiosInstance.delete<T>(url).then((res) => res.data),
};
