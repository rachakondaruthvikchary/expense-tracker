import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add JWT token to request headers and log request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details
    console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
      hasToken: !!token,
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request setup error:', error);
    return Promise.reject(error);
  }
);

/**
 * Handle response and log success/errors
 */
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.method?.toUpperCase()} ${response.config.url}:`, {
      status: response.status,
      dataSize: JSON.stringify(response.data).length,
    });
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    console.error(`❌ API Error (${status}):`, {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status,
      message,
      details: error.response?.data,
    });
    
    if (status === 401) {
      console.warn('🔐 Unauthorized - clearing auth and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (status === 404 && error.config?.url?.includes('/profile')) {
      console.warn('⚠️ Profile endpoint returned 404 - user data may have been reset');
      // Don't redirect, just reject the error - component should handle gracefully
    }
    
    return Promise.reject(error);
  }
);

export default api;
