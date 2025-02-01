import axios from 'axios';
import { API_CONFIG } from './constants';
import { API_BASE_URL } from './constants';



const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (import.meta.env.DEV) {
      console.log('Request URL:', config.url);
      console.log('Request Headers:', config.headers);
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/auth/login';
    }
    if (import.meta.env.DEV) {
      console.error('Response Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;