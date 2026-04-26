import axios from 'axios';

const userAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_USER_API_BASE_URL || 'http://localhost:8085',
  headers: {
    'Content-Type': 'application/json',
  },
});

userAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default userAxiosInstance;
